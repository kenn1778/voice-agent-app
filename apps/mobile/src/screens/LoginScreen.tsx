import React, { useState } from 'react';
import { View, Text, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { Button } from '../components';
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
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1 bg-indigo-950">
      <View className="flex-1 justify-center px-6">
        <View className="items-center mb-10">
          <View className="w-20 h-20 bg-indigo-500/20 rounded-3xl items-center justify-center mb-6 border-2 border-indigo-400/30">
            <Text className="text-4xl">🎙️</Text>
          </View>
          <Text className="text-3xl font-bold text-white tracking-tight">Voice Agent</Text>
          <Text className="text-indigo-300 mt-2 text-base">Speak. Listen. Done.</Text>
        </View>

        {error && (
          <View className="bg-red-500/10 border border-red-400/20 p-3 rounded-xl mb-4" accessibilityRole="alert">
            <Text className="text-red-200 text-sm text-center">{error}</Text>
          </View>
        )}

        <View className="gap-y-3 mb-6">
          <TextInput
            testID="email-input"
            className="bg-indigo-500/10 border border-indigo-400/20 rounded-xl px-5 py-4 text-white placeholder-indigo-300"
            placeholder="Email"
            placeholderTextColor="#A5B4FC"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
            accessibilityLabel="Email address"
          />
          <TextInput
            testID="password-input"
            className="bg-indigo-500/10 border border-indigo-400/20 rounded-xl px-5 py-4 text-white placeholder-indigo-300"
            placeholder="Password"
            placeholderTextColor="#A5B4FC"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoComplete="password"
            accessibilityLabel="Password"
          />
          <Button title="Sign In" onPress={handleLogin} loading={loading} disabled={loading} variant="primary" size="lg" />
        </View>

        <Text className="text-indigo-400/50 text-xs text-center">
          End-to-end encrypted
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}
