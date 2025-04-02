import React, { useState } from 'react';
import axios from 'axios';

const API_GATEWAY_URL = "https://zq0h8jq06l.execute-api.ap-south-1.amazonaws.com/prod";

const App: React.FC = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [result, setResult] = useState<string>("");

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setSelectedFile(event.target.files[0]);
        }
    };

    const uploadFile = async () => {
        if (!selectedFile) {
            alert("Please select an audio file.");
            return;
        }

        // Upload to S3
        const formData = new FormData();
        formData.append("file", selectedFile);

        await axios.put(`https://your-s3-bucket-url/${selectedFile.name}`, formData, {
            headers: {
                "Content-Type": selectedFile.type
            }
        });

        // Trigger Lambda function
        const response = await axios.post(API_GATEWAY_URL, { file_name: selectedFile.name });
        setResult(response.data.body);
    };

    return (
        <div>
            <h2>Upload an Audio File</h2>
            <input type="file" accept="audio/*" onChange={handleFileChange} />
            <button onClick={uploadFile}>Upload & Analyze</button>

            {result && (
                <div>
                    <h3>Analysis Result:</h3>
                    <p>{JSON.stringify(result, null, 2)}</p>
                </div>
            )}
        </div>
    );
};

export default App;
