"""
JWT-based authentication routes (bonus feature).
Endpoints: POST /auth/signup, POST /auth/login
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from models import db, User

auth_bp = Blueprint('auth', __name__, url_prefix='/auth')


@auth_bp.route('/signup', methods=['POST'])
def signup():
    """Register a new user account."""
    try:
        data = request.get_json()
        username = data.get('username', '').strip()
        password = data.get('password', '')

        if not username or not password:
            return jsonify({'error': 'Username and password are required'}), 400

        if len(password) < 4:
            return jsonify({'error': 'Password must be at least 4 characters'}), 400

        # Check if username already exists
        if User.query.filter_by(username=username).first():
            return jsonify({'error': 'Username already taken'}), 409

        user = User(username=username)
        user.set_password(password)

        db.session.add(user)
        db.session.commit()

        token = create_access_token(identity=str(user.id))
        return jsonify({
            'message': 'Account created successfully',
            'token': token,
            'username': user.username,
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@auth_bp.route('/login', methods=['POST'])
def login():
    """Log in and receive a JWT access token."""
    try:
        data = request.get_json()
        username = data.get('username', '').strip()
        password = data.get('password', '')

        if not username or not password:
            return jsonify({'error': 'Username and password are required'}), 400

        user = User.query.filter_by(username=username).first()

        if not user or not user.check_password(password):
            return jsonify({'error': 'Invalid username or password'}), 401

        token = create_access_token(identity=str(user.id))
        return jsonify({
            'message': 'Login successful',
            'token': token,
            'username': user.username,
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
