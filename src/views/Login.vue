<template>
  <div class="login-container">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="login-form" :class="{ 'animate': isVisible }" ref="formRef">
            <div class="text-center mb-4">
              <div class="logo-placeholder mb-3">
                <h2 style="color: var(--secondary-color); font-weight: 800; font-size: 2.5rem;">VeriMed</h2>
              </div>
              <h1>Iniciar Sesión</h1>
              <p class="subtitle">Accede a tu cuenta VeriMed</p>
            </div>

            <!-- CAMBIO: Mostrar errores si los hay -->
            <div v-if="error" class="alert alert-danger mb-3">
              {{ error }}
            </div>

            <form @submit.prevent="handleLogin">
              <!-- Email/Username -->
              <div class="mb-3">
                <input 
                  v-model="loginData.username"
                  type="text" 
                  class="form-control" 
                  placeholder="Nombre de usuario"
                  required
                >
              </div>

              <!-- Password -->
              <div class="mb-3">
                <input 
                  v-model="loginData.password"
                  type="password" 
                  class="form-control" 
                  placeholder="Contraseña"
                  required
                >
              </div>

              <!-- Remember me -->
              <div class="form-check mb-4">
                <input 
                  v-model="rememberMe"
                  class="form-check-input" 
                  type="checkbox" 
                  id="rememberMe"
                >
                <label class="form-check-label" for="rememberMe">
                  Recordarme
                </label>
              </div>

              <!-- Submit button -->
              <button 
                type="submit" 
                class="btn btn-primary w-100 mb-3"
                :disabled="loading"
              >
                <span v-if="loading">Iniciando sesión...</span>
                <span v-else>Iniciar Sesión</span>
              </button>

              <!-- Forgot password -->
              <div class="text-center mb-3">
                <a href="#" class="forgot-password">¿Olvidaste tu contraseña?</a>
              </div>

              <!-- Register link -->
              <div class="text-center">
                <span class="register-text">¿No tienes cuenta? </span>
                <router-link to="/register" class="register-link">Regístrate aquí</router-link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '@/iam/auth.js'

const router = useRouter()
const formRef = ref(null)
const isVisible = ref(false)
const loading = ref(false)
const error = ref('')
const rememberMe = ref(false) // CAMBIO: Agregar variable faltante

const loginData = ref({
  username: '',
  password: ''
})

onMounted(() => {
  const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          isVisible.value = true
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
  )
  if (formRef.value) observer.observe(formRef.value)
})

const handleLogin = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await login(loginData.value.username, loginData.value.password)

    if (response.success && response.user) {
      // CAMBIO: Mejorar el manejo del localStorage
      if (rememberMe.value) {
        // Solo guardar en localStorage si "recordarme" está marcado
        localStorage.setItem('verimed_user', JSON.stringify(response.user))
      }
      
      // CAMBIO: Siempre guardar en sessionStorage para la sesión actual
      sessionStorage.setItem('userId', String(response.user.id))
      sessionStorage.setItem('authToken', response.user.token)

      // CAMBIO: Redirecciones corregidas según el tipo de usuario
      if (response.user.type === 'laboratory' || response.user.role === 'laboratory') {
        console.log('🏭 Redirigiendo laboratorio a /search')
        router.push('/search')
      } else {
        console.log('👨‍⚕️ Redirigiendo paciente/usuario a /home')
        router.push('/home')
      }
    } else {
      error.value = response.error || 'Respuesta inválida del servidor'
    }
  } catch (err) {
    console.error('Error al iniciar sesión:', err)
    error.value = 'Error de conexión. Intenta nuevamente.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  background: var(--background-color);
  padding: 20px;
  min-height: 100vh; /* CAMBIO: Asegurar altura completa */
  display: flex;
  align-items: center;
}

.login-form {
  background: var(--primary-color);
  padding: 40px;
  border-radius: 20px;
  color: var(--secondary-text-color);
  font-family: 'Funnel Sans', sans-serif;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.login-form.animate {
  animation: slideIn 0.8s ease-out;
}

.logo-placeholder {
  display: inline-block;
}

h1 {
  color: var(--secondary-text-color);
  font-family: 'Funnel Sans', sans-serif;
  font-weight: 800;
  font-size: 2.5rem;
  margin-bottom: 10px;
}

.subtitle {
  color: var(--tertiary-text-color);
  font-family: 'Albert Sans', sans-serif;
  font-size: 1.1rem;
  font-weight: 300;
  margin-bottom: 30px;
}

/* CAMBIO: Estilo para errores */
.alert {
  padding: 0.75rem 1rem;
  border-radius: 10px;
  font-size: 0.9rem;
  font-family: 'Albert Sans', sans-serif;
}

.alert-danger {
  background-color: rgba(220, 53, 69, 0.1);
  border: 1px solid rgba(220, 53, 69, 0.3);
  color: #dc3545;
}

.form-control {
  background: transparent;
  border: 1px solid var(--background-color);
  border-radius: 15px;
  padding: 15px 20px;
  color: var(--secondary-text-color);
  font-size: 1rem;
  margin-bottom: 10px;
}

.form-control::placeholder {
  color: var(--tertiary-text-color);
}

.form-control:focus {
  background: transparent;
  border-color: var(--secondary-color);
  color: var(--secondary-text-color);
  box-shadow: none;
  outline: none;
}

.form-check-input {
  background: transparent;
  border: 1px solid var(--background-color);
  margin-right: 10px;
}

.form-check-input:checked {
  background-color: var(--secondary-color);
  border-color: var(--secondary-color);
}

.form-check-label {
  color: var(--secondary-text-color);
  font-family: 'Albert Sans', sans-serif;
  font-size: 0.9rem;
}

.btn-primary {
  background-color: var(--secondary-color);
  border: none;
  border-radius: 25px;
  padding: 15px 30px;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s ease;
}

.btn-primary:hover:not(:disabled) {
  background-color: var(--secondary-hover-color);
  transform: translateY(-2px);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.forgot-password {
  color: var(--tertiary-text-color);
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.3s ease;
}

.forgot-password:hover {
  color: var(--secondary-color);
}

.register-text {
  color: var(--secondary-text-color);
  font-size: 0.9rem;
}

.register-link {
  color: var(--secondary-color);
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}

.register-link:hover {
  color: var(--secondary-hover-color);
}

label {
  color: var(--secondary-text-color);
  font-family: 'Albert Sans', sans-serif;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 8px;
}

@keyframes slideIn {
  0% {
    transform: translateY(-30px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .login-form {
    margin: 20px;
    padding: 30px 25px;
  }
  
  h1 {
    font-size: 2rem;
  }
}
</style>