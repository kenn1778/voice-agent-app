import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { VoiceWaveform, ErrorBanner } from '../components';
import { useSessionStore } from '../store';
import { useVoiceSession } from '../features/voice-session';

export function VoiceSessionScreen() {
  const { connectionState, isMicActive, digest, isDigestLoading, transcript, error, audioLevel } =
    useSessionStore();
  const { start, stop, requestDigest } = useVoiceSession();

  const isConnected = connectionState === 'connected';
  const isIdle = connectionState === 'disconnected';
  const isReconnecting = connectionState === 'reconnecting';

  return (
    <View className="flex-1 bg-background dark:bg-backgroundDark items-center justify-center px-6">
      <Text className="text-lg font-semibold text-text dark:text-textDark mb-4">
        {isReconnecting ? 'Reconnecting...' : isConnected ? 'Connected' : isIdle ? 'Tap to Start' : 'Connecting...'}
      </Text>
      <VoiceWaveform audioLevel={audioLevel} isActive={isConnected && isMicActive} />
      {error && <ErrorBanner message={error} />}
      <View className="flex-row mt-8 gap-4">
        {!isConnected ? (
          <TouchableOpacity onPress={start} className="bg-primary w-16 h-16 rounded-full items-center justify-center" accessibilityLabel="Start voice session">
            <Text className="text-white text-2xl">▶</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={stop} className="bg-error w-16 h-16 rounded-full items-center justify-center" accessibilityLabel="Stop voice session">
            <Text className="text-white text-2xl">■</Text>
          </TouchableOpacity>
        )}
      </View>
      {isConnected && (
        <TouchableOpacity onPress={requestDigest} className="mt-6 py-2 px-4 bg-secondary rounded-lg" disabled={isDigestLoading} accessibilityLabel="Generate summary">
          <Text className="text-white font-medium">{isDigestLoading ? 'Generating...' : 'Generate Summary'}</Text>
        </TouchableOpacity>
      )}
      {digest && (
        <View className="mt-4 p-4 bg-surface dark:bg-surfaceDark rounded-lg w-full">
          <Text className="text-xs text-textSecondary mb-1">AI-Generated Summary</Text>
          <Text className="text-text dark:text-textDark text-sm">{digest}</Text>
        </View>
      )}
      {transcript.length > 0 && (
        <View className="mt-4 w-full max-h-48">
          <Text className="text-xs text-textSecondary mb-1">Live Transcript</Text>
          {transcript.slice(-5).map((e) => (
            <Text key={e.id} className={`text-sm ${e.speaker === 'user' ? 'text-primary' : 'text-secondary'} ${!e.isFinal ? 'italic opacity-75' : ''}`}>
              {e.speaker === 'user' ? 'You: ' : 'Agent: '}{e.text}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
}
