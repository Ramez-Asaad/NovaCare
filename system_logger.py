"""
NovaCare - Comprehensive Logging System
Logs all actions, events, and AI interactions to database.
"""
from datetime import datetime
from flask import current_app
import traceback

class SystemLogger:
    """
    Central logging system for NovaCare.
    Logs to both console and database.
    """
    
    LOG_LEVELS = {
        'DEBUG': 0,
        'INFO': 1,
        'WARNING': 2,
        'ERROR': 3,
        'CRITICAL': 4
    }

    LOG_CATEGORIES = [
        'SYSTEM',      # System startup, shutdown, config changes
        'AUTH',        # Login, logout, auth failures
        'CHAT',        # User chat interactions
        'EMOTION',     # Emotion detection results
        'MEDICAL',     # Medical QA queries
        'ALERT',       # Emergency alerts
        'HEALTH',      # Vital signs, health data
        'MEDICATION',  # Medication reminders
        'CAMERA',      # Camera/Vision events
        'API'          # API calls and responses
    ]

    def __init__(self, db=None):
        self.db = db
        self._cache = []  # Cache logs if DB not ready

    def set_db(self, db):
        """Set database reference and flush cache"""
        self.db = db
        self._flush_cache()

    def _flush_cache(self):
        """Write cached logs to database"""
        if self.db and self._cache:
            for log_entry in self._cache:
                self._write_to_db(log_entry)
            self._cache.clear()

    def _write_to_db(self, log_entry):
        """Write log entry to database"""
        try:
            from models import SystemLog, db as models_db
            log = SystemLog(
                level=log_entry['level'],
                category=log_entry['category'],
                message=log_entry['message'],
                user_id=log_entry.get('user_id'),
                details=log_entry.get('details'),
                timestamp=log_entry['timestamp']
            )
            models_db.session.add(log)
            models_db.session.commit()
        except Exception as e:
            print(f"[Logger] DB write failed: {e}")

    def log(self, level: str, category: str, message: str, user_id: int = None, details: str = None):
        """
        Log an event
        :param level: DEBUG, INFO, WARNING, ERROR, CRITICAL
        :param category: Category from LOG_CATEGORIES
        :param message: Log message
        :param user_id: Optional user ID
        :param details: Optional additional details (JSON string)
        """
        entry = {
            'level': level.upper(),
            'category': category.upper(),
            'message': message,
            'user_id': user_id,
            'details': details,
            'timestamp': datetime.utcnow()
        }

        # Console output
        timestamp_str = entry['timestamp'].strftime('%Y-%m-%d %H:%M:%S')
        print(f"[{timestamp_str}] [{level}] [{category}] {message}")

        # Database write
        if self.db:
            self._write_to_db(entry)
        else:
            self._cache.append(entry)

    # Convenience methods
    def debug(self, category, message, **kwargs):
        self.log('DEBUG', category, message, **kwargs)

    def info(self, category, message, **kwargs):
        self.log('INFO', category, message, **kwargs)

    def warning(self, category, message, **kwargs):
        self.log('WARNING', category, message, **kwargs)

    def error(self, category, message, **kwargs):
        self.log('ERROR', category, message, **kwargs)

    def critical(self, category, message, **kwargs):
        self.log('CRITICAL', category, message, **kwargs)

    # Specific logging methods
    def log_chat(self, user_id: int, user_message: str, bot_response: str):
        """Log chat interaction"""
        import json
        details = json.dumps({
            'user_message': user_message,
            'bot_response': bot_response
        })
        self.info('CHAT', f"User {user_id} chatted", user_id=user_id, details=details)

    def log_emotion(self, user_id: int, emotion: str, confidence: float, source: str = 'face'):
        """Log emotion detection"""
        import json
        details = json.dumps({
            'emotion': emotion,
            'confidence': confidence,
            'source': source
        })
        self.info('EMOTION', f"Detected {emotion} ({confidence:.0%})", user_id=user_id, details=details)

    def log_alert(self, user_id: int, alert_type: str, status: str):
        """Log emergency alert"""
        import json
        details = json.dumps({'type': alert_type, 'status': status})
        self.critical('ALERT', f"ALERT: {alert_type}", user_id=user_id, details=details)

    def log_vital(self, user_id: int, heart_rate: int, spo2: int):
        """Log vital signs"""
        import json
        details = json.dumps({'heart_rate': heart_rate, 'spo2': spo2})
        self.info('HEALTH', f"Vitals: HR={heart_rate}, SpO2={spo2}", user_id=user_id, details=details)

    def log_medication(self, user_id: int, med_name: str, action: str):
        """Log medication event"""
        import json
        details = json.dumps({'medication': med_name, 'action': action})
        self.info('MEDICATION', f"Medication {action}: {med_name}", user_id=user_id, details=details)


# Singleton
_logger_instance = None

def get_logger():
    global _logger_instance
    if _logger_instance is None:
        _logger_instance = SystemLogger()
    return _logger_instance
