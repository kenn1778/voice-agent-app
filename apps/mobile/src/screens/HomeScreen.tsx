import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../auth';
import type { RootStackParamList } from '../navigation';

export function HomeScreen() {
  const { signOut } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View className="flex-1 bg-background dark:bg-backgroundDark">
      <SafeAreaView className="flex-1">
        <View className="px-6 pt-6 pb-2">
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-3xl font-bold text-text dark:text-textDark">Voice Agent</Text>
              <Text className="text-textSecondary text-sm mt-1">Ready when you are</Text>
            </View>
            <TouchableOpacity onPress={signOut} className="p-2">
              <Text className="text-textSecondary text-sm">Sign Out</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="flex-1 items-center justify-center px-6">
          <TouchableOpacity
            onPress={() => navigation.navigate('VoiceSession')}
            className="w-32 h-32 bg-primary rounded-full items-center justify-center shadow-2xl shadow-indigo-500/40 active:opacity-80 mb-8"
            accessibilityLabel="Start voice session"
            accessibilityRole="button"
          >
            <Text className="text-5xl text-white">🎤</Text>
          </TouchableOpacity>

          <Text className="text-xl font-semibold text-text dark:text-textDark mb-1">Start a Conversation</Text>
          <Text className="text-textSecondary text-center text-sm leading-5 mb-10 max-w-xs">
            Tap the microphone to begin speaking with your AI assistant. It's that simple.
          </Text>

          <View className="w-full gap-y-3">
            <TouchableOpacity
              onPress={() => navigation.navigate('Transcript')}
              className="flex-row items-center bg-surface dark:bg-surfaceDark p-4 rounded-2xl border border-gray-100 dark:border-gray-800 active:opacity-70"
            >
              <View className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl items-center justify-center mr-4">
                <Text className="text-xl">📋</Text>
              </View>
              <View className="flex-1">
                <Text className="font-semibold text-text dark:text-textDark">Transcripts</Text>
                <Text className="text-textSecondary text-xs mt-0.5">View your conversation history</Text>
              </View>
              <Text className="text-textSecondary text-lg">›</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={signOut}
              className="flex-row items-center bg-surface dark:bg-surfaceDark p-4 rounded-2xl border border-gray-100 dark:border-gray-800 active:opacity-70"
            >
              <View className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-xl items-center justify-center mr-4">
                <Text className="text-xl">⚙️</Text>
              </View>
              <View className="flex-1">
                <Text className="font-semibold text-text dark:text-textDark">Settings</Text>
                <Text className="text-textSecondary text-xs mt-0.5">Account & preferences</Text>
              </View>
              <Text className="text-textSecondary text-lg">›</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
