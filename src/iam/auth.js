
import { defineStore } from 'pinia'
import { storage } from './storage.js'


class SimpleAuth {
  constructor() {
    this.currentUser = storage.getUser()
    this.isLoggedIn = !!this.currentUser
    this.baseURL = `${import.meta.env.VITE_BACKEND_URL}api/v1/authentication`
  }


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


      const userData = {
        username: data.username || username,
        type: data.role || data.userType || 'patient',
        name: data.name || data.fullName || username,
        email: data.email || '',
        id: data.id || data.userId,
        token: data.token || data.accessToken
      }


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


  logout() {
    console.log('🚪 Cerrando sesión...')
    this.currentUser = null
    this.isLoggedIn = false
    storage.clear()
  }


  getUser() {
    return this.currentUser
  }

  checkAuth() {
    return this.isLoggedIn
  }

  isLaboratory() {
    return this.currentUser?.type === 'laboratory' || this.currentUser?.role === 'laboratory'
  }

  isPatient() {
    return this.currentUser?.type === 'patient' || this.currentUser?.role === 'patient'
  }

  getToken() {
    return this.currentUser?.token || storage.getToken()
  }

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

//Pinia
export const useAuthStore = defineStore('auth', {
  state: () => ({

    user: auth.getUser(),
    isLoggedIn: auth.checkAuth(),
    loading: false,
    error: null,
    rememberMe: false
  }),

  getters: {
    isLaboratory: () => auth.isLaboratory(),
    isPatient: () => auth.isPatient(),
    token: () => auth.getToken(),

    userInitials: (state) => {
      if (!state.user?.name && !state.user?.username) return 'U'
      const name = state.user.name || state.user.username
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    },

    userIcon: () => {
      if (auth.isLaboratory()) return 'pi pi-building'
      if (auth.isPatient()) return 'pi pi-user'
      return 'pi pi-user'
    }
  },

  actions: {
    async login(credentials) {
      this.loading = true
      this.error = null

      try {

        const response = await auth.login(credentials.username, credentials.password)

        if (response.success) {

          this.user = auth.getUser()
          this.isLoggedIn = auth.checkAuth()


          if (this.rememberMe) {
            localStorage.setItem('verimed_user', JSON.stringify(this.user))
          }
        } else {
          this.error = response.error
        }

        return response

      } catch (error) {
        this.error = error.message
        return { success: false, error: error.message }
      } finally {
        this.loading = false
      }
    },

    async register(userData) {
      this.loading = true
      this.error = null

      try {

        const response = await auth.register(userData)

        if (!response.success) {
          this.error = response.error
        }

        return response

      } catch (error) {
        this.error = error.message
        return { success: false, error: error.message }
      } finally {
        this.loading = false
      }
    },

    logout() {

      auth.logout()


      this.user = null
      this.isLoggedIn = false
      this.error = null
      this.rememberMe = false
    },

    clearError() {
      this.error = null
    },

    setRememberMe(value) {
      this.rememberMe = value
    },


    syncWithAuth() {
      this.user = auth.getUser()
      this.isLoggedIn = auth.checkAuth()
    }
  }
})


export const auth = new SimpleAuth()


export const login = (username, password) => auth.login(username, password)
export const register = (userData) => auth.register(userData)
export const logout = () => auth.logout()
export const getUser = () => auth.getUser()
export const isLoggedIn = () => auth.checkAuth()
export const isLaboratory = () => auth.isLaboratory()
export const isPatient = () => auth.isPatient()
export const getToken = () => auth.getToken()
export const updateProfile = (data) => auth.updateProfile(data)