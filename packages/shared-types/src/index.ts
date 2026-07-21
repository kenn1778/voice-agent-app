export type WSMessageType = 'audio' | 'transcript' | 'digest' | 'digest_request' | 'error' | 'connected' | 'disconnected';
export interface WSMessage { type: WSMessageType; payload?: unknown; sessionId?: string; timestamp?: string; }
export interface TranscriptPayload { id: string; speaker: 'user' | 'agent'; text: string; isFinal: boolean; timestamp: string; }
export interface DigestPayload { text: string; sessionId: string; }
export interface PresignRequest { sessionId?: string; }
export interface PresignResponse { url: string; expiresAt: number; sessionId: string; }
export type ConnectionState = 'connecting' | 'connected' | 'disconnected' | 'reconnecting' | 'error';
