<template>
  <Dialog
      :visible="visible"
      @update:visible="closeDialog"
      header="Agregar Producto al Lote"
      :modal="true"
      :closable="true"
      :style="{ width: '40vw', borderRadius: '15px' }"
      class="add-product-dialog"
  >
    <div class="add-product-content">
      <h2 class="dialog-title">Agregar Producto</h2>
      <form @submit.prevent="handleAddProduct">
        <div class="row">
          <!-- Tipo de Producto -->
          <div class="col-md-6 mb-3">
            <label for="productTypeId" class="form-label">Tipo de Producto</label>
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

          <!-- Cantidad -->
          <div class="col-md-6 mb-3">
            <label for="quantity" class="form-label">Cantidad</label>
            <input
                v-model.number="productData.quantity"
                type="number"
                id="quantity"
                class="form-control"
                placeholder="Ingrese la cantidad"
                required
            />
          </div>
        </div>

        <div class="row">
          <!-- Nombre -->
          <div class="col-md-6 mb-3">
            <label for="name" class="form-label">Nombre</label>
            <input
                v-model="productData.name"
                type="text"
                id="name"
                class="form-control"
                placeholder="Nombre del producto"
                required
            />
          </div>

          <!-- Descripción -->
          <div class="col-md-6 mb-3">
            <label for="description" class="form-label">Descripción</label>
            <textarea
                v-model="productData.description"
                id="description"
                class="form-control"
                placeholder="Descripción del producto"
                rows="3"
                required
            ></textarea>
          </div>
        </div>

        <div class="row">
          <!-- Imagen -->
          <div class="col-md-6 mb-3">
            <label for="image" class="form-label">Imagen del Producto</label>
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

          <!-- Fecha de Fabricación -->
          <div class="col-md-6 mb-3">
            <label for="manufactureDate" class="form-label">Fecha de Fabricación</label>
            <input
                v-model="productData.manufactureDate"
                type="date"
                id="manufactureDate"
                class="form-control"
                required
            />
          </div>
        </div>

        <div class="row">
          <!-- Fecha de Expiración -->
          <div class="col-md-6 mb-3">
            <label for="expirationDate" class="form-label">Fecha de Expiración</label>
            <input
                v-model="productData.expirationDate"
                type="date"
                id="expirationDate"
                class="form-control"
                required
            />
          </div>

          <!-- Composición -->
          <div class="col-md-6 mb-3">
            <label for="composition" class="form-label">Composición</label>
            <textarea
                v-model="productData.composition"
                id="composition"
                class="form-control"
                placeholder="Composición del producto"
                rows="2"
                required
            ></textarea>
          </div>
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
            <span v-if="loading">Agregando...</span>
            <span v-else>Agregar Producto</span>
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
          productData.value.image = reader.result; // Base64 de la imagen
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
.add-product-content {
  background: var(--primary-color);
  padding: 40px;
  border-radius: 20px;
  color: var(--secondary-text-color);
  font-family: 'Funnel Sans', sans-serif;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}
.or-text {
  display: block;
  text-align: center;
  margin: 0.5rem 0;
  font-size: 0.875rem;
  color: #6b7280;
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