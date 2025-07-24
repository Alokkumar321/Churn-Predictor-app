from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import pandas as pd
import joblib
import os
from utils.preprocess import preprocess_input

app = Flask(__name__)
CORS(app)

# Load model and necessary artifacts
model = joblib.load("model/model.pkl")
scaler = joblib.load('model/scaler.pkl')
model_features = joblib.load('model/model_features.pkl')

# 🔹 Single Entry Prediction
@app.route('/predict', methods=['POST'])
def predict_single():
    data = request.get_json()
    
    binary_fields = ['HasCrCard', 'IsActiveMember']
    for field in binary_fields:
        if field in data:
            value = str(data[field]).strip().lower()
            data[field] = 1 if value == 'yes' else 0

    df = pd.DataFrame([data])
    processed = preprocess_input(df, scaler, model_features)

    prediction = model.predict(processed)[0]
    result = 'Yes' if prediction == 1 else 'No'
    return jsonify({'prediction': result})

# 🔹 Bulk Upload Prediction
@app.route('/predict-bulk', methods=['POST'])
def predict_bulk():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400

    file = request.files['file']
    try:
        df = pd.read_csv(file)
    except Exception as e:
        return jsonify({'error': f'Invalid CSV file: {str(e)}'}), 400

    processed = preprocess_input(df.copy(), scaler, model_features)
    predictions = model.predict(processed)
    df['Churn_Predicted'] = ['Yes' if p == 1 else 'No' for p in predictions]

    # Save predicted output
    os.makedirs('uploads', exist_ok=True)
    csv_path = 'uploads/predicted_output.csv'
    df.to_csv(csv_path, index=False)

    preview = df.head(10).to_dict(orient='records')
    return jsonify({
        'preview': preview,
        'download_url': '/download'
    })

# 🔹 Download Route (Updated)
@app.route('/download', methods=['GET'])
def download_file():
    path = 'uploads/predicted_output.csv'
    if os.path.exists(path):
        return send_file(path, as_attachment=True)
    else:
        return jsonify({'error': 'File not found'}), 404

if __name__ == '__main__':
    app.run(debug=True)
