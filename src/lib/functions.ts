import { Client, Functions } from 'appwrite';

const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT;
const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID;

if (!endpoint || !projectId) {
    throw new Error('Missing Appwrite endpoint or project ID in environment variables.');
}

const client = new Client();
client.setEndpoint(endpoint).setProject(projectId);

const functions = new Functions(client);

export async function callAdvancedFunction(input: Record<string, any>) {
  // Use the function ID from environment variable, throw if not set
  const functionId = import.meta.env.VITE_APPWRITE_FUNCTION_ID;
  if (!functionId) {
    throw new Error('Missing Appwrite function ID in environment variables (VITE_APPWRITE_FUNCTION_ID)');
  }
  const execution = await functions.createExecution(functionId, JSON.stringify(input));
  // The function output is in execution.stdout, but the SDK typings do not include this property.
  // We cast to any to access it. See: https://github.com/appwrite/sdk-for-web/issues/ (if open)
  const stdout = (execution as any).stdout;
  try {
    return JSON.parse(stdout);
  } catch {
    return { error: 'Invalid response from function', raw: stdout };
  }
}
