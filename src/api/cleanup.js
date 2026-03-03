const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function cleanupText(text) {
  try {
    const response = await fetch(`${API_BASE_URL}/cleanup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error("Failed to clean up text");
    }

    const data = await response.json();
    return data.cleaned;
  } catch (err) {
    console.error(err);
    return null;
  }
}