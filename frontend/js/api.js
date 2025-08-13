// Configuración de la API
const API_BASE_URL = process.env.API_URL || 'http://127.0.0.1:5000/';

// Clase para manejar las llamadas a la API
class ApiService {
    // Obtener todos los usuarios
    static async obtenerUsuarios(pagina = 1, limite = 10, busqueda = '', filtro = '') {
        try {
            let url = `${API_BASE_URL}/usuarios?page=${pagina}&limit=${limite}`;
            
            if (busqueda) {
                url += `&search=${encodeURIComponent(busqueda)}`;
            }
            
            if (filtro) {
                url += `&colectivo=${encodeURIComponent(filtro)}`;
            }
            
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
            throw error;
        }
    }

    // Obtener un usuario por ID
    static async obtenerUsuario(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/usuarios/${id}`);
            
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error al obtener usuario:', error);
            throw error;
        }
    }

    // Crear un nuevo usuario
    static async crearUsuario(datos) {
        try {
            const response = await fetch(`${API_BASE_URL}/usuarios`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(datos)
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Error HTTP: ${response.status}`);
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error al crear usuario:', error);
            throw error;
        }
    }

    // Actualizar un usuario
    static async actualizarUsuario(id, datos) {
        try {
            const response = await fetch(`${API_BASE_URL}/usuarios/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(datos)
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Error HTTP: ${response.status}`);
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error al actualizar usuario:', error);
            throw error;
        }
    }

    // Eliminar un usuario
    static async eliminarUsuario(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/usuarios/${id}`, {
                method: 'DELETE'
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Error HTTP: ${response.status}`);
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error al eliminar usuario:', error);
            throw error;
        }
    }

    // Generar PDF de un usuario
    static async generarPDF(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/pdf/ficha/${id}`);
            
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            
            // Convertir la respuesta a un blob
            const blob = await response.blob();
            
            // Crear un objeto URL para el blob
            const url = window.URL.createObjectURL(blob);
            
            // Crear un enlace temporal para descargar el PDF
            const a = document.createElement('a');
            a.href = url;
            a.download = `ficha_usuario_${id}.pdf`;
            document.body.appendChild(a);
            a.click();
            
            // Limpiar
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            
            return true;
        } catch (error) {
            console.error('Error al generar PDF:', error);
            throw error;
        }
    }
}