<template>
  <Dialog
      :visible="visible"
      @update:visible="closeDialog"
      header="Crear Nuevo Lote"
      :modal="true"
      :closable="true"
      :style="{ width: '30vw', borderRadius: '15px' }"
      class="create-batch-dialog"
  >
    <div class="create-batch-content">
      <h2 class="dialog-title">Crear Nuevo Lote</h2>
      <form @submit.prevent="handleCreateBatch">
        <!-- Nombre del lote -->
        <div class="mb-3">
          <input
              v-model="batchData.nameBatch"
              type="text"
              class="form-control"
              placeholder="Nombre del lote"
              required
          />
        </div>

        <!-- URL del certificado -->
        <div class="mb-3">
          <input
              v-model="batchData.certificateUrl"
              type="text"
              class="form-control"
              placeholder="URL del certificado"
              required
          />
        </div>

        <!-- Botones -->
        <div class="dialog-footer">
          <button
              type="button"
              class="btn btn-secondary"
              @click="closeDialog"
          >
            Cancelar
          </button>
          <button
              type="submit"
              class="btn btn-primary"
              :disabled="loading"
          >
            <span v-if="loading">Creando...</span>
            <span v-else>Crear</span>
          </button>
        </div>
      </form>
    </div>
  </Dialog>
</template>

<script>
import { ref } from 'vue'
import Dialog from 'primevue/dialog'
import api from '@/services/api'

export default {
  components: { Dialog },
  props: {
    visible: {
      type: Boolean,
      required: true
    }
  },
  emits: ['update:visible', 'batchCreated'],
  setup(props, { emit }) {
    const batchData = ref({
      nameBatch: '',
      certificateUrl: ''
    })
    const loading = ref(false)

    const closeDialog = () => {
      emit('update:visible', false)
    }

    const handleCreateBatch = async () => {
      loading.value = true
      try {
        const userString = localStorage.getItem('verimed_user')
        if (userString) {
          const user = JSON.parse(userString)
          if (user.id) {
            const newBatch = {
              ...batchData.value,
              userId: user.id
            }
            const response = await api.createBatch(newBatch)
            emit('batchCreated', response.data)
            closeDialog()
          } else {
            console.error('No se encontró el ID del usuario.')
          }
        } else {
          console.error('No se encontró información del usuario en localStorage.')
        }
      } catch (error) {
        console.error('Error al crear el lote:', error)
      } finally {
        loading.value = false
      }
    }

    return {
      batchData,
      loading,
      closeDialog,
      handleCreateBatch
    }
  }
}
</script>

<style scoped>
.create-batch-content {
  background: var(--primary-color);
  padding: 40px;
  border-radius: 20px;
  color: var(--secondary-text-color);
  font-family: 'Funnel Sans', sans-serif;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.dialog-title {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 20px;
  text-align: center;
  color: var(--secondary-text-color);
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

.dialog-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.btn-primary {
  background-color: var(--secondary-color);
  border: none;
  border-radius: 25px;
  padding: 15px 30px;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: var(--secondary-hover-color);
  transform: translateY(-2px);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background-color: var(--tertiary-text-color);
  border: none;
  border-radius: 25px;
  padding: 15px 30px;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background-color: var(--secondary-hover-color);
  transform: translateY(-2px);
}
</style>