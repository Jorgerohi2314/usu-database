#!/usr/bin/env python3
"""
Script de diagnóstico para la aplicación de usuarios
"""
import sys
import os
import sqlite3
from datetime import datetime

def check_database():
    """Verificar el estado de la base de datos"""
    print("🔍 Verificando base de datos...")
    
    db_path = 'usuarios.db'
    if not os.path.exists(db_path):
        print(f"❌ La base de datos {db_path} no existe")
        return False
    
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Verificar tablas
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = cursor.fetchall()
        print(f"✅ Tablas encontradas: {[table[0] for table in tables]}")
        
        # Verificar tabla usuarios
        cursor.execute("SELECT COUNT(*) FROM usuarios;")
        count = cursor.fetchone()[0]
        print(f"📊 Total de usuarios: {count}")
        
        # Verificar estructura de la tabla usuarios
        cursor.execute("PRAGMA table_info(usuarios);")
        columns = cursor.fetchall()
        print(f"📋 Columnas en tabla usuarios:")
        for col in columns:
            print(f"   - {col[1]} ({col[2]})")
        
        conn.close()
        return True
        
    except Exception as e:
        print(f"❌ Error al verificar base de datos: {e}")
        return False

def check_dependencies():
    """Verificar dependencias de Python"""
    print("🔍 Verificando dependencias...")
    
    required_packages = [
        'flask',
        'flask_sqlalchemy',
        'flask_cors'
    ]
    
    missing_packages = []
    for package in required_packages:
        try:
            __import__(package.replace('_', ''))
            print(f"✅ {package} instalado")
        except ImportError:
            print(f"❌ {package} no encontrado")
            missing_packages.append(package)
    
    if missing_packages:
        print(f"\n⚠️ Paquetes faltantes: {', '.join(missing_packages)}")
        print("Instalalos con: pip install " + " ".join(missing_packages))
        return False
    
    return True

def check_files():
    """Verificar archivos necesarios"""
    print("🔍 Verificando archivos necesarios...")
    
    required_files = [
        'app.py',
        'config.py',
        'models/usuario.py',
        'models/formacion_complementaria.py',
        'routes/usuarios.py',
        'routes/pdf.py',
        'services/usuario_service.py'
    ]
    
    missing_files = []
    for file_path in required_files:
        if os.path.exists(file_path):
            print(f"✅ {file_path}")
        else:
            print(f"❌ {file_path} no encontrado")
            missing_files.append(file_path)
    
    if missing_files:
        print(f"\n⚠️ Archivos faltantes: {', '.join(missing_files)}")
        return False
    
    return True

def test_api_connection():
    """Probar conexión a la API"""
    print("🔍 Probando conexión a la API...")
    
    import requests
    
    try:
        response = requests.get('http://localhost:5000/', timeout=5)
        if response.status_code == 200:
            print("✅ API respondiendo correctamente")
            return True
        else:
            print(f"⚠️ API respondió con código {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ No se pudo conectar a la API (¿está corriendo el servidor?)")
        return False
    except Exception as e:
        print(f"❌ Error al probar API: {e}")
        return False

def main():
    """Función principal"""
    print("🚀 Iniciando diagnóstico del sistema...")
    print("=" * 50)
    
    checks = [
        ("Dependencias", check_dependencies),
        ("Archivos", check_files),
        ("Base de datos", check_database),
        ("Conexión API", test_api_connection)
    ]
    
    results = {}
    for check_name, check_func in checks:
        print(f"\n📋 {check_name}:")
        print("-" * 30)
        results[check_name] = check_func()
    
    print("\n" + "=" * 50)
    print("📊 RESUMEN DEL DIAGNÓSTICO:")
    print("=" * 50)
    
    all_passed = True
    for check_name, result in results.items():
        status = "✅ PASÓ" if result else "❌ FALLÓ"
        print(f"{check_name}: {status}")
        if not result:
            all_passed = False
    
    print("\n" + "=" * 50)
    if all_passed:
        print("🎉 ¡Todos los checks pasaron! El sistema debería funcionar correctamente.")
    else:
        print("⚠️ Algunos checks fallaron. Por favor, revisa los errores arriba.")
        print("\n💡 Recomendaciones:")
        print("1. Asegúrate de que el servidor Flask esté corriendo en el puerto 5000")
        print("2. Verifica que todas las dependencias estén instaladas")
        print("3. Revisa que la base de datos exista y tenga la estructura correcta")
        print("4. Verifica que el frontend esté corriendo en el puerto 8000")

if __name__ == '__main__':
    main()