import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, View } from 'react-native';

type ButtonProps = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  icon?: string;
  className?: string;
};

const variantClasses: Record<string, string> = {
  primary: 'bg-primary active:bg-primaryDark shadow-lg shadow-indigo-500/30',
  secondary: 'bg-secondary active:bg-dark shadow-lg shadow-sky-500/30',
  danger: 'bg-error active:bg-red-600 shadow-lg shadow-red-500/30',
  ghost: 'bg-transparent border border-gray-300 dark:border-gray-600',
};

const sizeClasses: Record<string, string> = {
  sm: 'py-2 px-4 rounded-lg',
  md: 'py-3 px-6 rounded-xl',
  lg: 'py-4 px-8 rounded-2xl',
};

const textClasses: Record<string, string> = {
  primary: 'text-white',
  secondary: 'text-white',
  danger: 'text-white',
  ghost: 'text-text dark:text-textDark',
};

export function Button({ title, onPress, variant = 'primary', size = 'md', loading, disabled, icon, className = '' }: ButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      className={`items-center justify-center flex-row ${variantClasses[variant]} ${sizeClasses[size]} ${disabled ? 'opacity-40' : ''} ${className}`}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: disabled || loading }}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'ghost' ? '#4F46E5' : '#FFFFFF'} size="small" />
      ) : (
        <>
          {icon && <Text className="text-lg mr-2">{icon}</Text>}
          <Text className={`font-semibold ${textClasses[variant]}`}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

export function IconButton({ icon, onPress, variant = 'primary', size = 'md', disabled, className = '' }: {
  icon: string; onPress: () => void; variant?: string; size?: string; disabled?: boolean; className?: string;
}) {
  const sizeMap: Record<string, string> = { sm: 'w-10 h-10', md: 'w-14 h-14', lg: 'w-20 h-20' };
  const colorMap: Record<string, string> = { primary: 'bg-primary', danger: 'bg-error', secondary: 'bg-secondary' };
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      className={`${sizeMap[size] || sizeMap.md} ${colorMap[variant] || colorMap.primary} rounded-full items-center justify-center shadow-lg active:opacity-80 ${disabled ? 'opacity-40' : ''} ${className}`}
      accessibilityRole="button"
    >
      <Text className="text-white text-2xl">{icon}</Text>
    </TouchableOpacity>
  );
}
