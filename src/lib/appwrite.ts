import { Client, Account } from 'appwrite';

// Read from Vite environment variables
const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT;
const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID;

if (!endpoint || !projectId) {
    throw new Error('Missing Appwrite endpoint or project ID in environment variables.');
}

export const client = new Client();
client.setEndpoint(endpoint).setProject(projectId);

export const account = new Account(client);
export { ID } from 'appwrite';