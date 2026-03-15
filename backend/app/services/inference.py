import pickle
import sys
import numpy as np
import cv2
import base64
import mediapipe as mp
from app.config import MODEL_PATHS

# Initialize MediaPipe with new tasks API
from mediapipe.tasks import python
from mediapipe.tasks.python import vision
import urllib.request
import os

# Download hand landmarker model if not exists
MODEL_PATH = 'hand_landmarker.task'
if not os.path.exists(MODEL_PATH):
    print("Downloading MediaPipe hand model...")
    model_url = 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task'
    urllib.request.urlretrieve(model_url, MODEL_PATH)
    print("✓ Model downloaded")

# Create hand landmarker
base_options = python.BaseOptions(model_asset_path=MODEL_PATH)
options = vision.HandLandmarkerOptions(
    base_options=base_options,
    num_hands=2,
    min_hand_detection_confidence=0.5,
    min_hand_presence_confidence=0.5
)
landmarker = vision.HandLandmarker.create_from_options(options)

# Load trained models
model_data = None
model = None
scaler = None

def load_models():
    global model_data, model, scaler
    with open(MODEL_PATHS['ASL'], 'rb') as f:
        model_data = pickle.load(f)
    model = model_data['model']
    scaler = model_data.get('scaler', None)  # Handle old models without scaler
    print(f"✓ Loaded model with signs: {model_data['signs']}")
    print(f"✓ Feature engineering: {'enabled' if scaler else 'disabled'}")

def base64_to_frame(base64_string):
    """Convert base64 string to OpenCV frame"""
    try:
        # Remove data URL prefix if present
        if ',' in base64_string:
            base64_string = base64_string.split(',')[1]
        
        # Decode base64 to bytes
        img_bytes = base64.b64decode(base64_string)
        
        # Convert to numpy array
        nparr = np.frombuffer(img_bytes, np.uint8)
        
        # Decode to OpenCV image
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        return frame
    except Exception as e:
        print(f"Error decoding base64: {e}")
        return None

def normalize_landmarks(landmarks_raw):
    """Make landmarks invariant to position/size"""
    landmarks = np.array(landmarks_raw).reshape(-1, 3)
    centered = landmarks - landmarks[0]
    hand_size = np.linalg.norm(centered[9])
    if hand_size < 1e-6:
        return None
    return (centered / hand_size).flatten()

def engineer_features(landmarks_raw):
    """Extract meaningful features"""
    landmarks = np.array(landmarks_raw).reshape(-1, 3)
    features = list(landmarks.flatten())
    
    fingertips = [4, 8, 12, 16, 20]
    mcp_joints = [2, 5, 9, 13, 17]
    wrist = landmarks[0]
    palm_center = np.mean(landmarks[[0, 5, 9, 13, 17]], axis=0)
    
    # Fingertip distances
    for i in range(len(fingertips)):
        for j in range(i + 1, len(fingertips)):
            features.append(np.linalg.norm(landmarks[fingertips[i]] - landmarks[fingertips[j]]))
    
    # Fingertip to wrist
    for tip in fingertips:
        features.append(np.linalg.norm(landmarks[tip] - wrist))
    
    # Fingertip to palm
    for tip in fingertips:
        features.append(np.linalg.norm(landmarks[tip] - palm_center))
    
    # Finger curl
    for tip, mcp in zip(fingertips, mcp_joints):
        features.append(np.linalg.norm(landmarks[tip] - landmarks[mcp]))
    
    # Angles between fingers
    for i in range(len(fingertips) - 1):
        v1 = landmarks[fingertips[i]] - palm_center
        v2 = landmarks[fingertips[i + 1]] - palm_center
        cos_angle = np.dot(v1, v2) / (np.linalg.norm(v1) * np.linalg.norm(v2) + 1e-8)
        features.append(np.arccos(np.clip(cos_angle, -1, 1)))
    
    # Thumb to fingers
    thumb_tip = landmarks[4]
    for tip in [8, 12, 16, 20]:
        features.append(np.linalg.norm(thumb_tip - landmarks[tip]))
    
    # Extension ratios
    for tip, mcp in zip(fingertips, mcp_joints):
        tip_dist = np.linalg.norm(landmarks[tip] - wrist)
        mcp_dist = np.linalg.norm(landmarks[mcp] - wrist)
        features.append(tip_dist / (mcp_dist + 1e-8))
    
    # Y positions
    for tip in fingertips:
        features.append(landmarks[tip][1] - wrist[1])
    
    return features

def extract_landmarks(frame):
    """Extract hand landmarks from frame using MediaPipe tasks API"""
    frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    
    # Create MediaPipe Image
    mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=frame_rgb)
    
    # Detect hands
    result = landmarker.detect(mp_image)
    
    if result.hand_landmarks:
        landmarks = []
        for hand_landmarks in result.hand_landmarks:
            for landmark in hand_landmarks:
                landmarks.extend([landmark.x, landmark.y, landmark.z])
        return landmarks
    return None

def predict_sign(frame_base64, sign_language):
    """Run inference on base64 encoded frame"""
    # Decode base64 to frame
    frame = base64_to_frame(frame_base64)
    if frame is None:
        return None
    
    # Extract raw landmarks
    raw_landmarks = extract_landmarks(frame)
    if raw_landmarks is None:
        return None
    
    # If model has scaler, use feature engineering
    if scaler is not None:
        # Normalize
        normalized = normalize_landmarks(raw_landmarks)
        if normalized is None:
            return None
        
        # Engineer features
        features = engineer_features(normalized)
        X = np.array(features).reshape(1, -1)
        X_scaled = scaler.transform(X)
    else:
        # Old model - use raw landmarks
        X_scaled = np.array(raw_landmarks).reshape(1, -1)
    
    # Predict
    prediction = model.predict(X_scaled)[0]
    probabilities = model.predict_proba(X_scaled)[0]
    confidence = np.max(probabilities)
    
    return {
        'sign': prediction,
        'confidence': float(confidence)
    }
