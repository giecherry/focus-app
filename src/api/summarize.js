const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

export async function getSummary(text) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 45000);

  try {
    const response = await fetch(`${API_BASE_URL}/summarize`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const details = await response.json().catch(() => null);
      const error = new Error(details?.error || "Failed to summarize");
      error.requestId = details?.requestId || response.headers.get("x-request-id");
      error.status = response.status;
      throw error;
    }

    const data = await response.json();
    return data.summary;
  } catch (err) {
    const message =
      err.name === "AbortError"
        ? "The summary request timed out. Try again in a moment."
        : err.message;
    const error = new Error(message);
    error.requestId = err.requestId;
    error.status = err.status;

    throw error;
  } finally {
    window.clearTimeout(timeout);
  }
}
