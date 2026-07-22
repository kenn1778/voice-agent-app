import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

type Props = {
  children: ReactNode;
  fallback?: ReactNode;
};

type State = {
  hasError: boolean;
  error: Error | null;
};

const colors = {
  surfaceAlt: '#33235C',
  borderSoft: 'rgba(255,255,255,0.07)',
  textPrimary: '#FBF7FF',
  textSecondary: '#C7B7E8',
  mint: '#2FE6C0',
  coral: '#FF6B5B',
};

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary]', error, errorInfo.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <View style={{ flex: 1, backgroundColor: '#1B0F30', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 }}>
          <Text style={{ color: colors.textPrimary, fontSize: 20, fontWeight: '700', marginBottom: 8 }}>
            Something went wrong
          </Text>
          <Text style={{ color: colors.textSecondary, textAlign: 'center', marginBottom: 16, fontSize: 14 }}>
            {this.state.error?.message || 'An unexpected error occurred'}
          </Text>
          <TouchableOpacity
            onPress={this.handleReset}
            accessibilityRole="button"
            accessibilityLabel="Try Again"
            style={{
              backgroundColor: colors.mint,
              paddingVertical: 12,
              paddingHorizontal: 32,
              borderRadius: 12,
            }}
          >
            <Text style={{ color: '#1D1333', fontWeight: '600', fontSize: 15 }}>
              Try Again
            </Text>
          </TouchableOpacity>
        </View>
      );
    }
    return this.props.children;
  }
}
