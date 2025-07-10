<template>
  <nav class="navbar navbar-expand-lg navbar-light fixed-top">
    <div class="container">
      <a class="navbar-brand d-flex align-items-center" href="#">
        <img src="https://res.cloudinary.com/drkelnilg/image/upload/v1752046529/imagen_2025-07-09_023451036-removebg-preview_eaavmj.png" alt="logo" style="min-width: 100px; max-width: 120px">
        <span class="navbar-title ms-3">VeriMed</span>
      </a>

      <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
              aria-expanded="false" aria-label="Toggle navigation">
        <span class="pi pi-bars"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
          <!-- Si el usuario está logueado -->
          <template v-if="isUserLoggedIn">
            <li class="nav-item">
              <router-link class="nav-link" to="/home">
                <i class="fas fa-home nav-icon"></i>
                <span>Inicio</span>
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/search">
                <i class="fas fa-cogs nav-icon"></i>
                <span>Gestión</span>
              </router-link>
            </li>
            <li class="nav-item user-info-container">
              <div class="user-info">
                <div class="user-avatar">
                  <i :class="userIcon"></i>
                </div>
                <div class="user-details">
                  <span class="username">{{ currentUser.username }}</span>
                  <span class="user-type">{{ getUserTypeLabel }}</span>
                </div>
              </div>
            </li>
            <li class="nav-item">
              <button class="btn-logout" @click="handleLogout">
                <i class="fas fa-sign-out-alt"></i>
                <span>Cerrar Sesión</span>
              </button>
            </li>
          </template>

          <!-- Si el usuario NO está logueado -->
          <template v-else>
            <li v-if="currentRouteName === 'login'" class="nav-item">
              <router-link class="nav-link register-btn" to="/register">
                <i class="fas fa-user-plus nav-icon"></i>
                <span>Registrarse</span>
              </router-link>
            </li>
            <li v-else-if="currentRouteName === 'register'" class="nav-item">
              <router-link class="nav-link login-btn" to="/login">
                <i class="fas fa-sign-in-alt nav-icon"></i>
                <span>Iniciar Sesión</span>
              </router-link>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { auth, logout } from '@/iam/auth.js'

const router = useRouter()
const route = useRoute()
const isUserLoggedIn = ref(false)
const currentUser = ref(null)

// Computed para el icono del usuario
const userIcon = computed(() => {
  if (!currentUser.value) return 'fas fa-user'
  return currentUser.value.type === 'laboratory' ? 'fas fa-industry' : 'fas fa-user-md'
})

// Computed para el label del tipo de usuario
const getUserTypeLabel = computed(() => {
  return 'Laboratorio Farmacéutico'
})

// Computed para obtener el nombre de la ruta actual
const currentRouteName = computed(() => route.name)

onMounted(() => {
  checkUserStatus()
})

const checkUserStatus = () => {
  isUserLoggedIn.value = auth.checkAuth()
  currentUser.value = auth.getUser()
}

const handleLogout = () => {
  logout()
  isUserLoggedIn.value = false
  currentUser.value = null
  router.push('/login')
}

// Escuchar cambios de ruta para actualizar estado
router.afterEach(() => {
  checkUserStatus()
})
</script>

<style scoped>
/* Variables CSS para consistencia */
:root {
  --navbar-height: 80px;
  --primary-color: #ffffff;
  --secondary-color: #2c5aa0;
  --secondary-hover-color: #1e3f73;
  --tertiary-text-color: #6c757d;
  --secondary-text-color: #2c5aa0;
  --accent-color: #f8f9fa;
  --shadow-light: 0 2px 10px rgba(0, 0, 0, 0.08);
  --shadow-medium: 0 4px 20px rgba(0, 0, 0, 0.12);
  --border-radius: 12px;
  --transition-smooth: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.navbar {
  background-color: var(--primary-color);
  box-shadow: var(--shadow-light);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  z-index: 1030;
  min-height: var(--navbar-height);
  padding: 0.75rem 0;
  transition: var(--transition-smooth);
}

.navbar:hover {
  box-shadow: var(--shadow-medium);
}

.container {
  max-width: 1200px;
  padding: 0 1rem;
}

/* Logo y Brand */
.navbar-brand {
  display: flex;
  align-items: center;
  text-decoration: none;
  transition: var(--transition-smooth);
}

.navbar-brand:hover {
  transform: translateY(-1px);
}

.navbar-brand img {
  max-height: 70px;
  object-fit: contain;
  height: auto;
  width: auto;
}

.navbar-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--secondary-text-color);
  font-family: 'Funnel Sans', sans-serif;
  letter-spacing: -0.5px;
  background: linear-gradient(135deg, var(--secondary-color), #4a90e2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Navegación */
.navbar-nav {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.nav-item {
  position: relative;
}

.nav-link {
  font-size: 16px;
  font-weight: 500;
  color: var(--secondary-text-color);
  background-color: transparent;
  border: none;
  cursor: pointer;
  position: relative;
  padding: 12px 20px;
  border-radius: var(--border-radius);
  transition: var(--transition-smooth);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  white-space: nowrap;
}

.nav-link:hover {
  color: var(--secondary-color);
  background-color: rgba(44, 90, 160, 0.08);
  transform: translateY(-2px);
}

.nav-link.router-link-active {
  color: var(--secondary-color);
  background-color: rgba(44, 90, 160, 0.1);
  font-weight: 600;
}

.nav-icon {
  font-size: 14px;
  opacity: 0.8;
}

/* Botones especiales */
.register-btn {
  background: linear-gradient(135deg, var(--secondary-color), #4a90e2);
  color: white !important;
  font-weight: 600;
  box-shadow: 0 4px 15px rgba(44, 90, 160, 0.3);
}

.register-btn:hover {
  background: linear-gradient(135deg, var(--secondary-hover-color), #2c5aa0);
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(44, 90, 160, 0.4);
}

.login-btn {
  border: 2px solid var(--secondary-color);
  color: var(--secondary-color) !important;
  font-weight: 600;
}

.login-btn:hover {
  background-color: var(--secondary-color);
  color: white !important;
}

/* Información del usuario */
.user-info-container {
  margin: 0 1rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 8px 16px;
  background-color: rgba(44, 90, 160, 0.05);
  border-radius: var(--border-radius);
  border: 1px solid rgba(44, 90, 160, 0.1);
  transition: var(--transition-smooth);
}

.user-info:hover {
  background-color: rgba(44, 90, 160, 0.08);
  transform: translateY(-1px);
}

.user-avatar {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, var(--secondary-color), #4a90e2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 16px;
  box-shadow: 0 2px 8px rgba(44, 90, 160, 0.3);
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.username {
  font-weight: 600;
  color: var(--secondary-color);
  font-size: 14px;
  line-height: 1.2;
}

.user-type {
  font-size: 12px;
  color: var(--tertiary-text-color);
  font-weight: 500;
  opacity: 0.8;
}

/* Botón de logout */
.btn-logout {
  background: none;
  border: 2px solid transparent;
  color: var(--tertiary-text-color);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  padding: 10px 16px;
  border-radius: var(--border-radius);
  transition: var(--transition-smooth);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-logout:hover {
  color: #dc3545;
  background-color: rgba(220, 53, 69, 0.08);
  border-color: rgba(220, 53, 69, 0.2);
  transform: translateY(-1px);
}

/* Responsive */
@media (max-width: 991.98px) {
  .navbar-nav {
    flex-direction: column;
    gap: 0.25rem;
    margin-top: 1rem;
  }

  .nav-link {
    width: 100%;
    justify-content: flex-start;
  }

  .user-info-container {
    margin: 0.5rem 0;
  }

  .user-info {
    width: 100%;
    justify-content: flex-start;
  }

  .btn-logout {
    width: 100%;
    justify-content: flex-start;
  }
}

@media (max-width: 575.98px) {
  .navbar-title {
    font-size: 1.5rem;
  }

  .logo-container {
    width: 45px;
    height: 45px;
  }

  .logo-container img {
    width: 28px;
    height: 28px;
  }
}

/* Animaciones adicionales */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.nav-item {
  animation: fadeInUp 0.5s ease-out;
}

.nav-item:nth-child(1) { animation-delay: 0.1s; }
.nav-item:nth-child(2) { animation-delay: 0.2s; }
.nav-item:nth-child(3) { animation-delay: 0.3s; }
.nav-item:nth-child(4) { animation-delay: 0.4s; }

/* Mejoras en el navbar toggler */
.navbar-toggler {
  border: none;
  padding: 8px 12px;
  border-radius: var(--border-radius);
  transition: var(--transition-smooth);
}

.navbar-toggler:hover {
  background-color: rgba(44, 90, 160, 0.08);
}

.navbar-toggler:focus {
  box-shadow: 0 0 0 3px rgba(44, 90, 160, 0.2);
}
</style>