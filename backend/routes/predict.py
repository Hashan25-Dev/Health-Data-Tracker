"""
Prediction endpoint — uses scikit-learn Linear Regression.
Endpoint: GET /predict
"""

from flask import Blueprint, jsonify
from utils.data_processing import get_records_dataframe
from utils.ml_model import predict_future

predict_bp = Blueprint('predict', __name__)


@predict_bp.route('/predict', methods=['GET'])
def get_predictions():
    """
    Train a Linear Regression model on historical data
    and predict the next 7 days for weight, steps, and calories.
    """
    try:
        df = get_records_dataframe()
        result = predict_future(df, days=7)

        if 'error' in result:
            return jsonify(result), 400

        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
