/**
 * CRUD BASICO- Script Principal
 * Maneja las operaciones básicas de creación, lectura, actualización y eliminación
 * de usuarios mediante una interfaz web.
 */

// Constantes de configuración
const CONFIG = {
    API_BASE_URL: 'http://127.0.0.1/registro/php',
    ENDPOINTS: {
      CREATE: 'create.php',
      READ: 'read.php',
      UPDATE: 'update.php',
      DELETE: 'delete.php'
    },
    SELECTORS: {
      FORM: '#userForm',
      USER_ID: '#userId',
      NOMBRE: '#nombre',
      EMAIL: '#email',
      TABLE_BODY: '#usersTable tbody'
    }
  };
  
  // Clase principal de la aplicación
  class CrudApp {
    constructor() {
      this.initElements();
      this.initEventListeners();
      this.loadInitialData();
    }
  
    // Inicializar elementos del DOM
    initElements() {
      this.elements = {
        form: document.querySelector(CONFIG.SELECTORS.FORM),
        userId: document.querySelector(CONFIG.SELECTORS.USER_ID),
        nombre: document.querySelector(CONFIG.SELECTORS.NOMBRE),
        email: document.querySelector(CONFIG.SELECTORS.EMAIL),
        tableBody: document.querySelector(CONFIG.SELECTORS.TABLE_BODY)
      };
    }
  
    // Configurar event listeners
    initEventListeners() {
      this.elements.form.addEventListener('submit', (e) => this.handleFormSubmit(e));
    }
  
    // Cargar datos iniciales
    loadInitialData() {
      this.fetchUsers()
        .then(users => this.renderUsers(users))
        .catch(error => this.showError('Error al cargar usuarios', error));
    }
  
    // Manejar envío del formulario
    async handleFormSubmit(event) {
      event.preventDefault();
      
      const userData = {
        nombre: this.elements.nombre.value,
        email: this.elements.email.value
      };
  
      try {
        if (this.elements.userId.value) {
          userData.id = this.elements.userId.value;
          await this.updateUser(userData);
        } else {
          await this.createUser(userData);
        }
        
        this.resetForm();
        await this.loadInitialData();
      } catch (error) {
        this.showError('Error al guardar usuario', error);
      }
    }
  
    // Resetear formulario
    resetForm() {
      this.elements.form.reset();
      this.elements.userId.value = '';
    }
  
    // Operaciones CRUD
    async fetchUsers() {
      const response = await fetch(`${CONFIG.API_BASE_URL}/${CONFIG.ENDPOINTS.READ}`);
      if (!response.ok) throw new Error('Error en la respuesta del servidor');
      return await response.json();
    }
  
    async createUser(userData) {
      const response = await fetch(`${CONFIG.API_BASE_URL}/${CONFIG.ENDPOINTS.CREATE}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      if (!response.ok) throw new Error('Error al crear usuario');
      return await response.json();
    }
  
    async updateUser(userData) {
      const response = await fetch(`${CONFIG.API_BASE_URL}/${CONFIG.ENDPOINTS.UPDATE}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      if (!response.ok) throw new Error('Error al actualizar usuario');
      return await response.json();
    }
  
    async deleteUser(userId) {
      const response = await fetch(`${CONFIG.API_BASE_URL}/${CONFIG.ENDPOINTS.DELETE}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId })
      });
      if (!response.ok) throw new Error('Error al eliminar usuario');
      return await response.json();
    }
  
    // Renderizar usuarios en la tabla
    renderUsers(users) {
      this.elements.tableBody.innerHTML = users.map(user => `
        <tr>
          <td>${user.id}</td>
          <td>${user.nombre}</td>
          <td>${user.email}</td>
          <td>
            <button onclick="app.editUser(${user.id}, '${this.escapeHtml(user.nombre)}', '${this.escapeHtml(user.email)}')">
              Editar
            </button>
            <button onclick="app.confirmDelete(${user.id})">
              Eliminar
            </button>
          </td>
        </tr>
      `).join('');
    }
  
    // Métodos públicos para los botones
    editUser(id, nombre, email) {
      this.elements.userId.value = id;
      this.elements.nombre.value = nombre;
      this.elements.email.value = email;
    }
  
    async confirmDelete(userId) {
      if (confirm('¿Realmente deseas eliminar este usuario?')) {
        try {
          await this.deleteUser(userId);
          await this.loadInitialData();
        } catch (error) {
          this.showError('Error al eliminar usuario', error);
        }
      }
    }
  
    // Utilidades
    escapeHtml(text) {
      return text.toString()
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }
  
    showError(message, error) {
      console.error(`${message}:`, error);
      alert(`${message}. Ver consola para detalles.`);
    }
  }
  
  // Inicializar la aplicación cuando el DOM esté listo
  document.addEventListener('DOMContentLoaded', () => {
    window.app = new CrudApp();
  });
