import { useState, useRef, useCallback, useEffect } from 'react';
import { AudioRecorder, AudioManager } from 'react-native-audio-api';
import { logger } from '../utils/logger';

type AudioRecorderOptions = {
  onAudioData: (base64Pcm: string) => void;
  onLevelChange: (level: number) => void;
};

const SAMPLE_RATE = 16000;
const BUFFER_DURATION = 0.1;

function float32ToPcm16Base64(float32: Float32Array): string {
  const int16 = new Int16Array(float32.length);
  for (let i = 0; i < float32.length; i++) {
    const s = Math.max(-1, Math.min(1, float32[i]));
    int16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }
  const bytes = new Uint8Array(int16.buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function computeLevel(float32: Float32Array): number {
  let sum = 0;
  for (let i = 0; i < float32.length; i++) {
    sum += Math.abs(float32[i]);
  }
  return Math.min(1, sum / float32.length);
}

export function useAudioRecorder(opts?: AudioRecorderOptions) {
  const [isRecording, setIsRecording] = useState(false);
  const recorderRef = useRef<AudioRecorder | null>(null);
  const isActiveRef = useRef(false);

  const stop = useCallback(async () => {
    if (!recorderRef.current) return;
    isActiveRef.current = false;
    try {
      recorderRef.current.stop();
      recorderRef.current.clearOnAudioReady();
    } catch (e) {
      logger.error('Failed to stop audio recorder', e);
    }
    recorderRef.current = null;
    setIsRecording(false);
    await AudioManager.setAudioSessionActivity(false);
    logger.info('Audio recorder stopped');
  }, []);

  const start = useCallback(async () => {
    try {
      const permissions = await AudioManager.requestRecordingPermissions();
      if (permissions !== 'Granted') {
        logger.warn('Microphone permission denied');
        return;
      }

      const sessionActive = await AudioManager.setAudioSessionActivity(true);
      if (!sessionActive) {
        logger.warn('Could not activate audio session');
        return;
      }

      const recorder = new AudioRecorder();
      recorderRef.current = recorder;
      isActiveRef.current = true;

      recorder.onAudioReady(
        { sampleRate: SAMPLE_RATE, bufferLength: Math.round(SAMPLE_RATE * BUFFER_DURATION), channelCount: 1 },
        (event: { buffer: { getChannelData: (ch: number) => Float32Array }; numFrames: number }) => {
          if (!isActiveRef.current || !opts) return;
          const channelData = event.buffer.getChannelData(0);
          const sliced = new Float32Array(channelData.slice(0, event.numFrames));
          if (opts.onLevelChange) {
            opts.onLevelChange(computeLevel(sliced));
          }
          if (opts.onAudioData) {
            opts.onAudioData(float32ToPcm16Base64(sliced));
          }
        },
      );

      const result = recorder.start();
      if (result.status === 'error') {
        logger.warn('Failed to start recorder: ' + result.message);
        recorder.clearOnAudioReady();
        recorderRef.current = null;
        await AudioManager.setAudioSessionActivity(false);
        return;
      }

      setIsRecording(true);
      logger.info('Audio recorder started');
    } catch (e) {
      logger.error('Failed to start audio recorder', e);
    }
  }, [opts]);

  useEffect(() => {
    return () => {
      if (recorderRef.current) {
        isActiveRef.current = false;
        recorderRef.current.stop();
        recorderRef.current.clearOnAudioReady();
        AudioManager.setAudioSessionActivity(false);
      }
    };
  }, []);

  return { start, stop, isRecording };
}