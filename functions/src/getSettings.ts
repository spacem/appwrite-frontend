import { Client, Users } from 'node-appwrite';

export async function getSettings(userId: string, appWriteKey: string, text: string) {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT ?? '')
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID ?? '')
    .setKey(appWriteKey);

  const users = new Users(client);
  const user = await users.get(userId);
  const name = user.name || 'User';
  const apiKey = user.prefs?.apiKey || 'not set';
  return { name, apiKey, text };
}