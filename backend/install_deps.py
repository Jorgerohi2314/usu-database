#!/usr/bin/env python3
"""
Script para instalar dependencias automáticamente
"""
import subprocess
import sys
import os

def install_package(package):
    """Instala un paquete usando pip"""
    try:
        print(f"📦 Instalando {package}...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", package])
        print(f"✅ {package} instalado correctamente")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Error al instalar {package}: {e}")
        return False

def main():
    """Función principal"""
    print("🚀 Instalando dependencias necesarias...")
    
    # Lista de paquetes necesarios
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
        if install_package(package):
            success_count += 1
    
    print(f"\n📊 Resumen: {success_count}/{len(packages)} paquetes instalados correctamente")
    
    if success_count == len(packages):
        print("🎉 Todas las dependencias están instaladas")
        print("\n📝 Siguientes pasos:")
        print("1. Ejecuta: python start_server.py")
        print("2. Abre otra terminal y ejecuta el frontend en el puerto 8000")
        print("3. Abre http://localhost:8000 en tu navegador")
    else:
        print("⚠️ Algunas dependencias no se pudieron instalar")
        print("Intenta instalar manualmente: pip install " + " ".join(packages))

if __name__ == '__main__':
    main()