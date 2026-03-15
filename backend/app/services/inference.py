import tensorflow as tf
import numpy as np
from app.config import MODEL_PATHS

# Load trained models
fsl_model = None
asl_model = None

def load_models():
    global fsl_model, asl_model
    fsl_model = tf.keras.models.load_model(MODEL_PATHS['FSL'])
    asl_model = tf.keras.models.load_model(MODEL_PATHS['ASL'])

def predict_sign(frame_data, sign_language):
    """
    Run inference on video frame to recognize sign
    Returns the predicted sign label
    """
    model = fsl_model if sign_language == 'FSL' else asl_model
    
    # Preprocess frame
    # Run model inference
    # Return predicted sign
    
    return "KAMUSTA"  # Placeholder
