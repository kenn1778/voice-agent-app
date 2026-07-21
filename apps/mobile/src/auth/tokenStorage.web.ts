type StoredTokens = {
  idToken: string;
  accessToken: string;
  refreshToken: string;
};

const STORAGE_KEY = 'voice_agent_tokens';

export async function storeTokens(tokens: StoredTokens): Promise<void> {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tokens));
  } catch {
    // localStorage may be unavailable in some environments
  }
}

export async function getTokens(): Promise<StoredTokens | null> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredTokens;
  } catch {
    return null;
  }
}

export async function clearTokens(): Promise<void> {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
}

export async function getBiometricType(): Promise<string | null> {
  return null;
}
