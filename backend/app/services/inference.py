import pickle
import numpy as np
import cv2
import mediapipe as mp
from app.config import MODEL_PATHS

# Initialize MediaPipe
mp_hands = mp.solutions.hands
hands = mp_hands.Hands(static_image_mode=False, max_num_hands=2, min_detection_confidence=0.5)

# Load trained models
fsl_model = None
asl_model = None

def load_models():
    global fsl_model, asl_model
    with open(MODEL_PATHS['FSL'], 'rb') as f:
        fsl_model = pickle.load(f)
    with open(MODEL_PATHS['ASL'], 'rb') as f:
        asl_model = pickle.load(f)

def extract_landmarks(frame):
    """Extract hand landmarks from frame using MediaPipe"""
    frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = hands.process(frame_rgb)
    
    if results.multi_hand_landmarks:
        landmarks = []
        for hand_landmarks in results.multi_hand_landmarks:
            for landmark in hand_landmarks.landmark:
                landmarks.extend([landmark.x, landmark.y, landmark.z])
        return np.array(landmarks).reshape(1, -1)
    return None

def predict_sign(frame_data, sign_language):
    """
    Run inference on video frame to recognize sign
    Returns the predicted sign label
    """
    model = fsl_model if sign_language == 'FSL' else asl_model
    
    # Extract landmarks from frame
    landmarks = extract_landmarks(frame_data)
    
    if landmarks is not None:
        prediction = model.predict(landmarks)
        return prediction[0]
    
    return None
