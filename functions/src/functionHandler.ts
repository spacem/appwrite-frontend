import { getSettings } from "./getSettings.js";

export default async ({ req, res, log }: any) => {
  // Debug: log all request fields and headers
  log('Request fields: ' + JSON.stringify(req, null, 2));
  log('Request headers: ' + JSON.stringify(req.headers, null, 2));

  const userId = req.headers['x-appwrite-user-id'];
  if (!userId) {
    return res.text('Not authenticated');
  }
  // Get text from request body (if present)
  let text = '';
  try {
    if (req.body) {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      text = body.text || '';
    }
  } catch {}
  try {
    const { name, apiKey } = await getSettings(userId, req.headers['x-appwrite-key'] ?? '', text);
    const result = { message: `Hello ${name} your api key is ${apiKey}. You entered: ${text}` };
    return res.json(result);
  } catch (e: any) {
    return res.json({ error: e?.message || 'Unknown error' });
  }
};