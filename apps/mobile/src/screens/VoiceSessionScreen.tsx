import React, { useEffect, useMemo } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing, interpolateColor } from 'react-native-reanimated';
import { VoiceWaveform, ErrorBanner } from '../components';
import { useSessionStore } from '../store';
import { useVoiceSession } from '../features/voice-session';

const colors = {
  surface: '#291B49',
  surfaceAlt: '#33235C',
  borderSoft: 'rgba(255,255,255,0.07)',
  textPrimary: '#FBF7FF',
  textSecondary: '#C7B7E8',
  textFaint: '#8B77B3',
  coral: '#FF6B5B',
  pink: '#FF3D9A',
  gold: '#FFC259',
  mint: '#2FE6C0',
  violet: '#9B6BFF',
  sky: '#4EA8FF',
};

function IconBtn({ icon, onPress, label, size = 36 }: { icon: string; onPress?: () => void; label: string; size?: number }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      accessibilityLabel={label}
      accessibilityRole="button"
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: 1,
        borderColor: colors.borderSoft,
        backgroundColor: colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text style={{ fontSize: size * 0.45, color: colors.textSecondary }}>{icon}</Text>
    </TouchableOpacity>
  );
}

function OrbAnimation({ isActive }: { isActive: boolean }) {
  const pulse = useSharedValue(0);
  const blob1X = useSharedValue(0);
  const blob1Y = useSharedValue(0);
  const blob2X = useSharedValue(0);
  const blob2Y = useSharedValue(0);
  const blob3X = useSharedValue(0);
  const blob3Y = useSharedValue(0);

  useEffect(() => {
    if (!isActive) return;
    pulse.value = withRepeat(
      withTiming(1, { duration: 3200, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
    blob1X.value = withRepeat(
      withTiming(6, { duration: 7000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
    blob1Y.value = withRepeat(
      withTiming(-8, { duration: 7000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
    blob2X.value = withRepeat(
      withTiming(-6, { duration: 7000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
    blob2Y.value = withRepeat(
      withTiming(6, { duration: 7000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
    blob3X.value = withRepeat(
      withTiming(3, { duration: 7000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
    blob3Y.value = withRepeat(
      withTiming(-4, { duration: 7000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, [isActive]);

  const orbStyle = useAnimatedStyle(() => ({
    shadowOpacity: 0.2 + pulse.value * 0.2,
    shadowRadius: 50 + pulse.value * 40,
  }));

  const blob1Style = useAnimatedStyle(() => ({
    transform: [{ translateX: blob1X.value }, { translateY: blob1Y.value }],
    opacity: 0.75 + pulse.value * 0.1,
  }));

  const blob2Style = useAnimatedStyle(() => ({
    transform: [{ translateX: blob2X.value }, { translateY: blob2Y.value }],
    opacity: 0.7 + pulse.value * 0.1,
  }));

  const blob3Style = useAnimatedStyle(() => ({
    transform: [{ translateX: blob3X.value }, { translateY: blob3Y.value }],
    opacity: 0.65 + pulse.value * 0.1,
  }));

  return (
    <View style={{ alignItems: 'center', paddingVertical: 14 }}>
      <Animated.View
        style={[
          {
            width: 150,
            height: 150,
            borderRadius: 75,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 14,
            shadowColor: '#FF3D9A',
            shadowOffset: { width: 0, height: 0 },
          },
          orbStyle,
        ]}
      >
        <Animated.View
          style={[
            {
              position: 'absolute',
              width: 120,
              height: 120,
              borderRadius: 60,
              backgroundColor: colors.coral,
              opacity: 0.85,
            },
            blob1Style,
          ]}
        />
        <Animated.View
          style={[
            {
              position: 'absolute',
              width: 110,
              height: 110,
              borderRadius: 55,
              backgroundColor: colors.violet,
              opacity: 0.8,
            },
            blob2Style,
          ]}
        />
        <Animated.View
          style={[
            {
              position: 'absolute',
              width: 100,
              height: 100,
              borderRadius: 50,
              backgroundColor: colors.mint,
              opacity: 0.75,
            },
            blob3Style,
          ]}
        />
      </Animated.View>
    </View>
  );
}

function LiveDot() {
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.25, { duration: 700, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  const dotStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return <Animated.View style={[{ width: 7, height: 7, borderRadius: 3.5, backgroundColor: colors.pink }, dotStyle]} />;
}

function TranscriptBubble({
  speaker,
  text,
  timestamp,
  isLive,
}: {
  speaker: 'user' | 'agent';
  text: string;
  timestamp?: string;
  isLive?: boolean;
}) {
  const isUser = speaker === 'user';
  const cursorBlink = useSharedValue(1);

  useEffect(() => {
    if (!isLive) return;
    cursorBlink.value = withRepeat(
      withTiming(0, { duration: 450, easing: Easing.step0 }),
      -1,
      true
    );
  }, [isLive]);

  const cursorStyle = useAnimatedStyle(() => ({ opacity: cursorBlink.value }));

  return (
    <View
      style={{
        alignSelf: isUser ? 'flex-end' : 'flex-start',
        maxWidth: '78%',
        backgroundColor: isUser ? colors.surfaceAlt : colors.surface,
        borderWidth: isUser ? 0 : 1,
        borderColor: isUser ? undefined : colors.borderSoft,
        borderRadius: 16,
        borderBottomRightRadius: isUser ? 6 : 16,
        borderBottomLeftRadius: isUser ? 16 : 6,
        paddingVertical: 10,
        paddingHorizontal: 13,
        marginBottom: 8,
      }}
    >
      <Text style={{ color: colors.textPrimary, fontSize: 13.5, lineHeight: 19, margin: 0 }}>
        {text}
        {isLive && (
          <Animated.Text style={[{ color: colors.mint, fontSize: 13.5 }, cursorStyle]}>|</Animated.Text>
        )}
      </Text>
      {timestamp && (
        <Text style={{ color: colors.textFaint, fontSize: 10, marginTop: 4 }}>
          {timestamp}
        </Text>
      )}
    </View>
  );
}

function WaveStrip({ audioLevel, isActive }: { audioLevel: number; isActive: boolean }) {
  const seedValues = useMemo(() =>
    Array.from({ length: 26 }, () => ({
      delay: Math.random() * 0.8,
      duration: 0.6 + Math.random() * 0.7,
    })),
    []
  );

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 3,
        height: 34,
        paddingHorizontal: 24,
      }}
    >
      {seedValues.map((seed, i) => (
        <WaveBar
          key={i}
          audioLevel={audioLevel}
          isActive={isActive}
          duration={seed.duration}
          delay={seed.delay}
        />
      ))}
    </View>
  );
}

function WaveBar({ audioLevel, isActive, duration, delay }: { audioLevel: number; isActive: boolean; duration: number; delay: number }) {
  const scaleY = useSharedValue(0.25);

  useEffect(() => {
    if (isActive) {
      const target = Math.min(1, 0.25 + audioLevel * (0.5 + Math.random() * 0.5));
      scaleY.value = withRepeat(
        withTiming(target, { duration: duration * 1000, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      );
    } else {
      scaleY.value = withTiming(0.25, { duration: 200 });
    }
  }, [isActive, audioLevel]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scaleY: scaleY.value }],
  }));

  return (
    <Animated.View
      style={[
        {
          width: 3,
          height: '100%',
          borderRadius: 2,
          backgroundColor: colors.textFaint,
        },
        animStyle,
      ]}
    />
  );
}

export function VoiceSessionScreen() {
  const { connectionState, isMicActive, digest, isDigestLoading, transcript, error, audioLevel } = useSessionStore();
  const { start, stop, requestDigest } = useVoiceSession();

  const isConnected = connectionState === 'connected';
  const isIdle = connectionState === 'disconnected';
  const isReconnecting = connectionState === 'reconnecting';
  const isConnecting = connectionState === 'connecting';

  const stateLabel = isConnecting ? 'Connecting...' : isReconnecting ? 'Reconnecting...' : isConnected ? 'Listening…' : isIdle ? 'Tap to Start' : 'Connecting...';
  const stateColor = isConnected ? colors.mint : isConnecting || isReconnecting ? colors.gold : colors.textFaint;

  return (
    <View style={{ flex: 1, backgroundColor: '#1D1333' }}>
      <SafeAreaView style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 20,
            paddingTop: 10,
            paddingBottom: 4,
          }}
        >
          <TouchableOpacity accessibilityLabel="Go back" accessibilityRole="button" style={{ width: 36, height: 36, borderRadius: 18, borderWidth: 1, borderColor: colors.borderSoft, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: colors.textSecondary, fontSize: 18 }}>{'←'}</Text>
          </TouchableOpacity>
          <Text style={{ color: colors.textPrimary, fontSize: 16 }}>
            Prism
          </Text>
          <TouchableOpacity accessibilityLabel="Menu" accessibilityRole="button" style={{ width: 36, height: 36, borderRadius: 18, borderWidth: 1, borderColor: colors.borderSoft, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: colors.textSecondary, fontSize: 18 }}>{'⋮'}</Text>
          </TouchableOpacity>
        </View>

        <OrbAnimation isActive={isConnected} />

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, paddingBottom: 4 }}>
          <LiveDot />
          <Text style={{ color: colors.textPrimary, fontSize: 13 }} id="statusText">
            {stateLabel}
          </Text>
        </View>
        <Text
          style={{
            color: colors.textFaint,
            fontSize: 12,
            textAlign: 'center',
            paddingHorizontal: 40,
            lineHeight: 18,
            marginBottom: 8,
          }}
        >
          {isConnected ? 'Speak naturally — Prism jumps in when it helps.' : 'Tap the mic to start a conversation'}
        </Text>

        {error && <ErrorBanner message={error} />}

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: 18, paddingVertical: 6 }}
          showsVerticalScrollIndicator={false}
        >
          {transcript.length > 0 ? (
            transcript.map((e) => (
              <TranscriptBubble
                key={e.id}
                speaker={e.speaker}
                text={e.text}
                timestamp={e.timestamp ? new Date(e.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : undefined}
              />
            ))
          ) : (
            <View style={{ alignItems: 'center', paddingTop: 20 }}>
              <Text style={{ color: colors.textFaint, fontSize: 13 }}>No conversation yet</Text>
            </View>
          )}
          {isConnected && (
            <TranscriptBubble speaker="agent" text="" isLive />
          )}
        </ScrollView>

        <WaveStrip audioLevel={audioLevel} isActive={isConnected} />

        {digest && (
          <View style={{ marginHorizontal: 18, marginBottom: 8, padding: 16, backgroundColor: colors.surface, borderRadius: 16, borderWidth: 1, borderColor: colors.borderSoft }}>
            <Text style={{ color: colors.textFaint, fontSize: 11, textTransform: 'uppercase', letterSpacing: 1.1, marginBottom: 8 }}>AI Summary</Text>
            <Text style={{ color: colors.textPrimary, fontSize: 13, lineHeight: 18 }}>{digest}</Text>
          </View>
        )}

        {isConnected && (
          <TouchableOpacity
            onPress={requestDigest}
            disabled={isDigestLoading}
            accessibilityLabel="Generate summary"
            accessibilityRole="button"
            style={{
              marginHorizontal: 18,
              marginBottom: 8,
              paddingVertical: 12,
              paddingHorizontal: 24,
              backgroundColor: colors.surfaceAlt,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: colors.borderSoft,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: colors.textSecondary, fontSize: 14 }}>
              {isDigestLoading ? 'Generating...' : 'Generate Summary'}
            </Text>
          </TouchableOpacity>
        )}

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 22,
            paddingVertical: 16,
            paddingHorizontal: 24,
          }}
        >
          {isConnected && (
            <IconBtn icon={isMicActive ? '🎤' : '🔇'} onPress={() => {}} label={isMicActive ? 'Mute' : 'Unmute'} size={42} />
          )}
          <TouchableOpacity
            onPress={isConnected ? stop : start}
            accessibilityLabel={isConnected ? 'Stop voice session' : 'Start voice session'}
            accessibilityRole="button"
            style={{
              width: 66,
              height: 66,
              borderRadius: 33,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: isConnected ? '#33235C' : '#2FE6C0',
              shadowColor: isConnected ? undefined : '#FF3D9A',
              shadowOffset: isConnected ? undefined : { width: 0, height: 14 },
              shadowOpacity: isConnected ? undefined : 0.5,
              shadowRadius: isConnected ? undefined : 28,
              elevation: isConnected ? undefined : 20,
            }}
          >
            <Text style={{ fontSize: 26, color: isConnected ? '#C7B7E8' : '#1D1333' }}>
              {isConnected ? '■' : '🎤'}
            </Text>
          </TouchableOpacity>
          {isConnected && (
            <IconBtn icon="⌨️" onPress={() => {}} label="Keyboard" size={42} />
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}
