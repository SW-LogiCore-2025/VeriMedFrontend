<template>
  <Menubar :model="menuItems" class="custom-menubar">
    <!-- Logo y marca -->
    <template #start>
      <div class="navbar-brand" @click="router.push('/')">
        <img 
          src="https://res.cloudinary.com/drkelnilg/image/upload/v1752046529/imagen_2025-07-09_023451036-removebg-preview_eaavmj.png" 
          alt="VeriMed Logo" 
          class="logo-image"
        />
        <span class="brand-text">VeriMed</span>
      </div>
    </template>

    <!-- Área derecha -->
    <template #end>
      <div class="navbar-end">
        <!-- Si NO está logueado -->
        <template v-if="!authStore.isLoggedIn">
          <!-- En páginas de auth, mostrar botón contrario -->
          <template v-if="isAuthPage">
            <Button
              v-if="$route.path === '/login'"
              label="Registrarse"
              icon="pi pi-user-plus"
              outlined
              class="auth-button outlined"
              @click="router.push('/register')"
            />
            <Button
              v-if="$route.path === '/register'"
              label="Iniciar Sesión"
              icon="pi pi-sign-in"
              class="auth-button"
              @click="router.push('/login')"
            />
          </template>
          
          <!-- En otras páginas, mostrar ambos botones -->
          <template v-else>
            <Button
              label="Iniciar Sesión"
              icon="pi pi-sign-in"
              text
              class="auth-button-text"
              @click="router.push('/login')"
            />
            <Button
              label="Registrarse"
              icon="pi pi-user-plus"
              class="auth-button"
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
    </template>
  </Menubar>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/iam/auth.js'
import { useToast } from 'primevue/usetoast'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const toast = useToast()
const userMenu = ref()

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

// Items del menú principal (solo se muestran si está logueado y no está en auth pages)
const menuItems = computed(() => {
  if (!authStore.isLoggedIn || isAuthPage.value) return []
  
  return [
    {
      label: 'Inicio',
      icon: 'pi pi-home',
      command: () => router.push('/home')
    },
    {
      label: 'Gestión',
      icon: 'pi pi-cog',
      command: () => router.push('/search'),
      visible: authStore.isLaboratory // Solo para laboratorios
    }
  ].filter(item => item.visible !== false)
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
  authStore.logout() // Usa tu sistema IAM + actualiza store
  
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
/* Menubar personalizado */
.custom-menubar {
  background: linear-gradient(135deg, #203459 0%, #2c4a6b 100%) !important;
  border: none !important;
  border-radius: 0 !important;
  padding: 0 var(--spacing-lg) !important;
  height: var(--navbar-height);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(10px);
  position: relative;
}

.custom-menubar::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.05);
  pointer-events: none;
}

/* Brand */
.navbar-brand {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  cursor: pointer;
  transition: var(--transition);
  z-index: 10;
  position: relative;
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

/* Área derecha */
.navbar-end {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  z-index: 10;
  position: relative;
}

/* Botones de autenticación */
:deep(.auth-button) {
  background: linear-gradient(135deg, #6c8ac3 0%, #4f46e5 100%) !important;
  border: none !important;
  color: white !important;
  font-weight: 500 !important;
  transition: var(--transition) !important;
  border-radius: var(--border-radius) !important;
  box-shadow: 0 2px 10px rgba(108, 138, 195, 0.3) !important;
  padding: 0.5rem 1rem !important;
  font-size: 0.9rem !important;
}

:deep(.auth-button:hover) {
  transform: translateY(-2px) !important;
  box-shadow: 0 4px 15px rgba(108, 138, 195, 0.5) !important;
  background: linear-gradient(135deg, #5a75b0 0%, #4338ca 100%) !important;
}

:deep(.auth-button.outlined) {
  background: transparent !important;
  border: 2px solid rgba(255, 255, 255, 0.3) !important;
  color: var(--text-white) !important;
  backdrop-filter: blur(10px) !important;
  box-shadow: 0 2px 10px rgba(255, 255, 255, 0.1) !important;
}

:deep(.auth-button.outlined:hover) {
  background: rgba(255, 255, 255, 0.1) !important;
  border-color: rgba(255, 255, 255, 0.5) !important;
  box-shadow: 0 4px 15px rgba(255, 255, 255, 0.2) !important;
}

:deep(.auth-button-text) {
  color: var(--text-white) !important;
  font-weight: 500 !important;
  backdrop-filter: blur(10px) !important;
  border-radius: var(--border-radius) !important;
  padding: 0.5rem 1rem !important;
  font-size: 0.9rem !important;
  background: rgba(255, 255, 255, 0.05) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
}

:deep(.auth-button-text:hover) {
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

/* Override PrimeVue menubar styles */
:deep(.p-menubar) {
  background: transparent !important;
  border: none !important;
  padding: 0 !important;
  display: flex !important;
  justify-content: space-between !important;
  align-items: center !important;
  width: 100% !important;
}

:deep(.p-menubar .p-menubar-root-list) {
  background: transparent !important;
  margin: 0 !important;
  padding: 0 !important;
}

:deep(.p-menubar .p-menubar-start) {
  display: flex !important;
  align-items: center !important;
}

:deep(.p-menubar .p-menubar-end) {
  display: flex !important;
  align-items: center !important;
  margin-left: auto !important;
}

:deep(.p-menubar .p-menuitem-link) {
  color: var(--text-white) !important;
  font-weight: 500;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius);
  transition: var(--transition);
  backdrop-filter: blur(10px);
}

:deep(.p-menubar .p-menuitem-link:hover) {
  background: rgba(255, 255, 255, 0.1) !important;
  color: var(--text-white) !important;
  transform: translateY(-1px);
}

:deep(.p-menubar .p-menuitem-icon) {
  margin-right: var(--spacing-xs);
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
  backdrop-filter: none;
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
  .custom-menubar {
    padding: 0 var(--spacing-sm) !important;
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
  
  .auth-button {
    font-size: 0.85rem;
    padding: var(--spacing-xs) var(--spacing-sm) !important;
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
    padding: var(--spacing-xs) !important;
    min-width: 40px;
  }
}
</style>