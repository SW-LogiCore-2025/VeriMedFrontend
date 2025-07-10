<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import Card from 'primevue/card';
import Toast from 'primevue/toast';
import { getUser } from '@/iam/auth.js';
import api from '@/services/api.js'; // Importar el servicio de API

const router = useRouter();
const toast = useToast();

// Estado local
const currentUser = ref(null);
const contractName = ref(''); // Variable para el nombre del contrato

// Actualizar usuario al montar
onMounted(() => {
  currentUser.value = getUser();
  fetchContractName(); // Llamar a la función para obtener el nombre del contrato
});

// Computeds
const isLaboratory = computed(() => {
  return currentUser.value?.type === 'factory' || currentUser.value?.role === 'factory';
});

const userName = computed(() => {
  if (!currentUser.value) return '';
  return currentUser.value.name || currentUser.value.username;
});

const welcomeMessage = computed(() => {
  if (isLaboratory.value) {
    return 'Registra tus productos en la blockchain y gestiona lotes NFT';
  } else {
    return 'Verifica la autenticidad de productos usando blockchain';
  }
});

// Métodos
const fetchContractName = async () => {
  try {
    const response = await api.getContractName();
    contractName.value = response.data || 'Blockchain'; // Asignar el texto recibido
  } catch (error) {
    console.error('Error al obtener el nombre del contrato:', error);
    contractName.value = 'Blockchain'; // Valor por defecto en caso de error
  }
};

const showLabInfo = () => {
  toast.add({
    severity: 'info',
    summary: 'Analíticas NFT',
    detail: 'Panel de métricas de productos y lotes estará disponible próximamente',
    life: 4000,
  });
};
</script>

<template>
  <div class="dashboard">
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
          <div class="welcome-badge">
            <i class="pi pi-verified"></i>
            <span>NFT Seguro</span>
          </div>
        </div>
      </div>

      <!-- Cards de acciones principales -->
      <div class="actions-section">
        <div class="actions-grid">
          <!-- Para Fábricas -->
          <template v-if="isLaboratory">
            <Card class="action-card primary" @click="router.push('/search')">
              <template #content>
                <div class="card-content">
                  <div class="card-icon">
                    <i class="pi pi-cog"></i>
                  </div>
                  <h3 class="card-title">Registrar Productos</h3>
                  <p class="card-description">Crea NFTs de productos y organiza en lotes</p>
                </div>
              </template>
            </Card>

            <Card class="action-card secondary" @click="showLabInfo">
              <template #content>
                <div class="card-content">
                  <div class="card-icon">
                    <i class="pi pi-chart-line"></i>
                  </div>
                  <h3 class="card-title">Analíticas NFT</h3>
                  <p class="card-description">Métricas de productos y lotes registrados</p>
                </div>
              </template>
            </Card>
          </template>

          <!-- Para Consumidores -->
          <template v-else>
            <Card class="action-card primary" @click="router.push('/search')">
              <template #content>
                <div class="card-content">
                  <div class="card-icon">
                    <i class="pi pi-qrcode"></i>
                  </div>
                  <h3 class="card-title">Verificar Producto</h3>
                  <p class="card-description">Escanea códigos QR y verifica NFTs</p>
                </div>
              </template>
            </Card>
          </template>
        </div>
      </div>

      <!-- Información del sistema -->
      <div class="info-section">
        <Card class="info-card">
          <template #content>
            <div class="info-content">
              <div class="info-header">
                <div class="info-icon">
                  <i class="pi pi-shield"></i>
                </div>
                <div class="info-text">
                  <h3>{{ contractName }}</h3> <!-- Mostrar el nombre del contrato -->
                  <p>Registro de productos industriales con NFT y blockchain</p>
                </div>
              </div>
              <div class="info-features">
                <div class="feature-item">
                  <i class="pi pi-check-circle"></i>
                  <span>Cada producto es un NFT único</span>
                </div>
                <div class="feature-item">
                  <i class="pi pi-check-circle"></i>
                  <span>Lotes organizados en blockchain</span>
                </div>
                <div class="feature-item">
                  <i class="pi pi-check-circle"></i>
                  <span>Verificación inmutable</span>
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

<style scoped>
.dashboard {
  min-height: 100vh;
  padding: 2rem 0;
  background: #f8fafc;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Welcome Section */
.welcome-section {
  margin-bottom: 3rem;
}

.welcome-card {
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
  border-radius: 16px;
  padding: 2.5rem;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 10px 25px rgba(30, 58, 138, 0.2);
}

.welcome-content {
  flex: 1;
}

.welcome-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  color: white;
}

.welcome-subtitle {
  font-size: 1.125rem;
  margin: 0;
  opacity: 0.9;
}

.welcome-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.15);
  padding: 1rem 1.5rem;
  border-radius: 12px;
  backdrop-filter: blur(10px);
  font-weight: 600;
}

.welcome-badge i {
  font-size: 1.25rem;
}

/* Actions Section */
.actions-section {
  margin-bottom: 3rem;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.action-card {
  cursor: pointer;
  transition: all 0.3s ease;
  border: none !important;
  border-radius: 16px !important;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05) !important;
  overflow: hidden;
}

.action-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1) !important;
}

.action-card.primary {
  background: linear-gradient(135deg, #059669 0%, #10b981 100%) !important;
}

.action-card.secondary {
  background: white !important;
  border: 1px solid #e5e7eb !important;
}

.card-content {
  padding: 2rem;
  text-align: center;
}

.action-card.primary .card-content {
  color: white;
}

.card-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem auto;
  font-size: 1.5rem;
}

.action-card.primary .card-icon {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.action-card.secondary .card-icon {
  background: #f3f4f6;
  color: #059669;
}

.card-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 0.75rem 0;
}

.action-card.secondary .card-title {
  color: #1f2937;
}

.card-description {
  margin: 0;
  font-size: 1rem;
  line-height: 1.5;
}

.action-card.primary .card-description {
  opacity: 0.9;
}

.action-card.secondary .card-description {
  color: #6b7280;
}

/* Info Section */
.info-section {
  margin-bottom: 2rem;
}

.info-card {
  border: none !important;
  background: white !important;
  border-radius: 16px !important;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05) !important;
}

.info-content {
  padding: 2rem;
}

.info-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.info-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #1e3a8a, #3b82f6);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.25rem;
  flex-shrink: 0;
}

.info-text h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 0.25rem 0;
}

.info-text p {
  color: #6b7280;
  margin: 0;
  font-size: 1rem;
}

.info-features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
  font-size: 0.875rem;
}

.feature-item i {
  color: #10b981;
  font-size: 1rem;
}

/* Responsive */
@media (max-width: 768px) {
  .welcome-card {
    flex-direction: column;
    gap: 1.5rem;
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
  .container {
    padding: 0 1rem;
  }

  .welcome-title {
    font-size: 1.75rem;
  }

  .dashboard {
    padding: 1rem 0;
  }
}

/* Animaciones suaves */
.welcome-card {
  animation: slideDown 0.6s ease-out;
}

.action-card {
  animation: fadeUp 0.8s ease-out both;
}

.action-card:nth-child(1) { animation-delay: 0.1s; }
.action-card:nth-child(2) { animation-delay: 0.2s; }

.info-card {
  animation: fadeUp 0.8s ease-out 0.3s both;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>