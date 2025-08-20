import { getCurrentApiKey } from './openrouterApi.js';

export interface SharedHandlerParams {
    userId: string;
    text: string;
    action?: string;
    appwriteApiKey?: string;
    userApiKey?: string;
    name?: string;
}

export async function sharedHandler({ userId, text, action, appwriteApiKey, userApiKey, name }: SharedHandlerParams) {
    if (!userId) {
        return { error: 'Not authenticated' };
    }
    let apiKeyResult = null;
    let creditsError = null;
    if (userApiKey) {
        try {
            apiKeyResult = await getCurrentApiKey(userApiKey);
        } catch (e: any) {
            creditsError = e?.message || e;
        }
    }
    const data = { openrouterCredits: apiKeyResult, openrouterError: creditsError, action };
    const message = `Hello${name ? ' ' + name : ''} (user ${userId}). You entered: ${text}. ${JSON.stringify(data)}`;
    return { message };
}
