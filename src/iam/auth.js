// src/iam/auth.js - ACTUALIZADO para backend real
import { storage } from './storage.js'

class SimpleAuth {
  constructor() {
    this.currentUser = storage.getUser()
    this.isLoggedIn = !!this.currentUser
    this.baseURL = 'http://localhost:8080/api/v1/authentication' // Ajusta el puerto según tu backend
  }

  // Login con endpoint real
  async login(username, password) {
    try {
      console.log('🔐 Intentando login con backend...')
      
      const response = await fetch(`${this.baseURL}/sign-in`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Credenciales incorrectas')
      }

      const data = await response.json()
      console.log('✅ Respuesta del backend:', data)
      
      // Extraer datos del usuario según respuesta del backend
      const userData = {
        username: data.username || username,
        type: data.role || data.userType || 'patient', // Ajustar según tu backend
        name: data.name || data.fullName || username,
        email: data.email || '',
        id: data.id || data.userId
      }
      
      // Guardar usuario y token
      this.currentUser = userData
      this.isLoggedIn = true
      storage.setUser(userData)
      storage.setToken(data.token || data.accessToken)
      
      return { success: true, user: userData }
      
    } catch (error) {
      console.error('❌ Error en login:', error)
      return { success: false, error: error.message }
    }
  }

  // Registro con endpoint real  
  async register(userData) {
    try {
      console.log('📝 Registrando usuario con backend...', userData)
      
      const response = await fetch(`${this.baseURL}/sign-up`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: userData.username,
          password: userData.password,
          email: userData.email,
          // Agregar campos según lo que espere tu backend
          userType: userData.userType || 'laboratory', // Por defecto laboratorio
          role: userData.role || userData.userType || 'laboratory'
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Error al crear cuenta')
      }

      const data = await response.json()
      console.log('✅ Usuario registrado:', data)
      
      return { 
        success: true, 
        message: 'Cuenta creada exitosamente',
        data: data
      }
      
    } catch (error) {
      console.error('❌ Error en registro:', error)
      return { success: false, error: error.message }
    }
  }

  // Logout simple
  logout() {
    console.log('🚪 Cerrando sesión...')
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
    return this.currentUser?.type === 'laboratory' || this.currentUser?.role === 'laboratory'
  }

  // Verificar si es paciente
  isPatient() {
    return this.currentUser?.type === 'patient' || this.currentUser?.role === 'patient'
  }

  // Actualizar perfil (para futuro)
  async updateProfile(profileData) {
    try {
      console.log('📝 Actualizando perfil:', profileData)
      
      // Por ahora solo actualizar localmente
      // Aquí puedes agregar llamada al backend para actualizar perfil
      this.currentUser = { ...this.currentUser, ...profileData, profileComplete: true }
      storage.setUser(this.currentUser)
      
      return { success: true, user: this.currentUser }
      
    } catch (error) {
      console.error('❌ Error actualizando perfil:', error)
      return { success: false, error: error.message }
    }
  }
}

// Crear instancia global
export const auth = new SimpleAuth()

// Funciones de conveniencia
export const login = (username, password) => auth.login(username, password)
export const register = (userData) => auth.register(userData)
export const logout = () => auth.logout()
export const getUser = () => auth.getUser()
export const isLoggedIn = () => auth.checkAuth()
export const isLaboratory = () => auth.isLaboratory()
export const isPatient = () => auth.isPatient()
export const updateProfile = (data) => auth.updateProfile(data)