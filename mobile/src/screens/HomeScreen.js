import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export default function HomeScreen({ navigation }) {
  const [signLanguage, setSignLanguage] = useState('FSL');
  const [outputLanguage, setOutputLanguage] = useState('Tagalog');

  const startSession = () => {
    navigation.navigate('Session', { signLanguage, outputLanguage });
  };

  return (
    <View className="flex-1 bg-white p-6">
      <Text className="text-2xl font-bold mb-8">Choose Your Languages</Text>
      
      {/* Sign Language Selection */}
      <Text className="text-lg mb-2">Sign Language:</Text>
      <View className="flex-row mb-6">
        <TouchableOpacity onPress={() => setSignLanguage('FSL')}>
          <Text className={signLanguage === 'FSL' ? 'font-bold' : ''}>FSL</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSignLanguage('ASL')}>
          <Text className={signLanguage === 'ASL' ? 'font-bold' : ''}>ASL</Text>
        </TouchableOpacity>
      </View>

      {/* Output Language Selection */}
      <Text className="text-lg mb-2">Output Language:</Text>
      <View className="flex-row mb-8">
        <TouchableOpacity onPress={() => setOutputLanguage('Tagalog')}>
          <Text className={outputLanguage === 'Tagalog' ? 'font-bold' : ''}>Tagalog</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setOutputLanguage('English')}>
          <Text className={outputLanguage === 'English' ? 'font-bold' : ''}>English</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={startSession}>
        <Text>Start Session</Text>
      </TouchableOpacity>
    </View>
  );
}
