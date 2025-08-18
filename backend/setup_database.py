#!/usr/bin/env python3
"""
Script para configurar la base de datos inicial
"""
import os
import sys
from datetime import datetime

# Añadir el directorio actual al path para importar los módulos
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

def setup_database():
    """Configurar la base de datos inicial"""
    try:
        print("🗄️ Configurando base de datos...")
        
        # Importar después de añadir al path
        from app import create_app
        from models.usuario import db, Usuario
        
        # Crear la aplicación
        app = create_app()
        
        # Crear las tablas
        with app.app_context():
            print("📋 Creando tablas...")
            db.create_all()
            print("✅ Tablas creadas correctamente")
            
            # Verificar si hay usuarios
            user_count = Usuario.query.count()
            print(f"📊 Usuarios existentes: {user_count}")
            
            if user_count == 0:
                print("📝 Creando usuario de ejemplo...")
                # Crear un usuario de ejemplo
                ejemplo_usuario = Usuario(
                    nombre="Juan",
                    apellidos="Pérez",
                    email="juan.perez@ejemplo.com",
                    telefono1="600000000",
                    colectivo="Desempleado",
                    miembros_perceptores="[]"
                )
                
                db.session.add(ejemplo_usuario)
                db.session.commit()
                print("✅ Usuario de ejemplo creado")
            else:
                print("ℹ️ Ya existen usuarios en la base de datos")
        
        print("🎉 Base de datos configurada correctamente")
        return True
        
    except Exception as e:
        print(f"❌ Error al configurar base de datos: {e}")
        return False

def main():
    """Función principal"""
    print("🚀 Iniciando configuración de la base de datos...")
    
    if setup_database():
        print("\n📝 Siguientes pasos:")
        print("1. Ejecuta: python start_server.py")
        print("2. Abre otra terminal y ejecuta el frontend en el puerto 8000")
        print("3. Abre http://localhost:8000 en tu navegador")
    else:
        print("\n⚠️ No se pudo configurar la base de datos")
        print("Verifica que todas las dependencias estén instaladas")

if __name__ == '__main__':
    main()