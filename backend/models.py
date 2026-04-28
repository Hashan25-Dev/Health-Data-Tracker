"""
SQLAlchemy models for the Health Data Tracker.
Defines HealthRecord and User tables.
"""

from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

# Shared SQLAlchemy instance — imported by app.py and route modules
db = SQLAlchemy()


class HealthRecord(db.Model):
    """Stores one daily health entry (weight, steps, calories)."""
    __tablename__ = 'health_records'

    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Date, nullable=False)
    weight = db.Column(db.Float, nullable=False)        # in kg
    steps = db.Column(db.Integer, nullable=False)
    calories = db.Column(db.Integer, nullable=False)     # kcal consumed
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)

    def to_dict(self):
        """Serialize the record to a JSON-friendly dictionary."""
        return {
            'id': self.id,
            'date': self.date.isoformat(),
            'weight': self.weight,
            'steps': self.steps,
            'calories': self.calories,
        }

    def __repr__(self):
        return f'<HealthRecord {self.date} w={self.weight}>'


class User(db.Model):
    """User account for JWT authentication (bonus feature)."""
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    records = db.relationship('HealthRecord', backref='user', lazy=True)

    def set_password(self, password):
        """Hash and store the password."""
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        """Verify a plaintext password against the stored hash."""
        return check_password_hash(self.password_hash, password)

    def __repr__(self):
        return f'<User {self.username}>'
