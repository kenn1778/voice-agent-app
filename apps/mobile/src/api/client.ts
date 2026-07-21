const API_BASE = process.env.API_BASE_URL || 'https://api.example.com';

type RequestOptions = {
  method?: string;
  headers?: Record<string, string>;
  body?: unknown;
  token?: string;
};

export async function apiRequest<T>(path: string, opts: RequestOptions = {}): Promise<T> {
  const { method = 'GET', headers = {}, body, token } = opts;
  const h: Record<string, string> = { 'Content-Type': 'application/json', ...headers };
  if (token) h['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: h,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}
