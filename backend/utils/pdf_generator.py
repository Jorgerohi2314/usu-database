import io
import json
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.lib.colors import navy, black, lightgrey
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from models.usuario import Usuario

def generar_ficha_usuario(usuario: Usuario):
    """Genera un PDF con los datos del usuario"""
    buffer = io.BytesIO()
    
    # Crear el documento PDF
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=72,
        leftMargin=72,
        topMargin=72,
        bottomMargin=18
    )
    
    # Contenido del PDF
    contenido = []
    
    # Estilos
    estilos = getSampleStyleSheet()
    estilo_titulo = ParagraphStyle(
        'CustomTitle',
        parent=estilos['Heading1'],
        fontSize=18,
        spaceAfter=30,
        alignment=TA_CENTER,
        textColor=navy
    )
    
    estilo_subtitulo = ParagraphStyle(
        'CustomSubTitle',
        parent=estilos['Heading2'],
        fontSize=14,
        spaceAfter=20,
        textColor=navy
    )
    
    # Título
    contenido.append(Paragraph("FICHA DE ENTREVISTA DE USUARIO", estilo_titulo))
    contenido.append(Spacer(1, 12))
    
    # Sección 1: Datos Personales
    contenido.append(Paragraph("1. DATOS PERSONALES", estilo_subtitulo))
    
    datos_personales = [
        ['Nombre completo:', f"{usuario.nombre} {usuario.apellidos}"],
        ['Fecha de nacimiento:', usuario.fecha_nacimiento.strftime('%d/%m/%Y') if usuario.fecha_nacimiento else 'No especificado'],
        ['Edad:', str(usuario.edad) if usuario.edad else 'No especificada'],
        ['Nacionalidad:', usuario.nacionalidad or 'No especificada'],
        ['Documento de identidad:', usuario.documento_identidad or 'No especificado'],
        ['Sexo:', usuario.sexo or 'No especificado'],
        ['Dirección:', usuario.direccion or 'No especificada'],
        ['Localidad:', usuario.localidad or 'No especificada'],
        ['Código Postal:', usuario.cp or 'No especificado'],
        ['Teléfono 1:', usuario.telefono1 or 'No especificado'],
        ['Teléfono 2:', usuario.telefono2 or 'No especificado'],
        ['Email:', usuario.email],
        ['Carné:', usuario.carnet or 'No especificado'],
        ['Vehículo propio:', 'Sí' if usuario.vehiculo_propio else 'No'],
        ['Discapacidad %:', str(usuario.discapacidad_porcentaje) if usuario.discapacidad_porcentaje else 'No especificado'],
        ['Tipo discapacidad:', usuario.discapacidad_tipo or 'No especificado'],
        ['Entidad de derivación:', usuario.entidad_derivacion or 'No especificado'],
        ['Técnico/a derivación:', usuario.tecnico_derivacion or 'No especificado'],
        ['Colectivo:', usuario.colectivo or 'No especificado']
    ]
    
    tabla_personales = Table(datos_personales, colWidths=[2.5*inch, 3.5*inch])
    tabla_personales.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), lightgrey),
        ('TEXTCOLOR', (0, 0), (-1, 0), black),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 12),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), '#f0f0f0'),
        ('GRID', (0, 0), (-1, -1), 1, black)
    ]))
    
    contenido.append(tabla_personales)
    contenido.append(Spacer(1, 20))
    
    # Sección 2: Datos Socio-Familiares y Económicos
    contenido.append(Paragraph("2. DATOS SOCIO-FAMILIARES Y ECONÓMICOS", estilo_subtitulo))
    
    # Composición familiar
    contenido.append(Paragraph("Composición familiar:", estilos['Normal']))
    contenido.append(Paragraph(usuario.composicion_familiar or 'No especificada', estilos['Normal']))
    contenido.append(Spacer(1, 12))
    
    # Situación económica
    contenido.append(Paragraph("Situación económica:", estilos['Normal']))
    contenido.append(Paragraph(usuario.situacion_economica or 'No especificada', estilos['Normal']))
    contenido.append(Spacer(1, 12))
    
    # Miembros perceptores
    if usuario.miembros_perceptores:
        try:
            miembros = json.loads(usuario.miembros_perceptores)
            if isinstance(miembros, list) and miembros:
                contenido.append(Paragraph("Miembros perceptores de ingresos:", estilos['Normal']))
                datos_miembros = [['Número', 'Tipo', 'Cantidad']]
                for miembro in miembros:
                    datos_miembros.append([
                        str(miembro.get('numero', '')),
                        miembro.get('tipo', ''),
                        str(miembro.get('cantidad', ''))
                    ])
                
                tabla_miembros = Table(datos_miembros, colWidths=[1*inch, 2*inch, 1.5*inch])
                tabla_miembros.setStyle(TableStyle([
                    ('BACKGROUND', (0, 0), (-1, 0), lightgrey),
                    ('TEXTCOLOR', (0, 0), (-1, 0), black),
                    ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                    ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                    ('FONTSIZE', (0, 0), (-1, 0), 10),
                    ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
                    ('BACKGROUND', (0, 1), (-1, -1), '#f0f0f0'),
                    ('GRID', (0, 0), (-1, -1), 1, black)
                ]))
                
                contenido.append(tabla_miembros)
                contenido.append(Spacer(1, 12))
        except:
            contenido.append(Paragraph("Miembros perceptores de ingresos: Error en el formato de datos", estilos['Normal']))
            contenido.append(Spacer(1, 12))
    
    # Otras situaciones
    contenido.append(Paragraph("Otras situaciones y circunstancias de interés:", estilos['Normal']))
    contenido.append(Paragraph(usuario.otras_situaciones or 'No especificadas', estilos['Normal']))
    contenido.append(Spacer(1, 20))
    
    # Sección 3: Datos Formativos
    contenido.append(Paragraph("3. DATOS FORMATIVOS", estilo_subtitulo))
    
    datos_formativos = [
        ['Formación académica:', usuario.formacion_academica or 'No especificada'],
        ['Año de finalización:', str(usuario.ano_finalizacion) if usuario.ano_finalizacion else 'No especificado'],
        ['Idiomas:', usuario.idiomas or 'No especificados'],
        ['Informática:', usuario.informatica or 'No especificada'],
        ['Experiencia laboral previa:', usuario.experiencia_laboral_previa or 'No especificada']
    ]
    
    tabla_formativos = Table(datos_formativos, colWidths=[2.5*inch, 3.5*inch])
    tabla_formativos.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), lightgrey),
        ('TEXTCOLOR', (0, 0), (-1, 0), black),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 12),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), '#f0f0f0'),
        ('GRID', (0, 0), (-1, -1), 1, black)
    ]))
    
    contenido.append(tabla_formativos)
    contenido.append(Spacer(1, 20))
    
    # Formación complementaria
    if usuario.formacion_complementaria:
        contenido.append(Paragraph("Formación Complementaria", estilos['Heading3']))
        datos_fc = [['Nombre del curso', 'Duración', 'Horas', 'Entidad', 'Fecha realización']]
        
        for fc in usuario.formacion_complementaria:
            datos_fc.append([
                fc.nombre_curso,
                fc.duracion or '',
                str(fc.horas) if fc.horas else '',
                fc.entidad or '',
                fc.fecha_realizacion.strftime('%d/%m/%Y') if fc.fecha_realizacion else ''
            ])
        
        tabla_fc = Table(datos_fc, colWidths=[2*inch, 1*inch, 0.8*inch, 1.2*inch, 1*inch])
        tabla_fc.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), navy),
            ('TEXTCOLOR', (0, 0), (-1, 0), black),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 10),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), '#f0f0f0'),
            ('GRID', (0, 0), (-1, -1), 1, black),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE')
        ]))
        
        contenido.append(tabla_fc)
    
    # Construir el PDF
    doc.build(contenido)
    
    buffer.seek(0)
    return buffer