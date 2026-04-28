"""
Configuration settings for the Health Data Tracker backend.
Uses SQLite by default for zero-config setup.
Switch to MySQL by changing SQLALCHEMY_DATABASE_URI.
"""

import os


class Config:
    # Database — SQLite (file-based, no install needed)
    # To switch to MySQL: 'mysql+pymysql://user:pass@localhost/health_tracker'
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        'DATABASE_URL',
        'sqlite:///health_tracker.db'
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Security
    SECRET_KEY = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'jwt-secret-change-in-production')
    JWT_ACCESS_TOKEN_EXPIRES = 86400  # 24 hours in seconds
