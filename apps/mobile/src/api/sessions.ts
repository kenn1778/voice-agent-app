import { apiRequest } from './client';

export type SessionItem = {
  userId: string;
  sessionId: string;
  createdAt: string;
  updatedAt: string;
  status: 'active' | 'completed';
  digest?: string;
  transcript?: Array<{ speaker: string; text: string; timestamp: string }>;
};

export type ListSessionsResponse = {
  sessions: SessionItem[];
};

export async function listSessions(token: string): Promise<SessionItem[]> {
  const res = await apiRequest<ListSessionsResponse>('/sessions', { token });
  return res.sessions;
}

export async function getSession(token: string, sessionId: string): Promise<SessionItem> {
  return apiRequest<SessionItem>(`/sessions/${sessionId}`, { token });
}

export async function createSession(token: string, data: Partial<SessionItem>): Promise<SessionItem> {
  return apiRequest<SessionItem>('/sessions', { method: 'POST', token, body: data });
}

export async function updateSession(token: string, sessionId: string, data: Partial<SessionItem>): Promise<void> {
  await apiRequest(`/sessions/${sessionId}`, { method: 'PUT', token, body: data });
}
