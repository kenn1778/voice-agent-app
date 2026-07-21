import { create } from 'zustand';
import { ConnectionState } from '../api/websocket';

export type TranscriptEntry = {
  id: string;
  speaker: 'user' | 'agent';
  text: string;
  timestamp: string;
  isFinal: boolean;
};

export type SessionState = {
  sessionId: string | null;
  connectionState: ConnectionState;
  isMicActive: boolean;
  isAgentSpeaking: boolean;
  transcript: TranscriptEntry[];
  digest: string | null;
  isDigestLoading: boolean;
  error: string | null;
  audioLevel: number;
  setSessionId: (id: string) => void;
  setConnectionState: (state: ConnectionState) => void;
  setMicActive: (active: boolean) => void;
  setAgentSpeaking: (speaking: boolean) => void;
  addTranscriptEntry: (entry: TranscriptEntry) => void;
  updateTranscriptEntry: (id: string, text: string, isFinal: boolean) => void;
  setDigest: (digest: string | null) => void;
  setDigestLoading: (loading: boolean) => void;
  setError: (err: string | null) => void;
  setAudioLevel: (level: number) => void;
  reset: () => void;
};

const initialState = {
  sessionId: null,
  connectionState: 'disconnected' as ConnectionState,
  isMicActive: false,
  isAgentSpeaking: false,
  transcript: [] as TranscriptEntry[],
  digest: null,
  isDigestLoading: false,
  error: null,
  audioLevel: 0,
};

export const useSessionStore = create<SessionState>((set) => ({
  ...initialState,
  setSessionId: (sessionId) => set({ sessionId }),
  setConnectionState: (connectionState) => set({ connectionState }),
  setMicActive: (isMicActive) => set({ isMicActive }),
  setAgentSpeaking: (isAgentSpeaking) => set({ isAgentSpeaking }),
  addTranscriptEntry: (entry) => set((s) => ({ transcript: [...s.transcript, entry] })),
  updateTranscriptEntry: (id, text, isFinal) =>
    set((s) => ({
      transcript: s.transcript.map((e) => (e.id === id ? { ...e, text, isFinal } : e)),
    })),
  setDigest: (digest) => set({ digest, isDigestLoading: false }),
  setDigestLoading: (isDigestLoading) => set({ isDigestLoading }),
  setError: (error) => set({ error }),
  setAudioLevel: (audioLevel) => set({ audioLevel }),
  reset: () => set(initialState),
}));
