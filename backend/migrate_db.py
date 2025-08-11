from app import create_app, db
from models.usuario import Usuario
from models.formacion_complementaria import FormacionComplementaria

def migrate_database():
    app = create_app()
    
    with app.app_context():
        # Eliminar todas las tablas existentes
        db.drop_all()
        
        # Crear todas las tablas con la nueva estructura
        db.create_all()
        
        print("Base de datos migrada correctamente")

if __name__ == '__main__':
    migrate_database()