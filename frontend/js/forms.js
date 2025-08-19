// Clase para manejar los formularios con el nuevo diseño
class FormManager {
    constructor() {
        console.log('🏗️ Creando instancia de FormManager...');
        
        this.formulario = document.getElementById('formulario-usuario');
        this.usuarioId = null;
        this.pasoActual = 1;
        this.totalPasos = 4;
        
        console.log('📝 Formulario encontrado:', this.formulario);
        console.log('🆔 ID de usuario inicializado en:', this.usuarioId);
        console.log('📊 Paso actual:', this.pasoActual, 'de', this.totalPasos);
        
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
                this.eliminarMiembroPerceptor(e.target.closest('.dynamic-item'));
            }
            
            if (e.target.closest('.btn-eliminar-curso')) {
                this.eliminarCurso(e.target.closest('.dynamic-item'));
            }
        });

        // Eventos de navegación del formulario
        const btnSiguiente = document.getElementById('btn-siguiente');
        if (btnSiguiente) {
            btnSiguiente.addEventListener('click', () => {
                this.siguientePaso();
            });
        }

        const btnAnterior = document.getElementById('btn-anterior');
        if (btnAnterior) {
            btnAnterior.addEventListener('click', () => {
                this.anteriorPaso();
            });
        }

        // Calcular edad automáticamente al cambiar la fecha de nacimiento
        const fechaNacimiento = document.getElementById('fecha_nacimiento');
        if (fechaNacimiento) {
            fechaNacimiento.addEventListener('change', (e) => {
                console.log('📅 Fecha de nacimiento cambiada:', e.target.value);
                this.calcularEdad(e.target.value);
            });
        }

        // Eventos para los indicadores de paso
        document.querySelectorAll('.step-indicator').forEach(indicator => {
            indicator.addEventListener('click', () => {
                const paso = parseInt(indicator.dataset.step);
                if (paso < this.pasoActual || this.validarPasoActual()) {
                    this.irAPaso(paso);
                }
            });
        });
    }

    // Métodos de navegación del formulario
    siguientePaso() {
        if (this.pasoActual < this.totalPasos) {
            if (this.validarPasoActual()) {
                this.pasoActual++;
                this.actualizarPaso();
            }
        } else {
            // Estamos en el último paso, guardar formulario
            this.guardarUsuario();
        }
    }

    anteriorPaso() {
        if (this.pasoActual > 1) {
            this.pasoActual--;
            this.actualizarPaso();
        }
    }

    irAPaso(paso) {
        if (paso >= 1 && paso <= this.totalPasos) {
            this.pasoActual = paso;
            this.actualizarPaso();
        }
    }

    actualizarPaso() {
        // Ocultar todos los pasos
        document.querySelectorAll('.form-step').forEach(step => {
            step.classList.remove('active');
        });

        // Mostrar paso actual
        const pasoActualElement = document.getElementById(`step-${this.pasoActual}`);
        if (pasoActualElement) {
            pasoActualElement.classList.add('active');
        }

        // Actualizar stepper
        document.querySelectorAll('.stepper-item').forEach((item, index) => {
            if (index + 1 < this.pasoActual) {
                item.classList.add('completed');
                item.classList.remove('active');
            } else if (index + 1 === this.pasoActual) {
                item.classList.add('active');
                item.classList.remove('completed');
            } else {
                item.classList.remove('active', 'completed');
            }
        });

        // Actualizar indicadores
        document.querySelectorAll('.step-indicator').forEach((indicator, index) => {
            if (index + 1 === this.pasoActual) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });

        // Actualizar botones de navegación
        const btnAnterior = document.getElementById('btn-anterior');
        const btnSiguiente = document.getElementById('btn-siguiente');

        if (btnAnterior) {
            btnAnterior.style.display = this.pasoActual === 1 ? 'none' : 'flex';
        }

        if (btnSiguiente) {
            if (this.pasoActual === this.totalPasos) {
                btnSiguiente.innerHTML = '<i class="bi bi-check-lg"></i> Guardar';
                btnSiguiente.classList.remove('btn-primary');
                btnSiguiente.classList.add('btn-success');
            } else {
                btnSiguiente.innerHTML = 'Siguiente <i class="bi bi-arrow-right"></i>';
                btnSiguiente.classList.remove('btn-success');
                btnSiguiente.classList.add('btn-primary');
            }
        }

        // Scroll al inicio del formulario
        pasoActualElement?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    validarPasoActual() {
        const pasoActualElement = document.getElementById(`step-${this.pasoActual}`);
        const camposRequeridos = pasoActualElement.querySelectorAll('[required]');
        
        for (let campo of camposRequeridos) {
            if (!campo.value.trim()) {
                this.mostrarNotificacion(`Por favor complete el campo: ${campo.previousElementSibling.textContent}`, 'warning');
                campo.focus();
                return false;
            }
        }

        // Validación específica para el paso 1 (Datos Personales)
        if (this.pasoActual === 1) {
            const email = document.getElementById('email').value;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                this.mostrarNotificación('Por favor ingrese un email válido', 'warning');
                document.getElementById('email').focus();
                return false;
            }
        }

        return true;
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
        
        const edadCampo = document.getElementById('edad');
        if (edadCampo) {
            edadCampo.value = edad;
        }
    }

    agregarMiembroPerceptor() {
        const container = document.getElementById('miembros-perceptores');
        const nuevoMiembro = document.createElement('div');
        nuevoMiembro.className = 'dynamic-item';
        
        const numeroMiembros = container.children.length + 1;
        
        nuevoMiembro.innerHTML = `
            <div class="dynamic-item-header">
                <h6>Miembro ${numeroMiembros}</h6>
                <button type="button" class="btn-remove btn-eliminar-miembro" title="Eliminar">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
            <div class="dynamic-item-content">
                <div class="form-grid">
                    <div class="form-group">
                        <label class="form-label">Número</label>
                        <input type="number" class="form-control" placeholder="Número" min="1">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Tipo</label>
                        <input type="text" class="form-control" placeholder="Tipo (ej: Prestación)">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Cantidad</label>
                        <input type="text" class="form-control" placeholder="Cantidad">
                    </div>
                </div>
            </div>
        `;
        
        container.appendChild(nuevoMiembro);
        
        // Animación de entrada
        nuevoMiembro.style.opacity = '0';
        nuevoMiembro.style.transform = 'translateY(-10px)';
        setTimeout(() => {
            nuevoMiembro.style.transition = 'all 0.3s ease';
            nuevoMiembro.style.opacity = '1';
            nuevoMiembro.style.transform = 'translateY(0)';
        }, 10);
    }

    eliminarMiembroPerceptor(elemento) {
        const container = document.getElementById('miembros-perceptores');
        if (container.children.length > 1) {
            elemento.style.transition = 'all 0.3s ease';
            elemento.style.opacity = '0';
            elemento.style.transform = 'translateX(100%)';
            setTimeout(() => {
                elemento.remove();
                this.actualizarNumerosMiembros();
            }, 300);
        } else {
            this.mostrarNotificacion('Debe haber al menos un miembro perceptor', 'warning');
        }
    }

    actualizarNumerosMiembros() {
        const container = document.getElementById('miembros-perceptores');
        Array.from(container.children).forEach((miembro, index) => {
            const header = miembro.querySelector('.dynamic-item-header h6');
            if (header) {
                header.textContent = `Miembro ${index + 1}`;
            }
        });
    }

    agregarCurso() {
        const container = document.getElementById('formacion-complementaria-lista');
        const plantilla = document.getElementById('plantilla-curso');
        
        if (!plantilla) {
            console.error('❌ Plantilla de curso no encontrada');
            return;
        }
        
        const nuevoCurso = plantilla.cloneNode(true);
        nuevoCurso.id = '';
        nuevoCurso.classList.remove('d-none');
        
        container.appendChild(nuevoCurso);
        
        // Animación de entrada
        nuevoCurso.style.opacity = '0';
        nuevoCurso.style.transform = 'translateY(-10px)';
        setTimeout(() => {
            nuevoCurso.style.transition = 'all 0.3s ease';
            nuevoCurso.style.opacity = '1';
            nuevoCurso.style.transform = 'translateY(0)';
        }, 10);
    }

    eliminarCurso(elemento) {
        elemento.style.transition = 'all 0.3s ease';
        elemento.style.opacity = '0';
        elemento.style.transform = 'translateX(100%)';
        setTimeout(() => {
            elemento.remove();
        }, 300);
    }

    limpiarFormulario() {
        this.formulario.reset();
        this.usuarioId = null;
        this.pasoActual = 1;
        this.actualizarPaso();
        
        // Limpiar miembros perceptores
        const containerMiembros = document.getElementById('miembros-perceptores');
        if (containerMiembros) {
            containerMiembros.innerHTML = `
                <div class="dynamic-item">
                    <div class="dynamic-item-header">
                        <h6>Miembro 1</h6>
                        <button type="button" class="btn-remove btn-eliminar-miembro" title="Eliminar">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                    <div class="dynamic-item-content">
                        <div class="form-grid">
                            <div class="form-group">
                                <label class="form-label">Número</label>
                                <input type="number" class="form-control" placeholder="Número" min="1">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Tipo</label>
                                <input type="text" class="form-control" placeholder="Tipo (ej: Prestación)">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Cantidad</label>
                                <input type="text" class="form-control" placeholder="Cantidad">
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
        
        // Limpiar formación complementaria
        const containerFormacion = document.getElementById('formacion-complementaria-lista');
        if (containerFormacion) {
            containerFormacion.innerHTML = '';
        }
        
        // Actualizar título
        const tituloFormulario = document.getElementById('titulo-formulario');
        if (tituloFormulario) {
            tituloFormulario.textContent = 'Nuevo Usuario';
        }
        
        this.mostrarNotificacion('Formulario limpiado', 'info');
    }

    async cargarUsuario(id) {
        try {
            const usuario = await ApiService.obtenerUsuario(id);
            this.usuarioId = id;
            
            // Cargar datos básicos
            this.campoValor('nombre', usuario.nombre);
            this.campoValor('apellidos', usuario.apellidos);
            this.campoValor('fecha_nacimiento', usuario.fecha_nacimiento ? usuario.fecha_nacimiento.split('T')[0] : '');
            this.campoValor('edad', usuario.edad);
            this.campoValor('nacionalidad', usuario.nacionalidad);
            this.campoValor('documento_identidad', usuario.documento_identidad);
            this.campoValor('sexo', usuario.sexo);
            this.campoValor('direccion', usuario.direccion);
            this.campoValor('localidad', usuario.localidad);
            this.campoValor('cp', usuario.cp);
            this.campoValor('email', usuario.email);
            this.campoValor('telefono1', usuario.telefono1);
            this.campoValor('telefono2', usuario.telefono2);
            this.campoValor('carnet', usuario.carnet);
            this.setCheckboxValue('vehiculo_propio', usuario.vehiculo_propio);
            this.campoValor('discapacidad_porcentaje', usuario.discapacidad_porcentaje);
            this.campoValor('discapacidad_tipo', usuario.discapacidad_tipo);
            this.campoValor('entidad_derivacion', usuario.entidad_derivacion);
            this.campoValor('tecnico_derivacion', usuario.tecnico_derivacion);
            this.campoValor('colectivo', usuario.colectivo);
            this.campoValor('composicion_familiar', usuario.composicion_familiar);
            this.campoValor('situacion_economica', usuario.situacion_economica);
            this.campoValor('otras_situaciones', usuario.otras_situaciones);
            this.campoValor('formacion_academica', usuario.formacion_academica);
            this.campoValor('ano_finalizacion', usuario.ano_finalizacion);
            this.campoValor('idiomas', usuario.idiomas);
            this.campoValor('informatica', usuario.informatica);
            this.campoValor('experiencia_laboral_previa', usuario.experiencia_laboral_previa);
            
            // Cargar miembros perceptores
            if (usuario.miembros_perceptores) {
                try {
                    const miembros = JSON.parse(usuario.miembros_perceptores);
                    const container = document.getElementById('miembros-perceptores');
                    container.innerHTML = '';
                    
                    miembros.forEach((miembro, index) => {
                        const nuevoMiembro = document.createElement('div');
                        nuevoMiembro.className = 'dynamic-item';
                        nuevoMiembro.innerHTML = `
                            <div class="dynamic-item-header">
                                <h6>Miembro ${index + 1}</h6>
                                <button type="button" class="btn-remove btn-eliminar-miembro" title="Eliminar">
                                    <i class="bi bi-trash"></i>
                                </button>
                            </div>
                            <div class="dynamic-item-content">
                                <div class="form-grid">
                                    <div class="form-group">
                                        <label class="form-label">Número</label>
                                        <input type="number" class="form-control" placeholder="Número" min="1" value="${miembro.numero || ''}">
                                    </div>
                                    <div class="form-group">
                                        <label class="form-label">Tipo</label>
                                        <input type="text" class="form-control" placeholder="Tipo (ej: Prestación)" value="${miembro.tipo || ''}">
                                    </div>
                                    <div class="form-group">
                                        <label class="form-label">Cantidad</label>
                                        <input type="text" class="form-control" placeholder="Cantidad" value="${miembro.cantidad || ''}">
                                    </div>
                                </div>
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
                    
                    this.campoValorEnElemento(nuevoCurso.querySelector('.nombre-curso'), curso.nombre_curso);
                    this.campoValorEnElemento(nuevoCurso.querySelector('.duracion-curso'), curso.duracion);
                    this.campoValorEnElemento(nuevoCurso.querySelector('.horas-curso'), curso.horas);
                    this.campoValorEnElemento(nuevoCurso.querySelector('.entidad-curso'), curso.entidad);
                    this.campoValorEnElemento(nuevoCurso.querySelector('.fecha-curso'), curso.fecha_realizacion ? curso.fecha_realizacion.split('T')[0] : '');
                    
                    container.appendChild(nuevoCurso);
                });
            }
            
            // Actualizar título
            const tituloFormulario = document.getElementById('titulo-formulario');
            if (tituloFormulario) {
                tituloFormulario.textContent = 'Editar Usuario';
            }
            
            // Volver al primer paso
            this.pasoActual = 1;
            this.actualizarPaso();
            
        } catch (error) {
            console.error('Error al cargar usuario:', error);
            this.mostrarNotificacion('Error al cargar los datos del usuario', 'error');
        }
    }

    campoValor(campoId, valor) {
        const campo = document.getElementById(campoId);
        if (campo) {
            campo.value = valor || '';
        }
    }

    campoValorEnElemento(elemento, valor) {
        if (elemento) {
            elemento.value = valor || '';
        }
    }

    setCheckboxValue(campoId, valor) {
        const campo = document.getElementById(campoId);
        if (campo) {
            campo.checked = !!valor;
        }
    }

    obtenerDatosFormulario() {
        console.log('📋 Obteniendo datos del formulario...');

        // Recopilar datos básicos
        const datos = {
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
        const miembrosElements = document.querySelectorAll('.miembro-perceptor .dynamic-item');
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
        document.querySelectorAll('#formacion-complementaria-lista .curso-item').forEach(curso => {
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
            console.log('💾 Guardando usuario...');
            
            // Validar todos los pasos
            for (let i = 1; i <= this.totalPasos; i++) {
                this.pasoActual = i;
                if (!this.validarPasoActual()) {
                    this.actualizarPaso();
                    return;
                }
            }
            
            const datos = this.obtenerDatosFormulario();
            console.log('📦 Datos a guardar:', datos);
            
            let usuarioGuardado;
            if (this.usuarioId) {
                // Actualizar usuario existente
                usuarioGuardado = await ApiService.actualizarUsuario(this.usuarioId, datos);
                this.mostrarNotificacion('Usuario actualizado correctamente', 'success');
            } else {
                // Crear nuevo usuario
                usuarioGuardado = await ApiService.crearUsuario(datos);
                this.mostrarNotificacion('Usuario creado correctamente', 'success');
            }
            
            // Limpiar formulario y volver a la lista
            setTimeout(() => {
                this.limpiarFormulario();
                window.appManager.mostrarVista('lista');
                window.appManager.actualizarTitulo('Dashboard');
                window.appManager.cargarUsuarios();
            }, 1500);
            
        } catch (error) {
            console.error('❌ Error al guardar usuario:', error);
            this.mostrarNotificacion(`Error al guardar usuario: ${error.message}`, 'error');
        }
    }

    mostrarNotificacion(mensaje, tipo = 'info') {
        console.log(`🔔 Mostrando notificación: ${mensaje} (${tipo})`);
        
        // Crear toast
        const toastHTML = `
            <div class="toast align-items-center text-white bg-${tipo === 'success' ? 'success' : tipo === 'error' ? 'danger' : tipo === 'warning' ? 'warning' : 'primary'} border-0" role="alert">
                <div class="d-flex">
                    <div class="toast-body">
                        ${mensaje}
                    </div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
                </div>
            </div>
        `;
        
        // Crear container si no existe
        let toastContainer = document.querySelector('.toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.className = 'toast-container';
            document.body.appendChild(toastContainer);
        }
        
        // Añadir toast
        toastContainer.insertAdjacentHTML('beforeend', toastHTML);
        
        // Mostrar toast
        const toastElement = toastContainer.lastElementChild;
        const toast = new bootstrap.Toast(toastElement, {
            autohide: true,
            delay: 3000
        });
        toast.show();
        
        // Eliminar toast después de ocultarse
        toastElement.addEventListener('hidden.bs.toast', () => {
            toastElement.remove();
        });
    }
}