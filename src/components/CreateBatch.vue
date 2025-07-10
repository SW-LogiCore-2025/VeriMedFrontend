<template>
  <Dialog
    :visible="visible"
    @update:visible="closeDialog"
    :modal="true"
    :closable="true"
    :style="{ width: '450px', maxWidth: '95vw', borderRadius: '16px', overflow: 'hidden' }"
    class="create-batch-dialog"
    :showHeader="false"
    :draggable="false"
    :dismissableMask="true"
    :contentStyle="{ padding: '0', boxShadow: 'none', border: 'none' }"
  >
    <div class="batch-form-container">
      <!-- Encabezado con título y botón cerrar -->
      <div class="batch-form-header">
        <h2 class="batch-form-title">Crear Nuevo Lote</h2>
        <button @click="closeDialog" class="close-btn">
          <i class="pi pi-times"></i>
        </button>
      </div>

      <!-- Formulario -->
      <form @submit.prevent="handleCreateBatch" class="batch-form">
        <!-- Nombre del lote -->
        <div class="form-field">
          <label for="nameBatch" class="field-label">
            <i class="pi pi-box"></i>
            Nombre del lote
          </label>
          <InputText
            id="nameBatch"
            v-model="batchData.nameBatch"
            placeholder="Nombre descriptivo del lote"
            class="batch-input"
            :class="{'error-input': submitted && !batchData.nameBatch}"
            required
          />
          <small v-if="submitted && !batchData.nameBatch" class="error-text">
            El nombre del lote es obligatorio
          </small>
        </div>

        <!-- URL del certificado -->
        <div class="form-field">
          <label for="certificateUrl" class="field-label">
            <i class="pi pi-link"></i>
            URL del certificado
          </label>
          <InputText
            id="certificateUrl"
            v-model="batchData.certificateUrl"
            placeholder="https://ejemplo.com/certificado.pdf"
            class="batch-input"
            :class="{'error-input': submitted && !batchData.certificateUrl}"
            required
          />
          <small v-if="submitted && !batchData.certificateUrl" class="error-text">
            La URL del certificado es obligatoria
          </small>
        </div>

        <!-- Botones de acción -->
        <div class="form-actions">
          <Button
            type="button"
            label="Cancelar"
            icon="pi pi-times"
            class="cancel-button"
            @click="closeDialog"
            :disabled="loading"
          />
          <Button
            type="submit"
            label="Crear"
            icon="pi pi-check"
            class="submit-button"
            :loading="loading"
          />
        </div>
      </form>
    </div>
  </Dialog>
</template>

<script>
import { ref } from 'vue'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import { useToast } from 'primevue/usetoast'
import api from '@/services/api'
import { MESSAGES } from '@/constants/messages'

export default {
  name: 'CreateBatch',
  components: { 
    Dialog,
    Button,
    InputText
  },
  props: {
    visible: {
      type: Boolean,
      required: true
    }
  },
  emits: ['update:visible', 'batchCreated'],
  
  setup(props, { emit }) {
    const toast = useToast();
    
    const batchData = ref({
      nameBatch: '',
      certificateUrl: ''
    });
    
    const loading = ref(false);
    const submitted = ref(false);

    const closeDialog = () => {
      emit('update:visible', false);
      
      // Resetear el formulario después de un breve retraso
      setTimeout(() => {
        batchData.value = {
          nameBatch: '',
          certificateUrl: ''
        };
        submitted.value = false;
      }, 200);
    };

    const handleCreateBatch = async () => {
      submitted.value = true;
      
      // Validación simple
      if (!batchData.value.nameBatch || !batchData.value.certificateUrl) {
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: MESSAGES.MISSING_FIELDS,
          life: 3000
        });
        return;
      }
      
      loading.value = true;
      
      try {
        const userString = localStorage.getItem('verimed_user');
        if (!userString) {
          throw new Error('No se encontró información del usuario');
        }
        
        const user = JSON.parse(userString);
        if (!user.id) {
          throw new Error('ID de usuario no encontrado');
        }
        
        const newBatch = {
          ...batchData.value,
          userId: user.id
        };
        
        const response = await api.createBatch(newBatch);
        
        toast.add({
          severity: 'success',
          summary: 'Éxito',
          detail: MESSAGES.BATCH_CREATED,
          life: 3000
        });
        
        emit('batchCreated', response.data);
        closeDialog();
      } catch (error) {
        console.error('Error al crear el lote:', error);
        
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message || MESSAGES.ERROR_CREATING_BATCH,
          life: 5000
        });
      } finally {
        loading.value = false;
      }
    };

    return {
      batchData,
      loading,
      submitted,
      closeDialog,
      handleCreateBatch
    };
  }
};
</script>

<style scoped>
.create-batch-dialog {
  overflow: hidden;
}

.batch-form-container {
  background: linear-gradient(135deg, #203459 0%, #2c4a6b 100%);
  color: #ffffff;
  border-radius: 16px;
  overflow: hidden;
}

.batch-form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.batch-form-title {
  font-family: 'Funnel Sans', sans-serif;
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0;
  background: linear-gradient(135deg, #ffffff 0%, #a4bdec 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.close-btn {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: rotate(90deg);
}

.batch-form {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.field-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
}

.batch-input {
  background: rgba(255, 255, 255, 0.1) !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  border-radius: 8px !important;
  color: white !important;
  padding: 0.75rem 1rem !important;
  font-size: 1rem !important;
  transition: all 0.3s ease;
  width: 100%;
}

.batch-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.batch-input:focus {
  background: rgba(255, 255, 255, 0.15) !important;
  border-color: #6c8ac3 !important;
  box-shadow: 0 0 0 2px rgba(108, 138, 195, 0.3) !important;
}

.error-input {
  border-color: #ff6b6b !important;
  background: rgba(255, 107, 107, 0.1) !important;
}

.error-text {
  color: #ff9a9a;
  font-size: 0.8rem;
  margin-top: 0.25rem;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 1rem;
}

.cancel-button {
  background: rgba(255, 255, 255, 0.15) !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  color: white !important;
  flex: 1;
  transition: all 0.3s ease;
  padding: 0.85rem 1rem !important;
  height: 48px !important;
}

.cancel-button:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.25) !important;
  transform: translateY(-2px);
}

.submit-button {
  background: linear-gradient(135deg, #6c8ac3 0%, #4f46e5 100%) !important;
  border: none !important;
  flex: 1;
  transition: all 0.3s ease;
  padding: 0.85rem 1rem !important;
  height: 48px !important;
}

.submit-button:disabled,
.cancel-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

/* Adapta el diálogo para dispositivos móviles */
@media (max-width: 480px) {
  .batch-form-header {
    padding: 1rem 1.5rem;
  }
  
  .batch-form-title {
    font-size: 1.5rem;
  }
  
  .batch-form {
    padding: 1.5rem;
    gap: 1.25rem;
  }
}

/* Animación de entrada */
:deep(.p-dialog-enter-active) {
  animation: dialogIn 0.3s ease-out;
}

:deep(.p-dialog-leave-active) {
  animation: dialogOut 0.2s ease-in;
}

@keyframes dialogIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes dialogOut {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-20px);
  }
}
</style>