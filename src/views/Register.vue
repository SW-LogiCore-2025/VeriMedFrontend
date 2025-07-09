<template>
  <div class="register-container">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="register-form animate" ref="formRef">
            <div class="text-center mb-4">
              <h1>Crear Usuario</h1>
              <p class="subtitle">Registra una nueva cuenta en VeriMed</p>
            </div>

            <form @submit.prevent="handleSubmit">
              <!-- Nombre de usuario -->
              <div class="mb-3">
                <input
                    v-model="registerData.username"
                    type="text"
                    class="form-control"
                    placeholder="Nombre de usuario"
                    required
                />
              </div>

              <!-- Contraseña -->
              <div class="mb-3">
                <input
                    v-model="registerData.password"
                    type="password"
                    class="form-control"
                    placeholder="Contraseña"
                    required
                />
              </div>

              <!-- Confirmar contraseña -->
              <div class="mb-3">
                <input
                    v-model="registerData.confirmPassword"
                    type="password"
                    class="form-control"
                    placeholder="Confirmar contraseña"
                    required
                />
              </div>

              <!-- Botón de envío -->
              <button
                  type="submit"
                  class="btn btn-primary w-100 mb-3"
                  :disabled="loading"
              >
                <span v-if="loading">Creando usuario...</span>
                <span v-else>Crear Usuario</span>
              </button>

              <!-- Enlace para iniciar sesión -->
              <div class="text-center">
                <span class="register-text">¿Ya tienes cuenta? </span>
                <router-link to="/login" class="register-link">Inicia sesión aquí</router-link>
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
import { register } from '@/iam/auth.js'

const router = useRouter()
const formRef = ref(null)
const isVisible = ref(false)
const loading = ref(false)

const registerData = ref({
  username: '',
  password: '',
  confirmPassword: ''
})

// Animación al cargar
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

// Manejar el envío del formulario
const handleSubmit = async () => {
  if (registerData.value.password !== registerData.value.confirmPassword) {
    alert('Las contraseñas no coinciden')
    return
  }

  try {
    loading.value = true
    const payload = {
      username: registerData.value.username,
      password: registerData.value.password
    }

    const response = await register(payload)
    if (response.success) {
      alert('Usuario creado exitosamente')
      router.push('/login')
    } else {
      alert(`Error al crear usuario: ${response.error}`)
    }
  } catch (error) {
    console.error('Error al crear usuario:', error)
    alert('Error al crear usuario')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-container {
  background: var(--background-color);
  min-height: 70vh;
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
  margin-bottom: 30px;
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
</style>