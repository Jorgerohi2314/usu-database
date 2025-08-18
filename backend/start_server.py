#!/usr/bin/env python3
"""
Script para iniciar el servidor Flask con configuración adecuada
"""
import os
import sys
from app import create_app

def main():
    """Función principal para iniciar el servidor"""
    print("🚀 Iniciando servidor de usuarios...")
    
    # Configurar variables de entorno si no están establecidas
    if not os.environ.get('DATABASE_URL'):
        os.environ['DATABASE_URL'] = 'sqlite:///usuarios.db'
    
    if not os.environ.get('SECRET_KEY'):
        os.environ['SECRET_KEY'] = 'clave-secreta-desarrollo'
    
    # Crear la aplicación
    app = create_app()
    
    # Información de inicio
    print("📊 Información del servidor:")
    print(f"   - Host: 0.0.0.0")
    print(f"   - Puerto: 5000")
    print(f"   - Debug: True")
    print(f"   - Base de datos: {os.environ.get('DATABASE_URL')}")
    print(f"   - CORS habilitado para: http://localhost:8000, http://127.0.0.1:8000")
    
    print("\n🌐 Endpoints disponibles:")
    print("   - GET  /               - Health check")
    print("   - GET  /health         - Health check detallado")
    print("   - GET  /usuarios       - Obtener todos los usuarios")
    print("   - POST /usuarios       - Crear nuevo usuario")
    print("   - GET  /usuarios/<id>  - Obtener usuario por ID")
    print("   - PUT  /usuarios/<id>  - Actualizar usuario")
    print("   - DELETE /usuarios/<id> - Eliminar usuario")
    print("   - GET  /pdf/ficha/<id> - Generar PDF de usuario")
    
    print("\n🚀 Servidor iniciando en http://localhost:5000")
    print("📝 Presiona Ctrl+C para detener el servidor")
    
    try:
        app.run(debug=True, host='0.0.0.0', port=5000)
    except KeyboardInterrupt:
        print("\n🛑 Servidor detenido por el usuario")
    except Exception as e:
        print(f"❌ Error al iniciar servidor: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()