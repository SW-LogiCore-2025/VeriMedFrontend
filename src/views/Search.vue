<template>
  <div class="search-container">
    <h1 class="title">Mis Lotes</h1>
    <div v-if="batches.length || showAddCard" class="card-container">
      <!-- Tarjeta para agregar un nuevo lote -->
      <Card class="add-card" @click="showDialog = true">
        <template #title>
          <i class="pi pi-plus icon"></i>
        </template>
        <template #content>
          <p>Agregar nuevo lote</p>
        </template>
      </Card>

      <!-- Tarjetas de lotes -->
      <Card v-for="batch in sortedBatches" :key="batch.code" class="batch-card">
        <template #title>{{ batch.nameBatch }}</template>
        <template #content>
          <p><strong>Código:</strong> {{ batch.code }}</p>
          <p><strong>Nombre:</strong> {{ batch.name }}</p>
          <p><strong>Fecha de creación:</strong> {{ new Date(batch.createdAt).toLocaleDateString() }}</p>
        </template>
      </Card>
    </div>
    <p v-else class="no-batches">No hay lotes disponibles.</p>

    <!-- Diálogo para crear lote -->
    <CreateBatch v-bind:visible="showDialog" @update:visible="showDialog = $event" @batchCreated="addBatch" />
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import api from '@/services/api'
import CreateBatch from '@/components/CreateBatch.vue'

export default {
  components: { CreateBatch },
  setup() {
    const batches = ref([])
    const showAddCard = ref(true)
    const showDialog = ref(false)

    const addBatch = (newBatch) => {
      // Asegúrate de que todos los datos necesarios estén presentes
      const batchWithDefaults = {
        nameBatch: newBatch.nameBatch || 'Sin nombre', // Cambiado a nameBatch
        certificateUrl: newBatch.certificateUrl || 'Sin URL',
        userId: newBatch.userId || null,
        code: newBatch.code || 'Sin código',
        createdAt: newBatch.createdAt || new Date().toISOString(),
      };

      // Agregar el lote al inicio de la lista
      batches.value.unshift(batchWithDefaults);
    };

    const sortedBatches = computed(() => {
      return [...batches.value].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    })

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
      addBatch,
      sortedBatches
    }
  }
}
</script>

<style scoped>
.search-container {
  padding: 20px;
  font-family: 'Funnel Sans', sans-serif;
}

.title {
  text-align: center;
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--secondary-color);
  margin-bottom: 20px;
}

.card-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* 4 columnas */
  gap: 1.5rem; /* Espaciado entre tarjetas */
  padding: 1rem;
}

.batch-card, .add-card {
  background: #fff;
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  padding: 20px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
}

.batch-card:hover, .add-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
}

.icon {
  font-size: 2.5rem;
  color: var(--secondary-color);
}

.no-batches {
  text-align: center;
  font-size: 1.2rem;
  color: var(--tertiary-text-color);
  margin-top: 20px;
}
</style>