from flask import Blueprint, request, jsonify
from services.usuario_service import UsuarioService

usuarios_bp = Blueprint('usuarios', __name__)

@usuarios_bp.route('/usuarios', methods=['GET'])
def obtener_usuarios():
    """Obtiene todos los usuarios"""
    usuarios = UsuarioService.obtener_todos_los_usuarios()
    return jsonify([usuario.to_dict() for usuario in usuarios])

@usuarios_bp.route('/usuarios', methods=['POST'])
def crear_usuario():
    """Crea un nuevo usuario"""
    datos = request.get_json()
    
    # Validación básica
    if not datos or not datos.get('nombre') or not datos.get('apellidos') or not datos.get('email'):
        return jsonify({'error': 'Faltan datos obligatorios: nombre, apellidos, email'}), 400
    
    try:
        nuevo_usuario = UsuarioService.crear_usuario(datos)
        return jsonify(nuevo_usuario.to_dict()), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@usuarios_bp.route('/usuarios/<int:id>', methods=['GET'])
def obtener_usuario(id):
    """Obtiene un usuario por su ID"""
    usuario = UsuarioService.obtener_usuario_por_id(id)
    if usuario:
        return jsonify(usuario.to_dict())
    return jsonify({'error': 'Usuario no encontrado'}), 404

@usuarios_bp.route('/usuarios/<int:id>', methods=['PUT'])
def actualizar_usuario(id):
    """Actualiza los datos de un usuario"""
    datos = request.get_json()
    
    if not datos:
        return jsonify({'error': 'No se proporcionaron datos para actualizar'}), 400
    
    try:
        usuario_actualizado = UsuarioService.actualizar_usuario(id, datos)
        if usuario_actualizado:
            return jsonify(usuario_actualizado.to_dict())
        return jsonify({'error': 'Usuario no encontrado'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@usuarios_bp.route('/usuarios/<int:id>', methods=['DELETE'])
def eliminar_usuario(id):
    """Elimina un usuario"""
    if UsuarioService.eliminar_usuario(id):
        return jsonify({'mensaje': 'Usuario eliminado correctamente'})
    return jsonify({'error': 'Usuario no encontrado'}), 404