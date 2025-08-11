import os
from flask import Flask
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
    CORS(app, resources={r"/*": {"origins": "*"}})
    
    # Registrar blueprints
    app.register_blueprint(usuarios_bp)
    app.register_blueprint(pdf_bp)
    
    # Crear las tablas de la base de datos
    with app.app_context():
        db.create_all()
    
    @app.route('/')
    def index():
        return "API de Usuarios - Funcionando correctamente"
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)