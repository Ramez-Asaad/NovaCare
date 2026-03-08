"""
NovaCare - Routes Package
Flask blueprints for organized route handling.
"""
from .auth import auth_bp
from .dashboard import dashboard_bp
from .api import api_bp

__all__ = ['auth_bp', 'dashboard_bp', 'api_bp']
