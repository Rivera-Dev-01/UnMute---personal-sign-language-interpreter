import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import SignRecognition from '../components/SignRecognition';
import SpeechInput from '../components/SpeechInput';
import ConversationThread from '../components/ConversationThread';

export default function SessionScreen({ route }) {
  const { signLanguage, outputLanguage } = route.params;
  const [messages, setMessages] = useState([]);

  const addMessage = (text, type) => {
    setMessages(prev => [...prev, { text, type, timestamp: Date.now() }]);
  };

  return (
    <View className="flex-1 bg-gray-50">
      <SignRecognition 
        signLanguage={signLanguage}
        outputLanguage={outputLanguage}
        onSignRecognized={addMessage}
      />
      <SpeechInput onSpeechRecognized={addMessage} />
      <ConversationThread messages={messages} />
    </View>
  );
}
