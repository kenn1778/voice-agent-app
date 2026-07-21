import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen } from '../screens/LoginScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { VoiceSessionScreen } from '../screens/VoiceSessionScreen';
import { TranscriptScreen } from '../screens/TranscriptScreen';
import { SessionDetailScreen } from '../screens/SessionDetailScreen';
import { useAuthStore } from '../store/authStore';

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  VoiceSession: undefined;
  Transcript: undefined;
  SessionDetail: { sessionId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <Stack.Screen name="Login" component={LoginScreen} />
      ) : (
        <>
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Voice Agent' }} />
          <Stack.Screen name="VoiceSession" component={VoiceSessionScreen} options={{ title: 'Voice Session' }} />
          <Stack.Screen name="Transcript" component={TranscriptScreen} options={{ title: 'History' }} />
          <Stack.Screen name="SessionDetail" component={SessionDetailScreen} options={{ title: 'Session' }} />
        </>
      )}
    </Stack.Navigator>
  );
}
