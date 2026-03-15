import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CameraView } from 'expo-camera';
import SignRecognition from '../components/SignRecognition';
import SpeechInput from '../components/SpeechInput';
import ConversationThread from '../components/ConversationThread';
import { controlColors } from '../utils/theme';

const logo = require('../logo_UnMute.jpg-.png');

// ViewfinderOverlay — four purple corner brackets positioned absolutely
function ViewfinderOverlay() {
  const bracketSize = 24;
  const bracketThickness = 3;
  const bracketColor = '#7c3aed';
  const offset = 12;

  const cornerStyle = {
    position: 'absolute',
    width: bracketSize,
    height: bracketSize,
  };

  return (
    <>
      {/* Top-left */}
      <View style={[cornerStyle, { top: offset, left: offset }]}>
        <View style={{ position: 'absolute', top: 0, left: 0, width: bracketSize, height: bracketThickness, backgroundColor: bracketColor }} />
        <View style={{ position: 'absolute', top: 0, left: 0, width: bracketThickness, height: bracketSize, backgroundColor: bracketColor }} />
      </View>
      {/* Top-right */}
      <View style={[cornerStyle, { top: offset, right: offset }]}>
        <View style={{ position: 'absolute', top: 0, right: 0, width: bracketSize, height: bracketThickness, backgroundColor: bracketColor }} />
        <View style={{ position: 'absolute', top: 0, right: 0, width: bracketThickness, height: bracketSize, backgroundColor: bracketColor }} />
      </View>
      {/* Bottom-left */}
      <View style={[cornerStyle, { bottom: offset, left: offset }]}>
        <View style={{ position: 'absolute', bottom: 0, left: 0, width: bracketSize, height: bracketThickness, backgroundColor: bracketColor }} />
        <View style={{ position: 'absolute', bottom: 0, left: 0, width: bracketThickness, height: bracketSize, backgroundColor: bracketColor }} />
      </View>
      {/* Bottom-right */}
      <View style={[cornerStyle, { bottom: offset, right: offset }]}>
        <View style={{ position: 'absolute', bottom: 0, right: 0, width: bracketSize, height: bracketThickness, backgroundColor: bracketColor }} />
        <View style={{ position: 'absolute', bottom: 0, right: 0, width: bracketThickness, height: bracketSize, backgroundColor: bracketColor }} />
      </View>
    </>
  );
}

// ControlBar — camera, mic, speaker, END buttons
function ControlBar({ cameraEnabled, micEnabled, speakerEnabled, onCameraToggle, onMicToggle, onSpeakerToggle, onEnd }) {
  return (
    <View style={styles.controlBar}>
      <TouchableOpacity
        onPress={onCameraToggle}
        style={[styles.controlButton, { backgroundColor: controlColors.cameraBg }]}
        accessibilityLabel="Toggle camera"
      >
        <Text style={styles.controlIcon}>{cameraEnabled ? '📷' : '🚫'}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onMicToggle}
        style={[styles.controlButton, { backgroundColor: controlColors.micBg }]}
        accessibilityLabel="Toggle microphone"
      >
        <Text style={styles.controlIcon}>{micEnabled ? '🎤' : '🔇'}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onSpeakerToggle}
        style={[styles.controlButton, { backgroundColor: controlColors.speakerBg }]}
        accessibilityLabel="Toggle speaker"
      >
        <Text style={styles.controlIcon}>{speakerEnabled ? '🔊' : '🔕'}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onEnd}
        style={[styles.endButton, { backgroundColor: controlColors.endBg }]}
        accessibilityLabel="End session"
      >
        <Text style={[styles.endButtonText, { color: controlColors.endText }]}>END</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function SessionScreen({ route, navigation }) {
  const { signLanguage = 'FSL', outputLanguage = 'Tagalog' } = route.params ?? {};

  const [messages, setMessages] = useState([]);
  const [cameraType, setCameraType] = useState('front');
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [micEnabled, setMicEnabled] = useState(true);
  const [speakerEnabled, setSpeakerEnabled] = useState(true);

  const addMessage = (text, type) => {
    setMessages(prev => [...prev, { text, type, timestamp: Date.now() }]);
  };

  const clearMessages = () => setMessages([]);

  const flipCamera = () => {
    setCameraType(prev => (prev === 'front' ? 'back' : 'front'));
  };

  return (
    <LinearGradient
      colors={['#ffffff', '#f2f1f6']}
      style={styles.container}
    >
      {/* Custom Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton} accessibilityLabel="Go back">
          <Text style={styles.headerButtonText}>‹</Text>
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Image source={logo} style={styles.logoImage} resizeMode="contain" />
          <Text style={styles.headerTitle}>{signLanguage} → {outputLanguage}</Text>
          <View style={styles.liveRow}>
            <View style={styles.liveDot} />
            <Text style={styles.liveLabel}>Live Session</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.headerButton} accessibilityLabel="Settings">
          <Text style={styles.headerButtonText}>⚙</Text>
        </TouchableOpacity>
      </View>

      {/* Camera Viewfinder */}
      <View style={styles.viewfinderContainer}>
        {cameraEnabled ? (
          <CameraView style={StyleSheet.absoluteFill} facing={cameraType} />
        ) : (
          <View style={[StyleSheet.absoluteFill, styles.cameraOff]}>
            <Text style={styles.cameraOffText}>Camera Off</Text>
          </View>
        )}

        {/* ViewfinderOverlay — four corner brackets */}
        <ViewfinderOverlay />

        {/* Flip button — bottom-right of viewfinder */}
        <TouchableOpacity
          onPress={flipCamera}
          style={styles.flipButton}
          accessibilityLabel="Flip camera"
        >
          <Text style={styles.flipButtonText}>🔄</Text>
        </TouchableOpacity>
      </View>

      {/* Hidden AI components — preserve existing callbacks */}
      <SpeechInput onSpeechRecognized={addMessage} />
      <SignRecognition
        signLanguage={signLanguage}
        outputLanguage={outputLanguage}
        onSignRecognized={addMessage}
      />

      {/* Conversation Thread */}
      <ConversationThread messages={messages} onClear={clearMessages} />

      {/* Control Bar */}
      <ControlBar
        cameraEnabled={cameraEnabled}
        micEnabled={micEnabled}
        speakerEnabled={speakerEnabled}
        onCameraToggle={() => setCameraEnabled(prev => !prev)}
        onMicToggle={() => setMicEnabled(prev => !prev)}
        onSpeakerToggle={() => setSpeakerEnabled(prev => !prev)}
        onEnd={() => navigation.goBack()}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 52,
    paddingBottom: 12,
  },
  headerButton: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerButtonText: {
    fontSize: 24,
    color: '#0f0d1a',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  logoImage: {
    width: 110,
    height: 40,
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f0d1a',
  },
  liveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00d492',
    marginRight: 5,
  },
  liveLabel: {
    fontSize: 12,
    color: '#00bc7d',
    fontWeight: '600',
  },
  // Viewfinder
  viewfinderContainer: {
    height: 240,
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#000',
    position: 'relative',
  },
  cameraOff: {
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraOffText: {
    color: '#71717a',
    fontSize: 14,
  },
  flipButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderRadius: 20,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flipButtonText: {
    fontSize: 18,
  },
  // Control Bar
  controlBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 28,
    backgroundColor: 'transparent',
  },
  controlButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlIcon: {
    fontSize: 22,
  },
  endButton: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  endButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});
