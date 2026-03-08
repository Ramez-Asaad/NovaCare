"""
NovaCare - Vitals API (SOLID: Single Responsibility)
Handles vital signs recording and retrieval.
"""
from flask import Blueprint, request, jsonify
from flask_login import current_user

vitals_bp = Blueprint('vitals', __name__)

# Dependencies injected during initialization
_db = None
_logger = None
_VitalSign = None
_Alert = None


def init_vitals(db, logger, VitalSign, Alert):
    """Initialize vitals blueprint with dependencies."""
    global _db, _logger, _VitalSign, _Alert
    _db = db
    _logger = logger
    _VitalSign = VitalSign
    _Alert = Alert


@vitals_bp.route('/vitals', methods=['POST'])
def vitals_api():
    """Record vital signs."""
    data = request.json
    user_id = data.get('user_id') or (current_user.id if current_user.is_authenticated else 1)
    heart_rate = data.get('heart_rate')
    spo2 = data.get('spo2')
    stress = data.get('stress_level', 'normal')
    
    vital = _VitalSign(
        user_id=user_id,
        heart_rate=heart_rate,
        spo2=spo2,
        stress_level=stress
    )
    _db.session.add(vital)
    _db.session.commit()
    
    _logger.log_vital(user_id, heart_rate, spo2)
    
    # Check for abnormal readings
    if heart_rate and (heart_rate < 50 or heart_rate > 120):
        alert = _Alert(
            user_id=user_id, 
            type='Abnormal Heart Rate', 
            message=f'HR: {heart_rate}', 
            status='New'
        )
        _db.session.add(alert)
        _db.session.commit()
        _logger.log_alert(user_id, 'Abnormal Heart Rate', 'New')
    
    return jsonify({'success': True, 'vital_id': vital.id})


@vitals_bp.route('/vitals/<int:user_id>', methods=['GET'])
def get_vitals_api(user_id):
    """Get recent vitals for a user."""
    limit = request.args.get('limit', 20, type=int)
    vitals = _VitalSign.query.filter_by(user_id=user_id).order_by(
        _VitalSign.timestamp.desc()
    ).limit(limit).all()
    
    return jsonify([{
        'id': v.id,
        'heart_rate': v.heart_rate,
        'spo2': v.spo2,
        'stress_level': v.stress_level,
        'timestamp': v.timestamp.isoformat()
    } for v in vitals])
