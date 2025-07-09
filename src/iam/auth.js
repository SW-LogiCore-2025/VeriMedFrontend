// src/iam/auth.js
import { storage } from './storage.js'

class SimpleAuth {
  constructor() {
    this.currentUser = storage.getUser()
    this.isLoggedIn = !!this.currentUser
  }

  // Login simple
  async login(username, password) {
    try {
      // Por ahora simular - luego conectar a tu API
      console.log('Login attempt:', username, password)
      
      // Simular respuesta del servidor
      let userData
      if (username === 'lab_demo' && password === 'demo123') {
        userData = { 
          username: 'lab_demo', 
          type: 'laboratory', 
          name: 'Laboratorio Demo',
          email: 'lab@demo.com'
        }
      } else if (username === 'patient_demo' && password === 'demo123') {
        userData = { 
          username: 'patient_demo', 
          type: 'patient', 
          name: 'Paciente Demo',
          email: 'patient@demo.com'
        }
      } else {
        throw new Error('Credenciales incorrectas')
      }
      
      // Guardar usuario
      this.currentUser = userData
      this.isLoggedIn = true
      storage.setUser(userData)
      storage.setToken('demo-token-123')
      
      return { success: true, user: userData }
      
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // Registro simple
  async register(userData) {
    try {
      console.log('Register attempt:', userData)
      
      // Simular registro exitoso
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      return { success: true, message: 'Cuenta creada exitosamente' }
      
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // Logout simple
  logout() {
    this.currentUser = null
    this.isLoggedIn = false
    storage.clear()
  }

  // Obtener usuario actual
  getUser() {
    return this.currentUser
  }

  // Verificar si está logueado
  checkAuth() {
    return this.isLoggedIn
  }

  // Verificar si es laboratorio
  isLaboratory() {
    return this.currentUser?.type === 'laboratory'
  }

  // Verificar si es paciente
  isPatient() {
    return this.currentUser?.type === 'patient'
  }

  // Actualizar perfil (para futuro)
  async updateProfile(profileData) {
    try {
      console.log('Update profile:', profileData)
      
      // Simular actualización
      this.currentUser = { ...this.currentUser, ...profileData }
      storage.setUser(this.currentUser)
      
      return { success: true, user: this.currentUser }
      
    } catch (error) {
      return { success: false, error: error.message }
    }
  }
}

// Crear instancia global
export const auth = new SimpleAuth()

// Funciones de conveniencia para usar en componentes
export const login = (username, password) => auth.login(username, password)
export const register = (userData) => auth.register(userData)
export const logout = () => auth.logout()
export const getUser = () => auth.getUser()
export const isLoggedIn = () => auth.checkAuth()
export const isLaboratory = () => auth.isLaboratory()
export const isPatient = () => auth.isPatient()
export const updateProfile = (data) => auth.updateProfile(data)