import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Camera } from 'expo-camera';
import * as Speech from 'expo-speech';
import { recognizeSign } from '../services/api';

export default function SignRecognition({ signLanguage, outputLanguage, onSignRecognized }) {
  const cameraRef = useRef(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastSign, setLastSign] = useState(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (hasPermission && cameraRef.current) {
      // Process frames every 500ms
      intervalRef.current = setInterval(async () => {
        if (!isProcessing) {
          await processFrame();
        }
      }, 500);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [hasPermission, isProcessing]);

  const processFrame = async () => {
    if (!cameraRef.current) return;
    
    setIsProcessing(true);
    try {
      // Capture photo as base64
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.5,
        base64: true,
        skipProcessing: true,
      });

      // Send to backend
      const result = await recognizeSign(photo.base64, signLanguage, outputLanguage);
      
      if (result.text && result.text !== lastSign) {
        setLastSign(result.text);
        onSignRecognized(result.text, 'sign');
        
        // Speak the result
        Speech.speak(result.text, { 
          language: outputLanguage === 'Tagalog' ? 'tl-PH' : 'en-US' 
        });
      }
    } catch (error) {
      console.error('Frame processing error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (hasPermission === null) {
    return <View style={styles.container}><Text>Requesting camera permission...</Text></View>;
  }
  
  if (hasPermission === false) {
    return <View style={styles.container}><Text>No camera access</Text></View>;
  }

  return (
    <View style={styles.container}>
      <Camera 
        ref={cameraRef} 
        style={styles.camera} 
        type={Camera.Constants.Type.front}
      />
      {lastSign && (
        <View style={styles.overlay}>
          <Text style={styles.signText}>{lastSign}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 15,
    borderRadius: 10,
  },
  signText: {
    color: 'white',
    fontSize: 24,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
