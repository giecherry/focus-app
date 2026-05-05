const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

export async function cleanupText(text) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 20000);

  try {
    const response = await fetch(`${API_BASE_URL}/cleanup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const details = await response.json().catch(() => null);
      const error = new Error(details?.error || "Failed to clean up text");
      error.requestId = details?.requestId || response.headers.get("x-request-id");
      error.status = response.status;
      throw error;
    }

    const data = await response.json();
    return data.cleaned;
  } catch {
    return null;
  } finally {
    window.clearTimeout(timeout);
  }
}
