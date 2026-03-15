import React, { useEffect, useRef } from 'react';
import { useCameraPermissions } from 'expo-camera';
import * as Speech from 'expo-speech';
import { recognizeSign } from '../services/api';

// SignRecognition handles AI sign processing only — camera rendering is in SessionScreen
export default function SignRecognition({ signLanguage, outputLanguage, onSignRecognized }) {
  const [permission, requestPermission] = useCameraPermissions();

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, []);

  // Frame processing would be triggered externally via ref
  return null;
}
