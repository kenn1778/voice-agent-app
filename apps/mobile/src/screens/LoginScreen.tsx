import React, { useState } from 'react';
import { View, Text, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { Button, ErrorBanner } from '../components';
import { useAuth } from '../auth';

export function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signIn } = useAuth();

  async function handleLogin() {
    if (!username.trim() || !password.trim()) {
      setError('Please enter your email and password.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await signIn(username, password);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Sign in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1 bg-background dark:bg-backgroundDark justify-center px-6">
      <View className="items-center mb-8">
        <Text className="text-3xl font-bold text-text dark:text-textDark">Voice Agent</Text>
        <Text className="text-textSecondary mt-2">Sign in to get started</Text>
      </View>
      {error && <ErrorBanner message={error} />}
      <View className="gap-y-4">
        <TextInput
          testID="email-input"
          className="bg-surface dark:bg-surfaceDark border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-text dark:text-textDark"
          placeholder="Email"
          placeholderTextColor="#9CA3AF"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          keyboardType="email-address"
          autoComplete="email"
          accessibilityLabel="Email address"
        />
        <TextInput
          testID="password-input"
          className="bg-surface dark:bg-surfaceDark border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-text dark:text-textDark"
          placeholder="Password"
          placeholderTextColor="#9CA3AF"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoComplete="password"
          accessibilityLabel="Password"
        />
        <Button title="Sign In" onPress={handleLogin} loading={loading} disabled={loading} />
      </View>
    </KeyboardAvoidingView>
  );
}
