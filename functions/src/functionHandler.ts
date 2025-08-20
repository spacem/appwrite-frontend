import { sharedHandler } from "./sharedHandler.js";
import { getSettings } from "./getSettings.js";

export default async ({ req, res, log }: any) => {
  // Debug: log all request fields and headers
  log('Request fields: ' + JSON.stringify(req, null, 2));
  log('Request headers: ' + JSON.stringify(req.headers, null, 2));

  const userId = req.headers['x-appwrite-user-id'];
  let text = '';
  let action = '';
  try {
    if (req.body) {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      text = body.text || '';
      action = body.action || '';
    }
  } catch {}
  const appwriteApiKey = req.headers['x-appwrite-key'] ?? '';
  try {
    const settings = await getSettings(userId, appwriteApiKey, text);
    const result = await sharedHandler({
      userId,
      text,
      action,
      appwriteApiKey,
      userApiKey: settings.apiKey,
      name: settings.name
    });
    return res.json(result);
  } catch (e: any) {
    if (log) {
      log('Error in functionHandler: ' + (e?.message || 'Unknown error'));
      if (e?.stack) log('Stack: ' + e.stack);
      log('Full error: ' + JSON.stringify(e));
    }
    return res.json({ error: e?.message || 'Unknown error', details: e?.stack || e });
  }
};