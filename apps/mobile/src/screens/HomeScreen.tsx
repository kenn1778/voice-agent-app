import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../auth/AuthProvider';
import type { RootStackParamList } from '../navigation/RootNavigator';

export function HomeScreen() {
  const { signOut } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View className="flex-1 bg-background dark:bg-backgroundDark items-center justify-center px-6">
      <Text className="text-2xl font-bold text-text dark:text-textDark mb-2">Welcome</Text>
      <Text className="text-textSecondary text-center mb-8">Tap below to start a voice conversation with your AI agent.</Text>
      <TouchableOpacity
        onPress={() => navigation.navigate('VoiceSession')}
        className="bg-primary w-24 h-24 rounded-full items-center justify-center mb-6 shadow-lg"
        accessibilityLabel="Start voice session"
        accessibilityRole="button"
      >
        <Text className="text-white text-4xl">ðŸŽ¤</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('Transcript')}
        className="py-3 px-8 bg-surface dark:bg-surfaceDark rounded-lg border border-gray-200 dark:border-gray-700 mb-4"
        accessibilityLabel="View transcript history"
      >
        <Text className="text-primary dark:text-primaryLight font-semibold">View Transcripts</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={signOut} className="py-2">
        <Text className="text-error">Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}
