// Clase principal de la aplicación
class AppManager {
    constructor() {
        console.log('🚀 Creando instancia de AppManager...');
        
        this.vistaActual = 'lista';
        this.usuarios = [];
        this.paginaActual = 1;
        this.totalPaginas = 1;
        
        console.log('📋 Inicializando FormManager...');
        this.formManager = new FormManager();
        
        console.log('🔧 Inicializando eventos de AppManager...');
        this.inicializarEventos();

        console.log('🌓 Cargando preferencia de tema...');
        this.cargarPreferenciaTema();
        
        
        console.log('📥 Cargando usuarios iniciales...');
        this.cargarUsuarios();
        
        console.log('✅ AppManager inicializado correctamente');
    }

    inicializarEventos() {
        // Navegación del sidebar
        document.getElementById('nav-lista').addEventListener('click', (e) => {
            e.preventDefault();
            this.mostrarVista('lista');
            this.actualizarTitulo('Dashboard');
        });

        document.getElementById('nav-nuevo').addEventListener('click', (e) => {
            e.preventDefault();
            this.formManager.limpiarFormulario();
            this.mostrarVista('formulario');
            this.actualizarTitulo('Nuevo Usuario');
        });

        // Botones principales
        document.getElementById('btn-nuevo-usuario').addEventListener('click', () => {
            this.formManager.limpiarFormulario();
            this.mostrarVista('formulario');
            this.actualizarTitulo('Nuevo Usuario');
        });

        document.getElementById('btn-volver').addEventListener('click', () => {
            this.mostrarVista('lista');
            this.actualizarTitulo('Dashboard');
        });

        // Toggle dark mode
        const themeToggle = document.querySelector('.btn-action');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.toggleDarkMode();
            });
        }

        // Búsqueda y filtros
        const busquedaElement = document.getElementById('busqueda');
        const busquedaGlobalElement = document.getElementById('busqueda-global');
        
        if (busquedaElement) {
            busquedaElement.addEventListener('input', this.debounce(() => {
                this.paginaActual = 1;
                this.cargarUsuarios();
            }, 500));
        }
        
        if (busquedaGlobalElement) {
            busquedaGlobalElement.addEventListener('input', this.debounce(() => {
                this.paginaActual = 1;
                this.cargarUsuarios();
            }, 500));
        }

        const filtroColectivo = document.getElementById('filtro-colectivo');
        if (filtroColectivo) {
            filtroColectivo.addEventListener('change', () => {
                this.paginaActual = 1;
                this.cargarUsuarios();
            });
        }
    }

    toggleDarkMode() {
        const body = document.body;
        const themeIcon = document.querySelector('.btn-action i');
        
        body.classList.toggle('dark-mode');
        
        // Cambiar el icono según el modo
        if (body.classList.contains('dark-mode')) {
            themeIcon.classList.remove('bi-moon-stars');
            themeIcon.classList.add('bi-sun');
            // Guardar preferencia en localStorage
            localStorage.setItem('darkMode', 'enabled');
        } else {
            themeIcon.classList.remove('bi-sun');
            themeIcon.classList.add('bi-moon-stars');
            // Guardar preferencia en localStorage
            localStorage.setItem('darkMode', 'disabled');
        }
    }

    cargarPreferenciaTema() {
        const savedTheme = localStorage.getItem('darkMode');
        const themeIcon = document.querySelector('.btn-action i');
        
        if (savedTheme === 'enabled') {
            document.body.classList.add('dark-mode');
            themeIcon.classList.remove('bi-moon-stars');
            themeIcon.classList.add('bi-sun');
        } else if (savedTheme === 'disabled') {
            document.body.classList.remove('dark-mode');
            themeIcon.classList.remove('bi-sun');
            themeIcon.classList.add('bi-moon-stars');
        }
    }

    actualizarTitulo(titulo) {
        const pageTitle = document.getElementById('page-title');
        if (pageTitle) {
            pageTitle.textContent = titulo;
        }
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
        const vistaElement = document.getElementById(`vista-${vista}`);
        if (vistaElement) {
            vistaElement.classList.remove('d-none');
        }

        // Actualizar navegación del sidebar
        document.querySelectorAll('.sidebar-nav .nav-link').forEach(link => {
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
            const busqueda = document.getElementById('busqueda')?.value || '';
            const filtro = document.getElementById('filtro-colectivo')?.value || '';
            
            // Mostrar indicador de carga
            const tablaBody = document.getElementById('tabla-usuarios');
            if (tablaBody) {
                tablaBody.innerHTML = `
                    <tr>
                        <td colspan="6" class="text-center">
                            <div class="cargando">
                                <div class="spinner-border text-primary" role="status">
                                    <span class="visually-hidden">Cargando...</span>
                                </div>
                            </div>
                        </td>
                    </tr>
                `;
            }

            // Obtener usuarios
            const usuarios = await ApiService.obtenerUsuarios(this.paginaActual, 10, busqueda, filtro);
            this.usuarios = usuarios;

            // Renderizar tabla
            this.renderizarTabla(usuarios);

            // Actualizar estadísticas
            this.actualizarEstadisticas(usuarios);

            // Renderizar paginación
            this.renderizarPaginacion();

        } catch (error) {
            console.error('Error al cargar usuarios:', error);
            this.formManager.mostrarNotificacion(`Error al cargar usuarios: ${error.message}`, 'error');
            
            // Mostrar error en la tabla
            const tablaBody = document.getElementById('tabla-usuarios');
            if (tablaBody) {
                tablaBody.innerHTML = `
                    <tr>
                        <td colspan="6" class="text-center text-danger">
                            Error al cargar los usuarios
                        </td>
                    </tr>
                `;
            }
        }
    }

    actualizarEstadisticas(usuarios) {
        // Actualizar contador total
        const totalElement = document.getElementById('total-usuarios');
        if (totalElement) {
            totalElement.textContent = usuarios.length;
        }

        // Actualizar mostrando usuarios
        const mostrandoElement = document.getElementById('mostrando-usuarios');
        if (mostrandoElement) {
            mostrandoElement.textContent = usuarios.length;
        }

        // Simular otras estadísticas
        const usuariosMesElement = document.getElementById('usuarios-mes');
        if (usuariosMesElement) {
            usuariosMesElement.textContent = Math.floor(usuarios.length * 0.3);
        }

        const usuariosInactivosElement = document.getElementById('usuarios-inactivos');
        if (usuariosInactivosElement) {
            usuariosInactivosElement.textContent = Math.floor(usuarios.length * 0.1);
        }
    }

    renderizarTabla(usuarios) {
        const tablaBody = document.getElementById('tabla-usuarios');
        
        if (!tablaBody) return;
        
        if (usuarios.length === 0) {
            tablaBody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center">
                        <div class="text-muted">
                            <i class="bi bi-inbox display-4 d-block mb-3"></i>
                            No se encontraron usuarios
                        </div>
                    </td>
                </tr>
            `;
            return;
        }

        tablaBody.innerHTML = usuarios.map(usuario => `
            <tr>
                <td>
                    <div class="th-content">
                        <input type="checkbox" class="form-check-input">
                    </div>
                </td>
                <td>
                    <div class="user-info">
                        <div class="user-name">${usuario.nombre} ${usuario.apellidos}</div>
                        <div class="user-email">${usuario.email}</div>
                    </div>
                </td>
                <td>
                    <div class="contact-info">
                        ${usuario.telefono1 ? `<div><i class="bi bi-telephone"></i> ${usuario.telefono1}</div>` : ''}
                        ${usuario.telefono2 ? `<div><i class="bi bi-telephone-fill"></i> ${usuario.telefono2}</div>` : ''}
                    </div>
                </td>
                <td>
                    <span class="status-badge ${usuario.colectivo ? 'active' : 'inactive'}">
                        ${usuario.colectivo || 'Sin asignar'}
                    </span>
                </td>
                <td>
                    <span class="status-badge active">Activo</span>
                </td>
                <td>
                    <div class="table-actions">
                        <button class="btn-icon" onclick="appManager.editarUsuario(${usuario.id})" title="Editar">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn-icon" onclick="appManager.verDetalles(${usuario.id})" title="Ver detalles">
                            <i class="bi bi-eye"></i>
                        </button>
                        <button class="btn-icon" onclick="appManager.generarPDF(${usuario.id})" title="Generar PDF">
                            <i class="bi bi-file-earmark-pdf"></i>
                        </button>
                        <button class="btn-icon" onclick="appManager.eliminarUsuario(${usuario.id})" title="Eliminar">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    renderizarPaginacion() {
        const paginacion = document.getElementById('paginacion');
        
        if (!paginacion) return;
        
        // Calcular total de páginas (simulado, en una API real vendría en la respuesta)
        this.totalPaginas = Math.ceil(this.usuarios.length / 10) || 1;
        
        let html = '';
        
        // Botón anterior
        html += `
            <li class="page-item ${this.paginaActual === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="appManager.cambiarPagina(${this.paginaActual - 1})">
                    <i class="bi bi-chevron-left"></i>
                </a>
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
                <a class="page-link" href="#" onclick="appManager.cambiarPagina(${this.paginaActual + 1})">
                    <i class="bi bi-chevron-right"></i>
                </a>
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
            // En el nuevo diseño, los detalles se muestran en un modal o sidebar
            this.mostrarModalDetalles(usuario);
        } catch (error) {
            console.error('Error al cargar detalles:', error);
            this.formManager.mostrarNotificacion(`Error al cargar detalles: ${error.message}`, 'error');
        }
    }

    mostrarModalDetalles(usuario) {
        // Crear modal para mostrar detalles
        const modalHTML = `
            <div class="modal fade" id="modalDetalles" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Detalles del Usuario</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            ${this.generarHTMLDetalles(usuario)}
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                            <button type="button" class="btn btn-primary" onclick="appManager.editarUsuario(${usuario.id}); bootstrap.Modal.getInstance(document.getElementById('modalDetalles')).hide();">
                                Editar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Eliminar modal existente si hay uno
        const modalExistente = document.getElementById('modalDetalles');
        if (modalExistente) {
            modalExistente.remove();
        }
        
        // Añadir nuevo modal
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Mostrar modal
        const modal = new bootstrap.Modal(document.getElementById('modalDetalles'));
        modal.show();
    }

    generarHTMLDetalles(usuario) {
        return `
            <div class="row">
                <div class="col-md-6">
                    <div class="card mb-3">
                        <div class="card-header bg-primary text-white">
                            <h6 class="mb-0">Datos Personales</h6>
                        </div>
                        <div class="card-body">
                            <div class="row">
                                <div class="col-6"><strong>Nombre:</strong></div>
                                <div class="col-6">${usuario.nombre} ${usuario.apellidos}</div>
                            </div>
                            <div class="row">
                                <div class="col-6"><strong>Email:</strong></div>
                                <div class="col-6">${usuario.email}</div>
                            </div>
                            <div class="row">
                                <div class="col-6"><strong>Teléfono:</strong></div>
                                <div class="col-6">${usuario.telefono1 || 'No especificado'}</div>
                            </div>
                            <div class="row">
                                <div class="col-6"><strong>Edad:</strong></div>
                                <div class="col-6">${usuario.edad || 'No especificada'}</div>
                            </div>
                            <div class="row">
                                <div class="col-6"><strong>Sexo:</strong></div>
                                <div class="col-6">${usuario.sexo || 'No especificado'}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="card mb-3">
                        <div class="card-header bg-success text-white">
                            <h6 class="mb-0">Datos Socio-Familiares</h6>
                        </div>
                        <div class="card-body">
                            <div class="row">
                                <div class="col-6"><strong>Colectivo:</strong></div>
                                <div class="col-6">${usuario.colectivo || 'No especificado'}</div>
                            </div>
                            <div class="row">
                                <div class="col-6"><strong>Entidad derivación:</strong></div>
                                <div class="col-6">${usuario.entidad_derivacion || 'No especificada'}</div>
                            </div>
                            <div class="row">
                                <div class="col-6"><strong>Técnico derivación:</strong></div>
                                <div class="col-6">${usuario.tecnico_derivacion || 'No especificado'}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    editarUsuario(id) {
        this.formManager.cargarUsuario(id);
        this.mostrarVista('formulario');
        this.actualizarTitulo('Editar Usuario');
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
                this.cargarUsuarios(); // Recargar la lista
            } catch (error) {
                this.formManager.mostrarNotificacion(`Error al eliminar usuario: ${error.message}`, 'error');
            }
        }
    }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎬 Inicializando aplicación...');
    window.appManager = new AppManager();
    console.log('✅ Aplicación lista');
});