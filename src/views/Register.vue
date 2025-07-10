<template>
  <div class="register-page">
    <div class="register-container">
     
      <div class="register-background">
        <div class="bg-circle circle-1"></div>
        <div class="bg-circle circle-2"></div>
        <div class="bg-circle circle-3"></div>
        <div class="bg-pattern"></div>
      </div>
      
    
      <div class="register-content">
        
        <div class="register-header">
          <div class="logo">
            <img 
              src="https://res.cloudinary.com/drkelnilg/image/upload/v1752046529/imagen_2025-07-09_023451036-removebg-preview_eaavmj.png" 
              alt="VeriMed Logo" 
              class="logo-image"
            />
            <h1 class="brand-name">VeriMed</h1>
          </div>
          <p class="brand-tagline">Únete a la revolución de la verificación farmacéutica</p>
        </div>

        <Card class="register-card">
          <template #content>
            <div class="register-form">
              
              <div class="form-header">
                <h2 class="form-title">Crear Usuario</h2>
                <p class="form-subtitle">Registra una nueva cuenta en VeriMed</p>
              </div>

             
              <div v-if="authStore.error" class="error-message">
                <i class="pi pi-exclamation-triangle"></i>
                <span>{{ authStore.error }}</span>
              </div>

            
              <div v-if="successMessage" class="success-message">
                <i class="pi pi-check-circle"></i>
                <span>{{ successMessage }}</span>
              </div>

              <!-- Formulario -->
              <form @submit.prevent="handleRegister" class="form">
                <!-- Campo usuario -->
                <div class="field">
                  <label for="username" class="field-label">
                    <i class="pi pi-user"></i>
                    Nombre de usuario
                  </label>
                  <InputText
                    id="username"
                    v-model="registerData.username"
                    placeholder="Ingresa tu nombre de usuario"
                    class="w-full input-field"
                    size="large"
                    :invalid="authStore.error && !registerData.username"
                    required
                  />
                </div>

             
                <div class="field">
                  <label for="email" class="field-label">
                    <i class="pi pi-envelope"></i>
                    Email (opcional)
                  </label>
                  <InputText
                    id="email"
                    v-model="registerData.email"
                    type="email"
                    placeholder="tu@email.com"
                    class="w-full input-field"
                    size="large"
                  />
                </div>

                <!-- Campo contraseña -->
                <div class="field">
                  <label for="password" class="field-label">
                    <i class="pi pi-lock"></i>
                    Contraseña
                  </label>
                  <Password
                    id="password"
                    v-model="registerData.password"
                    placeholder="Crea una contraseña segura"
                    class="w-full"
                    input-class="input-field"
                    size="large"
                    :feedback="true"
                    toggleMask
                    :invalid="authStore.error && !registerData.password"
                    required
                  />
                </div>

                <!-- Confirmar contraseña -->
                <div class="field">
                  <label for="confirmPassword" class="field-label">
                    <i class="pi pi-lock"></i>
                    Confirmar contraseña
                  </label>
                  <Password
                    id="confirmPassword"
                    v-model="registerData.confirmPassword"
                    placeholder="Confirma tu contraseña"
                    class="w-full"
                    input-class="input-field"
                    size="large"
                    :feedback="false"
                    toggleMask
                    :invalid="passwordMismatch"
                    required
                  />
                  <small v-if="passwordMismatch" class="error-text">
                    Las contraseñas no coinciden
                  </small>
                </div>


                <!-- Términos y condiciones -->
                <div class="field-checkbox">
                  <Checkbox
                    id="acceptTerms"
                    v-model="acceptTerms"
                    :binary="true"
                    required
                  />
                  <label for="acceptTerms" class="checkbox-label">
                    Acepto los <a href="#" class="terms-link">términos y condiciones</a>
                  </label>
                </div>

                
                <Button
                  type="submit"
                  label="Crear Usuario"
                  icon="pi pi-user-plus"
                  class="register-button"
                  size="large"
                  :loading="authStore.loading"
                  :disabled="!canSubmit"
                />

               
                <div class="divider">
                  <span class="divider-text">o</span>
                </div>

                
                <div class="login-section">
                  <span class="login-text">¿Ya tienes una cuenta?</span>
                  <router-link to="/login" class="login-link">
                    Inicia sesión aquí
                  </router-link>
                </div>
              </form>
            </div>
          </template>
        </Card>

       
        <div class="register-footer">
          <p>&copy; 2025 VeriMed. Únete a la comunidad que verifica la autenticidad farmacéutica.</p>
        </div>
      </div>
    </div>

    
    <Toast />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/iam/auth.js'
import { useToast } from 'primevue/usetoast'

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

const registerData = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  userType: 'laboratory'
})

const acceptTerms = ref(false)
const successMessage = ref('')

const userTypes = ref([
  { label: 'Laboratorio Farmacéutico', value: 'laboratory' },
  { label: 'Paciente/Usuario', value: 'patient' }
])

const passwordMismatch = computed(() => {
  return registerData.value.password && 
         registerData.value.confirmPassword && 
         registerData.value.password !== registerData.value.confirmPassword
})

const canSubmit = computed(() => {
  return registerData.value.username &&
         registerData.value.password &&
         registerData.value.confirmPassword &&
         !passwordMismatch.value &&
         acceptTerms.value &&
         registerData.value.userType
})

onMounted(() => {
  
  authStore.syncWithAuth()
  authStore.clearError()
})

const handleRegister = async () => {
  if (passwordMismatch.value) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Las contraseñas no coinciden',
      life: 5000
    })
    return
  }

  try {
    const userData = {
      username: registerData.value.username,
      password: registerData.value.password,
      email: registerData.value.email,
      userType: registerData.value.userType,
      role: registerData.value.userType
    }

    const response = await authStore.register(userData)

    if (response.success) {
      successMessage.value = 'Usuario creado exitosamente'
      
      toast.add({
        severity: 'success',
        summary: '¡Registro exitoso!',
        detail: 'Tu cuenta ha sido creada. Ahora puedes iniciar sesión.',
        life: 5000
      })

      // Limpiar formulario
      registerData.value = {
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        userType: 'laboratory'
      }
      acceptTerms.value = false

      // Redirigir a login después de 2 segundos
      setTimeout(() => {
        router.push('/login')
      }, 2000)

    } else {
      toast.add({
        severity: 'error',
        summary: 'Error al crear cuenta',
        detail: response.error,
        life: 5000
      })
    }
  } catch (error) {
    console.error('Error inesperado:', error)
    toast.add({
      severity: 'error',
      summary: 'Error inesperado',
      detail: 'Ocurrió un error. Intenta nuevamente.',
      life: 5000
    })
  }
}
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-md);
  background: linear-gradient(135deg, #203459 0%, #0a1529 100%);
  position: relative;
  overflow: hidden;
}

.register-container {
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 900px;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
  align-items: center;
}


.register-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  z-index: 1;
}

.bg-pattern {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle at 25% 25%, rgba(108, 138, 195, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 75% 75%, rgba(164, 189, 236, 0.08) 0%, transparent 50%);
  background-size: 400px 400px;
  animation: float 20s ease-in-out infinite;
}

.bg-circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(108, 138, 195, 0.1);
  animation: floatCircle 8s ease-in-out infinite;
}

.circle-1 {
  width: 280px;
  height: 280px;
  top: -140px;
  right: -140px;
  animation-delay: 1s;
}

.circle-2 {
  width: 180px;
  height: 180px;
  top: 70%;
  left: -90px;
  animation-delay: 4s;
}

.circle-3 {
  width: 120px;
  height: 120px;
  bottom: -60px;
  right: 20%;
  animation-delay: 7s;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  33% { transform: translate(20px, -20px) rotate(120deg); }
  66% { transform: translate(-15px, 15px) rotate(240deg); }
}

@keyframes floatCircle {
  0%, 100% { transform: translateY(0px) scale(1); }
  50% { transform: translateY(-30px) scale(1.05); }
}

.register-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 550px;
}

/* Header con logo (igual al login) */
.register-header {
  text-align: center;
  color: var(--text-white);
  margin-bottom: var(--spacing-md);
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-sm);
}

.logo-image {
  width: 70px;
  height: 70px;
  object-fit: contain;
  filter: brightness(0) invert(1);
  drop-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
}

.brand-name {
  font-family: 'Funnel Sans', sans-serif;
  font-size: 3.2rem;
  font-weight: 800;
  margin: 0;
  background: linear-gradient(135deg, #ffffff 0%, #a4bdec 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 30px rgba(255, 255, 255, 0.5);
}

.brand-tagline {
  font-size: 1.1rem;
  opacity: 0.9;
  margin: 0;
  font-weight: 300;
}

/* Card de registro glassmorphism */
.register-card {
  background: rgba(255, 255, 255, 0.1) !important;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1) !important;
  width: 100%;
}

.register-form {
  padding: var(--spacing-xl);
}

.form-header {
  text-align: center;
  margin-bottom: var(--spacing-xl);
}

.form-title {
  font-family: 'Funnel Sans', sans-serif;
  font-size: 2.2rem;
  font-weight: 700;
  color: var(--text-white);
  margin: 0 0 var(--spacing-xs) 0;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.form-subtitle {
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
  font-size: 1rem;
}

/* Mensajes */
.error-message {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm);
  background: rgba(239, 68, 68, 0.15);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: var(--border-radius);
  color: #fecaca;
  margin-bottom: var(--spacing-md);
  font-size: 0.9rem;
  backdrop-filter: blur(10px);
}

.success-message {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm);
  background: rgba(34, 197, 94, 0.15);
  border: 1px solid rgba(34, 197, 94, 0.3);
  border-radius: var(--border-radius);
  color: #86efac;
  margin-bottom: var(--spacing-md);
  font-size: 0.9rem;
  backdrop-filter: blur(10px);
}

/* Form (igual al login) */
.form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.field {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.field-label {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-weight: 600;
  color: var(--text-white);
  font-size: 0.9rem;
}

.error-text {
  color: #fecaca;
  font-size: 0.8rem;
  margin-top: 0.25rem;
}

/* Input fields glassmorphism (igual al login) */
:deep(.input-field) {
  background: rgba(255, 255, 255, 0.1) !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  color: white !important;
  backdrop-filter: blur(10px);
  border-radius: var(--border-radius) !important;
  padding: var(--spacing-sm) var(--spacing-md) !important;
  font-size: 1rem !important;
}

:deep(.input-field::placeholder) {
  color: rgba(255, 255, 255, 0.6) !important;
}

:deep(.input-field:focus) {
  border-color: #6c8ac3 !important;
  box-shadow: 0 0 0 2px rgba(108, 138, 195, 0.3) !important;
  background: rgba(255, 255, 255, 0.15) !important;
}

/* Dropdown */
:deep(.p-dropdown) {
  background: rgba(255, 255, 255, 0.1) !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  color: white !important;
  backdrop-filter: blur(10px);
}

:deep(.p-dropdown .p-inputtext) {
  color: white !important;
  background: transparent !important;
  border: none !important;
}

:deep(.p-dropdown:not(.p-disabled):hover) {
  border-color: #6c8ac3 !important;
}

:deep(.p-dropdown:not(.p-disabled).p-focus) {
  border-color: #6c8ac3 !important;
  box-shadow: 0 0 0 2px rgba(108, 138, 195, 0.3) !important;
}

/* Password field */
:deep(.p-password) {
  width: 100%;
}

:deep(.p-password .p-inputtext) {
  width: 100% !important;
}

.field-checkbox {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  margin-top: var(--spacing-xs);
}

:deep(.p-checkbox .p-checkbox-box) {
  background: rgba(255, 255, 255, 0.1) !important;
  border: 1px solid rgba(255, 255, 255, 0.3) !important;
  backdrop-filter: blur(10px);
}

:deep(.p-checkbox .p-checkbox-box.p-highlight) {
  background: #6c8ac3 !important;
  border-color: #6c8ac3 !important;
}

.checkbox-label {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.9);
  cursor: pointer;
}

.terms-link {
  color: #a4bdec;
  text-decoration: none;
}

.terms-link:hover {
  color: #6c8ac3;
  text-decoration: underline;
}

.register-button {
  background: linear-gradient(135deg, #6c8ac3 0%, #4f46e5 100%) !important;
  border: none !important;
  font-weight: 600;
  padding: var(--spacing-md) var(--spacing-lg) !important;
  margin-top: var(--spacing-sm);
  border-radius: var(--border-radius) !important;
  box-shadow: 0 4px 15px rgba(108, 138, 195, 0.4) !important;
  transition: all 0.3s ease !important;
}

.register-button:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(108, 138, 195, 0.6) !important;
}

.register-button:disabled {
  opacity: 0.6;
  transform: none !important;
}

/* Divider y enlaces (igual al login) */
.divider {
  position: relative;
  text-align: center;
  margin: var(--spacing-md) 0;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: rgba(255, 255, 255, 0.2);
}

.divider-text {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 0 var(--spacing-md);
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
}

.login-section {
  text-align: center;
  margin-top: var(--spacing-sm);
}

.login-text {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
}

.login-link {
  color: #a4bdec;
  text-decoration: none;
  font-weight: 600;
  margin-left: var(--spacing-xs);
  transition: var(--transition);
}

.login-link:hover {
  color: #6c8ac3;
  text-decoration: underline;
}

/* Footer */
.register-footer {
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.85rem;
  margin-top: var(--spacing-md);
}

/* Responsive (igual al login) */
@media (max-width: 768px) {
  .register-page {
    padding: var(--spacing-sm);
  }
  
  .brand-name {
    font-size: 2.5rem;
  }
  
  .logo-image {
    width: 60px;
    height: 60px;
  }
  
  .register-form {
    padding: var(--spacing-md);
  }
  
  .bg-circle {
    display: none;
  }
}

@media (max-width: 480px) {
  .brand-name {
    font-size: 2rem;
  }
  
  .form-title {
    font-size: 1.8rem;
  }
}


.register-card {
  animation: slideUp 0.8s ease-out;
}

.register-header {
  animation: fadeIn 1s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>