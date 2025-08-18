#!/usr/bin/env python3
"""
Script para solucionar todos los problemas automáticamente
"""
import os
import sys
import subprocess
import shutil

def backup_file(file_path):
    """Crear una copia de seguridad de un archivo"""
    if os.path.exists(file_path):
        backup_path = f"{file_path}.backup"
        shutil.copy2(file_path, backup_path)
        print(f"💾 Copia de seguridad creada: {backup_path}")
        return True
    return False

def fix_usuario_service():
    """Corregir el archivo usuario_service.py"""
    print("🔧 Corrigiendo usuario_service.py...")
    
    original_file = "services/usuario_service.py"
    fixed_file = "services/usuario_service_fixed.py"
    
    if not os.path.exists(fixed_file):
        print(f"❌ No se encontró el archivo corregido: {fixed_file}")
        return False
    
    # Crear copia de seguridad
    backup_file(original_file)
    
    # Reemplazar con la versión corregida
    shutil.copy2(fixed_file, original_file)
    print("✅ usuario_service.py corregido")
    return True

def fix_app_py():
    """Corregir el archivo app.py"""
    print("🔧 Corrigiendo app.py...")
    
    original_file = "app.py"
    fixed_file = "app_fixed.py"
    
    if not os.path.exists(fixed_file):
        print(f"❌ No se encontró el archivo corregido: {fixed_file}")
        return False
    
    # Crear copia de seguridad
    backup_file(original_file)
    
    # Reemplazar con la versión corregida
    shutil.copy2(fixed_file, original_file)
    print("✅ app.py corregido")
    return True

def install_dependencies():
    """Instalar dependencias necesarias"""
    print("📦 Instalando dependencias...")
    
    packages = [
        "Flask==2.3.3",
        "Flask-SQLAlchemy==3.0.5",
        "Flask-CORS==4.0.0",
        "requests==2.31.0",
        "Werkzeug==2.3.7",
        "SQLAlchemy==2.0.21"
    ]
    
    success_count = 0
    for package in packages:
        try:
            print(f"📦 Instalando {package}...")
            subprocess.check_call([sys.executable, "-m", "pip", "install", package], 
                                stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            print(f"✅ {package} instalado")
            success_count += 1
        except subprocess.CalledProcessError:
            print(f"❌ Error al instalar {package}")
    
    print(f"📊 {success_count}/{len(packages)} paquetes instalados")
    return success_count == len(packages)

def setup_database():
    """Configurar la base de datos"""
    print("🗄️ Configurando base de datos...")
    
    try:
        # Importar y ejecutar el script de configuración
        sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
        from setup_database import setup_database
        return setup_database()
    except Exception as e:
        print(f"❌ Error al configurar base de datos: {e}")
        return False

def main():
    """Función principal"""
    print("🚀 Iniciando reparación automática del sistema...")
    print("=" * 50)
    
    steps = [
        ("Corrigiendo usuario_service.py", fix_usuario_service),
        ("Corrigiendo app.py", fix_app_py),
        ("Instalando dependencias", install_dependencies),
        ("Configurando base de datos", setup_database)
    ]
    
    results = {}
    for step_name, step_func in steps:
        print(f"\n📋 {step_name}:")
        print("-" * 30)
        results[step_name] = step_func()
    
    print("\n" + "=" * 50)
    print("📊 RESUMEN DE LA REPARACIÓN:")
    print("=" * 50)
    
    all_passed = True
    for step_name, result in results.items():
        status = "✅ COMPLETADO" if result else "❌ FALLÓ"
        print(f"{step_name}: {status}")
        if not result:
            all_passed = False
    
    print("\n" + "=" * 50)
    if all_passed:
        print("🎉 ¡Todos los pasos se completaron correctamente!")
        print("\n📝 Siguientes pasos:")
        print("1. Ejecuta: python start_server.py")
        print("2. Abre otra terminal y navega al directorio frontend")
        print("3. Inicia el servidor frontend (dependiendo de tu configuración)")
        print("4. Abre http://localhost:8000 en tu navegador")
    else:
        print("⚠️ Algunos pasos fallaron. Por favor, revisa los errores arriba.")
        print("\n💡 Soluciones manuales:")
        print("1. Instala dependencias manualmente:")
        print("   pip install Flask Flask-SQLAlchemy Flask-CORS requests")
        print("2. Configura la base de datos:")
        print("   python setup_database.py")
        print("3. Inicia el servidor:")
        print("   python start_server.py")

if __name__ == '__main__':
    main()