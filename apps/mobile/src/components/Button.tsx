import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';

type ButtonProps = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  loading?: boolean;
  disabled?: boolean;
  className?: string;
};

const variantStyles: Record<string, string> = {
  primary: 'bg-primary',
  secondary: 'bg-secondary',
  danger: 'bg-error',
};

export function Button({ title, onPress, variant = 'primary', loading, disabled, className = '' }: ButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      className={`py-3 px-6 rounded-lg items-center justify-center ${variantStyles[variant]} ${disabled ? 'opacity-50' : ''} ${className}`}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: disabled || loading }}
    >
      {loading ? (
        <ActivityIndicator color="#FFFFFF" />
      ) : (
        <Text className="text-white font-semibold text-base">{title}</Text>
      )}
    </TouchableOpacity>
  );
}
