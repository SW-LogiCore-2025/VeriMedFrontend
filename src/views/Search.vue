<template>
  <div class="search-container">
    <div class="header">
      <h1 class="title">Gestión de lotes de medicamentos</h1>
      <div class="search-section">
        <button class="search-btn" @click="toggleSearch">
          <i class="pi pi-search"></i>
        </button>
        <div v-if="showSearch" class="search-container-input">
          <input
              type="text"
              v-model="searchTerm"
              placeholder="Buscar por código o nombre..."
              class="search-input"
              @input="filterBatches"
          />
          <button class="clear-search-btn" @click="clearSearch" v-if="searchTerm">
            <i class="pi pi-times"></i>
          </button>
        </div>
      </div>
    </div>

    <div v-if="batches.length || showAddCard" class="card-container">
      <!-- Tarjeta para agregar un nuevo lote -->
      <div class="add-card" @click="showDialog = true">
        <div class="add-icon">
          <i class="pi pi-plus"></i>
        </div>
        <p class="add-text">Agregar nuevo lote</p>
      </div>

      <!-- Tarjetas de lotes -->
      <div
          v-for="batch in filteredBatches"
          :key="batch.code"
          class="batch-card"
      >
        <div class="batch-header">
          <h3 class="batch-name">{{ batch.nameBatch }}</h3>
          <div class="batch-code">{{ batch.code }}</div>
        </div>
        <div class="batch-content">
          <div class="batch-info">
            <span class="label">Nombre:</span>
            <span class="value">{{ batch.name }}</span>
          </div>
          <div class="batch-info">
            <span class="label">Fecha de creación:</span>
            <span class="value">{{ new Date(batch.createdAt).toLocaleDateString() }}</span>
          </div>
          <button
              class="view-details-btn"
              @click.stop="goToListProducts(batch.code)"
          >
            Ver Lote
          </button>
        </div>
      </div>
    </div>

    <div v-else class="no-batches">
      <i class="pi pi-box no-batches-icon"></i>
      <p class="no-batches-text">No hay lotes disponibles</p>
      <p class="no-batches-subtitle">Crea tu primer lote para comenzar</p>
    </div>

    <!-- Diálogo para crear lote -->
    <CreateBatch v-bind:visible="showDialog" @update:visible="showDialog = $event" @batchCreated="addBatch" />
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'
import CreateBatch from '@/components/CreateBatch.vue'

export default {
  components: { CreateBatch },
  setup() {
    const router = useRouter()
    const batches = ref([])
    const showAddCard = ref(true)
    const showDialog = ref(false)
    const showSearch = ref(false)
    const searchTerm = ref('')

    const addBatch = (newBatch) => {
      const batchWithDefaults = {
        nameBatch: newBatch.nameBatch || 'Sin nombre',
        certificateUrl: newBatch.certificateUrl || 'Sin URL',
        userId: newBatch.userId || null,
        code: newBatch.code || 'Sin código',
        createdAt: newBatch.createdAt || new Date().toISOString(),
      }
      batches.value.unshift(batchWithDefaults)
    }

    const goToListProducts = (batchCode) => {
      router.push({ path: '/list-products', query: { code: batchCode } });
    };

    const sortedBatches = computed(() => {
      return [...batches.value].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    })

    const filteredBatches = computed(() => {
      if (!searchTerm.value) {
        return sortedBatches.value
      }

      const term = searchTerm.value.toLowerCase()
      return sortedBatches.value.filter(batch =>
          batch.code.toLowerCase().includes(term) ||
          batch.nameBatch.toLowerCase().includes(term) ||
          batch.name.toLowerCase().includes(term)
      )
    })

    const toggleSearch = () => {
      showSearch.value = !showSearch.value
      if (!showSearch.value) {
        searchTerm.value = ''
      }
    }

    const clearSearch = () => {
      searchTerm.value = ''
    }

    const filterBatches = () => {
      // La función filteredBatches se ejecuta automáticamente debido a la reactividad
    }

    onMounted(async () => {
      try {
        const userString = localStorage.getItem('verimed_user')
        if (userString) {
          const user = JSON.parse(userString)
          if (user.id) {
            const response = await api.getBatchesByUser(user.id)
            batches.value = response.data
          }
        }
      } catch (error) {
        console.error('Error al obtener los lotes:', error)
      }
    })

    return {
      batches,
      showAddCard,
      showDialog,
      showSearch,
      searchTerm,
      addBatch,
      goToListProducts,
      sortedBatches,
      filteredBatches,
      toggleSearch,
      clearSearch,
      filterBatches
    }
  }
}
</script>

<style scoped>
.search-container {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.header {
  display: flex;
  justify-content: space-between; /* Para alinear el título y el ícono */
  align-items: center; /* Centra verticalmente los elementos */
  margin-bottom: 3rem;
}

.title {
  font-size: 2.5rem;
  font-weight: 300;
  color: #2c3e50;
  margin: 0;
  letter-spacing: -0.5px;
}

.search-section {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.search-btn {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 0.75rem;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1rem;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-btn:hover {
  background: #2563eb;
}

.search-container-input {
  position: relative;
  width: 100%;
  max-width: 400px;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  box-sizing: border-box;
}

.search-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.clear-search-btn {
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
}

.clear-search-btn:hover {
  background: #f1f5f9;
  color: #1e293b;
}

.card-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  padding: 0;
}

.add-card {
  background: #ffffff;
  border: 2px dashed #cbd5e1;
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #64748b;
}

.add-card:hover {
  border-color: #3b82f6;
  background: #f8fafc;
}

.add-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
}

.add-icon i {
  font-size: 1.5rem;
  color: #3b82f6;
}

.add-text {
  font-size: 1rem;
  font-weight: 500;
  margin: 0;
}

.batch-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.5rem;
  cursor: pointer;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.batch-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-color: #3b82f6;
}

.batch-header {
  margin-bottom: 1.5rem;
}

.batch-name {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 0.5rem 0;
}

.batch-code {
  background: #f1f5f9;
  color: #475569;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
  display: inline-block;
  font-family: 'Courier New', monospace;
}

.batch-content {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.batch-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.label {
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 500;
}

.value {
  font-size: 1rem;
  color: #1e293b;
  font-weight: 400;
}

.no-batches {
  text-align: center;
  padding: 4rem 2rem;
  color: #64748b;
}

.no-batches-icon {
  font-size: 4rem;
  color: #cbd5e1;
  margin-bottom: 1rem;
}

.no-batches-text {
  font-size: 1.25rem;
  font-weight: 500;
  margin: 0 0 0.5rem 0;
  color: #475569;
}

.no-batches-subtitle {
  font-size: 1rem;
  margin: 0;
  color: #64748b;
}

.view-details-btn {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  margin-top: auto;
  width: 100%;
}

.view-details-btn:hover {
  background: #2563eb;
}

/* Responsive */
@media (max-width: 768px) {
  .search-container {
    padding: 1rem;
  }

  .title {
    font-size: 2rem;
  }

  .card-container {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .add-card,
  .batch-card {
    min-height: 150px;
  }
}

@media (max-width: 480px) {
  .header {
    margin-bottom: 2rem;
  }

  .title {
    font-size: 1.75rem;
  }

  .add-card,
  .batch-card {
    padding: 1rem;
  }
}
</style>