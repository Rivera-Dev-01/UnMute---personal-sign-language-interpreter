import axios from 'axios';

const API_URL = process.env.BACKEND_URL || 'http://localhost:8000';

export const recognizeSign = async (frameData, signLanguage, outputLanguage) => {
  try {
    const response = await axios.post(`${API_URL}/recognize`, {
      frame: frameData,
      sign_language: signLanguage,
      output_language: outputLanguage
    });
    return response.data;
  } catch (error) {
    console.error('Recognition error:', error);
    return { text: null };
  }
};
