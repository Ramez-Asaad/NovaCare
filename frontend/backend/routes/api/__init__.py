"""
NovaCare - API Routes Package
Organizes all API endpoints into focused modules.
"""
from flask import Blueprint

api_bp = Blueprint('api', __name__, url_prefix='/api')

# Import and register sub-blueprints
from .chat import chat_bp
from .alerts import alerts_bp
from .vitals import vitals_bp
from .medication import medication_bp
from .reports import reports_bp

api_bp.register_blueprint(chat_bp)
api_bp.register_blueprint(alerts_bp)
api_bp.register_blueprint(vitals_bp)
api_bp.register_blueprint(medication_bp)
api_bp.register_blueprint(reports_bp)
