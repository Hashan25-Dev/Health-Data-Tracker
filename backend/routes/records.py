"""
CRUD routes for health records.
Endpoints: POST /add, GET /records, PUT /update/<id>, DELETE /delete/<id>
"""

from flask import Blueprint, request, jsonify
from models import db, HealthRecord
from datetime import datetime

records_bp = Blueprint('records', __name__)


@records_bp.route('/add', methods=['POST'])
def add_record():
    """Add a new health record."""
    try:
        data = request.get_json()

        # Validate required fields
        required = ['date', 'weight', 'steps', 'calories']
        for field in required:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400

        # Parse date string → date object
        record_date = datetime.strptime(data['date'], '%Y-%m-%d').date()

        new_record = HealthRecord(
            date=record_date,
            weight=float(data['weight']),
            steps=int(data['steps']),
            calories=int(data['calories']),
        )

        db.session.add(new_record)
        db.session.commit()

        return jsonify({
            'message': 'Record added successfully',
            'record': new_record.to_dict()
        }), 201

    except ValueError as e:
        return jsonify({'error': f'Invalid data format: {str(e)}'}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@records_bp.route('/records', methods=['GET'])
def get_records():
    """Return all health records sorted by date (ascending)."""
    try:
        records = HealthRecord.query.order_by(HealthRecord.date.asc()).all()
        return jsonify([r.to_dict() for r in records]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@records_bp.route('/update/<int:record_id>', methods=['PUT'])
def update_record(record_id):
    """Update an existing health record by ID."""
    try:
        record = HealthRecord.query.get(record_id)
        if not record:
            return jsonify({'error': 'Record not found'}), 404

        data = request.get_json()

        if 'date' in data:
            record.date = datetime.strptime(data['date'], '%Y-%m-%d').date()
        if 'weight' in data:
            record.weight = float(data['weight'])
        if 'steps' in data:
            record.steps = int(data['steps'])
        if 'calories' in data:
            record.calories = int(data['calories'])

        db.session.commit()

        return jsonify({
            'message': 'Record updated successfully',
            'record': record.to_dict()
        }), 200

    except ValueError as e:
        return jsonify({'error': f'Invalid data format: {str(e)}'}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@records_bp.route('/delete/<int:record_id>', methods=['DELETE'])
def delete_record(record_id):
    """Delete a health record by ID."""
    try:
        record = HealthRecord.query.get(record_id)
        if not record:
            return jsonify({'error': 'Record not found'}), 404

        db.session.delete(record)
        db.session.commit()

        return jsonify({'message': 'Record deleted successfully'}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
