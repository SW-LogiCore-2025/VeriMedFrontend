<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-background">
        <div class="bg-circle circle-1"></div>
        <div class="bg-circle circle-2"></div>
        <div class="bg-circle circle-3"></div>
        <div class="bg-pattern"></div>
      </div>
      
      
      <div class="login-content">
        <div class="login-header">
          <div class="logo">
            <img 
              src="https://res.cloudinary.com/drkelnilg/image/upload/v1752046529/imagen_2025-07-09_023451036-removebg-preview_eaavmj.png" 
              alt="VeriMed Logo" 
              class="logo-image"
            />
            <h1 class="brand-name">VeriMed</h1>
          </div>
          <p class="brand-tagline">Plataforma segura de verificación farmacéutica</p>
        </div>

       
        <Card class="login-card">
          <template #content>
            <div class="login-form">
              <div class="form-header">
                <h2 class="form-title">Iniciar Sesión</h2>
                <p class="form-subtitle">Accede a tu cuenta VeriMed</p>
              </div>

              
              <div v-if="authStore.error" class="error-message">
                <i class="pi pi-exclamation-triangle"></i>
                <span>{{ authStore.error }}</span>
              </div>

              
              <form @submit.prevent="handleLogin" class="form">
                <div class="field">
                  <label for="username" class="field-label">
                    <i class="pi pi-user"></i>
                    Nombre de usuario
                  </label>
                  <InputText
                    id="username"
                    v-model="loginData.username"
                    placeholder="Ingresa tu usuario"
                    class="w-full input-field"
                    size="large"
                    :invalid="authStore.error && !loginData.username"
                    required
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
                    v-model="loginData.password"
                    placeholder="Ingresa tu contraseña"
                    class="w-full"
                    input-class="input-field"
                    size="large"
                    :feedback="false"
                    toggleMask
                    :invalid="authStore.error && !loginData.password"
                    required
                  />
                </div>

                <!-- Recordarme -->
                <div class="field-checkbox">
                  <Checkbox
                    id="rememberMe"
                    v-model="rememberMe"
                    :binary="true"
                    @change="authStore.setRememberMe($event)"
                  />
                  <label for="rememberMe" class="checkbox-label">
                    Recordarme en este dispositivo
                  </label>
                </div>

                <!-- Botón de login -->
                <Button
                  type="submit"
                  label="Iniciar Sesión"
                  icon="pi pi-sign-in"
                  class="login-button"
                  size="large"
                  :loading="authStore.loading"
                  :disabled="!loginData.username || !loginData.password"
                />

                <!-- Link de olvidé contraseña -->
                <div class="forgot-password">
                  <a href="#" class="forgot-link">
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>

                <!-- Separador -->
                <div class="divider">
                  <span class="divider-text">o</span>
                </div>

                <!-- Link de registro -->
                <div class="register-section">
                  <span class="register-text">¿No tienes una cuenta?</span>
                  <router-link to="/register" class="register-link">
                    Regístrate aquí
                  </router-link>
                </div>
              </form>
            </div>
          </template>
        </Card>

        <!-- Footer -->
        <div class="login-footer">
          <p>&copy; 2025 VeriMed. Tecnología blockchain para la autenticidad farmacéutica.</p>
        </div>
      </div>
    </div>

    <!-- Toast para notificaciones -->
    <Toast />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/iam/auth.js'
import { useToast } from 'primevue/usetoast'

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

const loginData = ref({
  username: '',
  password: ''
})

const rememberMe = ref(false)

onMounted(() => {
  
  authStore.syncWithAuth()
  authStore.clearError()
})

const handleLogin = async () => {
  try {
    authStore.setRememberMe(rememberMe.value)
    const response = await authStore.login(loginData.value)

    if (response.success) {
      
      toast.add({
        severity: 'success',
        summary: '¡Bienvenido!',
        detail: `Hola ${response.user.name || response.user.username}`,
        life: 3000
      })

      
      if (authStore.isLaboratory) {
        router.push('/search')
      } else {
        router.push('/home')
      }
    } else {
      
      toast.add({
        severity: 'error',
        summary: 'Error de autenticación',
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
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-md);
  background: linear-gradient(135deg, #203459 0%, #0a1529 100%);
  position: relative;
  overflow: hidden;
}

.login-container {
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 900px;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
  align-items: center;
}


.login-background {
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
  width: 300px;
  height: 300px;
  top: -150px;
  left: -150px;
  animation-delay: 0s;
}

.circle-2 {
  width: 200px;
  height: 200px;
  top: 60%;
  right: -100px;
  animation-delay: 3s;
}

.circle-3 {
  width: 150px;
  height: 150px;
  bottom: -75px;
  left: 30%;
  animation-delay: 6s;
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

.login-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 500px;
}


.login-header {
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


.login-card {
  background: rgba(255, 255, 255, 0.1) !important;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1) !important;
  width: 100%;
}

.login-form {
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

/* Error message */
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

/* Form */
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

/* Input fields glassmorphism */
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

.login-button {
  background: linear-gradient(135deg, #6c8ac3 0%, #4f46e5 100%) !important;
  border: none !important;
  font-weight: 600;
  padding: var(--spacing-md) var(--spacing-lg) !important;
  margin-top: var(--spacing-sm);
  border-radius: var(--border-radius) !important;
  box-shadow: 0 4px 15px rgba(108, 138, 195, 0.4) !important;
  transition: all 0.3s ease !important;
}

.login-button:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(108, 138, 195, 0.6) !important;
}

.login-button:disabled {
  opacity: 0.6;
  transform: none !important;
}

.forgot-password {
  text-align: center;
  margin-top: var(--spacing-sm);
}

.forgot-link {
  color: #a4bdec;
  text-decoration: none;
  font-size: 0.9rem;
  transition: var(--transition);
}

.forgot-link:hover {
  color: #6c8ac3;
  text-decoration: underline;
}

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

.register-section {
  text-align: center;
  margin-top: var(--spacing-sm);
}

.register-text {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
}

.register-link {
  color: #a4bdec;
  text-decoration: none;
  font-weight: 600;
  margin-left: var(--spacing-xs);
  transition: var(--transition);
}

.register-link:hover {
  color: #6c8ac3;
  text-decoration: underline;
}

/* Footer */
.login-footer {
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.85rem;
  margin-top: var(--spacing-md);
}

/* Responsive */
@media (max-width: 768px) {
  .login-page {
    padding: var(--spacing-sm);
  }
  
  .brand-name {
    font-size: 2.5rem;
  }
  
  .logo-image {
    width: 60px;
    height: 60px;
  }
  
  .login-form {
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


.login-card {
  animation: slideUp 0.8s ease-out;
}

.login-header {
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