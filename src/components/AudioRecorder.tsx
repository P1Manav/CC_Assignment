import React, { useState, useRef } from "react";
import axios from "axios";

const AudioRecorder: React.FC = () => {
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  const startRecording = async () => {
    setRecording(true);
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;

    audioChunks.current = [];

    mediaRecorder.ondataavailable = (event) => {
      audioChunks.current.push(event.data);
    };

    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunks.current, { type: "audio/wav" });
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudioURL(audioUrl);

      const formData = new FormData();
      formData.append("file", audioBlob, "audio.wav");

      try {
        const response = await axios.post(
          "https://4lafzadyc9.execute-api.ap-south-1.amazonaws.com/prod/parkinsonsPredictor", // ✅ Your real API Gateway URL
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log("Prediction response:", response.data);
        alert(`Prediction: ${response.data.prediction}`);
      } catch (error: any) {
        console.error("Error during prediction:", error);
        alert("Error sending audio for prediction.");
      }
    };

    mediaRecorder.start();
  };

  const stopRecording = () => {
    setRecording(false);
    mediaRecorderRef.current?.stop();
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Parkinson's Detection</h2>
      <div className="flex gap-4">
        {!recording ? (
          <button
            onClick={startRecording}
            className="bg-green-600 text-white px-4 py-2 rounded-xl"
          >
            Start Recording
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="bg-red-600 text-white px-4 py-2 rounded-xl"
          >
            Stop Recording
          </button>
        )}
      </div>

      {audioURL && (
        <div className="mt-4">
          <audio controls src={audioURL} />
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;
