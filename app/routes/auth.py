from flask import Blueprint, request, jsonify
import jwt
import hashlib
from datetime import datetime, timedelta
from config import Config
from app.database import get_supabase_client

bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@bp.route('/login', methods=['POST', 'OPTIONS'])
def login():
    # ✅ Respond to preflight OPTIONS request
    if request.method == 'OPTIONS':
        return '', 200

    data = request.get_json()
    
    if not data.get('student_id') or not data.get('password'):
        return jsonify({'error': 'Missing credentials'}), 400
    
    supabase = get_supabase_client()
    
    # Find user
    result = supabase.table('users').select('*').eq('student_id', data['student_id']).execute()
    
    if not result.data:
        return jsonify({'error': 'Invalid credentials'}), 401
    
    user = result.data[0]
    
    password_hash = hashlib.sha256(data['password'].encode()).hexdigest()
    if user['password_hash'] != password_hash:
        return jsonify({'error': 'Invalid credentials'}), 401
    
    # Generate JWT token
    token = jwt.encode({
        'user_id': user['id'],
        'student_id': user['student_id'],
        'role': user['role'],
        'exp': datetime.utcnow() + timedelta(days=7)
    }, Config.JWT_SECRET_KEY, algorithm='HS256')
    
    return jsonify({
        'token': token,
        'user': {
            'id': user['id'],
            'student_id': user['student_id'],
            'name': user['name'],
            'email': user['email'],
            'role': user['role'],
            'hostel': user['hostel'],
            'room_number': user['room_number']
        }
    }), 200
