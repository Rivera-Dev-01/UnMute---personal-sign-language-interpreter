import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import SessionScreen from './screens/SessionScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'SignVoice' }} />
        <Stack.Screen name="Session" component={SessionScreen} options={{ title: 'Live Session' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
