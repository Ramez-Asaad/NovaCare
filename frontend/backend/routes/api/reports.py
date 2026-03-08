"""
NovaCare - Reports API (SOLID: Single Responsibility)
Handles health report generation and system logs.
"""
from flask import Blueprint, request, jsonify
from datetime import datetime, timedelta

reports_bp = Blueprint('reports', __name__)

# Dependencies injected during initialization
_db = None
_logger = None
_VitalSign = None
_Alert = None
_MedicationLog = None
_HealthReport = None
_SystemLog = None


def init_reports(db, logger, VitalSign, Alert, MedicationLog, HealthReport, SystemLog):
    """Initialize reports blueprint with dependencies."""
    global _db, _logger, _VitalSign, _Alert, _MedicationLog, _HealthReport, _SystemLog
    _db = db
    _logger = logger
    _VitalSign = VitalSign
    _Alert = Alert
    _MedicationLog = MedicationLog
    _HealthReport = HealthReport
    _SystemLog = SystemLog


@reports_bp.route('/report/<int:user_id>', methods=['GET'])
def generate_report_api(user_id):
    """Generate health report for a user."""
    days = request.args.get('days', 7, type=int)
    end_date = datetime.utcnow()
    start_date = end_date - timedelta(days=days)
    
    # Gather data
    vitals = _VitalSign.query.filter(
        _VitalSign.user_id == user_id,
        _VitalSign.timestamp >= start_date
    ).all()
    
    alerts = _Alert.query.filter(
        _Alert.user_id == user_id,
        _Alert.timestamp >= start_date
    ).all()
    
    meds = _MedicationLog.query.filter(
        _MedicationLog.user_id == user_id,
        _MedicationLog.scheduled_time >= start_date
    ).all()
    
    # Calculate metrics
    avg_hr = sum(v.heart_rate for v in vitals if v.heart_rate) / len(vitals) if vitals else 0
    avg_spo2 = sum(v.spo2 for v in vitals if v.spo2) / len(vitals) if vitals else 0
    taken_meds = len([m for m in meds if m.status == 'taken'])
    total_meds = len(meds) if meds else 1
    adherence = (taken_meds / total_meds) * 100
    
    # Generate summary
    summary = f"""
Health Report for User ID: {user_id}
Period: {start_date.strftime('%Y-%m-%d')} to {end_date.strftime('%Y-%m-%d')}

Vital Signs:
- Average Heart Rate: {avg_hr:.1f} BPM
- Average SpO2: {avg_spo2:.1f}%
- Total Readings: {len(vitals)}

Alerts:
- Total Alerts: {len(alerts)}
- Emergency Alerts: {len([a for a in alerts if 'emergency' in a.type.lower()])}

Medication Adherence: {adherence:.1f}%
"""
    
    # Save report
    report = _HealthReport(
        user_id=user_id,
        period_start=start_date,
        period_end=end_date,
        avg_heart_rate=avg_hr,
        avg_spo2=avg_spo2,
        alert_count=len(alerts),
        medication_adherence=adherence,
        summary=summary
    )
    _db.session.add(report)
    _db.session.commit()
    
    _logger.info('HEALTH', f'Generated health report for user {user_id}', user_id=user_id)
    
    return jsonify({
        'report_id': report.id,
        'summary': summary,
        'metrics': {
            'avg_heart_rate': avg_hr,
            'avg_spo2': avg_spo2,
            'alert_count': len(alerts),
            'medication_adherence': adherence
        }
    })


@reports_bp.route('/logs', methods=['GET'])
def get_logs_api():
    """Get system logs (admin only)."""
    category = request.args.get('category')
    level = request.args.get('level')
    limit = request.args.get('limit', 100, type=int)
    
    query = _SystemLog.query.order_by(_SystemLog.timestamp.desc())
    if category:
        query = query.filter_by(category=category.upper())
    if level:
        query = query.filter_by(level=level.upper())
    
    logs = query.limit(limit).all()
    return jsonify([{
        'id': l.id,
        'level': l.level,
        'category': l.category,
        'message': l.message,
        'user_id': l.user_id,
        'details': l.details,
        'timestamp': l.timestamp.isoformat()
    } for l in logs])
