from datetime import datetime
from models.usuario import db

class FormacionComplementaria(db.Model):
    __tablename__ = 'formacion_complementaria'
    
    id = db.Column(db.Integer, primary_key=True)
    usuario_id = db.Column(db.Integer, db.ForeignKey('usuarios.id'), nullable=False)
    nombre_curso = db.Column(db.String(200), nullable=False)
    duracion = db.Column(db.String(100))
    horas = db.Column(db.Integer)
    entidad = db.Column(db.String(100))
    fecha_realizacion = db.Column(db.Date)
    
    def __repr__(self):
        return f'<FormacionComplementaria {self.nombre_curso}>'
    
    def to_dict(self):
        """Convierte el objeto a un diccionario para JSON"""
        return {
            'id': self.id,
            'nombre_curso': self.nombre_curso,
            'duracion': self.duracion,
            'horas': self.horas,
            'entidad': self.entidad,
            'fecha_realizacion': self.fecha_realizacion.isoformat() if self.fecha_realizacion else None
        }