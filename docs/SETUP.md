# Setup Instructions

## Prerequisites
- Node.js 18+
- Python 3.10+
- Expo CLI
- Google Colab account (for training)

## Backend Setup
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your config
uvicorn app.main:app --reload
```

## Mobile Setup
```bash
cd mobile
npm install
npx expo start
```

## AI Training (Colab)
1. Upload notebooks to Google Colab
2. Record sign videos for dataset
3. Run training notebooks
4. Download trained models to `ai-training/trained_models/`
5. Update backend .env with model paths

## Running the App
1. Start backend: `uvicorn app.main:app --reload`
2. Start mobile: `npx expo start`
3. Scan QR code with Expo Go app
4. Grant camera and microphone permissions
5. Select languages and start session
