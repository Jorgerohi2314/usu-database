// Clase para manejar los formularios
class FormManager {
    constructor() {
        console.log('🏗️ Creando instancia de FormManager...');
        
        this.formulario = document.getElementById('formulario-usuario');
        console.log('📝 Formulario encontrado:', this.formulario);
        
        this.usuarioId = null;
        console.log('🆔 ID de usuario inicializado en:', this.usuarioId);
        
        this.inicializarEventos();
        console.log('✅ FormManager inicializado correctamente');
    }

    inicializarEventos() {
        console.log('🎯 Inicializando eventos del formulario...');
        
        // Evento para agregar miembros perceptores
        const btnAgregarMiembro = document.getElementById('btn-agregar-miembro');
        if (btnAgregarMiembro) {
            btnAgregarMiembro.addEventListener('click', () => {
                console.log('👥 Click en agregar miembro');
                this.agregarMiembroPerceptor();
            });
        } else {
            console.error('❌ Botón agregar miembro no encontrado');
        }

        // Evento para agregar cursos de formación complementaria
        const btnAgregarCurso = document.getElementById('btn-agregar-curso');
        if (btnAgregarCurso) {
            btnAgregarCurso.addEventListener('click', () => {
                console.log('📚 Click en agregar curso');
                this.agregarCurso();
            });
        } else {
            console.error('❌ Botón agregar curso no encontrado');
        }

        // Evento para limpiar formulario
        const btnLimpiar = document.getElementById('btn-limpiar');
        if (btnLimpiar) {
            btnLimpiar.addEventListener('click', () => {
                console.log('🧹 Click en limpiar formulario');
                this.limpiarFormulario();
            });
        } else {
            console.error('❌ Botón limpiar no encontrado');
        }

        // Evento para enviar formulario
        if (this.formulario) {
            console.log('✅ Formulario encontrado, configurando evento submit...');
            this.formulario.addEventListener('submit', (e) => {
                console.log('🚀 Evento submit disparado!');
                e.preventDefault();
                this.guardarUsuario();
            });
        } else {
            console.error('❌ Formulario no encontrado!');
        }

        // Eventos para eliminar elementos dinámicos
        document.addEventListener('click', (e) => {
            if (e.target.closest('.btn-eliminar-miembro')) {
                this.eliminarMiembroPerceptor(e.target.closest('.miembro-perceptor'));
            }
            
            if (e.target.closest('.btn-eliminar-curso')) {
                this.eliminarCurso(e.target.closest('.curso-item'));
            }
        });

        // Calcular edad automáticamente al cambiar la fecha de nacimiento
        document.getElementById('fecha_nacimiento').addEventListener('change', (e) => {
            this.calcularEdad(e.target.value);
        });
        const fechaNacimiento = document.getElementById('fecha_nacimiento');
        if (fechaNacimiento) {
            fechaNacimiento.addEventListener('change', (e) => {
                console.log('📅 Fecha de nacimiento cambiada:', e.target.value);
                this.calcularEdad(e.target.value);
            });
        }
    }

    calcularEdad(fechaNacimiento) {
        if (!fechaNacimiento) return;
        
        const hoy = new Date();
        const nacimiento = new Date(fechaNacimiento);
        let edad = hoy.getFullYear() - nacimiento.getFullYear();
        const mes = hoy.getMonth() - nacimiento.getMonth();
        
        if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
            edad--;
        }
        
        document.getElementById('edad').value = edad;
    }

    agregarMiembroPerceptor() {
        const container = document.getElementById('miembros-perceptores');
        const nuevoMiembro = document.createElement('div');
        nuevoMiembro.className = 'row mb-2 miembro-perceptor';
        nuevoMiembro.innerHTML = `
            <div class="col-md-3">
                <input type="number" class="form-control" placeholder="Número" min="1">
            </div>
            <div class="col-md-5">
                <input type="text" class="form-control" placeholder="Tipo (ej: Prestación)">
            </div>
            <div class="col-md-3">
                <input type="text" class="form-control" placeholder="Cantidad">
            </div>
            <div class="col-md-1">
                <button type="button" class="btn btn-danger btn-sm btn-eliminar-miembro">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        `;
        container.appendChild(nuevoMiembro);
    }

    eliminarMiembroPerceptor(elemento) {
        const container = document.getElementById('miembros-perceptores');
        if (container.children.length > 1) {
            elemento.remove();
        } else {
            this.mostrarNotificacion('Debe haber al menos un miembro perceptor', 'warning');
        }
    }

    agregarCurso() {
        const container = document.getElementById('formacion-complementaria-lista');
        const plantilla = document.getElementById('plantilla-curso');
        const nuevoCurso = plantilla.cloneNode(true);
        nuevoCurso.id = '';
        nuevoCurso.classList.remove('d-none');
        container.appendChild(nuevoCurso);
    }

    eliminarCurso(elemento) {
        elemento.remove();
    }

    limpiarFormulario() {
        this.formulario.reset();
        this.usuarioId = null;
        
        // Limpiar miembros perceptores
        const containerMiembros = document.getElementById('miembros-perceptores');
        containerMiembros.innerHTML = `
            <div class="row mb-2 miembro-perceptor">
                <div class="col-md-3">
                    <input type="number" class="form-control" placeholder="Número" min="1">
                </div>
                <div class="col-md-5">
                    <input type="text" class="form-control" placeholder="Tipo (ej: Prestación)">
                </div>
                <div class="col-md-3">
                    <input type="text" class="form-control" placeholder="Cantidad">
                </div>
                <div class="col-md-1">
                    <button type="button" class="btn btn-danger btn-sm btn-eliminar-miembro">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </div>
        `;
        
        // Limpiar formación complementaria
        document.getElementById('formacion-complementaria-lista').innerHTML = '';
        
        // Actualizar título
        document.getElementById('titulo-formulario').textContent = 'Nuevo Usuario';
    }

    async cargarUsuario(id) {
        try {
            const usuario = await ApiService.obtenerUsuario(id);
            this.usuarioId = id;
            
            // Cargar datos básicos
            document.getElementById('nombre').value = usuario.nombre || '';
            document.getElementById('apellidos').value = usuario.apellidos || '';
            document.getElementById('fecha_nacimiento').value = usuario.fecha_nacimiento ? usuario.fecha_nacimiento.split('T')[0] : '';
            document.getElementById('edad').value = usuario.edad || '';
            document.getElementById('nacionalidad').value = usuario.nacionalidad || '';
            document.getElementById('documento_identidad').value = usuario.documento_identidad || '';
            document.getElementById('sexo').value = usuario.sexo || '';
            document.getElementById('direccion').value = usuario.direccion || '';
            document.getElementById('localidad').value = usuario.localidad || '';
            document.getElementById('cp').value = usuario.cp || '';
            document.getElementById('email').value = usuario.email || '';
            document.getElementById('telefono1').value = usuario.telefono1 || '';
            document.getElementById('telefono2').value = usuario.telefono2 || '';
            document.getElementById('carnet').value = usuario.carnet || '';
            document.getElementById('vehiculo_propio').checked = usuario.vehiculo_propio || false;
            document.getElementById('discapacidad_porcentaje').value = usuario.discapacidad_porcentaje || '';
            document.getElementById('discapacidad_tipo').value = usuario.discapacidad_tipo || '';
            document.getElementById('entidad_derivacion').value = usuario.entidad_derivacion || '';
            document.getElementById('tecnico_derivacion').value = usuario.tecnico_derivacion || '';
            document.getElementById('colectivo').value = usuario.colectivo || '';
            document.getElementById('composicion_familiar').value = usuario.composicion_familiar || '';
            document.getElementById('situacion_economica').value = usuario.situacion_economica || '';
            document.getElementById('otras_situaciones').value = usuario.otras_situaciones || '';
            document.getElementById('formacion_academica').value = usuario.formacion_academica || '';
            document.getElementById('ano_finalizacion').value = usuario.ano_finalizacion || '';
            document.getElementById('idiomas').value = usuario.idiomas || '';
            document.getElementById('informatica').value = usuario.informatica || '';
            document.getElementById('experiencia_laboral_previa').value = usuario.experiencia_laboral_previa || '';
            
            // Cargar miembros perceptores
            if (usuario.miembros_perceptores) {
                try {
                    const miembros = JSON.parse(usuario.miembros_perceptores);
                    const container = document.getElementById('miembros-perceptores');
                    container.innerHTML = '';
                    
                    miembros.forEach(miembro => {
                        const nuevoMiembro = document.createElement('div');
                        nuevoMiembro.className = 'row mb-2 miembro-perceptor';
                        nuevoMiembro.innerHTML = `
                            <div class="col-md-3">
                                <input type="number" class="form-control" placeholder="Número" min="1" value="${miembro.numero || ''}">
                            </div>
                            <div class="col-md-5">
                                <input type="text" class="form-control" placeholder="Tipo (ej: Prestación)" value="${miembro.tipo || ''}">
                            </div>
                            <div class="col-md-3">
                                <input type="text" class="form-control" placeholder="Cantidad" value="${miembro.cantidad || ''}">
                            </div>
                            <div class="col-md-1">
                                <button type="button" class="btn btn-danger btn-sm btn-eliminar-miembro">
                                    <i class="bi bi-trash"></i>
                                </button>
                            </div>
                        `;
                        container.appendChild(nuevoMiembro);
                    });
                } catch (e) {
                    console.error('Error al parsear miembros perceptores:', e);
                }
            }
            
            // Cargar formación complementaria
            if (usuario.formacion_complementaria && usuario.formacion_complementaria.length > 0) {
                const container = document.getElementById('formacion-complementaria-lista');
                container.innerHTML = '';
                
                usuario.formacion_complementaria.forEach(curso => {
                    const plantilla = document.getElementById('plantilla-curso');
                    const nuevoCurso = plantilla.cloneNode(true);
                    nuevoCurso.id = '';
                    nuevoCurso.classList.remove('d-none');
                    
                    nuevoCurso.querySelector('.nombre-curso').value = curso.nombre_curso || '';
                    nuevoCurso.querySelector('.duracion-curso').value = curso.duracion || '';
                    nuevoCurso.querySelector('.horas-curso').value = curso.horas || '';
                    nuevoCurso.querySelector('.entidad-curso').value = curso.entidad || '';
                    nuevoCurso.querySelector('.fecha-curso').value = curso.fecha_realizacion ? curso.fecha_realizacion.split('T')[0] : '';
                    
                    container.appendChild(nuevoCurso);
                });
            }
            
            // Actualizar título
            document.getElementById('titulo-formulario').textContent = 'Editar Usuario';
            
        } catch (error) {
            console.error('Error al cargar usuario:', error);
            this.mostrarNotificacion('Error al cargar los datos del usuario', 'error');
        }
    }

    obtenerDatosFormulario() {
        console.log('📋 Obteniendo datos del formulario...');

        // Recopilar datos básicos
        const datos = {
            nombre: document.getElementById('nombre').value,
            apellidos: document.getElementById('apellidos').value,
            fecha_nacimiento: document.getElementById('fecha_nacimiento').value,
            edad: parseInt(document.getElementById('edad').value) || null,
            nacionalidad: document.getElementById('nacionalidad').value,
            documento_identidad: document.getElementById('documento_identidad').value,
            sexo: document.getElementById('sexo').value,
            direccion: document.getElementById('direccion').value,
            localidad: document.getElementById('localidad').value,
            cp: document.getElementById('cp').value,
            email: document.getElementById('email').value,
            telefono1: document.getElementById('telefono1').value,
            telefono2: document.getElementById('telefono2').value,
            carnet: document.getElementById('carnet').value,
            vehiculo_propio: document.getElementById('vehiculo_propio').checked,
            discapacidad_porcentaje: parseInt(document.getElementById('discapacidad_porcentaje').value) || null,
            discapacidad_tipo: document.getElementById('discapacidad_tipo').value,
            entidad_derivacion: document.getElementById('entidad_derivacion').value,
            tecnico_derivacion: document.getElementById('tecnico_derivacion').value,
            colectivo: document.getElementById('colectivo').value,
            composicion_familiar: document.getElementById('composicion_familiar').value,
            situacion_economica: document.getElementById('situacion_economica').value,
            otras_situaciones: document.getElementById('otras_situaciones').value,
            formacion_academica: document.getElementById('formacion_academica').value,
            ano_finalizacion: parseInt(document.getElementById('ano_finalizacion').value) || null,
            idiomas: document.getElementById('idiomas').value,
            informatica: document.getElementById('informatica').value,
            experiencia_laboral_previa: document.getElementById('experiencia_laboral_previa').value,
            nombre: document.getElementById('nombre')?.value || '',
            apellidos: document.getElementById('apellidos')?.value || '',
            fecha_nacimiento: document.getElementById('fecha_nacimiento')?.value || '',
            edad: parseInt(document.getElementById('edad')?.value) || null,
            nacionalidad: document.getElementById('nacionalidad')?.value || '',
            documento_identidad: document.getElementById('documento_identidad')?.value || '',
            sexo: document.getElementById('sexo')?.value || '',
            direccion: document.getElementById('direccion')?.value || '',
            localidad: document.getElementById('localidad')?.value || '',
            cp: document.getElementById('cp')?.value || '',
            email: document.getElementById('email')?.value || '',
            telefono1: document.getElementById('telefono1')?.value || '',
            telefono2: document.getElementById('telefono2')?.value || '',
            carnet: document.getElementById('carnet')?.value || '',
            vehiculo_propio: document.getElementById('vehiculo_propio')?.checked || false,
            discapacidad_porcentaje: parseInt(document.getElementById('discapacidad_porcentaje')?.value) || null,
            discapacidad_tipo: document.getElementById('discapacidad_tipo')?.value || '',
            entidad_derivacion: document.getElementById('entidad_derivacion')?.value || '',
            tecnico_derivacion: document.getElementById('tecnico_derivacion')?.value || '',
            colectivo: document.getElementById('colectivo')?.value || '',
            composicion_familiar: document.getElementById('composicion_familiar')?.value || '',
            situacion_economica: document.getElementById('situacion_economica')?.value || '',
            otras_situaciones: document.getElementById('otras_situaciones')?.value || '',
            formacion_academica: document.getElementById('formacion_academica')?.value || '',
            ano_finalizacion: parseInt(document.getElementById('ano_finalizacion')?.value) || null,
            idiomas: document.getElementById('idiomas')?.value || '',
            informatica: document.getElementById('informatica')?.value || '',
            experiencia_laboral_previa: document.getElementById('experiencia_laboral_previa')?.value || ''
        };

        console.log('📊 Datos básicos recopilados:', datos);
        
        // Recopilar miembros perceptores
        const miembrosElements = document.querySelectorAll('.miembro-perceptor');
        console.log(`👥 Encontrados ${miembrosElements.length} miembros perceptores`);

        const miembrosPerceptores = [];
        
        miembrosElements.forEach((miembro, index) => {
            const numeroInput = miembro.querySelector('input[type="number"]');
            const textoInputs = miembro.querySelectorAll('input[type="text"]');
            
            const numero = numeroInput?.value || '';
            const tipo = textoInputs[0]?.value || '';
            const cantidad = textoInputs[1]?.value || '';
            
            console.log(`👤 Miembro ${index}: numero=${numero}, tipo=${tipo}, cantidad=${cantidad}`);
            
            if (numero || tipo || cantidad) {
                miembrosPerceptores.push({
                    numero: parseInt(numero) || null,
                    tipo: tipo,
                    cantidad: cantidad
                });
            }
        });
        datos.miembros_perceptores = miembrosPerceptores;
        
        // Recopilar formación complementaria
        const formacionComplementaria = [];
        document.querySelectorAll('.curso-item').forEach(curso => {
            const nombre = curso.querySelector('.nombre-curso')?.value || '';
            if (nombre) {
                formacionComplementaria.push({
                    nombre_curso: nombre,
                    duracion: curso.querySelector('.duracion-curso')?.value || '',
                    horas: parseInt(curso.querySelector('.horas-curso')?.value) || null,
                    entidad: curso.querySelector('.entidad-curso')?.value || '',
                    fecha_realizacion: curso.querySelector('.fecha-curso')?.value || ''
                });
            }
        });
        datos.formacion_complementaria = formacionComplementaria;
        
        return datos;
    }

    async guardarUsuario() {
        try {
            console.log('🔄 Iniciando guardado de usuario...');
            // Primero, remover todos los atributos required para evitar el error de foco
            const requiredFields = document.querySelectorAll('#formulario-usuario [required]');
            
            const datos = this.obtenerDatosFormulario();
            
            // Validar campos obligatorios
            if (!datos.nombre || !datos.apellidos || !datos.email) {
                this.mostrarNotificacion('Por favor, completa los campos obligatorios', 'warning');
                return;
            }
            
            let resultado;
            if (this.usuarioId) {
                // Actualizar usuario existente
                resultado = await ApiService.actualizarUsuario(this.usuarioId, datos);
                this.mostrarNotificacion('Usuario actualizado correctamente', 'success');
            } else {
                // Crear nuevo usuario
                resultado = await ApiService.crearUsuario(datos);
                this.mostrarNotificacion('Usuario creado correctamente', 'success');
            }
            
            // Volver a la lista y recargar
            appManager.mostrarVista('lista');
            appManager.cargarUsuarios();
            
        } catch (error) {
            console.error('Error al guardar usuario:', error);
            this.mostrarNotificacion(`Error: ${error.message}`, 'error');
        }
    }

    mostrarNotificacion(mensaje, tipo = 'info') {
        const toast = document.getElementById('toast-notificacion');
        const toastTitulo = document.getElementById('toast-titulo');
        const toastMensaje = document.getElementById('toast-mensaje');
        
        // Configurar título según el tipo
        const titulos = {
            'success': 'Éxito',
            'error': 'Error',
            'warning': 'Advertencia',
            'info': 'Información'
        };
        
        toastTitulo.textContent = titulos[tipo] || 'Notificación';
        toastMensaje.textContent = mensaje;
        
        // Configurar clase según el tipo
        toast.className = `toast bg-${tipo === 'error' ? 'danger' : tipo}`;
        
        // Mostrar toast
        const bsToast = new bootstrap.Toast(toast);
        bsToast.show();
    }
}