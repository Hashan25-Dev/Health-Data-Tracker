"""
Machine Learning module for the Health Data Tracker.
Uses scikit-learn LinearRegression to predict future health metrics.
"""

import numpy as np
from sklearn.linear_model import LinearRegression
from datetime import timedelta


def predict_future(df, days=7):
    """
    Train Linear Regression models on historical health data
    and predict the next `days` values for weight, steps, and calories.

    Args:
        df: Pandas DataFrame with columns [date, weight, steps, calories]
        days: Number of future days to predict (default 7)

    Returns:
        dict with predictions list and model accuracy (R² scores)
    """
    if df.empty or len(df) < 2:
        return {'error': 'Not enough data for prediction. Need at least 2 records.'}

    # Sort by date and convert to ordinal (numerical) format
    df = df.sort_values('date').copy()
    df['date_ordinal'] = df['date'].apply(lambda x: x.toordinal())

    X = df['date_ordinal'].values.reshape(-1, 1)

    # ── Train three separate models ──────────────────────────────
    weight_model = LinearRegression()
    weight_model.fit(X, df['weight'].values)

    steps_model = LinearRegression()
    steps_model.fit(X, df['steps'].values)

    calories_model = LinearRegression()
    calories_model.fit(X, df['calories'].values)

    # ── Generate future dates ────────────────────────────────────
    last_date = df['date'].max()
    future_dates = [last_date + timedelta(days=i + 1) for i in range(days)]
    future_ordinals = np.array([d.toordinal() for d in future_dates]).reshape(-1, 1)

    # ── Predict ──────────────────────────────────────────────────
    pred_weights = weight_model.predict(future_ordinals)
    pred_steps = steps_model.predict(future_ordinals)
    pred_calories = calories_model.predict(future_ordinals)

    predictions = []
    for i, date in enumerate(future_dates):
        predictions.append({
            'date': date.strftime('%Y-%m-%d'),
            'predicted_weight': round(float(pred_weights[i]), 2),
            'predicted_steps': max(0, int(pred_steps[i])),
            'predicted_calories': max(0, int(pred_calories[i])),
        })

    # ── Model accuracy (R² score) ────────────────────────────────
    accuracy = {
        'weight_r2': round(float(weight_model.score(X, df['weight'].values)), 4),
        'steps_r2': round(float(steps_model.score(X, df['steps'].values)), 4),
        'calories_r2': round(float(calories_model.score(X, df['calories'].values)), 4),
    }

    return {
        'predictions': predictions,
        'model_accuracy': accuracy,
        'training_samples': len(df),
    }
