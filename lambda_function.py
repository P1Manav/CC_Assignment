# lambda_function.py
import json
import boto3
import base64
import joblib
import numpy as np
from io import BytesIO
import librosa

s3 = boto3.client('s3')
BUCKET = 'parkinsons-models-bucket'

def extract_features(audio_bytes):
    y, sr = librosa.load(BytesIO(audio_bytes), sr=None)
    mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)
    return np.mean(mfccs.T, axis=0).reshape(1, -1)

def load_model(key):
    obj = s3.get_object(Bucket=BUCKET, Key=key)
    return joblib.load(BytesIO(obj['Body'].read()))

def lambda_handler(event, context):
    body = json.loads(event['body'])
    audio_b64 = body['audio']
    
    audio_bytes = base64.b64decode(audio_b64)
    features = extract_features(audio_bytes)

    rf = load_model('rf_model.pkl')
    log = load_model('lr_model.pkl')
    
    rf_pred = rf.predict(features)[0]
    log_pred = log.predict(features)[0]
    
    final = 1 if (rf_pred + log_pred) >= 1 else 0

    return {
        'statusCode': 200,
        'body': json.dumps({
            'prediction': 'Parkinson' if final else 'Healthy',
            'rf': int(rf_pred),
            'log': int(log_pred)
        })
    }
