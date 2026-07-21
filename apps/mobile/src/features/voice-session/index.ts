import { useCallback, useRef } from 'react';
import { VoiceWebSocket, ConnectionState } from '../../api/websocket';
import { getPresignedUrl } from '../../api/presign';
import { useSessionStore } from '../../store/sessionStore';
import { useAuth } from '../../auth/AuthProvider';
import { useAudioRecorder } from '../../hooks/useAudioRecorder';
import { categorizeError, getUserFacingError } from '../../utils/errorHandling';
import { logger } from '../../utils/logger';

export function useVoiceSession() {
  const wsRef = useRef<VoiceWebSocket | null>(null);
  const { getAccessToken } = useAuth();
  const store = useSessionStore();

  const recorder = useAudioRecorder({
    onAudioData: (base64Pcm) => {
      wsRef.current?.sendJson({ type: 'audio', payload: { audio: base64Pcm } });
    },
    onLevelChange: (level) => {
      store.setAudioLevel(level);
    },
  });

  const start = useCallback(async () => {
    store.setError(null);
    store.setDigestLoading(false);
    try {
      const token = await getAccessToken();
      if (!token) throw new Error('No access token available');

      const presignRes = await getPresignedUrl(token);
      logger.info('Got presigned URL', { sessionId: presignRes.sessionId });

      type TranscriptPayload = { id?: string; speaker?: string; text?: string; timestamp?: string; isFinal?: boolean };
      type DigestPayload = { text?: string };
      type ErrorPayload = { message?: string };

      wsRef.current = new VoiceWebSocket({
        onMessage: (msg) => {
          switch (msg.type) {
            case 'connected':
              store.setSessionId(msg.sessionId || presignRes.sessionId);
              break;
            case 'transcript': {
              const p = msg.payload as TranscriptPayload;
              store.addTranscriptEntry({
                id: p?.id || Date.now().toString(),
                speaker: (p?.speaker as 'user' | 'agent') || 'agent',
                text: p?.text || '',
                timestamp: p?.timestamp || new Date().toISOString(),
                isFinal: p?.isFinal || false,
              });
              break;
            }
            case 'digest':
              store.setDigest((msg.payload as DigestPayload)?.text || '');
              break;
            case 'audio':
              store.setAudioLevel(Math.random());
              break;
            case 'error':
              store.setError((msg.payload as ErrorPayload)?.message || 'An error occurred');
              break;
          }
        },
        onStateChange: (state: ConnectionState) => {
          store.setConnectionState(state);
          if (state === 'connected') {
            recorder.start();
          }
          if (state === 'disconnected') {
            recorder.stop();
          }
        },
        onError: (err) => {
          store.setError(getUserFacingError(err));
        },
      });

      wsRef.current.connect(presignRes.url);
      store.setMicActive(true);
    } catch (err) {
      const message = getUserFacingError(err);
      store.setError(message);
      logger.error('Failed to start voice session', { error: categorizeError(err).message });
    }
  }, [getAccessToken, recorder]);

  const stop = useCallback(() => {
    recorder.stop();
    wsRef.current?.disconnect();
    wsRef.current = null;
    store.setMicActive(false);
    store.setConnectionState('disconnected');
  }, [recorder]);

  const sendAudio = useCallback((_data: ArrayBuffer) => {
    // handled by useAudioRecorder callback
  }, []);

  const requestDigest = useCallback(() => {
    store.setDigestLoading(true);
    wsRef.current?.sendJson({ type: 'digest_request', payload: undefined });
  }, []);

  return { start, stop, sendAudio, requestDigest };
}
