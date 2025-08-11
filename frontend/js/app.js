// Clase principal de la aplicación
class AppManager {
    constructor() {
        this.vistaActual = 'lista';
        this.usuarios = [];
        this.paginaActual = 1;
        this.totalPaginas = 1;
        this.formManager = new FormManager();
        this.inicializarEventos();
        this.cargarUsuarios();
    }

    inicializarEventos() {
        // Navegación
        document.getElementById('nav-lista').addEventListener('click', (e) => {
            e.preventDefault();
            this.mostrarVista('lista');
        });

        document.getElementById('nav-nuevo').addEventListener('click', (e) => {
            e.preventDefault();
            this.mostrarVista('formulario');
        });

        // Botones
        document.getElementById('btn-nuevo-usuario').addEventListener('click', () => {
            this.formManager.limpiarFormulario();
            this.mostrarVista('formulario');
        });

        document.getElementById('btn-volver').addEventListener('click', () => {
            this.mostrarVista('lista');
        });

        document.getElementById('btn-volver-desde-detalles').addEventListener('click', () => {
            this.mostrarVista('lista');
        });

        document.getElementById('btn-cancelar').addEventListener('click', () => {
            if (confirm('¿Estás seguro de que deseas cancelar? Los datos no guardados se perderán.')) {
                this.mostrarVista('lista');
            }
        });

        document.getElementById('btn-editar-desde-detalles').addEventListener('click', () => {
            const usuarioId = parseInt(document.getElementById('btn-editar-desde-detalles').dataset.usuarioId);
            this.formManager.cargarUsuario(usuarioId);
            this.mostrarVista('formulario');
        });

        document.getElementById('btn-generar-pdf').addEventListener('click', async () => {
            const usuarioId = parseInt(document.getElementById('btn-generar-pdf').dataset.usuarioId);
            try {
                await ApiService.generarPDF(usuarioId);
                this.formManager.mostrarNotificacion('PDF generado correctamente', 'success');
            } catch (error) {
                this.formManager.mostrarNotificacion(`Error al generar PDF: ${error.message}`, 'error');
            }
        });

        // Búsqueda y filtros
        document.getElementById('busqueda').addEventListener('input', this.debounce(() => {
            this.paginaActual = 1;
            this.cargarUsuarios();
        }, 500));

        document.getElementById('filtro-colectivo').addEventListener('change', () => {
            this.paginaActual = 1;
            this.cargarUsuarios();
        });
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    mostrarVista(vista) {
        // Ocultar todas las vistas
        document.querySelectorAll('.vista').forEach(v => {
            v.classList.add('d-none');
        });

        // Mostrar la vista seleccionada
        document.getElementById(`vista-${vista}`).classList.remove('d-none');

        // Actualizar navegación
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });

        if (vista === 'lista') {
            document.getElementById('nav-lista').classList.add('active');
        } else if (vista === 'formulario') {
            document.getElementById('nav-nuevo').classList.add('active');
        }

        this.vistaActual = vista;
    }

    async cargarUsuarios() {
        try {
            const busqueda = document.getElementById('busqueda').value;
            const filtro = document.getElementById('filtro-colectivo').value;
            
            // Mostrar indicador de carga
            const tablaBody = document.getElementById('tabla-usuarios');
            tablaBody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center">
                        <div class="spinner-border text-primary" role="status">
                            <span class="visually-hidden">Cargando...</span>
                        </div>
                    </td>
                </tr>
            `;

            // Obtener usuarios
            const usuarios = await ApiService.obtenerUsuarios(this.paginaActual, 10, busqueda, filtro);
            this.usuarios = usuarios;

            // Renderizar tabla
            this.renderizarTabla(usuarios);

            // Renderizar paginación
            this.renderizarPaginacion();

        } catch (error) {
            console.error('Error al cargar usuarios:', error);
            this.formManager.mostrarNotificacion(`Error al cargar usuarios: ${error.message}`, 'error');
            
            // Mostrar error en la tabla
            const tablaBody = document.getElementById('tabla-usuarios');
            tablaBody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center text-danger">
                        Error al cargar los usuarios
                    </td>
                </tr>
            `;
        }
    }

    renderizarTabla(usuarios) {
        const tablaBody = document.getElementById('tabla-usuarios');
        
        if (usuarios.length === 0) {
            tablaBody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center">
                        No se encontraron usuarios
                    </td>
                </tr>
            `;
            return;
        }

        tablaBody.innerHTML = usuarios.map(usuario => `
            <tr onclick="appManager.verDetalles(${usuario.id})">
                <td>${usuario.id}</td>
                <td>${usuario.nombre} ${usuario.apellidos}</td>
                <td>${usuario.email}</td>
                <td>${usuario.telefono1 || '-'}</td>
                <td>${usuario.colectivo || '-'}</td>
                <td>
                    <div class="btn-group btn-group-sm" onclick="event.stopPropagation()">
                        <button class="btn btn-outline-primary btn-accion" onclick="appManager.verDetalles(${usuario.id})" title="Ver detalles">
                            <i class="bi bi-eye"></i>
                        </button>
                        <button class="btn btn-outline-warning btn-accion" onclick="appManager.editarUsuario(${usuario.id})" title="Editar">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-outline-info btn-accion" onclick="appManager.generarPDF(${usuario.id})" title="Generar PDF">
                            <i class="bi bi-file-earmark-pdf"></i>
                        </button>
                        <button class="btn btn-outline-danger btn-accion" onclick="appManager.eliminarUsuario(${usuario.id})" title="Eliminar">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    renderizarPaginacion() {
        const paginacion = document.getElementById('paginacion');
        
        // Calcular total de páginas (simulado, en una API real vendría en la respuesta)
        this.totalPaginas = Math.ceil(this.usuarios.length / 10) || 1;
        
        let html = '';
        
        // Botón anterior
        html += `
            <li class="page-item ${this.paginaActual === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="appManager.cambiarPagina(${this.paginaActual - 1})">Anterior</a>
            </li>
        `;
        
        // Números de página
        for (let i = 1; i <= this.totalPaginas; i++) {
            if (i === 1 || i === this.totalPaginas || (i >= this.paginaActual - 2 && i <= this.paginaActual + 2)) {
                html += `
                    <li class="page-item ${i === this.paginaActual ? 'active' : ''}">
                        <a class="page-link" href="#" onclick="appManager.cambiarPagina(${i})">${i}</a>
                    </li>
                `;
            } else if (i === this.paginaActual - 3 || i === this.paginaActual + 3) {
                html += '<li class="page-item disabled"><span class="page-link">...</span></li>';
            }
        }
        
        // Botón siguiente
        html += `
            <li class="page-item ${this.paginaActual === this.totalPaginas ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="appManager.cambiarPagina(${this.paginaActual + 1})">Siguiente</a>
            </li>
        `;
        
        paginacion.innerHTML = html;
    }

    cambiarPagina(pagina) {
        if (pagina < 1 || pagina > this.totalPaginas) return;
        
        this.paginaActual = pagina;
        this.cargarUsuarios();
    }

    async verDetalles(id) {
        try {
            const usuario = await ApiService.obtenerUsuario(id);
            this.renderizarDetalles(usuario);
            this.mostrarVista('detalles');
            
            // Configurar botones
            document.getElementById('btn-editar-desde-detalles').dataset.usuarioId = id;
            document.getElementById('btn-generar-pdf').dataset.usuarioId = id;
            
        } catch (error) {
            console.error('Error al cargar detalles:', error);
            this.formManager.mostrarNotificacion(`Error al cargar detalles: ${error.message}`, 'error');
        }
    }

    renderizarDetalles(usuario) {
        const contenido = document.getElementById('contenido-detalles');
        
        contenido.innerHTML = `
            <div class="row">
                <div class="col-md-6">
                    <div class="card card-detalle mb-3">
                        <div class="card-header">Datos Personales</div>
                        <div class="card-body">
                            <p><strong>Nombre completo:</strong> ${usuario.nombre} ${usuario.apellidos}</p>
                            <p><strong>Fecha de nacimiento:</strong> ${usuario.fecha_nacimiento ? new Date(usuario.fecha_nacimiento).toLocaleDateString() : 'No especificado'}</p>
                            <p><strong>Edad:</strong> ${usuario.edad || 'No especificada'}</p>
                            <p><strong>Nacionalidad:</strong> ${usuario.nacionalidad || 'No especificada'}</p>
                            <p><strong>Documento de identidad:</strong> ${usuario.documento_identidad || 'No especificado'}</p>
                            <p><strong>Sexo:</strong> ${usuario.sexo || 'No especificado'}</p>
                            <p><strong>Dirección:</strong> ${usuario.direccion || 'No especificada'}</p>
                            <p><strong>Localidad:</strong> ${usuario.localidad || 'No especificada'}</p>
                            <p><strong>Código Postal:</strong> ${usuario.cp || 'No especificado'}</p>
                            <p><strong>Email:</strong> ${usuario.email}</p>
                            <p><strong>Teléfono 1:</strong> ${usuario.telefono1 || 'No especificado'}</p>
                            <p><strong>Teléfono 2:</strong> ${usuario.telefono2 || 'No especificado'}</p>
                            <p><strong>Carnet de conducir:</strong> ${usuario.carnet || 'No tiene'}</p>
                            <p><strong>Vehículo propio:</strong> ${usuario.vehiculo_propio ? 'Sí' : 'No'}</p>
                            <p><strong>% Discapacidad:</strong> ${usuario.discapacidad_porcentaje || 'No especificado'}</p>
                            <p><strong>Tipo discapacidad:</strong> ${usuario.discapacidad_tipo || 'No especificado'}</p>
                        </div>
                    </div>
                </div>
                
                <div class="col-md-6">
                    <div class="card card-detalle mb-3">
                        <div class="card-header">Datos Socio-Familiares</div>
                        <div class="card-body">
                            <p><strong>Entidad de derivación:</strong> ${usuario.entidad_derivacion || 'No especificada'}</p>
                            <p><strong>Técnico/a de derivación:</strong> ${usuario.tecnico_derivacion || 'No especificado'}</p>
                            <p><strong>Colectivo:</strong> ${usuario.colectivo || 'No especificado'}</p>
                            <p><strong>Composición familiar:</strong> ${usuario.composicion_familiar || 'No especificada'}</p>
                            <p><strong>Situación económica:</strong> ${usuario.situacion_economica || 'No especificada'}</p>
                            <p><strong>Otras situaciones:</strong> ${usuario.otras_situaciones || 'No especificadas'}</p>
                        </div>
                    </div>
                    
                    <div class="card card-detalle mb-3">
                        <div class="card-header">Datos Formativos</div>
                        <div class="card-body">
                            <p><strong>Formación académica:</strong> ${usuario.formacion_academica || 'No especificada'}</p>
                            <p><strong>Año de finalización:</strong> ${usuario.ano_finalizacion || 'No especificado'}</p>
                            <p><strong>Idiomas:</strong> ${usuario.idiomas || 'No especificados'}</p>
                            <p><strong>Informática:</strong> ${usuario.informatica || 'No especificada'}</p>
                            <p><strong>Experiencia laboral previa:</strong> ${usuario.experiencia_laboral_previa || 'No especificada'}</p>
                        </div>
                    </div>
                </div>
            </div>
            
            ${usuario.formacion_complementaria && usuario.formacion_complementaria.length > 0 ? `
                <div class="card card-detalle mb-3">
                    <div class="card-header">Formación Complementaria</div>
                    <div class="card-body">
                        <div class="table-responsive">
                            <table class="table table-striped">
                                <thead>
                                    <tr>
                                        <th>Curso</th>
                                        <th>Duración</th>
                                        <th>Horas</th>
                                        <th>Entidad</th>
                                        <th>Fecha realización</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${usuario.formacion_complementaria.map(curso => `
                                        <tr>
                                            <td>${curso.nombre_curso}</td>
                                            <td>${curso.duracion || '-'}</td>
                                            <td>${curso.horas || '-'}</td>
                                            <td>${curso.entidad || '-'}</td>
                                            <td>${curso.fecha_realizacion ? new Date(curso.fecha_realizacion).toLocaleDateString() : '-'}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            ` : ''}
        `;
    }

    editarUsuario(id) {
        this.formManager.cargarUsuario(id);
        this.mostrarVista('formulario');
    }

    async generarPDF(id) {
        try {
            await ApiService.generarPDF(id);
            this.formManager.mostrarNotificacion('PDF generado correctamente', 'success');
        } catch (error) {
            this.formManager.mostrarNotificacion(`Error al generar PDF: ${error.message}`, 'error');
        }
    }

    async eliminarUsuario(id) {
        if (confirm('¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.')) {
            try {
                await ApiService.eliminarUsuario(id);
                this.formManager.mostrarNotificacion('Usuario eliminado correctamente', 'success');
                this.cargarUsuarios();
            } catch (error) {
                this.formManager.mostrarNotificacion(`Error al eliminar usuario: ${error.message}`, 'error');
            }
        }
    }
}

// Inicializar la aplicación cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
    window.appManager = new AppManager();
});