import React, { useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../auth';
import { listSessions } from '../api';
import type { SessionItem } from '../api';
import { logger } from '../utils';
import type { RootStackParamList } from '../navigation';

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
      className="mx-4 mb-3 p-4 bg-surface dark:bg-surfaceDark rounded-2xl border border-gray-100 dark:border-gray-800 active:opacity-70"
    >
      <View className="flex-row justify-between items-start mb-2">
        <Text className="text-sm font-semibold text-text dark:text-textDark">
          {new Date(item.createdAt).toLocaleDateString(undefined, {
            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
          })}
        </Text>
        <View className={`px-2.5 py-1 rounded-full ${item.status === 'active' ? 'bg-successLight' : 'bg-gray-100 dark:bg-gray-800'}`}>
          <Text className={`text-xs font-medium ${item.status === 'active' ? 'text-success' : 'text-gray-500'}`}>
            {item.status}
          </Text>
        </View>
      </View>
      {item.digest && (
        <Text className="text-textSecondary text-sm leading-5 mb-2" numberOfLines={2}>
          {item.digest}
        </Text>
      )}
      <View className="flex-row items-center">
        <Text className="text-xs text-gray-400">{item.transcript?.length || 0} exchanges</Text>
        <Text className="text-xs text-gray-400 ml-auto">›</Text>
      </View>
    </TouchableOpacity>
  ), [navigation]);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background dark:bg-backgroundDark">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#4F46E5" />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    logger.error('Failed to load sessions', error);
    return (
      <SafeAreaView className="flex-1 bg-background dark:bg-backgroundDark">
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-4xl mb-4">📭</Text>
          <Text className="text-error text-base font-medium">Could not load session history.</Text>
          <Text className="text-textSecondary text-sm mt-1">Pull down to try again</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!sessions || sessions.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-background dark:bg-backgroundDark">
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-5xl mb-4">🎤</Text>
          <Text className="text-text dark:text-textDark text-lg font-semibold">No transcripts yet</Text>
          <Text className="text-textSecondary text-sm mt-1 text-center">Start a voice session to see your history here</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-backgroundDark">
      <FlatList
        data={sessions}
        keyExtractor={(item) => item.sessionId}
        renderItem={renderItem}
        contentContainerStyle={{ paddingTop: 16, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
