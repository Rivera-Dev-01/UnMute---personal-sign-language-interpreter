import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

MODEL_PATHS = {
    'FSL': os.getenv('FSL_MODEL_PATH', str(BASE_DIR / '../ai-training/trained_models/fsl_model.h5')),
    'ASL': os.getenv('ASL_MODEL_PATH', str(BASE_DIR / '../ai-training/trained_models/asl_model.h5'))
}

SUPABASE_URL = os.getenv('SUPABASE_URL', '')
SUPABASE_KEY = os.getenv('SUPABASE_KEY', '')
