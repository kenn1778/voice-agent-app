import React from 'react';
import { View, Text } from 'react-native';

type ErrorBannerProps = {
  message: string;
  details?: string;
};

const colors = {
  surface: '#291B49',
  borderSoft: 'rgba(255,255,255,0.07)',
  textPrimary: '#FBF7FF',
  textFaint: '#8B77B3',
  coral: '#FF6B5B',
};

export function ErrorBanner({ message, details }: ErrorBannerProps) {
  return (
    <View
      accessibilityRole="alert"
      style={{
        marginHorizontal: 18,
        marginBottom: 8,
        padding: 12,
        backgroundColor: 'rgba(255,107,91,0.15)',
        borderWidth: 1,
        borderColor: 'rgba(255,107,91,0.4)',
        borderRadius: 12,
      }}
    >
      <Text style={{ color: colors.coral, fontSize: 13, fontWeight: '500' }}>
        {message}
      </Text>
      {details && (
        <Text style={{ color: colors.coral, fontSize: 12, marginTop: 4, opacity: 0.75 }}>
          {details}
        </Text>
      )}
    </View>
  );
}
