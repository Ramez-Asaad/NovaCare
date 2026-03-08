"""
NovaCare - Medication API (SOLID: Single Responsibility)
Handles medication CRUD operations.
"""
from flask import Blueprint, request, jsonify
from flask_login import current_user
from datetime import datetime

medication_bp = Blueprint('medication', __name__)

# Dependencies injected during initialization
_db = None
_logger = None
_Medication = None


def init_medication(db, logger, Medication):
    """Initialize medication blueprint with dependencies."""
    global _db, _logger, _Medication
    _db = db
    _logger = logger
    _Medication = Medication


@medication_bp.route('/medication', methods=['GET', 'POST'])
def medication_api():
    """CRUD for medications."""
    if request.method == 'POST':
        data = request.json
        user_id = data.get('user_id') or (current_user.id if current_user.is_authenticated else 1)
        schedule_time = datetime.strptime(data.get('schedule_time', '08:00'), '%H:%M').time()
        
        med = _Medication(
            user_id=user_id,
            name=data.get('name'),
            dosage=data.get('dosage'),
            schedule_time=schedule_time,
            frequency=data.get('frequency', 'daily'),
            notes=data.get('notes')
        )
        _db.session.add(med)
        _db.session.commit()
        _logger.log_medication(user_id, med.name, 'created')
        return jsonify({'success': True, 'medication_id': med.id})
    
    else:
        user_id = request.args.get('user_id', type=int)
        query = _Medication.query.filter_by(is_active=True)
        if user_id:
            query = query.filter_by(user_id=user_id)
        meds = query.all()
        return jsonify([{
            'id': m.id,
            'name': m.name,
            'dosage': m.dosage,
            'schedule_time': m.schedule_time.strftime('%H:%M') if m.schedule_time else None,
            'frequency': m.frequency
        } for m in meds])
