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
              <h1>Crear Cuenta de Laboratorio</h1>
              <p class="subtitle">Únete a la red de verificación de medicamentos</p>
              
              <!-- Indicador de progreso -->
              <div class="progress-indicator">
                <div class="progress-bar" :style="{ width: progressPercentage + '%' }"></div>
              </div>
              <p class="step-info">Paso {{ currentStep }} de 2</p>
            </div>

            <!-- Mostrar errores -->
            <div v-if="error" class="alert alert-danger mb-3">
              <i class="fas fa-exclamation-triangle"></i>
              {{ error }}
            </div>

            <!-- Mostrar loading -->
            <div v-if="loading" class="alert alert-info mb-3">
              <i class="fas fa-spinner fa-spin"></i>
              {{ loadingMessage }}
            </div>

            <!-- Formulario con pasos -->
            <form @submit.prevent="handleSubmit">
              
              <!-- PASO 1: Datos básicos de la cuenta -->
              <div v-if="currentStep === 1" class="form-step">
                <h3 class="step-title">
                  <span class="step-number">1</span>
                  Crear tu Cuenta
                </h3>
                
                <!-- Nombre de usuario -->
                <div class="mb-3">
                  <label for="username" class="modern-label">
                    <i class="fas fa-user"></i>
                    Nombre de usuario
                  </label>
                  <input 
                    id="username"
                    v-model="registerData.username"
                    type="text" 
                    class="form-control" 
                    placeholder="Ingresa tu nombre de usuario"
                    required
                    :disabled="loading"
                    minlength="3"
                  >
                </div>

                <!-- Email -->
                <div class="mb-3">
                  <label for="email" class="modern-label">
                    <i class="fas fa-envelope"></i>
                    Correo Electrónico
                  </label>
                  <input 
                    id="email"
                    v-model="registerData.email"
                    type="email" 
                    class="form-control" 
                    placeholder="correo@laboratorio.com"
                    required
                    :disabled="loading"
                  >
                </div>

                <!-- Contraseña -->
                <div class="mb-3">
                  <label for="password" class="modern-label">
                    <i class="fas fa-lock"></i>
                    Contraseña
                  </label>
                  <div class="password-input-container">
                    <input 
                      id="password"
                      v-model="registerData.password"
                      :type="showPassword ? 'text' : 'password'"
                      class="form-control" 
                      placeholder="Mínimo 6 caracteres"
                      required
                      :disabled="loading"
                      minlength="6"
                    >
                    <button 
                      type="button" 
                      class="password-toggle-btn"
                      @click="showPassword = !showPassword"
                      :disabled="loading"
                    >
                      <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                    </button>
                  </div>
                </div>

                <!-- Confirmar contraseña -->
                <div class="mb-3">
                  <label for="confirmPassword" class="modern-label">
                    <i class="fas fa-lock"></i>
                    Confirmar Contraseña
                  </label>
                  <input 
                    id="confirmPassword"
                    v-model="registerData.confirmPassword"
                    type="password" 
                    class="form-control" 
                    placeholder="Confirma tu contraseña"
                    required
                    :disabled="loading"
                    minlength="6"
                  >
                  <small v-if="passwordMismatch" class="text-danger">
                    Las contraseñas no coinciden
                  </small>
                </div>
              </div>

              <!-- PASO 2: Información del laboratorio -->
              <div v-if="currentStep === 2" class="form-step">
                <h3 class="step-title">
                  <span class="step-number">2</span>
                  Información del Laboratorio
                </h3>
                
                <!-- Información personal -->
                <div class="row g-3">
                  <div class="col-md-6">
                    <label for="firstName" class="modern-label">
                      <i class="fas fa-user"></i>
                      Nombre(s)
                    </label>
                    <input 
                      id="firstName"
                      v-model="profileData.firstName"
                      type="text" 
                      class="form-control" 
                      placeholder="Tu nombre"
                      required
                      :disabled="loading"
                    >
                  </div>
                  <div class="col-md-6">
                    <label for="lastName" class="modern-label">
                      <i class="fas fa-user"></i>
                      Apellido(s)
                    </label>
                    <input 
                      id="lastName"
                      v-model="profileData.lastName"
                      type="text" 
                      class="form-control" 
                      placeholder="Tus apellidos"
                      required
                      :disabled="loading"
                    >
                  </div>
                </div>

                <!-- Información del laboratorio -->
                <div class="row g-3">
                  <div class="col-md-12">
                    <label for="companyName" class="modern-label">
                      <i class="fas fa-building"></i>
                      Nombre de la Empresa/Laboratorio
                    </label>
                    <input 
                      id="companyName"
                      v-model="profileData.companyName"
                      type="text" 
                      class="form-control" 
                      placeholder="Laboratorios XYZ S.A."
                      required
                      :disabled="loading"
                    >
                  </div>
                </div>

                <div class="row g-3">
                  <div class="col-md-6">
                    <label for="ruc" class="modern-label">
                      <i class="fas fa-id-card"></i>
                      RUC
                    </label>
                    <input 
                      id="ruc"
                      v-model="profileData.ruc"
                      type="text" 
                      class="form-control" 
                      placeholder="20123456789"
                      required
                      :disabled="loading"
                      maxlength="11"
                      pattern="[0-9]{11}"
                    >
                  </div>
                  <div class="col-md-6">
                    <label for="position" class="modern-label">
                      <i class="fas fa-briefcase"></i>
                      Cargo
                    </label>
                    <input 
                      id="position"
                      v-model="profileData.position"
                      type="text" 
                      class="form-control" 
                      placeholder="Director de Calidad"
                      required
                      :disabled="loading"
                    >
                  </div>
                </div>

                <!-- Teléfono y dirección (opcionales) -->
                <div class="row g-3">
                  <div class="col-md-6">
                    <label for="phone" class="modern-label">
                      <i class="fas fa-phone"></i>
                      Teléfono (Opcional)
                    </label>
                    <input 
                      id="phone"
                      v-model="profileData.phone"
                      type="tel" 
                      class="form-control" 
                      placeholder="+51 999 999 999"
                      :disabled="loading"
                    >
                  </div>
                </div>

                <div class="mb-3">
                  <label for="address" class="modern-label">
                    <i class="fas fa-map-marker-alt"></i>
                    Dirección (Opcional)
                  </label>
                  <textarea 
                    id="address"
                    v-model="profileData.address"
                    class="form-control" 
                    rows="2"
                    placeholder="Dirección del laboratorio"
                    :disabled="loading"
                  ></textarea>
                </div>

                <!-- Términos y condiciones -->
                <div class="form-check mb-4">
                  <input 
                    id="acceptTerms"
                    v-model="acceptTerms"
                    class="form-check-input" 
                    type="checkbox"
                    required
                    :disabled="loading"
                  >
                  <label class="form-check-label" for="acceptTerms">
                    Acepto los <a href="#" class="terms-link">términos y condiciones</a> y la <a href="#" class="terms-link">política de privacidad</a>
                  </label>
                </div>
              </div>

              <!-- Botones de navegación -->
              <div class="form-navigation">
                <!-- Botón anterior -->
                <button 
                  v-if="currentStep > 1"
                  type="button" 
                  class="btn btn-outline-secondary"
                  @click="previousStep"
                  :disabled="loading"
                >
                  <i class="fas fa-chevron-left"></i>
                  Anterior
                </button>
                <div v-else></div> <!-- Espacio vacío para mantener diseño -->

                <!-- Botón siguiente/finalizar -->
                <button 
                  v-if="currentStep < 2"
                  type="button" 
                  class="btn btn-primary"
                  @click="nextStep"
                  :disabled="!isStep1Valid || loading"
                >
                  Siguiente
                  <i class="fas fa-chevron-right"></i>
                </button>

                <button 
                  v-if="currentStep === 2"
                  type="submit" 
                  class="btn btn-success"
                  :disabled="!isStep2Valid || loading"
                >
                  <span v-if="loading">
                    <i class="fas fa-spinner fa-spin"></i>
                    Creando cuenta...
                  </span>
                  <span v-else>
                    <i class="fas fa-check"></i>
                    Crear Cuenta Completa
                  </span>
                </button>
              </div>

              <!-- Login link -->
              <div class="text-center mt-4">
                <span class="login-text">¿Ya tienes cuenta? </span>
                <router-link to="/login" class="login-link">
                  <i class="fas fa-sign-in-alt"></i>
                  Inicia sesión aquí
                </router-link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { register } from '@/iam/auth.js'

const router = useRouter()
const formRef = ref(null)
const isVisible = ref(false)
const loading = ref(false)
const error = ref('')
const showPassword = ref(false)
const acceptTerms = ref(false)
const currentStep = ref(1)

// Datos del paso 1 (registro)
const registerData = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  userType: 'laboratory'
})

// Datos del paso 2 (perfil)
const profileData = ref({
  firstName: '',
  lastName: '',
  companyName: '',
  ruc: '',
  position: '',
  phone: '',
  address: ''
})

// Computed
const progressPercentage = computed(() => {
  return (currentStep.value / 2) * 100
})

const passwordMismatch = computed(() => {
  return registerData.value.password && 
         registerData.value.confirmPassword && 
         registerData.value.password !== registerData.value.confirmPassword
})

const isStep1Valid = computed(() => {
  return registerData.value.username.length >= 3 &&
         registerData.value.email &&
         registerData.value.password.length >= 6 &&
         registerData.value.password === registerData.value.confirmPassword
})

const isStep2Valid = computed(() => {
  return profileData.value.firstName &&
         profileData.value.lastName &&
         profileData.value.companyName &&
         profileData.value.ruc &&
         profileData.value.position &&
         acceptTerms.value
})

const loadingMessage = computed(() => {
  if (currentStep.value === 1) return 'Validando datos...'
  return 'Creando tu cuenta completa...'
})

onMounted(() => {
  // Animación de entrada
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

const nextStep = () => {
  if (currentStep.value < 2 && isStep1Valid.value) {
    currentStep.value++
    error.value = '' // Limpiar errores al avanzar
  }
}

const previousStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
    error.value = '' // Limpiar errores al retroceder
  }
}

const handleSubmit = async () => {
  if (currentStep.value === 1) {
    nextStep()
    return
  }

  if (!isStep2Valid.value) return

  loading.value = true
  error.value = ''

  try {
    console.log('📝 Creando cuenta completa...')
    
    // Crear cuenta con todos los datos
    const completeUserData = {
      // Datos básicos
      username: registerData.value.username,
      email: registerData.value.email,
      password: registerData.value.password,
      userType: 'laboratory',
      role: 'laboratory',
      
      // Datos del perfil
      firstName: profileData.value.firstName,
      lastName: profileData.value.lastName,
      companyName: profileData.value.companyName,
      ruc: profileData.value.ruc,
      position: profileData.value.position,
      phone: profileData.value.phone,
      address: profileData.value.address,
      profileComplete: true
    }
    
    const result = await register(completeUserData)
    
    if (result.success) {
      console.log('✅ Cuenta creada exitosamente')
      
      // Redirigir directamente al login con mensaje de éxito
      router.push('/login?message=account-created')
      
    } else {
      console.log('❌ Error creando cuenta:', result.error)
      error.value = result.error
    }
    
  } catch (err) {
    console.error('💥 Error inesperado:', err)
    error.value = 'Error de conexión. Inténtalo nuevamente.'
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
  margin-bottom: 20px;
}

.progress-indicator {
  background: var(--background-color);
  height: 6px;
  border-radius: 3px;
  margin: 20px 0 10px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, var(--secondary-color), var(--secondary-hover-color));
  transition: width 0.3s ease;
  border-radius: 3px;
}

.step-info {
  color: var(--tertiary-text-color);
  font-size: 0.9rem;
  margin-bottom: 30px;
}

.form-step {
  min-height: 400px;
  animation: fadeInSlide 0.5s ease-out;
}

.step-title {
  display: flex;
  align-items: center;
  gap: 1rem;
  color: var(--secondary-text-color);
  font-size: 1.4rem;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--secondary-color);
}

.step-number {
  background: var(--secondary-color);
  color: white;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.1rem;
}

.modern-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: var(--secondary-text-color);
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  font-family: 'Albert Sans', sans-serif;
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
  width: 100%;
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

.form-control:disabled, textarea:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.password-input-container {
  position: relative;
}

.password-toggle-btn {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--tertiary-text-color);
  cursor: pointer;
  padding: 5px;
  border-radius: 4px;
  transition: color 0.3s ease;
}

.password-toggle-btn:hover {
  color: var(--secondary-color);
}

.form-navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 30px;
  gap: 1rem;
}

.btn-outline-secondary {
  background: transparent;
  color: var(--tertiary-text-color);
  border: 2px solid var(--tertiary-text-color);
  padding: 12px 24px;
  border-radius: 25px;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-outline-secondary:hover {
  background: var(--tertiary-text-color);
  color: white;
}

.btn-primary {
  background-color: var(--secondary-color);
  border: none;
  color: white;
  padding: 12px 24px;
  border-radius: 25px;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: auto;
}

.btn-primary:hover:not(:disabled) {
  background-color: var(--secondary-hover-color);
  transform: translateY(-2px);
}

.btn-success {
  background: linear-gradient(135deg, #198754, #20c997);
  border: none;
  color: white;
  padding: 12px 24px;
  border-radius: 25px;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: auto;
}

.btn-success:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(25, 135, 84, 0.3);
}

.btn-primary:disabled,
.btn-success:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
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

.alert {
  border-radius: 15px;
  padding: 15px 20px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.alert-danger {
  background-color: rgba(220, 53, 69, 0.1);
  border: 1px solid rgba(220, 53, 69, 0.3);
  color: #dc3545;
}

.alert-info {
  background-color: rgba(13, 202, 240, 0.1);
  border: 1px solid rgba(13, 202, 240, 0.3);
  color: #0dcaf0;
}

.terms-link {
  color: var(--secondary-color);
  text-decoration: none;
  transition: color 0.3s ease;
}

.terms-link:hover {
  color: var(--secondary-hover-color);
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
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.login-link:hover {
  color: var(--secondary-hover-color);
}

.text-danger {
  color: #dc3545;
  font-size: 0.8rem;
  margin-top: 0.25rem;
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

@keyframes fadeInSlide {
  0% {
    opacity: 0;
    transform: translateX(20px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

@media (max-width: 768px) {
  .register-form {
    margin: 20px;
    padding: 25px;
  }
  
  h1 {
    font-size: 2rem;
  }
  
  .form-navigation {
    flex-direction: column;
    gap: 1rem;
  }
  
  .btn-primary,
  .btn-success {
    margin-left: 0;
    width: 100%;
    justify-content: center;
  }
}
</style>