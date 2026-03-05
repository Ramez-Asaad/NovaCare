"""
NovaCare - Alerts API (SOLID: Single Responsibility)
Handles emergency alerts and alert management.
"""
from flask import Blueprint, request, jsonify
from flask_login import current_user

alerts_bp = Blueprint('alerts', __name__)

# Dependencies injected during initialization
_db = None
_logger = None
_Alert = None


def init_alerts(db, logger, Alert):
    """Initialize alerts blueprint with dependencies."""
    global _db, _logger, _Alert
    _db = db
    _logger = logger
    _Alert = Alert


@alerts_bp.route('/emergency', methods=['POST'])
def emergency_api():
    """Trigger emergency alert."""
    data = request.json
    user_id = data.get('user_id') or (current_user.id if current_user.is_authenticated else 1)
    alert_type = data.get('type', 'Manual Emergency')
    message = data.get('message', 'Emergency button pressed')
    lat = data.get('latitude')
    lng = data.get('longitude')
    
    alert = _Alert(
        user_id=user_id,
        type=alert_type,
        message=message,
        status='New',
        latitude=lat,
        longitude=lng
    )
    _db.session.add(alert)
    _db.session.commit()
    
    _logger.log_alert(user_id, alert_type, 'New')
    
    return jsonify({
        'success': True,
        'alert_id': alert.id,
        'message': 'Emergency alert created and dispatched'
    })


@alerts_bp.route('/alerts', methods=['GET'])
def get_alerts_api():
    """Get alerts, optionally filtered by status."""
    status = request.args.get('status')
    query = _Alert.query.order_by(_Alert.timestamp.desc())
    if status:
        query = query.filter_by(status=status)
    alerts = query.limit(50).all()
    return jsonify([{
        'id': a.id,
        'user_id': a.user_id,
        'type': a.type,
        'message': a.message,
        'status': a.status,
        'latitude': a.latitude,
        'longitude': a.longitude,
        'timestamp': a.timestamp.isoformat()
    } for a in alerts])


@alerts_bp.route('/alerts/<int:alert_id>/acknowledge', methods=['POST'])
def acknowledge_alert_api(alert_id):
    """Acknowledge an alert."""
    alert = _Alert.query.get_or_404(alert_id)
    alert.status = 'Acknowledged'
    _db.session.commit()
    _logger.info('ALERT', f'Alert {alert_id} acknowledged', 
                 user_id=current_user.id if current_user.is_authenticated else None)
    return jsonify({'success': True})
