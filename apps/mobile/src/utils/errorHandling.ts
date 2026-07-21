export class AuthError extends Error { constructor(m: string) { super(m); this.name = 'AuthError'; } }
export class NetworkError extends Error { constructor(m: string) { super(m); this.name = 'NetworkError'; } }
export class PermissionError extends Error { constructor(m: string) { super(m); this.name = 'PermissionError'; } }
export class AgentError extends Error { constructor(m: string) { super(m); this.name = 'AgentError'; } }

export function categorizeError(err: unknown): Error {
  if (err instanceof Error) {
    const msg = err.message.toLowerCase();
    if (msg.includes('auth') || msg.includes('token') || msg.includes('401') || msg.includes('403')) return new AuthError(err.message);
    if (msg.includes('network') || msg.includes('fetch') || msg.includes('timeout') || msg.includes('econnrefused')) return new NetworkError(err.message);
    if (msg.includes('permission') || msg.includes('mic') || msg.includes('camera')) return new PermissionError(err.message);
    if (msg.includes('agent') || msg.includes('bedrock') || msg.includes('nova')) return new AgentError(err.message);
  }
  return err instanceof Error ? err : new Error(String(err));
}

export function getUserFacingError(err: unknown): string {
  const categorized = categorizeError(err);
  if (categorized instanceof AuthError) return 'Sign-in expired. Please sign in again.';
  if (categorized instanceof NetworkError) return 'Couldn\'t reach the voice agent â€” check your connection and try again.';
  if (categorized instanceof PermissionError) return 'Microphone access is needed for voice sessions. Please enable it in Settings.';
  if (categorized instanceof AgentError) return 'The voice agent encountered an issue. Please try again.';
  return 'Something went wrong. Please try again.';
}
