import os
from datetime import timedelta

class Config:
    # Configuración básica
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'clave-secreta-temporal'
    
    # Configuración de la base de datos
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///usuarios.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Configuración de CORS
    CORS_ORIGINS = ["*"]  # Para desarrollo, en producción limita a tu dominio
    
    # Configuración de uploads (si necesitas almacenar archivos)
    UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'uploads')
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16 MB max upload
    
    # Configuración de sesión
    PERMANENT_SESSION_LIFETIME = timedelta(hours=2)