from flask import Blueprint, request, send_file, make_response
from services.usuario_service import UsuarioService
from utils.pdf_generator import generar_ficha_usuario

pdf_bp = Blueprint('pdf', __name__)

@pdf_bp.route('/pdf/ficha/<int:id>', methods=['GET'])
def generar_ficha_pdf(id):
    """Genera un PDF con los datos de un usuario"""
    usuario = UsuarioService.obtener_usuario_por_id(id)
    if not usuario:
        return {'error': 'Usuario no encontrado'}, 404
    
    try:
        pdf_buffer = generar_ficha_usuario(usuario)
        
        # Crear respuesta con el PDF
        response = make_response(pdf_buffer.getvalue())
        response.headers['Content-Type'] = 'application/pdf'
        response.headers['Content-Disposition'] = f'attachment; filename=ficha_{usuario.id}.pdf'
        
        return response
    except Exception as e:
        return {'error': str(e)}, 500