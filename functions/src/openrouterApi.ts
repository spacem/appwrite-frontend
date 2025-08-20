import fetch from 'node-fetch';

export async function getCurrentApiKey(userApiKey: string) {
  if (!userApiKey) {
    throw new Error('Missing user API key for OpenRouter');
  }
  const res = await fetch('https://openrouter.ai/api/v1/key', {
    headers: {
      'Authorization': `Bearer ${userApiKey}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OpenRouter API error: ${res.status} ${text}`);
  }
  return res.json();
}
