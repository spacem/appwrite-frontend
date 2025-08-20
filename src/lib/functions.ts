
const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001/api/advanced';

export async function callAdvancedFunction(text: string, action: string = 'advanced') {
  const res = await fetch(backendUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, action })
  });
  try {
    return await res.json();
  } catch {
    return { error: 'Invalid response from backend' };
  }
}
