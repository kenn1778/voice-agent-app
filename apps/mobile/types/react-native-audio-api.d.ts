declare module 'react-native-audio-api' {
  export class AudioRecorder {
    onAudioReady(
      config: { sampleRate: number; bufferLength: number; channelCount: number },
      callback: (event: {
        buffer: { getChannelData: (channel: number) => Float32Array };
        numFrames: number;
        when: number;
      }) => void,
    ): void;
    clearOnAudioReady(): void;
    connect(destination: AudioNode): void;
    start(): { status: 'success' } | { status: 'error'; message: string };
    stop(): void;
  }

  export namespace AudioManager {
    function setAudioSessionOptions(options: {
      iosCategory?: string;
      iosMode?: string;
      iosOptions?: string[];
    }): void;
    function requestRecordingPermissions(): Promise<'Granted' | 'Denied' | 'Undetermined'>;
    function setAudioSessionActivity(active: boolean): Promise<boolean>;
  }

  export class AudioContext {
    constructor(options?: { sampleRate?: number });
    readonly destination: AudioNode;
    createWorkletNode(
      worklet: (audioData: Float32Array[], inputChannelCount: number) => void,
      bufferLength: number,
      channelCount: number,
      runMode: 'UIRuntime' | 'Worklet',
    ): AudioNode;
    createRecorderAdapter(): AudioNode;
    resume(): void;
  }

  export type AudioNode = {};
}