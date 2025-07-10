// src/iam/auth.js - ACTUALIZADO con redirecciones corregidas
import { storage } from './storage.js'

class SimpleAuth {
  constructor() {
    this.currentUser = storage.getUser()
    this.isLoggedIn = !!this.currentUser
    this.baseURL = `${import.meta.env.VITE_BACKEND_URL}api/v1/authentication`
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
        type: data.role || data.userType || 'patient',
        name: data.name || data.fullName || username,
        email: data.email || '',
        id: data.id || data.userId,
        token: data.token || data.accessToken // CAMBIO: Guardar token en userData
      }
      
      // Guardar usuario y token
      this.currentUser = userData
      this.isLoggedIn = true
      storage.setUser(userData)
      storage.setToken(userData.token)
      
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
          userType: userData.userType || 'laboratory',
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

  // CAMBIO: Obtener token directamente
  getToken() {
    return this.currentUser?.token || storage.getToken()
  }

  // Actualizar perfil (para futuro)
  async updateProfile(profileData) {
    try {
      console.log('📝 Actualizando perfil:', profileData)
      
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
export const getToken = () => auth.getToken() // CAMBIO: Nueva función para obtener token
export const updateProfile = (data) => auth.updateProfile(data)