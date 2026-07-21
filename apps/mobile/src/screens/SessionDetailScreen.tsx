import React from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../auth/AuthProvider';
import { getSession } from '../api/sessions';
import { logger } from '../utils/logger';
import type { RootStackParamList } from '../navigation/RootNavigator';

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
      <View className="flex-1 bg-background dark:bg-backgroundDark items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error || !session) {
    logger.error('Failed to load session', error);
    return (
      <View className="flex-1 bg-background dark:bg-backgroundDark items-center justify-center px-6">
        <Text className="text-error text-base">Could not load session details.</Text>
      </View>
    );
  }

  const transcript = session.transcript || [];

  return (
    <View className="flex-1 bg-background dark:bg-backgroundDark px-4">
      {session.digest && (
        <View className="mt-4 p-4 bg-surface dark:bg-surfaceDark rounded-lg">
          <Text className="text-xs font-semibold text-textSecondary uppercase tracking-wide">Summary</Text>
          <Text className="text-text dark:text-textDark mt-1">{session.digest}</Text>
        </View>
      )}
      <Text className="text-lg font-bold text-text dark:text-textDark mt-6 mb-2">Transcript</Text>
      <FlatList
        data={transcript}
        keyExtractor={(_item, i) => `${i}`}
        renderItem={({ item }) => (
          <View className={`py-2 ${item.speaker === 'user' ? 'items-start' : 'items-end'}`}>
            <View className={`max-w-[80%] p-3 rounded-lg ${item.speaker === 'user' ? 'bg-primaryLight' : 'bg-secondaryLight'}`}>
              <Text className="text-xs font-medium mb-1">{item.speaker === 'user' ? 'You' : 'Agent'}</Text>
              <Text className="text-text dark:text-textDark text-sm">{item.text}</Text>
            </View>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 32 }}
        ListEmptyComponent={
          <Text className="text-textSecondary text-center mt-8">No transcript entries for this session.</Text>
        }
      />
    </View>
  );
}
