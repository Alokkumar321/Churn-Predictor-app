import joblib

def load_model_and_scaler():
    model = joblib.load('model/model.pkl') 
    scaler = joblib.load('model/scaler.pkl')
    model_features = joblib.load('model/model_features.pkl')
    return model, scaler, model_features

