import { Client, Users } from 'node-appwrite';

export async function getSettings(userId: string, appWriteKey: string, text: string) {
  // Only use endpoint in Appwrite cloud function context
  const endpoint = process.env.APPWRITE_FUNCTION_API_ENDPOINT;
  const project = process.env.APPWRITE_FUNCTION_PROJECT_ID;
  if (!endpoint || !project) {
    throw new Error('Missing Appwrite endpoint or project ID in environment variables.');
  }
  const client = new Client()
    .setEndpoint(endpoint)
    .setProject(project)
    .setKey(appWriteKey);

  const users = new Users(client);
  const user = await users.get(userId);
  const name = user.name || 'User';
  const apiKey = user.prefs?.apiKey || 'not set';
  return { name, apiKey, text };
}