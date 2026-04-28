"""
CSV export route (bonus feature).
Endpoint: GET /export/csv
"""

import io
from flask import Blueprint, send_file
from utils.data_processing import get_records_dataframe

export_bp = Blueprint('export', __name__)


@export_bp.route('/export/csv', methods=['GET'])
def export_csv():
    """Download all health records as a CSV file."""
    try:
        df = get_records_dataframe()

        if df.empty:
            return {'error': 'No records to export'}, 404

        # Convert DataFrame to CSV in-memory
        buffer = io.BytesIO()
        df.to_csv(buffer, index=False, encoding='utf-8')
        buffer.seek(0)

        return send_file(
            buffer,
            mimetype='text/csv',
            as_attachment=True,
            download_name='health_records.csv',
        )

    except Exception as e:
        return {'error': str(e)}, 500
