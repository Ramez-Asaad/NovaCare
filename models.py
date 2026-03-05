from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from datetime import datetime

db = SQLAlchemy()

class Role(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(20), unique=True, nullable=False)

    def __repr__(self):
        return f'<Role {self.name}>'

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(120), nullable=False)
    role_id = db.Column(db.Integer, db.ForeignKey('role.id'), nullable=False)
    role = db.relationship('Role', backref=db.backref('users', lazy=True))

    def __repr__(self):
        return f'<User {self.username}>'

class Alert(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    type = db.Column(db.String(50), nullable=False)
    message = db.Column(db.String(200))
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(20), default='New')
    latitude = db.Column(db.Float, nullable=True)
    longitude = db.Column(db.Float, nullable=True)

class VitalSign(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    heart_rate = db.Column(db.Integer)
    spo2 = db.Column(db.Integer)
    stress_level = db.Column(db.String(20))
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

class Medication(db.Model):
    """Medication schedule for users"""
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    dosage = db.Column(db.String(50))
    schedule_time = db.Column(db.Time, nullable=False)
    frequency = db.Column(db.String(20), default='daily')  # daily, weekly, etc.
    notes = db.Column(db.String(200))
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class MedicationLog(db.Model):
    """Log of medication taken/missed"""
    id = db.Column(db.Integer, primary_key=True)
    medication_id = db.Column(db.Integer, db.ForeignKey('medication.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    scheduled_time = db.Column(db.DateTime, nullable=False)
    taken_time = db.Column(db.DateTime)
    status = db.Column(db.String(20), default='pending')  # pending, taken, missed, skipped
    notes = db.Column(db.String(100))

class HealthReport(db.Model):
    """Generated health reports"""
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    generated_at = db.Column(db.DateTime, default=datetime.utcnow)
    period_start = db.Column(db.DateTime, nullable=False)
    period_end = db.Column(db.DateTime, nullable=False)
    avg_heart_rate = db.Column(db.Float)
    avg_spo2 = db.Column(db.Float)
    alert_count = db.Column(db.Integer, default=0)
    medication_adherence = db.Column(db.Float)  # Percentage
    summary = db.Column(db.Text)
    report_file = db.Column(db.String(200))  # Path to PDF if generated

class EmotionLog(db.Model):
    """Log of detected emotions"""
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    emotion = db.Column(db.String(20), nullable=False)
    confidence = db.Column(db.Float)
    source = db.Column(db.String(20), default='face')  # face, text, voice
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

class SystemLog(db.Model):
    """Comprehensive system logging"""
    id = db.Column(db.Integer, primary_key=True)
    level = db.Column(db.String(10), nullable=False)  # DEBUG, INFO, WARNING, ERROR, CRITICAL
    category = db.Column(db.String(20), nullable=False)  # SYSTEM, AUTH, CHAT, etc.
    message = db.Column(db.String(500), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    details = db.Column(db.Text)  # JSON for additional data
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

class ChatHistory(db.Model):
    """Log of all chat interactions"""
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    user_message = db.Column(db.Text, nullable=False)
    bot_response = db.Column(db.Text, nullable=False)
    detected_intent = db.Column(db.String(50))  # greeting, emergency, medical, general
    detected_emotion = db.Column(db.String(20))
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
