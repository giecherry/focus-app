 const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

 export async function getSummary(text) {
  try {
    const response = await fetch(`${API_BASE_URL}/summarize`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error("Failed to summarize");
    }

    const data = await response.json();
    return data.summary;
  } catch (err) {
    console.error(err);
    return null;
  }
}