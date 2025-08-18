from datetime import datetime
from models.usuario import db, Usuario
from models.formacion_complementaria import FormacionComplementaria
import json

class UsuarioService:
    @staticmethod
    def crear_usuario(datos):
        """Crea un nuevo usuario en la base de datos"""
        try:
            print(f"🏗️ Iniciando creación de usuario con datos: {datos}")
            
            # Procesar miembros perceptores como JSON
            miembros_perceptores = datos.get('miembros_perceptores')
            print(f"👥 Miembros perceptores originales: {miembros_perceptores}")
            
            if miembros_perceptores and isinstance(miembros_perceptores, list):
                if miembros_perceptores:  # Si la lista no está vacía
                    datos['miembros_perceptores'] = json.dumps(miembros_perceptores)
                else:
                    datos['miembros_perceptores'] = json.dumps([])  # Lista vacía como JSON
            else:
                datos['miembros_perceptores'] = json.dumps([])  # Por defecto, lista vacía como JSON
            
            print(f"📄 Miembros perceptores procesados: {datos['miembros_perceptores']}")
            
            # Procesar fecha de nacimiento
            if datos.get('fecha_nacimiento') and datos['fecha_nacimiento'].strip():
                try:
                    datos['fecha_nacimiento'] = datetime.strptime(datos['fecha_nacimiento'], '%Y-%m-%d').date()
                except ValueError as e:
                    raise ValueError(f'Formato de fecha inválido. Use YYYY-MM-DD: {e}')
            else:
                datos['fecha_nacimiento'] = None
            
            # Crear usuario
            nuevo_usuario = Usuario(
                nombre=datos.get('nombre'),
                apellidos=datos.get('apellidos'),
                fecha_nacimiento=datos.get('fecha_nacimiento'),
                edad=datos.get('edad'),
                nacionalidad=datos.get('nacionalidad'),
                documento_identidad=datos.get('documento_identidad'),
                sexo=datos.get('sexo'),
                direccion=datos.get('direccion'),
                localidad=datos.get('localidad'),
                cp=datos.get('cp'),
                email=datos.get('email'),
                telefono1=datos.get('telefono1'),
                telefono2=datos.get('telefono2'),
                carnet=datos.get('carnet'),
                vehiculo_propio=datos.get('vehiculo_propio', False),
                discapacidad_porcentaje=datos.get('discapacidad_porcentaje'),
                discapacidad_tipo=datos.get('discapacidad_tipo'),
                entidad_derivacion=datos.get('entidad_derivacion'),
                tecnico_derivacion=datos.get('tecnico_derivacion'),
                colectivo=datos.get('colectivo'),
                composicion_familiar=datos.get('composicion_familiar'),
                situacion_economica=datos.get('situacion_economica'),
                miembros_perceptores=datos['miembros_perceptores'],  # Usar el valor ya procesado
                otras_situaciones=datos.get('otras_situaciones'),
                formacion_academica=datos.get('formacion_academica'),
                ano_finalizacion=datos.get('ano_finalizacion'),
                idiomas=datos.get('idiomas'),
                informatica=datos.get('informatica'),
                experiencia_laboral_previa=datos.get('experiencia_laboral_previa')
            )
            
            db.session.add(nuevo_usuario)
            db.session.commit()
            
            # Añadir formación complementaria si existe
            if datos.get('formacion_complementaria'):
                print(f"📚 Procesando formación complementaria: {datos['formacion_complementaria']}")
                for fc_data in datos['formacion_complementaria']:
                    if fc_data.get('fecha_realizacion') and fc_data['fecha_realizacion'].strip():
                        try:
                            fc_data['fecha_realizacion'] = datetime.strptime(fc_data['fecha_realizacion'], '%Y-%m-%d').date()
                        except ValueError as e:
                            raise ValueError(f'Formato de fecha inválido en formación complementaria. Use YYYY-MM-DD: {e}')
                    else:
                        fc_data['fecha_realizacion'] = None
                    
                    fc = FormacionComplementaria(
                        usuario_id=nuevo_usuario.id,
                        nombre_curso=fc_data.get('nombre_curso'),
                        duracion=fc_data.get('duracion'),
                        horas=fc_data.get('horas'),
                        entidad=fc_data.get('entidad'),
                        fecha_realizacion=fc_data.get('fecha_realizacion')
                    )
                    db.session.add(fc)
                
                db.session.commit()
            
            print("✅ Usuario creado exitosamente")
            return nuevo_usuario
            
        except Exception as e:
            print(f"❌ Error en crear_usuario: {e}")
            db.session.rollback()  # Importante: hacer rollback en caso de error
            raise
    
    @staticmethod
    def obtener_todos_los_usuarios(page=1, limit=10, search='', colectivo=''):
        """Obtiene todos los usuarios con paginación y filtros opcionales"""
        try:
            query = Usuario.query

            # Filtro por búsqueda en nombre o apellidos
            if search:
                search_pattern = f"%{search}%"
                query = query.filter(
                    (Usuario.nombre.ilike(search_pattern)) |
                    (Usuario.apellidos.ilike(search_pattern))
                )

            # Filtro por colectivo si aplica
            if colectivo:
                query = query.filter(Usuario.colectivo == colectivo)

            # Paginación
            usuarios = query.order_by(Usuario.id).paginate(page=page, per_page=limit, error_out=False).items
            print(f"📊 Usuarios obtenidos: {len(usuarios)}")
            return usuarios

        except Exception as e:
            print(f"❌ Error en obtener_todos_los_usuarios: {e}")
            raise
    
    @staticmethod
    def obtener_usuario_por_id(id):
        """Obtiene un usuario por su ID"""
        try:
            print(f"🔍 Buscando usuario con ID: {id}")
            usuario = Usuario.query.get(id)
            if usuario:
                print(f"✅ Usuario encontrado: {usuario.nombre} {usuario.apellidos}")
            else:
                print(f"⚠️ Usuario con ID {id} no encontrado")
            return usuario
        except Exception as e:
            print(f"❌ Error al obtener usuario por ID: {e}")
            raise
    
    @staticmethod
    def actualizar_usuario(id, datos):
        """Actualiza los datos de un usuario existente"""
        try:
            print(f"🔄 Actualizando usuario con ID: {id}")
            usuario = Usuario.query.get(id)
            if not usuario:
                print(f"⚠️ Usuario con ID {id} no encontrado")
                return None
            
            # Procesar miembros perceptores como JSON
            if 'miembros_perceptores' in datos:
                if isinstance(datos['miembros_perceptores'], list):
                    if datos['miembros_perceptores']:  # Si la lista no está vacía
                        datos['miembros_perceptores'] = json.dumps(datos['miembros_perceptores'])
                    else:
                        datos['miembros_perceptores'] = json.dumps([])  # Lista vacía como JSON
                else:
                    # Si ya es un string JSON, lo dejamos como está
                    pass
            
            # Procesar fecha de nacimiento
            if datos.get('fecha_nacimiento') and datos['fecha_nacimiento'].strip():
                try:
                    datos['fecha_nacimiento'] = datetime.strptime(datos['fecha_nacimiento'], '%Y-%m-%d').date()
                except ValueError as e:
                    raise ValueError(f'Formato de fecha inválido. Use YYYY-MM-DD: {e}')
            else:
                datos['fecha_nacimiento'] = None
            
            # Actualizar solo los campos proporcionados
            for campo, valor in datos.items():
                if hasattr(usuario, campo) and campo != 'formacion_complementaria':
                    setattr(usuario, campo, valor)
            
            db.session.commit()
            
            # Actualizar formación complementaria si existe
            if 'formacion_complementaria' in datos:
                # Eliminar formación complementaria existente
                FormacionComplementaria.query.filter_by(usuario_id=id).delete()
                
                # Añadir nueva formación complementaria
                for fc_data in datos['formacion_complementaria']:
                    if fc_data.get('fecha_realizacion') and fc_data['fecha_realizacion'].strip():
                        try:
                            fc_data['fecha_realizacion'] = datetime.strptime(fc_data['fecha_realizacion'], '%Y-%m-%d').date()
                        except ValueError as e:
                            raise ValueError(f'Formato de fecha inválido en formación complementaria. Use YYYY-MM-DD: {e}')
                    else:
                        fc_data['fecha_realizacion'] = None
                    
                    fc = FormacionComplementaria(
                        usuario_id=id,
                        nombre_curso=fc_data.get('nombre_curso'),
                        duracion=fc_data.get('duracion'),
                        horas=fc_data.get('horas'),
                        entidad=fc_data.get('entidad'),
                        fecha_realizacion=fc_data.get('fecha_realizacion')
                    )
                    db.session.add(fc)
                
                db.session.commit()
            
            print(f"✅ Usuario con ID {id} actualizado correctamente")
            return usuario
        except Exception as e:
            print(f"❌ Error al actualizar usuario: {e}")
            db.session.rollback()
            raise
    
    @staticmethod
    def eliminar_usuario(id):
        """Elimina un usuario de la base de datos"""
        try:
            print(f"🗑️ Eliminando usuario con ID: {id}")
            usuario = Usuario.query.get(id)
            if usuario:
                db.session.delete(usuario)
                db.session.commit()
                print(f"✅ Usuario con ID {id} eliminado correctamente")
                return True
            print(f"⚠️ Usuario con ID {id} no encontrado")
            return False
        except Exception as e:
            print(f"❌ Error al eliminar usuario: {e}")
            db.session.rollback()
            raise