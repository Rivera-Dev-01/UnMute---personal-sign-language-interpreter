import React from 'react';
import { ScrollView, View, Text } from 'react-native';

export default function ConversationThread({ messages }) {
  return (
    <ScrollView className="flex-1 p-4">
      {messages.map((msg, idx) => (
        <View 
          key={idx}
          className={`p-3 mb-2 rounded-lg ${msg.type === 'sign' ? 'bg-blue-100 self-end' : 'bg-gray-200 self-start'}`}
        >
          <Text>{msg.text}</Text>
        </View>
      ))}
    </ScrollView>
  );
}
