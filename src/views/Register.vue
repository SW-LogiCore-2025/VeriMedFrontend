<template>
  <div class="register-container">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="register-form" :class="{ 'animate': isVisible }" ref="formRef">
            <div class="text-center mb-4">
              <div class="logo-placeholder mb-3">
                <h2 style="color: var(--secondary-color); font-weight: 800; font-size: 2.5rem;">VeriMed</h2>
              </div>
              <h1>Crear Cuenta</h1>
              <p class="subtitle">Únete a la red de verificación de medicamentos</p>
            </div>

            <!-- Selector de tipo de usuario -->
            <div class="mb-4">
              <label class="form-label">Selecciona el tipo de cuenta</label>
              <div class="user-type-selector">
                <div class="row g-3">
                  <div class="col-6">
                    <input 
                      type="radio" 
                      id="laboratory" 
                      value="laboratory" 
                      v-model="userType"
                      class="form-check-input user-type-radio"
                    >
                    <label for="laboratory" class="user-type-card">
                      <div class="card-icon">🏭</div>
                      <div class="card-title">Laboratorio</div>
                      <div class="card-subtitle">Fabricante de medicamentos</div>
                    </label>
                  </div>
                  <div class="col-6">
                    <input 
                      type="radio" 
                      id="patient" 
                      value="patient" 
                      v-model="userType"
                      class="form-check-input user-type-radio"
                    >
                    <label for="patient" class="user-type-card">
                      <div class="card-icon">👤</div>
                      <div class="card-title">Paciente</div>
                      <div class="card-subtitle">Consumidor de medicamentos</div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <!-- Formulario simplificado -->
            <form @submit.prevent="handleRegister" v-if="userType">
              <h3 class="form-section-title">Crear tu cuenta {{ userType === 'laboratory' ? 'de Laboratorio' : 'de Paciente' }}</h3>
              
              <div class="row g-3">
                <div class="col-md-12">
                  <input 
                    v-model="registerData.username"
                    type="text" 
                    class="form-control" 
                    placeholder="Nombre de usuario"
                    required
                  >
                </div>
              </div>

              <div class="row g-3">
                <div class="col-md-6">
                  <input 
                    v-model="registerData.password"
                    type="password" 
                    class="form-control" 
                    placeholder="Contraseña"
                    required
                  >
                </div>
                <div class="col-md-6">
                  <input 
                    v-model="registerData.confirmPassword"
                    type="password" 
                    class="form-control" 
                    placeholder="Confirmar contraseña"
                    required
                  >
                </div>
              </div>

              <div class="info-box mt-4">
                <p><strong>📝 Siguiente paso:</strong></p>
                <p>Después de crear tu cuenta, te pediremos completar tu perfil con información adicional como correo electrónico y datos {{ userType === 'laboratory' ? 'corporativos' : 'personales' }}.</p>
              </div>

              <!-- Términos y condiciones -->
              <div class="form-check mb-4 mt-4">
                <input 
                  v-model="acceptTerms"
                  class="form-check-input" 
                  type="checkbox" 
                  id="acceptTerms"
                  required
                >
                <label class="form-check-label" for="acceptTerms">
                  Acepto los <a href="#" class="terms-link">términos y condiciones</a> y la <a href="#" class="terms-link">política de privacidad</a>
                </label>
              </div>

              <!-- Submit button -->
              <button 
                type="submit" 
                class="btn btn-primary w-100 mb-3"
                :disabled="loading || !acceptTerms"
              >
                <span v-if="loading">Creando cuenta...</span>
                <span v-else>Crear Cuenta</span>
              </button>

              <!-- Login link -->
              <div class="text-center">
                <span class="login-text">¿Ya tienes cuenta? </span>
                <router-link to="/login" class="login-link">Inicia sesión aquí</router-link>
              </div>
            </form>

            <!-- Mensaje cuando no se ha seleccionado tipo de usuario -->
            <div v-else class="no-user-type">
              <p>👆 Selecciona el tipo de cuenta para continuar</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api.js'

const router = useRouter()
const formRef = ref(null)
const isVisible = ref(false)
const loading = ref(false)

const userType = ref('')
const acceptTerms = ref(false)

// Datos simplificados del registro
const registerData = ref({
  username: '',
  password: '',
  confirmPassword: ''
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

const validateForm = () => {
  // Validar contraseñas coincidentes
  if (registerData.value.password !== registerData.value.confirmPassword) {
    alert('Las contraseñas no coinciden')
    return false
  }
  
  // Validar longitud de contraseña
  if (registerData.value.password.length < 6) {
    alert('La contraseña debe tener al menos 6 caracteres')
    return false
  }

  // Validar username no vacío
  if (!registerData.value.username.trim()) {
    alert('El nombre de usuario es requerido')
    return false
  }
  
  return true
}

const handleRegister = async () => {
  if (!validateForm()) return
  
  loading.value = true

  try {
    const registrationData = {
      username: registerData.value.username,
      password: registerData.value.password,
      userType: userType.value
    }

    console.log('Registration attempt:', registrationData)
    
    // Simulación de registro exitoso
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    alert('¡Cuenta creada exitosamente! Ahora completa tu perfil.')
    
    // Redirigir a completar perfil pasando el tipo de usuario
    router.push(`/complete-profile?type=${userType.value}`)
    
  } catch (error) {
    console.error('Error en registro:', error)
    alert('Error al crear la cuenta. Inténtalo nuevamente.')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-container {
  background: var(--background-color);
  min-height: 100vh;
  padding: 100px 0 50px;
}

.register-form {
  background: var(--primary-color);
  padding: 40px;
  border-radius: 20px;
  color: var(--secondary-text-color);
  font-family: 'Funnel Sans', sans-serif;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.register-form.animate {
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

.form-section-title {
  color: var(--secondary-text-color);
  font-family: 'Funnel Sans', sans-serif;
  font-weight: 600;
  font-size: 1.3rem;
  margin: 30px 0 20px 0;
  padding-bottom: 10px;
  border-bottom: 2px solid var(--secondary-color);
}

.user-type-selector {
  margin-bottom: 20px;
}

.user-type-radio {
  display: none;
}

.user-type-card {
  display: block;
  background: var(--background-color);
  border: 2px solid transparent;
  border-radius: 15px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: var(--text-color);
  text-decoration: none;
  height: 100%;
}

.user-type-card:hover {
  border-color: var(--secondary-color);
  transform: translateY(-2px);
}

.user-type-radio:checked + .user-type-card {
  border-color: var(--secondary-color);
  background: var(--secondary-color);
  color: white;
}

.card-icon {
  font-size: 2rem;
  margin-bottom: 10px;
}

.card-title {
  font-weight: 600;
  font-size: 1.1rem;
  margin-bottom: 5px;
}

.card-subtitle {
  font-size: 0.9rem;
  opacity: 0.8;
}

.form-control, textarea {
  background: transparent;
  border: 1px solid var(--background-color);
  border-radius: 15px;
  padding: 15px 20px;
  color: var(--secondary-text-color);
  font-size: 1rem;
  margin-bottom: 10px;
  transition: all 0.3s ease;
}

.form-control::placeholder, textarea::placeholder {
  color: var(--tertiary-text-color);
}

.form-control:focus, textarea:focus {
  background: transparent;
  border-color: var(--secondary-color);
  color: var(--secondary-text-color);
  box-shadow: 0 0 0 0.2rem rgba(108, 138, 195, 0.25);
  outline: none;
}

select.form-control {
  cursor: pointer;
}

select.form-control option {
  background: var(--primary-color);
  color: var(--secondary-text-color);
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

.terms-link {
  color: var(--secondary-color);
  text-decoration: none;
  transition: color 0.3s ease;
}

.terms-link:hover {
  color: var(--secondary-hover-color);
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

.login-text {
  color: var(--secondary-text-color);
  font-size: 0.9rem;
}

.login-link {
  color: var(--secondary-color);
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}

.login-link:hover {
  color: var(--secondary-hover-color);
}

.no-user-type {
  text-align: center;
  color: var(--tertiary-text-color);
  font-size: 1.1rem;
  padding: 40px 20px;
}

.info-box {
  background: var(--background-color);
  border-left: 4px solid var(--secondary-color);
  padding: 20px;
  border-radius: 10px;
  color: var(--text-color);
}

.info-box p {
  margin: 0;
  font-size: 0.9rem;
}

.info-box p:first-child {
  margin-bottom: 8px;
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
  .register-form {
    margin: 20px;
    padding: 30px 25px;
  }
  
  h1 {
    font-size: 2rem;
  }
  
  .user-type-card {
    padding: 15px;
    margin-bottom: 15px;
  }
  
  .card-icon {
    font-size: 1.5rem;
  }
  
  .form-section-title {
    font-size: 1.1rem;
  }
}
</style>