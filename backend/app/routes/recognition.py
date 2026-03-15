from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.inference import predict_sign
from app.services.context import apply_context_awareness

router = APIRouter(prefix="/recognize", tags=["recognition"])

class RecognitionRequest(BaseModel):
    frame: str  # Base64 encoded image
    sign_language: str  # FSL or ASL
    output_language: str  # Tagalog or English
    recent_signs: list = []

@router.post("")
async def recognize_sign(request: RecognitionRequest):
    try:
        # Run AI inference on frame
        predicted_sign = predict_sign(request.frame, request.sign_language)
        
        # Apply context awareness
        final_text = apply_context_awareness(
            predicted_sign,
            request.recent_signs,
            request.sign_language,
            request.output_language
        )
        
        return {
            "text": final_text,
            "sign": predicted_sign,
            "confidence": 0.95
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
