<template>
  <nav class="navbar navbar-expand-lg navbar-light fixed-top">
    <div class="container">
      <a class="navbar-brand d-flex align-items-center" href="#">
        <img src="https://res.cloudinary.com/drkelnilg/image/upload/v1752046529/imagen_2025-07-09_023451036-removebg-preview_eaavmj.png" alt="logo" style="min-width: 100px; max-width: 120px">
        <span class="navbar-title ms-2">VeriMed</span>
      </a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
              aria-label="Toggle navigation">
        <span class="pi pi-bars"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link class="nav-link mx-3" to="/">Inicio</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link mx-3" to="/search">Gestion</router-link>
          </li>

          <!-- Si NO está logueado -->
          <template v-if="!isUserLoggedIn">
            <li class="nav-item">
              <router-link class="nav-link mx-3" to="/login">Iniciar Sesión</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link mx-3 register-btn" to="/register">Registrarse</router-link>
            </li>
          </template>

          <!-- Si SÍ está logueado -->
          <template v-else>
            <li class="nav-item">
              <span class="nav-link mx-3 user-info">
                <i :class="userIcon"></i>
                {{ currentUser.name || currentUser.username }}
              </span>
            </li>
            <li class="nav-item">
              <router-link class="nav-link mx-3" to="/profile">Mi Perfil</router-link>
            </li>
            <li class="nav-item">
              <button class="nav-link mx-3 btn-logout" @click="handleLogout">
                <i class="fas fa-sign-out-alt"></i>
                Cerrar Sesión
              </button>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { auth, logout } from '@/iam/auth.js'

const router = useRouter()
const isUserLoggedIn = ref(false)
const currentUser = ref(null)

// Computed para el icono del usuario
const userIcon = computed(() => {
  if (!currentUser.value) return 'fas fa-user'
  return currentUser.value.type === 'laboratory' ? 'fas fa-industry' : 'fas fa-user-md'
})

onMounted(() => {
  checkUserStatus()
})

const checkUserStatus = () => {
  isUserLoggedIn.value = auth.checkAuth()
  currentUser.value = auth.getUser()

  if (isUserLoggedIn.value) {
    console.log('👤 Usuario logueado:', currentUser.value.username)
  }
}

const handleLogout = () => {
  console.log('🚪 Cerrando sesión...')
  logout()
  isUserLoggedIn.value = false
  currentUser.value = null
  router.push('/')
  console.log('✅ Sesión cerrada')
}

// Escuchar cambios de ruta para actualizar estado
router.afterEach(() => {
  checkUserStatus()
})
</script>

<style scoped>
/* Mantén todos tus estilos existentes y agrega estos: */
.navbar-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--secondary-text-color);
  font-family: 'Funnel Sans', sans-serif;
}
.navbar {
  background-color: var(--primary-color, #ffffff);
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  z-index: 1030;
  min-height: var(--navbar-height); /* Mantener la altura del toolbar */
}

.navbar-brand img {
  max-height: 70px; /* Limita la altura máxima de la imagen */
  object-fit: contain; /* Asegura que la imagen mantenga sus proporciones */
  height: auto; /* Ajusta automáticamente la altura */
  width: auto; /* Ajusta automáticamente el ancho */
}

.nav-link {
  font-size: 18px;
  font-weight: 400;
  color: var(--secondary-text-color);
  background-color: transparent;
  border: none;
  cursor: pointer;
  position: relative;
  margin: 0 10px;
  padding: 10px 12px;
  letter-spacing: 0.8px;
}

.nav-link::after {
  content: "";
  position: absolute;
  width: 0;
  height: 3px;
  background-color: var(--secondary-text-color);
  bottom: 0;
  left: 0;
  transition: width 0.1s ease-in;
}

.nav-link:hover::after {
  width: 100%;
}

.nav-link:hover {
  color: var(--secondary-text-color);
}

.nav-link.active::after {
  width: 100%;
}

.register-btn {
  background-color: var(--secondary-color);
  border-radius: 20px;
  transition: all 0.3s ease;
}

.register-btn::after {
  display: none;
}

.register-btn:hover {
  background-color: var(--secondary-hover-color);
  transform: translateY(-2px);
}

/* Nuevos estilos para usuario logueado */
.user-info {
  color: var(--secondary-color) !important;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-logout {
  background: none;
  border: none;
  color: var(--tertiary-text-color);
  font-size: 16px;
  font-weight: 400;
  cursor: pointer;
  padding: 10px 12px;
  letter-spacing: 0.8px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-logout:hover {
  color: var(--secondary-text-color);
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
}
</style>