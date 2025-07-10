<template>
  <div class="custom-navbar">
    <!-- Logo y marca -->
    <div class="navbar-start">
      <div class="navbar-brand" @click="router.push('/')">
        <img 
          src="https://res.cloudinary.com/drkelnilg/image/upload/v1752046529/imagen_2025-07-09_023451036-removebg-preview_eaavmj.png" 
          alt="VeriMed Logo" 
          class="logo-image"
        />
        <span class="brand-text">VeriMed</span>
      </div>
      
      <!-- Menú principal (solo si está logueado y no en auth pages) -->
      <div v-if="!isAuthPage && authStore.isLoggedIn" class="main-menu">
        <a href="#" @click.prevent="router.push('/home')" class="menu-link">
          <i class="pi pi-home"></i>
          Inicio
        </a>
        <a v-if="authStore.isLaboratory" href="#" @click.prevent="router.push('/search')" class="menu-link">
          <i class="pi pi-cog"></i>
          Gestión
        </a>
      </div>
    </div>

    <!-- Área derecha -->
    <div class="navbar-end">
      <!-- Si NO está logueado -->
      <template v-if="!authStore.isLoggedIn">
        <!-- En páginas de auth, mostrar botón contrario -->
        <template v-if="isAuthPage">
          <Button
            v-if="$route.path === '/login'"
            label="Registrarse"
            icon="pi pi-user-plus"
            class="auth-button outlined"
            @click="router.push('/register')"
          />
          <Button
            v-if="$route.path === '/register'"
            label="Iniciar Sesión"
            icon="pi pi-sign-in"
            class="auth-button primary"
            @click="router.push('/login')"
          />
        </template>
        
        <!-- En otras páginas, mostrar ambos botones -->
        <template v-else>
          <Button
            label="Iniciar Sesión"
            icon="pi pi-sign-in"
            class="auth-button text"
            @click="router.push('/login')"
          />
          <Button
            label="Registrarse"
            icon="pi pi-user-plus"
            class="auth-button primary"
            @click="router.push('/register')"
          />
        </template>
      </template>

      <!-- Si SÍ está logueado -->
      <template v-else>
        <div class="user-section">
          <!-- Avatar con menú -->
          <Menu ref="userMenu" :model="userMenuItems" :popup="true" class="user-dropdown" />
          <div class="user-info" @click="toggleUserMenu">
            <Avatar 
              :label="authStore.userInitials"
              shape="circle"
              size="normal"
              class="user-avatar"
            />
            <div class="user-details">
              <span class="user-name">{{ authStore.user?.name || authStore.user?.username }}</span>
              <span class="user-role">{{ userRoleText }}</span>
            </div>
            <i class="pi pi-chevron-down user-chevron"></i>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/iam/auth.js'
import { useToast } from 'primevue/usetoast'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const toast = useToast()
const userMenu = ref()

// SINCRONIZAR ESTADO AL MONTAR EL COMPONENTE
onMounted(() => {
  console.log('🔄 Navbar montado - Sincronizando estado de auth...')
  authStore.syncWithAuth()
  console.log('📊 Estado actual:', {
    isLoggedIn: authStore.isLoggedIn,
    user: authStore.user
  })
})

// OBSERVAR CAMBIOS EN LA RUTA PARA RE-SINCRONIZAR
watch(() => route.path, () => {
  console.log('🔄 Cambio de ruta - Re-sincronizando auth...')
  authStore.syncWithAuth()
}, { immediate: true })

// OBSERVAR CAMBIOS EN EL ESTADO DE AUTH
watch(() => authStore.isLoggedIn, (newValue) => {
  console.log('🔄 Estado de login cambió:', newValue)
}, { immediate: true })

// Detectar si estamos en página de autenticación
const isAuthPage = computed(() => {
  return route.path === '/login' || route.path === '/register'
})

// Texto del rol del usuario
const userRoleText = computed(() => {
  if (authStore.isLaboratory) return 'Laboratorio'
  if (authStore.isPatient) return 'Paciente'
  return 'Usuario'
})

// Items del menú de usuario
const userMenuItems = ref([
  {
    label: 'Mi Perfil',
    icon: 'pi pi-user',
    command: () => router.push('/profile')
  },
  {
    label: 'Configuración',
    icon: 'pi pi-cog',
    command: () => toast.add({
      severity: 'info',
      summary: 'Próximamente',
      detail: 'Esta función estará disponible pronto'
    })
  },
  {
    separator: true
  },
  {
    label: 'Cerrar Sesión',
    icon: 'pi pi-sign-out',
    command: handleLogout
  }
])

// Toggle del menú de usuario
const toggleUserMenu = (event) => {
  userMenu.value.toggle(event)
}

// Manejar logout
function handleLogout() {
  console.log('🚪 Cerrando sesión...')
  authStore.logout()
  
  toast.add({
    severity: 'success',
    summary: 'Sesión cerrada',
    detail: 'Has cerrado sesión exitosamente',
    life: 3000
  })
  
  router.push('/login')
}
</script>

<style scoped>
.custom-navbar {
  background: linear-gradient(135deg, #203459 0%, #2c4a6b 100%);
  padding: 0 var(--spacing-lg);
  height: var(--navbar-height);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(10px);
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.custom-navbar::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.05);
  pointer-events: none;
}

/* Lado izquierdo */
.navbar-start {
  display: flex;
  align-items: center;
  gap: var(--spacing-xl);
  z-index: 10;
  position: relative;
}

/* Brand */
.navbar-brand {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  cursor: pointer;
  transition: var(--transition);
}

.navbar-brand:hover {
  transform: translateY(-1px);
}

.logo-image {
  width: 50px;
  height: 50px;
  object-fit: contain;
  filter: brightness(0) invert(1);
  drop-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
}

.brand-text {
  font-family: 'Funnel Sans', sans-serif;
  font-size: 1.8rem;
  font-weight: 800;
  color: var(--text-white);
  background: linear-gradient(135deg, #ffffff 0%, #a4bdec 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 2px 10px rgba(255, 255, 255, 0.3);
}

/* Menú principal */
.main-menu {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.menu-link {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  color: var(--text-white);
  text-decoration: none;
  font-weight: 500;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius);
  transition: var(--transition);
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.menu-link:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
  color: var(--text-white);
  text-decoration: none;
}

/* Lado derecho */
.navbar-end {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  z-index: 10;
  position: relative;
}

/* Botones de autenticación */
.auth-button {
  font-weight: 500 !important;
  transition: all 0.3s ease !important;
  border-radius: var(--border-radius) !important;
  padding: 0.6rem 1.2rem !important;
  font-size: 0.9rem !important;
  border: none !important;
}

.auth-button.primary {
  background: linear-gradient(135deg, #6c8ac3 0%, #4f46e5 100%) !important;
  color: white !important;
  box-shadow: 0 2px 10px rgba(108, 138, 195, 0.3) !important;
}

.auth-button.primary:hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 4px 15px rgba(108, 138, 195, 0.5) !important;
  background: linear-gradient(135deg, #5a75b0 0%, #4338ca 100%) !important;
}

.auth-button.outlined {
  background: transparent !important;
  border: 2px solid rgba(255, 255, 255, 0.3) !important;
  color: var(--text-white) !important;
  backdrop-filter: blur(10px) !important;
  box-shadow: 0 2px 10px rgba(255, 255, 255, 0.1) !important;
}

.auth-button.outlined:hover {
  background: rgba(255, 255, 255, 0.1) !important;
  border-color: rgba(255, 255, 255, 0.5) !important;
  box-shadow: 0 4px 15px rgba(255, 255, 255, 0.2) !important;
  transform: translateY(-2px) !important;
}

.auth-button.text {
  color: var(--text-white) !important;
  background: rgba(255, 255, 255, 0.05) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  backdrop-filter: blur(10px) !important;
}

.auth-button.text:hover {
  background: rgba(255, 255, 255, 0.1) !important;
  border-color: rgba(255, 255, 255, 0.2) !important;
  transform: translateY(-1px) !important;
}

/* Sección de usuario */
.user-section {
  position: relative;
}

.user-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: var(--transition);
  color: var(--text-white);
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.user-info:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
}

.user-avatar {
  background: linear-gradient(135deg, #6c8ac3 0%, #4f46e5 100%) !important;
  color: white !important;
  font-weight: 600;
  box-shadow: 0 2px 10px rgba(108, 138, 195, 0.3);
}

.user-details {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.user-name {
  font-weight: 600;
  font-size: 0.9rem;
  line-height: 1.2;
}

.user-role {
  font-size: 0.75rem;
  opacity: 0.8;
  line-height: 1;
}

.user-chevron {
  font-size: 0.75rem;
  opacity: 0.7;
  transition: var(--transition);
}

.user-info:hover .user-chevron {
  opacity: 1;
  transform: translateY(1px);
}

/* Menu flotante de usuario */
:deep(.user-dropdown) {
  background: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(20px) !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  border-radius: var(--border-radius-lg) !important;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2) !important;
  margin-top: var(--spacing-xs);
}

:deep(.user-dropdown .p-menuitem-link) {
  color: var(--text-primary) !important;
  padding: var(--spacing-sm) var(--spacing-md) !important;
  transition: var(--transition);
}

:deep(.user-dropdown .p-menuitem-link:hover) {
  background: rgba(108, 138, 195, 0.1) !important;
  color: var(--primary-color) !important;
}

:deep(.user-dropdown .p-separator) {
  margin: var(--spacing-xs) 0;
  border-color: rgba(0, 0, 0, 0.1) !important;
}

/* Responsive */
@media (max-width: 768px) {
  .custom-navbar {
    padding: 0 var(--spacing-sm);
  }
  
  .brand-text {
    font-size: 1.5rem;
  }
  
  .logo-image {
    width: 40px;
    height: 40px;
  }
  
  .user-details {
    display: none;
  }
  
  .main-menu {
    display: none;
  }
  
  .auth-button {
    font-size: 0.85rem !important;
    padding: 0.5rem 1rem !important;
  }
}

@media (max-width: 480px) {
  .navbar-end {
    gap: var(--spacing-xs);
  }
  
  .auth-button .p-button-label {
    display: none;
  }
  
  .auth-button {
    padding: 0.5rem !important;
    min-width: 40px;
  }
}
</style>