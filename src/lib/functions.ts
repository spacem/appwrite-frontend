
import { Functions, Client } from 'appwrite';

const backendUrl = import.meta.env.VITE_BACKEND_URL;
const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT;
const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const functionId = import.meta.env.VITE_APPWRITE_FUNCTION_ID;

export async function callAdvancedFunction(text: string, action: string = 'advanced') {
  if (backendUrl) {
    // Use local backend if set
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
  } else {
    // Use Appwrite SDK if no backend URL
    if (!endpoint || !projectId || !functionId) {
      throw new Error('Missing Appwrite endpoint, project ID, or function ID in environment variables.');
    }
    const client = new Client();
    client.setEndpoint(endpoint).setProject(projectId);
    const functions = new Functions(client);
    const execution = await functions.createExecution(functionId, JSON.stringify({ text, action }));
    try {
      return JSON.parse((execution as any).stdout || execution.responseBody || '{}');
    } catch {
      return { error: 'Invalid response from Appwrite function' };
    }
  }
}
