from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Usuario(db.Model):
    __tablename__ = 'usuarios'
    
    # Datos básicos
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    apellidos = db.Column(db.String(100), nullable=False)
    
    # Datos personales adicionales
    fecha_nacimiento = db.Column(db.Date)
    edad = db.Column(db.Integer)
    nacionalidad = db.Column(db.String(50))
    documento_identidad = db.Column(db.String(20), unique=True)
    sexo = db.Column(db.Enum('Mujer', 'Hombre', name='sexo_enum'))
    direccion = db.Column(db.Text)
    localidad = db.Column(db.String(100))
    cp = db.Column(db.String(10))
    email = db.Column(db.String(100), unique=True, nullable=False)
    telefono1 = db.Column(db.String(20))
    telefono2 = db.Column(db.String(20))
    carnet = db.Column(db.String(50))
    vehiculo_propio = db.Column(db.Boolean, default=False)
    
    # Discapacidad
    discapacidad_porcentaje = db.Column(db.Integer)
    discapacidad_tipo = db.Column(db.String(100))
    
    # Derivación
    entidad_derivacion = db.Column(db.String(100))
    tecnico_derivacion = db.Column(db.String(100))
    colectivo = db.Column(db.String(100))
    
    # Datos socio-familiares
    composicion_familiar = db.Column(db.Text)
    situacion_economica = db.Column(db.Text)
    miembros_perceptores = db.Column(db.Text)  # JSON con número, tipo y cantidad
    otras_situaciones = db.Column(db.Text)
    
    # Datos formativos
    formacion_academica = db.Column(db.String(50))  # Opción seleccionada
    ano_finalizacion = db.Column(db.Integer)
    idiomas = db.Column(db.Text)
    informatica = db.Column(db.Text)
    experiencia_laboral_previa = db.Column(db.Text)
    
    # Fechas
    fecha_creacion = db.Column(db.DateTime, default=datetime.utcnow)
    fecha_actualizacion = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relaciones
    formacion_complementaria = db.relationship('FormacionComplementaria', backref='usuario', lazy=True, cascade='all, delete-orphan')
    
    def __repr__(self):
        return f'<Usuario {self.nombre} {self.apellidos}>'
    
    def to_dict(self):
        """Convierte el objeto a un diccionario para JSON"""
        return {
            'id': self.id,
            'nombre': self.nombre,
            'apellidos': self.apellidos,
            'fecha_nacimiento': self.fecha_nacimiento.isoformat() if self.fecha_nacimiento else None,
            'edad': self.edad,
            'nacionalidad': self.nacionalidad,
            'documento_identidad': self.documento_identidad,
            'sexo': self.sexo,
            'direccion': self.direccion,
            'localidad': self.localidad,
            'cp': self.cp,
            'email': self.email,
            'telefono1': self.telefono1,
            'telefono2': self.telefono2,
            'carnet': self.carnet,
            'vehiculo_propio': self.vehiculo_propio,
            'discapacidad_porcentaje': self.discapacidad_porcentaje,
            'discapacidad_tipo': self.discapacidad_tipo,
            'entidad_derivacion': self.entidad_derivacion,
            'tecnico_derivacion': self.tecnico_derivacion,
            'colectivo': self.colectivo,
            'composicion_familiar': self.composicion_familiar,
            'situacion_economica': self.situacion_economica,
            'miembros_perceptores': self.miembros_perceptores,
            'otras_situaciones': self.otras_situaciones,
            'formacion_academica': self.formacion_academica,
            'ano_finalizacion': self.ano_finalizacion,
            'idiomas': self.idiomas,
            'informatica': self.informatica,
            'experiencia_laboral_previa': self.experiencia_laboral_previa,
            'formacion_complementaria': [fc.to_dict() for fc in self.formacion_complementaria],
            'fecha_creacion': self.fecha_creacion.isoformat() if self.fecha_creacion else None,
            'fecha_actualizacion': self.fecha_actualizacion.isoformat() if self.fecha_actualizacion else None
        }