import axios from 'axios';

const API_URL = 'https://your-api-id.execute-api.region.amazonaws.com/predict'; // ← replace this

export const sendAudioForPrediction = async (audioBlob: Blob) => {
  const base64Audio = await convertBlobToBase64(audioBlob);

  const response = await axios.post(API_URL, {
    audio: base64Audio,
  });

  return response.data;
};

const convertBlobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject('File reading failed');
    reader.onload = () => {
      const dataUrl = reader.result as string;
      resolve(dataUrl.split(',')[1]); // only base64 part
    };
    reader.readAsDataURL(blob);
  });
};
