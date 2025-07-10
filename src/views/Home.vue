<template>
  <div class="home-dashboard">
    <div class="container">
      <!-- Header de bienvenida -->
      <div class="welcome-section">
        <div class="welcome-card">
          <div class="welcome-content">
            <h1 class="welcome-title">
              ¡Bienvenido{{ userName ? `, ${userName}` : '' }}!
            </h1>
            <p class="welcome-subtitle">{{ welcomeMessage }}</p>
          </div>
          <div class="welcome-stats">
            <div class="stat-item">
              <div class="stat-icon">
                <i class="pi pi-shield"></i>
              </div>
              <div class="stat-text">
                <span class="stat-number">100%</span>
                <span class="stat-label">Seguro</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Cards de acciones principales -->
      <div class="main-actions">
        <div class="actions-grid">
          <!-- Para Laboratorios -->
          <template v-if="isLaboratory">
            <Card class="action-card primary" @click="router.push('/search')">
              <template #content>
                <div class="card-content">
                  <div class="card-icon lab">
                    <i class="pi pi-cog"></i>
                  </div>
                  <h3 class="card-title">Gestionar Lotes</h3>
                  <p class="card-description">Administra y crea lotes de medicamentos</p>
                  <div class="card-arrow">
                    <i class="pi pi-arrow-right"></i>
                  </div>
                </div>
              </template>
            </Card>
            
            <Card class="action-card secondary" @click="showLabInfo">
              <template #content>
                <div class="card-content">
                  <div class="card-icon stats">
                    <i class="pi pi-chart-line"></i>
                  </div>
                  <h3 class="card-title">Estadísticas</h3>
                  <p class="card-description">Ver métricas de tus lotes</p>
                  <div class="card-arrow">
                    <i class="pi pi-arrow-right"></i>
                  </div>
                </div>
              </template>
            </Card>
          </template>

          <!-- Para Pacientes -->
          <template v-else>
            <Card class="action-card primary" @click="router.push('/search')">
              <template #content>
                <div class="card-content">
                  <div class="card-icon verify">
                    <i class="pi pi-qrcode"></i>
                  </div>
                  <h3 class="card-title">Verificar Medicamento</h3>
                  <p class="card-description">Escanea o busca medicamentos</p>
                  <div class="card-arrow">
                    <i class="pi pi-arrow-right"></i>
                  </div>
                </div>
              </template>
            </Card>
          </template>
        </div>
      </div>

      <!-- Información del sistema -->
      <div class="system-info">
        <Card class="info-card">
          <template #content>
            <div class="info-content">
              <div class="info-header">
                <div class="info-icon-main">
                  <i class="pi pi-shield"></i>
                </div>
                <div class="info-text">
                  <h3>Sistema VeriMed</h3>
                  <p>Verificación farmacéutica con tecnología blockchain</p>
                </div>
              </div>
              <div class="info-features">
                <div class="feature-item">
                  <i class="pi pi-check-circle"></i>
                  <span>Trazabilidad completa</span>
                </div>
                <div class="feature-item">
                  <i class="pi pi-check-circle"></i>
                  <span>Verificación instantánea</span>
                </div>
                <div class="feature-item">
                  <i class="pi pi-check-circle"></i>
                  <span>Blockchain inmutable</span>
                </div>
              </div>
            </div>
          </template>
        </Card>
      </div>
    </div>

    <!-- Toast para notificaciones -->
    <Toast />
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { getUser, isLaboratory as checkLab } from '@/iam/auth.js'
import { useToast } from 'primevue/usetoast'

const router = useRouter()
const toast = useToast()

// Estado local
const currentUser = ref(null)

// Actualizar usuario al montar
onMounted(() => {
  currentUser.value = getUser()
})

// Computeds
const isLaboratory = computed(() => {
  return currentUser.value?.type === 'laboratory' || currentUser.value?.role === 'laboratory'
})

const userName = computed(() => {
  if (!currentUser.value) return ''
  return currentUser.value.name || currentUser.value.username
})

const welcomeMessage = computed(() => {
  if (isLaboratory.value) {
    return 'Gestiona tus lotes de medicamentos de forma segura'
  } else {
    return 'Verifica la autenticidad de tus medicamentos'
  }
})

// Methods
const showLabInfo = () => {
  toast.add({
    severity: 'info',
    summary: 'Estadísticas',
    detail: 'Panel de estadísticas estará disponible próximamente',
    life: 4000
  })
}

const showPatientInfo = () => {
  toast.add({
    severity: 'info',
    summary: 'Mis Verificaciones',
    detail: 'Historial de verificaciones estará disponible próximamente',
    life: 4000
  })
}
</script>

<style scoped>
.home-dashboard {
  min-height: calc(100vh - var(--navbar-height));
  padding: var(--spacing-lg) 0;
  background: var(--bg-primary);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-md);
}

/* Welcome Section */
.welcome-section {
  margin-bottom: var(--spacing-xl);
}

.welcome-card {
  background: linear-gradient(135deg, #203459 0%, #2c4a6b 100%);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-xl);
  color: var(--text-white);
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: var(--shadow-lg);
  position: relative;
  overflow: hidden;
}

.welcome-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  pointer-events: none;
}

.welcome-content {
  z-index: 2;
  position: relative;
}

.welcome-title {
  font-family: 'Funnel Sans', sans-serif;
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 var(--spacing-sm) 0;
  background: linear-gradient(135deg, #ffffff 0%, #a4bdec 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.welcome-subtitle {
  font-size: 1.1rem;
  opacity: 0.9;
  margin: 0;
}

.welcome-stats {
  z-index: 2;
  position: relative;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  background: rgba(255, 255, 255, 0.1);
  padding: var(--spacing-md);
  border-radius: var(--border-radius);
  backdrop-filter: blur(10px);
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6c8ac3 0%, #4f46e5 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
}

.stat-text {
  display: flex;
  flex-direction: column;
}

.stat-number {
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1;
}

.stat-label {
  font-size: 0.9rem;
  opacity: 0.8;
}

/* Main Actions */
.main-actions {
  margin-bottom: var(--spacing-xl);
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: var(--spacing-lg);
}

.action-card {
  cursor: pointer;
  transition: var(--transition);
  border: none !important;
  border-radius: var(--border-radius-lg) !important;
  box-shadow: var(--shadow-sm) !important;
  overflow: hidden;
}

.action-card.primary {
  background: linear-gradient(135deg, #6c8ac3 0%, #4f46e5 100%) !important;
}

.action-card.secondary {
  background: var(--bg-card) !important;
}

.action-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-lg) !important;
}

.action-card.primary:hover {
  box-shadow: 0 12px 30px rgba(108, 138, 195, 0.4) !important;
}

.card-content {
  padding: var(--spacing-xl);
  position: relative;
}

.action-card.primary .card-content {
  color: white;
}

.card-icon {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--spacing-md);
  font-size: 2rem;
  color: white;
}

.action-card.primary .card-icon {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
}

.action-card.secondary .card-icon.stats {
  background: linear-gradient(135deg, #10b981, #059669);
}

.action-card.secondary .card-icon.info {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
}

.card-title {
  font-family: 'Funnel Sans', sans-serif;
  font-size: 1.4rem;
  font-weight: 600;
  margin: 0 0 var(--spacing-xs) 0;
}

.action-card.secondary .card-title {
  color: var(--primary-color);
}

.card-description {
  margin: 0 0 var(--spacing-md) 0;
  font-size: 1rem;
  line-height: 1.5;
}

.action-card.primary .card-description {
  opacity: 0.9;
}

.action-card.secondary .card-description {
  color: var(--text-secondary);
}

.card-arrow {
  position: absolute;
  bottom: var(--spacing-md);
  right: var(--spacing-md);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition);
}

.action-card.primary .card-arrow {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.action-card.secondary .card-arrow {
  background: var(--bg-secondary);
  color: var(--primary-color);
}

.action-card:hover .card-arrow {
  transform: translateX(5px);
}

/* System Info */
.system-info {
  margin-bottom: var(--spacing-lg);
}

.info-card {
  border: none !important;
  background: var(--bg-card) !important;
  border-radius: var(--border-radius-lg) !important;
}

.info-content {
  padding: var(--spacing-lg);
}

.info-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.info-icon-main {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6c8ac3, #4f46e5);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  flex-shrink: 0;
}

.info-text h3 {
  font-family: 'Funnel Sans', sans-serif;
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--primary-color);
  margin: 0 0 var(--spacing-xs) 0;
}

.info-text p {
  color: var(--text-secondary);
  margin: 0;
  font-size: 1rem;
}

.info-features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-md);
}

.feature-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  color: var(--text-secondary);
  font-size: 0.95rem;
}

.feature-item i {
  color: #10b981;
  font-size: 1rem;
}

/* Responsive */
@media (max-width: 768px) {
  .welcome-card {
    flex-direction: column;
    gap: var(--spacing-lg);
    text-align: center;
  }
  
  .welcome-title {
    font-size: 2rem;
  }
  
  .actions-grid {
    grid-template-columns: 1fr;
  }
  
  .info-header {
    flex-direction: column;
    text-align: center;
  }
  
  .info-features {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .welcome-title {
    font-size: 1.8rem;
  }
  
  .actions-grid {
    grid-template-columns: 1fr;
  }
}

/* Animaciones */
.welcome-card {
  animation: slideInDown 0.6s ease-out;
}

.action-card {
  animation: fadeInUp 0.8s ease-out both;
}

.action-card:nth-child(1) { animation-delay: 0.1s; }
.action-card:nth-child(2) { animation-delay: 0.2s; }

.info-card {
  animation: fadeInUp 0.8s ease-out 0.3s both;
}

@keyframes slideInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>