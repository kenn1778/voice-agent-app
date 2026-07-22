import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { VoiceWaveform, ErrorBanner } from '../components';
import { useSessionStore } from '../store';
import { useVoiceSession } from '../features/voice-session';

export function VoiceSessionScreen() {
  const { connectionState, isMicActive, digest, isDigestLoading, transcript, error, audioLevel } = useSessionStore();
  const { start, stop, requestDigest } = useVoiceSession();

  const isConnected = connectionState === 'connected';
  const isIdle = connectionState === 'disconnected';
  const isReconnecting = connectionState === 'reconnecting';
  const isConnecting = connectionState === 'connecting';

  const stateLabel = isConnecting ? 'Connecting...' : isReconnecting ? 'Reconnecting...' : isConnected ? 'Connected' : isIdle ? 'Tap to Start' : 'Connecting...';
  const stateColor = isConnected ? 'text-success' : isConnecting || isReconnecting ? 'text-warning' : 'text-textSecondary';

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-backgroundDark">
      <View className="flex-1 items-center justify-center px-6">
        <Text className={`text-sm font-medium tracking-wider uppercase ${stateColor} mb-6`}>{stateLabel}</Text>

        <View className="items-center mb-8">
          {isConnected ? (
            <VoiceWaveform audioLevel={audioLevel} isActive={isMicActive} />
          ) : (
            <VoiceWaveform audioLevel={0} isActive={false} />
          )}
        </View>

        {error && <ErrorBanner message={error} />}

        <View className="mt-6">
          {!isConnected ? (
            <TouchableOpacity
              onPress={start}
              className="w-20 h-20 bg-primary rounded-full items-center justify-center shadow-2xl shadow-indigo-500/40 active:opacity-80"
              accessibilityLabel="Start voice session"
            >
              <Text className="text-white text-3xl">▶</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={stop}
              className="w-20 h-20 bg-error rounded-full items-center justify-center shadow-2xl shadow-red-500/40 active:opacity-80"
              accessibilityLabel="Stop voice session"
            >
              <Text className="text-white text-3xl">■</Text>
            </TouchableOpacity>
          )}
        </View>

        {isConnected && (
          <TouchableOpacity
            onPress={requestDigest}
            disabled={isDigestLoading}
            className="mt-6 py-3 px-6 bg-surface dark:bg-surfaceDark rounded-xl border border-gray-200 dark:border-gray-700 active:opacity-70"
            accessibilityLabel="Generate summary"
          >
            <Text className="text-textSecondary font-medium">{isDigestLoading ? 'Generating...' : 'Generate Summary'}</Text>
          </TouchableOpacity>
        )}

        {digest && (
          <View className="mt-6 w-full p-4 bg-surface dark:bg-surfaceDark rounded-2xl border border-gray-100 dark:border-gray-800">
            <Text className="text-xs font-semibold text-textSecondary uppercase tracking-wider mb-2">AI Summary</Text>
            <Text className="text-text dark:text-textDark text-sm leading-5">{digest}</Text>
          </View>
        )}

        {transcript.length > 0 && (
          <View className="mt-4 w-full max-h-40">
            <Text className="text-xs font-semibold text-textSecondary uppercase tracking-wider mb-2 px-1">Live Transcript</Text>
            {transcript.slice(-5).map((e) => (
              <View key={e.id} className="flex-row items-start py-1.5">
                <Text className={`text-xs font-medium mr-2 mt-0.5 ${e.speaker === 'user' ? 'text-primary' : 'text-secondary'}`}>
                  {e.speaker === 'user' ? 'You' : 'AI'}
                </Text>
                <Text className={`flex-1 text-sm ${e.speaker === 'user' ? 'text-text dark:text-textDark' : 'text-text dark:text-textDark'} ${!e.isFinal ? 'opacity-60' : ''}`}>
                  {e.text}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
