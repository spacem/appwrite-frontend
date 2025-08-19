import { Client, Users } from 'node-appwrite';

async function getSettings(client: any, userId: string) {
  const users = new Users(client);
  // Get user details
  const user = await users.get(userId);
  // Assume API key is stored in user preferences as 'apiKey'
  const name = user.name || 'User';
  const apiKey = user.prefs?.apiKey || 'not set';
  return { name, apiKey };
}

// Minimal handler
export default async ({ req, res }: any) => {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT ?? '')
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID ?? '')
    .setKey(req.headers['x-appwrite-key'] ?? '');

  // Get userId from req (Appwrite Functions pass userId in req.userId if authenticated)
  const userId = req.userId;
  if (!userId) {
    return res.text('Not authenticated');
  }
  try {
    const { name, apiKey } = await getSettings(client, userId);
    const result = { message: `Hello ${name} your api key is ${apiKey}` };
    return res.json(result);
  } catch (e: any) {
    return res.json({ error: e?.message || 'Unknown error' });
  }
};