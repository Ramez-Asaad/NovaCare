"""
NovaCare - Flask Application Factory (SOLID: Dependency Inversion)
Creates and configures the Flask application with all dependencies.
"""
import os
from flask import Flask
from flask_login import LoginManager

from models import (
    db, User, Role, Alert, VitalSign, Medication, 
    MedicationLog, HealthReport, EmotionLog, SystemLog, ChatHistory
)
from system_logger import get_logger
from novabrain import get_nova


def create_app(config=None):
    """
    Application factory for creating Flask app instances.
    :param config: Optional configuration dictionary
    :return: Configured Flask application
    """
    basedir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    
    app = Flask(
        __name__,
        template_folder=os.path.join(basedir, 'app', 'templates'),
        static_folder=os.path.join(basedir, 'app', 'static')
    )
    
    # Default configuration
    app.config['SECRET_KEY'] = 'dev-secret-key-change-in-production'
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'novacare.db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    # Override with custom config if provided
    if config:
        app.config.update(config)
    
    # Initialize extensions
    db.init_app(app)
    
    login_manager = LoginManager()
    login_manager.login_view = 'auth.login'
    login_manager.init_app(app)
    
    # Initialize logger
    logger = get_logger()
    
    # Initialize NovaBrain
    print("Initializing NovaBrain...")
    nova = get_nova()
    
    # Register blueprints and inject dependencies
    _register_blueprints(app, login_manager, db, logger, nova)
    
    # Initialize database
    _init_db(app, db, logger)
    
    return app


def _register_blueprints(app, login_manager, db, logger, nova):
    """Register all blueprints with dependency injection."""
    from app.routes.auth import auth_bp, init_auth
    from app.routes.dashboard import dashboard_bp, init_dashboard
    from app.routes.api import api_bp
    from app.routes.api.chat import init_chat
    from app.routes.api.alerts import init_alerts
    from app.routes.api.vitals import init_vitals
    from app.routes.api.medication import init_medication
    from app.routes.api.reports import init_reports
    
    # Initialize blueprints with dependencies
    init_auth(login_manager, db, User, logger)
    init_dashboard(db, Alert, VitalSign, Medication, HealthReport)
    init_chat(nova, db, logger, ChatHistory, EmotionLog, Alert)
    init_alerts(db, logger, Alert)
    init_vitals(db, logger, VitalSign, Alert)
    init_medication(db, logger, Medication)
    init_reports(db, logger, VitalSign, Alert, MedicationLog, HealthReport, SystemLog)
    
    # Register blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(dashboard_bp)
    app.register_blueprint(api_bp)


def _init_db(app, db, logger):
    """Initialize database with seed data."""
    with app.app_context():
        db.create_all()
        logger.set_db(db)
        
        # Seed Roles
        roles = ['primary', 'caregiver', 'doctor', 'emergency']
        for r_name in roles:
            if not Role.query.filter_by(name=r_name).first():
                db.session.add(Role(name=r_name))
        db.session.commit()

        # Seed Users
        users_to_seed = [
            ('user', 'password', 'primary'),
            ('guardian', 'password', 'caregiver'),
            ('doctor', 'password', 'doctor'),
            ('emergency', 'password', 'emergency')
        ]
        for username, pwd, role_name in users_to_seed:
            if not User.query.filter_by(username=username).first():
                r = Role.query.filter_by(name=role_name).first()
                u = User(username=username, password_hash=pwd, role=r)
                db.session.add(u)
        db.session.commit()
        
        logger.info('SYSTEM', 'Database initialized and seeded')
        print("Database initialized and seeded.")
