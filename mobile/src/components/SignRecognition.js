import React, { useEffect, useRef } from 'react';
import { Camera } from 'expo-camera';
import * as Speech from 'expo-speech';
import { recognizeSign } from '../services/api';

export default function SignRecognition({ signLanguage, outputLanguage, onSignRecognized }) {
  const cameraRef = useRef(null);

  const processFrame = async () => {
    // Capture frame and send to backend for recognition
    const result = await recognizeSign(frame, signLanguage, outputLanguage);
    if (result.text) {
      onSignRecognized(result.text, 'sign');
      Speech.speak(result.text, { language: outputLanguage === 'Tagalog' ? 'tl-PH' : 'en-US' });
    }
  };

  return <Camera ref={cameraRef} style={{ flex: 1 }} type={Camera.Constants.Type.front} />;
}
