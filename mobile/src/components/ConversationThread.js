import React, { useRef, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';

function ConversationBubble({ message }) {
  const isSign = message.type === 'sign';
  const timeString = new Date(message.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <View
      className={`mb-2 max-w-xs ${isSign ? 'self-end items-end' : 'self-start items-start'}`}
    >
      <View
        style={{
          backgroundColor: isSign ? 'rgba(59,130,246,0.12)' : 'rgba(113,113,122,0.12)',
          borderRadius: 12,
          paddingHorizontal: 12,
          paddingVertical: 8,
        }}
      >
        <Text className="text-gray-900 dark:text-gray-100">{message.text}</Text>
        <Text style={{ fontSize: 11.2, color: '#71717a', marginTop: 2 }}>{timeString}</Text>
      </View>
    </View>
  );
}

function EmptyState() {
  return (
    <View className="flex-1 items-center justify-center py-12">
      <Text style={{ fontSize: 40 }}>💬</Text>
      <Text className="text-gray-700 font-semibold mt-3 text-base">
        Start signing or speaking
      </Text>
      <Text className="text-gray-400 mt-1 text-sm">Messages will appear here</Text>
    </View>
  );
}

export default function ConversationThread({ messages, onClear }) {
  const listRef = useRef(null);

  useEffect(() => {
    if (messages.length > 0 && listRef.current) {
      listRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  return (
    <View className="flex-1">
      {/* Section header */}
      <View className="flex-row items-center justify-between px-4 py-2">
        <Text className="text-gray-900 font-semibold text-base">Conversation</Text>
        <TouchableOpacity onPress={onClear}>
          <Text style={{ color: '#7c3aed', fontWeight: '600' }}>Clear</Text>
        </TouchableOpacity>
      </View>

      {messages.length === 0 ? (
        <EmptyState />
      ) : (
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(_, idx) => String(idx)}
          renderItem={({ item }) => <ConversationBubble message={item} />}
          contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 8 }}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
        />
      )}
    </View>
  );
}
