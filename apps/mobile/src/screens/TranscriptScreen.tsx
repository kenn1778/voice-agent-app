import React, { useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../auth/AuthProvider';
import { listSessions, SessionItem } from '../api/sessions';
import { logger } from '../utils/logger';
import type { RootStackParamList } from '../navigation/RootNavigator';

export function TranscriptScreen() {
  const { getAccessToken } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const { data: sessions, isLoading, error } = useQuery({
    queryKey: ['sessions'],
    queryFn: async () => {
      const token = await getAccessToken();
      if (!token) throw new Error('Not authenticated');
      return listSessions(token);
    },
    staleTime: 30_000,
  });

  const renderItem = useCallback(({ item }: { item: SessionItem }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('SessionDetail', { sessionId: item.sessionId })}
      className="p-4 bg-surface dark:bg-surfaceDark rounded-lg mb-2 mx-4 border border-gray-100 dark:border-gray-800"
    >
      <View className="flex-row justify-between items-center">
        <Text className="text-sm font-semibold text-text dark:text-textDark">
          {new Date(item.createdAt).toLocaleDateString(undefined, {
            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
          })}
        </Text>
        <Text className={`text-xs px-2 py-0.5 rounded ${item.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
          {item.status}
        </Text>
      </View>
      {item.digest && (
        <Text className="text-textSecondary text-sm mt-1 line-clamp-2" numberOfLines={2}>
          {item.digest}
        </Text>
      )}
      <Text className="text-xs text-textSecondary mt-1">
        {item.transcript?.length || 0} exchanges
      </Text>
    </TouchableOpacity>
  ), [navigation]);

  if (isLoading) {
    return (
      <View className="flex-1 bg-background dark:bg-backgroundDark items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    logger.error('Failed to load sessions', error);
    return (
      <View className="flex-1 bg-background dark:bg-backgroundDark items-center justify-center px-6">
        <Text className="text-error text-base">Could not load session history.</Text>
      </View>
    );
  }

  if (!sessions || sessions.length === 0) {
    return (
      <View className="flex-1 bg-background dark:bg-backgroundDark items-center justify-center px-6">
        <Text className="text-textSecondary text-lg">No transcripts yet.</Text>
        <Text className="text-textSecondary text-sm mt-2">Start a voice session to see your history here.</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background dark:bg-backgroundDark pt-4">
      <FlatList
        data={sessions}
        keyExtractor={(item) => item.sessionId}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 32 }}
      />
    </View>
  );
}
