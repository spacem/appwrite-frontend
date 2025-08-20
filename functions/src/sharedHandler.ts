export async function sharedHandler({ userId, text, action, appwriteApiKey, userApiKey, name }: {
  userId: string,
  text: string,
  action?: string,
  appwriteApiKey?: string,
  userApiKey?: string,
  name?: string
}) {
  if (!userId) {
    return { error: 'Not authenticated' };
  }
  const message = `Hello${name ? ' ' + name : ''} (user ${userId}), User API key: ${userApiKey || '[none]'}. You entered: ${text}. Action: ${action || '[none]'}`;
  return { message };
}
