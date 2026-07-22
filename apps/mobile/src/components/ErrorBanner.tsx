import React from 'react';
import { View, Text } from 'react-native';

type ErrorBannerProps = {
  message: string;
  details?: string;
};

export function ErrorBanner({ message, details }: ErrorBannerProps) {
  return (
    <View className="w-full bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 p-3 rounded-xl mb-4" accessibilityRole="alert">
      <Text className="text-error dark:text-red-300 font-medium text-sm">{message}</Text>
      {details && (
        <Text className="text-error dark:text-red-400 text-xs mt-1 opacity-75">{details}</Text>
      )}
    </View>
  );
}
