#!/usr/bin/env python3
"""
Script para crear la base de datos inicial
"""
import os
import sys
from datetime import datetime

# Agregar el directorio actual al path para importar los módulos
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

def crear_base_datos():
    """Crear la base de datos y las tablas necesarias"""
    try:
        print("🗄️ Creando base de datos...")
        
        # Importar después de configurar el path
        from app import create_app
        
        # Crear la aplicación
        app = create_app()
        
        # Crear las tablas
        with app.app_context():
            from models.usuario import db
            
            print("📋 Creando tablas...")
            db.create_all()
            print("✅ Tablas creadas correctamente")
            
            # Verificar que las tablas se crearon
            inspector = db.inspect(db.engine)
            tables = inspector.get_table_names()
            print(f"📊 Tablas creadas: {tables}")
            
            # Crear un usuario de prueba
            from models.usuario import Usuario
            from models.formacion_complementaria import FormacionComplementaria
            import json
            
            print("👤 Creando usuario de prueba...")
            usuario_prueba = Usuario(
                nombre="Juan",
                apellidos="Pérez",
                email="juan.perez@example.com",
                telefono1="123456789",
                colectivo="Desempleados",
                miembros_perceptores=json.dumps([]),
                formacion_academica="Universidad"
            )
            
            db.session.add(usuario_prueba)
            db.session.commit()
            
            print("✅ Usuario de prueba creado")
            print(f"   ID: {usuario_prueba.id}")
            print(f"   Nombre: {usuario_prueba.nombre} {usuario_prueba.apellidos}")
            print(f"   Email: {usuario_prueba.email}")
            
        print("\n🎉 Base de datos creada exitosamente!")
        return True
        
    except Exception as e:
        print(f"❌ Error al crear base de datos: {e}")
        return False

def main():
    """Función principal"""
    print("🚀 Iniciando creación de base de datos...")
    
    if crear_base_datos():
        print("\n📝 Siguientes pasos:")
        print("1. Ejecuta: python diagnostico.py")
        print("2. Si todo está bien, ejecuta: python start_server.py")
    else:
        print("\n❌ No se pudo crear la base de datos.")
        print("Revisa los errores e intenta nuevamente.")

if __name__ == '__main__':
    main()