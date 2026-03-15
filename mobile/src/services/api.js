import axios from 'axios';

// Your computer's IP address on the local network
const API_URL = process.env.BACKEND_URL || 'http://192.168.1.38:8000';

export const recognizeSign = async (frameBase64, signLanguage, outputLanguage) => {
  try {
    const response = await axios.post(`${API_URL}/recognize`, {
      frame: frameBase64,
      sign_language: signLanguage,
      output_language: outputLanguage,
      recent_signs: []
    }, {
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Recognition error:', error.message);
    return { text: null, confidence: 0 };
  }
};
