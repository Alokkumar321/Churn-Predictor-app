# backend/utils/preprocess.py

import pandas as pd

def preprocess_input(df, scaler, model_features):
    # Convert categorical features using the same logic as during training
    df = df.copy()

    # Standardize column names (optional but safe)
    df.columns = [col.strip() for col in df.columns]

    # Encode categoricals
    df = pd.get_dummies(df)

    # Reindex to ensure exact feature order and presence
    df = df.reindex(columns=model_features, fill_value=0)

    # Scale numerical features
    df_scaled = scaler.transform(df)

    return df_scaled
