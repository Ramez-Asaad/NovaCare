"""
NovaCare - Authentication Routes (SOLID: Single Responsibility)
Handles login, logout, and user loading.
"""
from flask import Blueprint, render_template, request, redirect, url_for, flash
from flask_login import login_user, logout_user, login_required, current_user

auth_bp = Blueprint('auth', __name__)


def init_auth(login_manager, db, User, logger):
    """
    Initialize auth blueprint with dependencies.
    Called from app factory.
    """
    
    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id))
    
    @auth_bp.route('/login', methods=['GET', 'POST'])
    def login():
        if request.method == 'POST':
            username = request.form.get('username')
            password = request.form.get('password')
            user = User.query.filter_by(username=username).first()
            
            if user and user.password_hash == password:
                login_user(user)
                logger.info('AUTH', f'User {username} logged in', user_id=user.id)
                return redirect(url_for('dashboard.dashboard'))
            logger.warning('AUTH', f'Failed login attempt for {username}')
            flash('Invalid username or password')
        return render_template('login.html')
    
    @auth_bp.route('/logout')
    @login_required
    def logout():
        logger.info('AUTH', f'User {current_user.username} logged out', user_id=current_user.id)
        logout_user()
        return redirect(url_for('auth.login'))
