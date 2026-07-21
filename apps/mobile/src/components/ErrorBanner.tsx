import React from 'react';
import { View, Text } from 'react-native';

type ErrorBannerProps = {
  message: string;
  details?: string;
};

export function ErrorBanner({ message, details }: ErrorBannerProps) {
  return (
    <View className="bg-errorLight dark:bg-red-900 p-3 rounded-lg mx-4 my-2" accessibilityRole="alert">
      <Text className="text-error dark:text-red-200 font-medium text-sm">{message}</Text>
      {details && (
        <Text className="text-error dark:text-red-300 text-xs mt-1 opacity-75">{details}</Text>
      )}
    </View>
  );
}
