import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';

type ButtonProps = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  icon?: string;
};

const colors = {
  surface: '#291B49',
  surfaceAlt: '#33235C',
  borderSoft: 'rgba(255,255,255,0.07)',
  textPrimary: '#FBF7FF',
  textSecondary: '#C7B7E8',
  textFaint: '#8B77B3',
  mint: '#2FE6C0',
  coral: '#FF6B5B',
};

const sizeMap: Record<string, { py: number; px: number; borderRadius: number; fontSize: number }> = {
  sm: { py: 8, px: 16, borderRadius: 8, fontSize: 13 },
  md: { py: 12, px: 24, borderRadius: 12, fontSize: 14 },
  lg: { py: 16, px: 32, borderRadius: 16, fontSize: 16 },
};

const variantMap: Record<string, { bg: string; textColor: string; border?: string }> = {
  primary: { bg: colors.mint, textColor: '#1D1333' },
  secondary: { bg: colors.surfaceAlt, textColor: colors.textPrimary, border: colors.borderSoft },
  danger: { bg: colors.coral, textColor: colors.textPrimary },
  ghost: { bg: 'transparent', textColor: colors.textSecondary, border: colors.borderSoft },
};

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading,
  disabled,
  icon,
}: ButtonProps) {
  const sizeStyle = sizeMap[size] || sizeMap.md;
  const variantStyle = variantMap[variant] || variantMap.primary;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: disabled || loading }}
      activeOpacity={0.7}
      style={{
        paddingVertical: sizeStyle.py,
        paddingHorizontal: sizeStyle.px,
        borderRadius: sizeStyle.borderRadius,
        backgroundColor: variantStyle.bg,
        borderWidth: variantStyle.border ? 1 : 0,
        borderColor: variantStyle.border || undefined,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: disabled ? 0.4 : 1,
      }}
    >
      {loading ? (
        <ActivityIndicator color={variantStyle.textColor} size="small" />
      ) : (
        <>
          {icon && <Text style={{ fontSize: sizeStyle.fontSize + 2, marginRight: 8 }}>{icon}</Text>}
          <Text style={{ color: variantStyle.textColor, fontSize: sizeStyle.fontSize, fontWeight: '600' }}>
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}

export function IconButton({
  icon,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled,
}: {
  icon: string;
  onPress: () => void;
  variant?: string;
  size?: string;
  disabled?: boolean;
}) {
  const sizeMap: Record<string, number> = { sm: 40, md: 56, lg: 80 };
  const circleSize = sizeMap[size] || sizeMap.md;
  const colorMap: Record<string, string> = {
    primary: '#2FE6C0',
    danger: '#FF6B5B',
    secondary: '#33235C',
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      activeOpacity={0.7}
      style={{
        width: circleSize,
        height: circleSize,
        borderRadius: circleSize / 2,
        backgroundColor: colorMap[variant] || colorMap.primary,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: disabled ? 0.4 : 1,
      }}
    >
      <Text style={{ color: '#1D1333', fontSize: circleSize * 0.4 }}>{icon}</Text>
    </TouchableOpacity>
  );
}
