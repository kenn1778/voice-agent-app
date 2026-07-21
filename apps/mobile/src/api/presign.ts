import { apiRequest } from './client';

export type PresignResponse = {
  url: string;
  expiresAt: number;
  sessionId: string;
};

export async function getPresignedUrl(token: string): Promise<PresignResponse> {
  return apiRequest<PresignResponse>('/presign', { method: 'POST', token });
}
