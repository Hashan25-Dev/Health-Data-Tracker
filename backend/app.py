"""
Flask application factory for the Health Data Tracker.
Initializes extensions, registers blueprints, and creates DB tables.
"""

from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import Config
from models import db


def create_app():
    """Create and configure the Flask application."""
    app = Flask(__name__)
    app.config.from_object(Config)

    # ── Extensions ──────────────────────────────────────────────
    CORS(app, resources={r"/*": {"origins": "*"}})
    db.init_app(app)
    JWTManager(app)

    # ── Blueprints ──────────────────────────────────────────────
    from routes.records import records_bp
    from routes.stats import stats_bp
    from routes.predict import predict_bp
    from routes.auth import auth_bp
    from routes.export import export_bp

    app.register_blueprint(records_bp)
    app.register_blueprint(stats_bp)
    app.register_blueprint(predict_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(export_bp)

    # ── Create tables on first run ──────────────────────────────
    with app.app_context():
        db.create_all()

    # ── Health check ────────────────────────────────────────────
    @app.route('/')
    def index():
        return {'message': 'Health Data Tracker API is running', 'status': 'ok'}

    return app


if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, port=5000)
