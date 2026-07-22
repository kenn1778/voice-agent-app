import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing, withSequence } from 'react-native-reanimated';

const BAR_COUNT = 24;
const SPECTRUM = ['#FF6B5B', '#FF3D9A', '#FFC259', '#2FE6C0', '#9B6BFF'];

function getBarColor(index: number): string {
  const pos = index / BAR_COUNT;
  if (pos < 0.2) return SPECTRUM[0];
  if (pos < 0.4) return SPECTRUM[1];
  if (pos < 0.6) return SPECTRUM[2];
  if (pos < 0.8) return SPECTRUM[3];
  return SPECTRUM[4];
}

export function VoiceWaveform({ audioLevel, isActive }: { audioLevel: number; isActive: boolean }) {
  return (
    <View style={styles.container} accessibilityLabel={isActive ? 'Voice active' : 'Voice inactive'}>
      {Array.from({ length: BAR_COUNT }, (_, i) => (
        <WaveBar
          key={i}
          index={i}
          audioLevel={audioLevel}
          isActive={isActive}
        />
      ))}
    </View>
  );
}

function WaveBar({
  index,
  audioLevel,
  isActive,
}: {
  index: number;
  audioLevel: number;
  isActive: boolean;
}) {
  const scaleY = useSharedValue(0.3);

  useEffect(() => {
    if (isActive) {
      const multiplier = 0.5 + Math.random() * 0.5;
      const target = Math.min(1, 0.25 + audioLevel * multiplier);
      scaleY.value = withSequence(
        withTiming(target, { duration: 100, easing: Easing.ease }),
        withTiming(0.25 + Math.random() * 0.3, { duration: 80, easing: Easing.ease })
      );
    } else {
      scaleY.value = withTiming(0.3, { duration: 200 });
    }
  }, [audioLevel, isActive]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scaleY: scaleY.value }],
  }));

  return (
    <Animated.View
      style={[
        styles.bar,
        { backgroundColor: getBarColor(index) },
        animStyle,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 34,
    gap: 3,
    paddingHorizontal: 24,
  },
  bar: {
    width: 3,
    borderRadius: 2,
    minHeight: 4,
    maxHeight: 34,
  },
});
