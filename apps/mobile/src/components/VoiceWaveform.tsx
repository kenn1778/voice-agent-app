import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';

function WaveBar({ audioLevel, isActive }: { audioLevel: number; isActive: boolean }) {
  const height = useSharedValue(4);
  const animatedStyle = useAnimatedStyle(() => ({ height: height.value }));

  useEffect(() => {
    if (isActive) {
      const multiplier = 0.5 + Math.random() * 0.5;
      height.value = withTiming(4 + audioLevel * 60 * multiplier, { duration: 100, easing: Easing.ease });
    } else {
      height.value = withTiming(4, { duration: 200 });
    }
  }, [audioLevel, isActive]);

  return (
    <Animated.View
      className="w-1 bg-primary dark:bg-primaryLight rounded-full mx-0.5"
      style={[{ minHeight: 4, maxHeight: 80 }, animatedStyle]}
    />
  );
}

export function VoiceWaveform({ audioLevel, isActive }: { audioLevel: number; isActive: boolean }) {
  return (
    <View className="flex-row items-center justify-center h-24" accessibilityLabel={isActive ? 'Voice active' : 'Voice inactive'}>
      {Array.from({ length: 24 }, (_, i) => i).map((i) => (
        <WaveBar key={i} audioLevel={audioLevel} isActive={isActive} />
      ))}
    </View>
  );
}
