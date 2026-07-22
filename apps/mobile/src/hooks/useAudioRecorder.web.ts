import { useState, useRef, useCallback, useEffect } from 'react';

type AudioRecorderOptions = {
  onAudioData: (base64Pcm: string) => void;
  onLevelChange: (level: number) => void;
};

const SAMPLE_RATE = 16000;
const BUFFER_SIZE = 2048;

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
  const streamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const isActiveRef = useRef(false);

  const stop = useCallback(async () => {
    isActiveRef.current = false;
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (sourceRef.current) {
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }
    if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
      await audioCtxRef.current.close();
      audioCtxRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setIsRecording(false);
  }, []);

  const start = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      isActiveRef.current = true;

      const audioCtx = new AudioContext({ sampleRate: SAMPLE_RATE });
      audioCtxRef.current = audioCtx;
      const source = audioCtx.createMediaStreamSource(stream);
      sourceRef.current = source;

      const processor = audioCtx.createScriptProcessor(BUFFER_SIZE, 1, 1);
      processorRef.current = processor;

      processor.onaudioprocess = (event) => {
        if (!isActiveRef.current || !opts) return;
        const input = event.inputBuffer.getChannelData(0);
        const sliced = new Float32Array(input);
        if (opts.onLevelChange) {
          opts.onLevelChange(computeLevel(sliced));
        }
        if (opts.onAudioData) {
          opts.onAudioData(float32ToPcm16Base64(sliced));
        }
      };

      source.connect(processor);
      processor.connect(audioCtx.destination);

      setIsRecording(true);
    } catch (e) {
      console.error('Failed to start web audio recorder:', e);
    }
  }, [opts]);

  useEffect(() => {
    return () => { stop(); };
  }, [stop]);

  return { start, stop, isRecording };
}
