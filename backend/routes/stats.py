"""
Statistics endpoint — uses Pandas for data aggregation.
Endpoint: GET /stats
"""

from flask import Blueprint, jsonify
from utils.data_processing import get_records_dataframe, compute_statistics

stats_bp = Blueprint('stats', __name__)


@stats_bp.route('/stats', methods=['GET'])
def get_stats():
    """
    Return summary statistics:
      - average weight, steps, calories
      - min and max values
      - latest entry
    """
    try:
        df = get_records_dataframe()
        stats = compute_statistics(df)
        return jsonify(stats), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
