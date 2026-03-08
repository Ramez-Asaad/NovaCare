"""
NovaCare - Dashboard Routes (SOLID: Single Responsibility)
Handles dashboard page rendering based on user role.
"""
from flask import Blueprint, render_template, redirect, url_for
from flask_login import login_required, current_user

dashboard_bp = Blueprint('dashboard', __name__)


def init_dashboard(db, Alert, VitalSign, Medication, HealthReport):
    """
    Initialize dashboard blueprint with dependencies.
    Called from app factory.
    """
    
    @dashboard_bp.route('/')
    def index():
        if current_user.is_authenticated:
            return redirect(url_for('dashboard.dashboard'))
        return render_template('index.html')
    
    @dashboard_bp.route('/dashboard')
    @login_required
    def dashboard():
        role = current_user.role.name
        
        if role == 'primary':
            meds = Medication.query.filter_by(user_id=current_user.id, is_active=True).all()
            return render_template('dashboard_primary.html', user=current_user, medications=meds)
        
        elif role == 'caregiver':
            alerts = Alert.query.order_by(Alert.timestamp.desc()).limit(10).all()
            vitals = VitalSign.query.order_by(VitalSign.timestamp.desc()).limit(10).all()
            return render_template('dashboard_caregiver.html', user=current_user, alerts=alerts, vitals=vitals)
        
        elif role == 'doctor':
            vitals = VitalSign.query.order_by(VitalSign.timestamp.desc()).limit(20).all()
            reports = HealthReport.query.order_by(HealthReport.generated_at.desc()).limit(5).all()
            return render_template('dashboard_doctor.html', user=current_user, vitals=vitals, reports=reports)
        
        elif role == 'emergency':
            alerts = Alert.query.filter_by(status='New').order_by(Alert.timestamp.desc()).all()
            return render_template('dashboard_emergency.html', user=current_user, alerts=alerts)
        
        else:
            return "Role not recognized", 403
