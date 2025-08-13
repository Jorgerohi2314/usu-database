import os
from flask import Flask, jsonify
from flask_cors import CORS
from models.usuario import db
from models.formacion_complementaria import FormacionComplementaria
from config import Config
from routes import usuarios_bp, pdf_bp

def create_app(config_class=Config):
    app = Flask(__name__)
    
    # Configuración para producción
    if os.environ.get('DATABASE_URL'):
        app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL')
    else:
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///usuarios.db'
    
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'clave-secreta-temporal')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    # Inicializar extensiones
    db.init_app(app)
    # Configurar CORS de manera más específica
    CORS(app, resources={
        r"/*": {
            "origins": ["http://localhost:8000", "http://127.0.0.1:8000", "http://localhost:3000", "http://127.0.0.1:3000"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    })
    
    # Registrar blueprints
    app.register_blueprint(usuarios_bp)
    app.register_blueprint(pdf_bp)
    
    # Crear las tablas de la base de datos
    with app.app_context():
        try:
            db.create_all()
            print("✅ Tablas de base de datos creadas correctamente")
        except Exception as e:
            print(f"❌ Error al crear tablas: {e}")
    
    # Manejador de errores global
    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({
            'error': 'Error interno del servidor',
            'message': str(error)
        }), 500
    
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({
            'error': 'Recurso no encontrado'
        }), 404
    
    @app.errorhandler(400)
    def bad_request(error):
        return jsonify({
            'error': 'Solicitud incorrecta'
        }), 400
    
    @app.route('/')
    def index():
        return jsonify({
            'message': 'API de Usuarios - Funcionando correctamente',
            'status': 'ok'
        })
    
    return app

if __name__ == '__main__':
    app = create_app()
    print("🚀 Iniciando servidor Flask en http://localhost:5000")
    app.run(debug=True, host='0.0.0.0', port=5000)