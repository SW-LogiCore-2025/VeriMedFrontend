<template>
  <Dialog
      :visible="visible"
      @update:visible="closeDialog"
      header="Agregar Producto al Lote"
      :modal="true"
      :closable="true"
      :style="{ width: '40vw', borderRadius: '15px', overflow: 'hidden' }"
      class="add-product-dialog"
      :showHeader="false"
      :contentStyle="{ padding: '0', boxShadow: 'none', border: 'none' }"
  >
    <div class="add-product-content">
      <!-- Encabezado -->
      <div class="dialog-header">
        <h2 class="dialog-title">Agregar Producto al Lote</h2>
        <button @click="closeDialog" class="close-btn">
          <i class="pi pi-times"></i>
        </button>
      </div>
      
      <!-- Formulario -->
      <form @submit.prevent="handleAddProduct" class="product-form">
        <div class="form-group">
          <label for="productTypeId" class="form-label">
            <i class="pi pi-box"></i> Tipo de Producto
          </label>
          <select
              v-model="productData.productTypeId"
              id="productTypeId"
              class="form-control"
              required
          >
            <option value="" disabled>Seleccione un tipo de producto</option>
            <option v-for="type in productTypes" :key="type.id" :value="type.id">
              {{ type.name }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label for="quantity" class="form-label">
            <i class="pi pi-hashtag"></i> Cantidad
          </label>
          <input
              v-model.number="productData.quantity"
              type="number"
              id="quantity"
              class="form-control"
              placeholder="Ingrese la cantidad"
              required
          />
        </div>

        <div class="form-group">
          <label for="name" class="form-label">
            <i class="pi pi-tag"></i> Nombre
          </label>
          <input
              v-model="productData.name"
              type="text"
              id="name"
              class="form-control"
              placeholder="Nombre del producto"
              required
          />
        </div>

        <div class="form-group">
          <label for="description" class="form-label">
            <i class="pi pi-align-left"></i> Descripción
          </label>
          <textarea
              v-model="productData.description"
              id="description"
              class="form-control"
              placeholder="Descripción del producto"
              rows="3"
              required
          ></textarea>
        </div>

        <div class="form-group">
          <label for="image" class="form-label">
            <i class="pi pi-image"></i> Imagen del Producto
          </label>
          <input
              type="file"
              id="imageFile"
              class="form-control"
              @change="handleImageUpload"
          />
          <span class="or-text">o</span>
          <input
              v-model="productData.image"
              type="text"
              id="imageUrl"
              class="form-control"
              placeholder="URL de la imagen"
          />
        </div>

        <div class="form-group">
          <label for="manufactureDate" class="form-label">
            <i class="pi pi-calendar"></i> Fecha de Fabricación
          </label>
          <input
              v-model="productData.manufactureDate"
              type="date"
              id="manufactureDate"
              class="form-control"
              required
          />
        </div>

        <div class="form-group">
          <label for="expirationDate" class="form-label">
            <i class="pi pi-calendar-times"></i> Fecha de Expiración
          </label>
          <input
              v-model="productData.expirationDate"
              type="date"
              id="expirationDate"
              class="form-control"
              required
          />
        </div>

        <div class="form-group">
          <label for="composition" class="form-label">
            <i class="pi pi-list"></i> Composición
          </label>
          <textarea
              v-model="productData.composition"
              id="composition"
              class="form-control"
              placeholder="Composición del producto"
              rows="2"
              required
          ></textarea>
        </div>

        <!-- Botones -->
        <div class="form-actions">
          <button
              type="button"
              class="btn-cancel"
              @click="closeDialog"
          >
            <i class="pi pi-times"></i>
            Cancelar
          </button>
          <button
              type="submit"
              class="btn-create"
              :disabled="loading"
          >
            <i class="pi pi-check"></i>
            <span v-if="loading">Agregando...</span>
            <span v-else>Agregar</span>
          </button>
        </div>
      </form>
    </div>
  </Dialog>
</template>

<script>
import { ref } from 'vue';
import Dialog from 'primevue/dialog';
import api from '@/services/api';

export default {
  components: { Dialog },
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    batchCode: {
      type: String,
      required: true,
    },
  },
  emits: ['update:visible', 'productAdded'],
  setup(props, { emit }) {
    const productData = ref({
      productTypeId: null,
      quantity: null,
      name: '',
      description: '',
      image: '',
      manufactureDate: '',
      expirationDate: '',
      composition: '',
    });
    const productTypes = ref([]);
    const loading = ref(false);

    const closeDialog = () => {
      emit('update:visible', false);
    };

    const loadProductTypes = async () => {
      try {
        const response = await api.getProductTypes();
        productTypes.value = response.data;
      } catch (error) {
        console.error('Error al cargar los tipos de producto:', error);
      }
    };

    const handleImageUpload = (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          productData.value.image = reader.result;
        };
        reader.readAsDataURL(file);
      }
    };

    const handleAddProduct = async () => {
      loading.value = true;
      try {
        const newProduct = {
          ...productData.value,
          batchCode: props.batchCode,
        };
        const response = await api.createProduct(newProduct);
        emit('productAdded', response.data);
        closeDialog();
      } catch (error) {
        console.error('Error al agregar el producto:', error);
      } finally {
        loading.value = false;
      }
    };

    loadProductTypes();

    return {
      productData,
      productTypes,
      loading,
      closeDialog,
      handleAddProduct,
      handleImageUpload,
    };
  },
};
</script>

<style scoped>
.add-product-dialog {
  overflow: hidden;
}

.add-product-content {
  background: #203459;
  color: #ffffff;
  overflow: hidden;
}

.dialog-header {
  background: #203459;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.dialog-title {
  color: white;
  font-size: 1.25rem;
  font-weight: 500;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 1.25rem;
  cursor: pointer;
  opacity: 0.8;
  transition: opacity 0.2s;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  opacity: 1;
}

.product-form {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: white;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.form-control {
  width: 100%;
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  color: white;
  padding: 0.75rem 1rem;
  font-size: 0.9rem;
  transition: background-color 0.2s, border-color 0.2s;
}

.form-control::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.form-control:focus {
  background-color: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
  outline: none;
}

.or-text {
  display: block;
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
  margin: 0.5rem 0;
  font-size: 0.8rem;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 1.5rem;
}

.btn-cancel, 
.btn-create {
  flex: 1;
  padding: 0.75rem 1rem;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  cursor: pointer;
  height: 48px;
  transition: background-color 0.2s;
  border: none;
}

.btn-cancel {
  background-color: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
}

.btn-cancel:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.btn-create {
  background-color: #5E72E4;
  color: white;
}

.btn-create:hover:not(:disabled) {
  background-color: #4c61d7;
}

.btn-create:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Responsive */
@media (max-width: 768px) {
  .add-product-content {
    max-width: 100%;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .btn-cancel, 
  .btn-create {
    width: 100%;
  }
}
</style>