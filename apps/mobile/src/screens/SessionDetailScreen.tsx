import React from 'react';
import { View, Text, FlatList, ActivityIndicator, SafeAreaView } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../auth';
import { getSession } from '../api';
import { logger } from '../utils';
import type { RootStackParamList } from '../navigation';

export function SessionDetailScreen() {
  const { getAccessToken } = useAuth();
  const route = useRoute<RouteProp<RootStackParamList, 'SessionDetail'>>();
  const { sessionId } = route.params;

  const { data: session, isLoading, error } = useQuery({
    queryKey: ['session', sessionId],
    queryFn: async () => {
      const token = await getAccessToken();
      if (!token) throw new Error('Not authenticated');
      return getSession(token, sessionId);
    },
  });

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background dark:bg-backgroundDark">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#4F46E5" />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !session) {
    logger.error('Failed to load session', error);
    return (
      <SafeAreaView className="flex-1 bg-background dark:bg-backgroundDark">
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-4xl mb-4">⚠️</Text>
          <Text className="text-error text-base font-medium">Could not load session details.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const transcript = session.transcript || [];

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-backgroundDark">
      <FlatList
        data={transcript}
        keyExtractor={(_item, i) => String(i)}
        renderItem={({ item }) => (
          <View className={`px-4 py-1.5 ${item.speaker === 'user' ? 'items-end' : 'items-start'}`}>
            <View
              className={`max-w-[80%] p-3 rounded-2xl ${item.speaker === 'user'
                ? 'bg-primary rounded-tr-sm'
                : 'bg-surface dark:bg-surfaceDark border border-gray-100 dark:border-gray-800 rounded-tl-sm'
              }`}
            >
              <Text className={`text-xs font-medium mb-1 ${item.speaker === 'user' ? 'text-indigo-200' : 'text-textSecondary'}`}>
                {item.speaker === 'user' ? 'You' : 'Assistant'}
              </Text>
              <Text className={`text-sm leading-5 ${item.speaker === 'user' ? 'text-white' : 'text-text dark:text-textDark'}`}>
                {item.text}
              </Text>
            </View>
          </View>
        )}
        contentContainerStyle={{ paddingTop: 16, paddingBottom: 32 }}
        ListHeaderComponent={
          session.digest ? (
            <View className="mx-4 mb-6 p-4 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50 rounded-2xl border border-indigo-100 dark:border-indigo-900/50">
              <Text className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-2">Summary</Text>
              <Text className="text-text dark:text-textDark text-sm leading-5">{session.digest}</Text>
            </View>
          ) : null
        }
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center px-6 pt-20">
            <Text className="text-4xl mb-4">💬</Text>
            <Text className="text-textSecondary text-base">No messages in this session</Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
