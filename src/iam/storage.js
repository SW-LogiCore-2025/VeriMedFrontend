// src/iam/storage.js
export const storage = {
  // Claves para localStorage
  USER_KEY: 'verimed_user',
  TOKEN_KEY: 'verimed_token',

  // Guardar usuario
  setUser(user) {
    try {
      localStorage.setItem(this.USER_KEY, JSON.stringify(user))
      console.log('Usuario guardado:', user.username)
    } catch (error) {
      console.error('Error guardando usuario:', error)
    }
  },

  // Obtener usuario
  getUser() {
    try {
      const user = localStorage.getItem(this.USER_KEY)
      return user ? JSON.parse(user) : null
    } catch (error) {
      console.error('Error obteniendo usuario:', error)
      return null
    }
  },

  // Guardar token
  setToken(token) {
    try {
      localStorage.setItem(this.TOKEN_KEY, token)
      console.log('Token guardado')
    } catch (error) {
      console.error('Error guardando token:', error)
    }
  },

  // Obtener token
  getToken() {
    try {
      return localStorage.getItem(this.TOKEN_KEY)
    } catch (error) {
      console.error('Error obteniendo token:', error)
      return null
    }
  },

  // Limpiar todo
  clear() {
    try {
      localStorage.removeItem(this.USER_KEY)
      localStorage.removeItem(this.TOKEN_KEY)
      console.log('Storage limpiado')
    } catch (error) {
      console.error('Error limpiando storage:', error)
    }
  },

  // Verificar si hay datos guardados
  hasData() {
    return !!(this.getUser() && this.getToken())
  },

  // Mostrar info del storage (para debug)
  debug() {
    console.log('=== VERIMED STORAGE DEBUG ===')
    console.log('Usuario:', this.getUser())
    console.log('Token:', this.getToken())
    console.log('Tiene datos:', this.hasData())
    console.log('============================')
  }
}