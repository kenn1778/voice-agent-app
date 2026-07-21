import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { useSessionStore } from '../store/sessionStore';

export function TranscriptScreen() {
  const { transcript, digest } = useSessionStore();

  if (transcript.length === 0 && !digest) {
    return (
      <View className="flex-1 bg-background dark:bg-backgroundDark items-center justify-center px-6">
        <Text className="text-textSecondary text-lg">No transcripts yet.</Text>
        <Text className="text-textSecondary text-sm mt-2">Start a voice session to see your transcript here.</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background dark:bg-backgroundDark px-4">
      {digest && (
        <View className="mt-4 p-4 bg-surface dark:bg-surfaceDark rounded-lg">
          <Text className="text-xs font-semibold text-textSecondary uppercase tracking-wide">Summary</Text>
          <Text className="text-text dark:text-textDark mt-1">{digest}</Text>
        </View>
      )}
      <Text className="text-lg font-bold text-text dark:text-textDark mt-6 mb-2">Transcript</Text>
      <FlatList
        data={transcript}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className={`py-2 ${item.speaker === 'user' ? 'items-start' : 'items-end'}`}>
            <View className={`max-w-[80%] p-3 rounded-lg ${item.speaker === 'user' ? 'bg-primaryLight' : 'bg-secondaryLight'} ${!item.isFinal ? 'opacity-70' : ''}`}>
              <Text className="text-xs font-medium mb-1">{item.speaker === 'user' ? 'You' : 'Agent'}</Text>
              <Text className="text-text dark:text-textDark text-sm">{item.text}</Text>
            </View>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 32 }}
      />
    </View>
  );
}
