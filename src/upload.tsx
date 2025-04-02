import { useState } from "react";

export default function AudioUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [prediction, setPrediction] = useState<string | null>(null);

  const uploadAudio = async () => {
    if (!file) return alert("Please upload an audio file");

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("https://your-api-gateway-url.amazonaws.com/prod/upload", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();
    setPrediction(result.body);
  };

  return (
    <div className="p-4">
      <input type="file" accept="audio/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      <button onClick={uploadAudio} className="bg-blue-500 text-white p-2">Upload</button>
      {prediction && <div className="mt-4">{JSON.stringify(prediction)}</div>}
    </div>
  );
}
