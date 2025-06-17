<script setup>
import { ref, onMounted } from 'vue'
import api from "@/services/api.js";
import SearchProductLayout from "@/components/layout/SearchProductLayout.vue";
import SearchBtnComponent from "@/components/ui/SearchBtnComponent.vue";

const searchCode = ref('')
const products = ref([])
const productTypes = ref([])

onMounted(async () => {
  try {
    const response = await api.getProductTypes()
    productTypes.value = response.data
  } catch (error) {
    console.error('Error al cargar tipos de producto:', error)
    alert('No se pudo cargar la lista de tipos de producto')
  }
})

const newProduct = ref({
  batchCode: '',
  productTypeId: null,
  quantity: null
})

const fetchProducts = async () => {
  try {
    const response = await api.getProductsByCode(searchCode.value)
    products.value = response.data
  } catch (err) {
    console.error('Error al buscar productos:', err)
    alert('Error al buscar productos')
  }
}

const registerProduct = async () => {
  try {
    await api.registerProduct(newProduct.value)
    alert('Producto registrado exitosamente')
    newProduct.value = { batchCode: '', productTypeId: null, quantity: null }
  } catch (err) {
    console.error('Error al registrar producto:', err)
    alert('Error al registrar producto')
  }
}
</script>

<template>
  <section class="search-product d-flex justify-content-center">
    <div class="container">
      <div class="row my-5">
        <h2 class="text-center mb-4">Buscar Producto</h2>
        <div class="container" style="max-width: 1000px">
          <form @submit.prevent="fetchProducts" class="bg-white shadow p-4 rounded">
            <div class="mb-3">
              <label for="searchCode" class="form-label">Código del producto</label>
              <input v-model="searchCode" type="text" id="searchCode" class="form-control" required />
            </div>
            <div class="text-center">
              <SearchBtnComponent />
            </div>
          </form>
        </div>

        <!-- Results -->
        <div v-if="products.length" class="mt-4">
          <h2 class="h5 mb-3">Resultados</h2>
          <ul class="list-group">
            <li v-for="product in products" :key="product.id" class="list-group-item">
              <p><strong>ID:</strong> {{ product.id }}</p>
              <p><strong>Serial:</strong> {{ product.serialNumber }}</p>
              <p><strong>Nombre:</strong> {{ product.name.code }}</p>
              <p><strong>Fabricante:</strong> {{ product.manufacturer }}</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>

  <section class="register-product d-flex justify-content-center">
    <div class="container">
      <div class="row my-5">
        <h2 class="text-center mb-4">Registrar Producto</h2>
        <div class="container" style="max-width: 1000px">
          <form @submit.prevent="registerProduct" class="bg-white shadow p-4 rounded">
            <div class="mb-3">
              <label for="batchCode" class="form-label">Código del lote</label>
              <input v-model="newProduct.batchCode" type="text" id="batchCode" class="form-control" required />
            </div>
            <div class="mb-3">
              <label for="productTypeId" class="form-label">Tipo de producto</label>
              <select v-model="newProduct.productTypeId" id="productTypeId" class="form-select" required>
                <option value="" disabled>Seleccione un tipo de producto</option>
                <option v-for="type in productTypes" :key="type.id" :value="type.id">
                  {{ type.name }} - {{ type.manufacturer }}
                </option>
              </select>
            </div>
            <div class="mb-3">
              <label for="quantity" class="form-label">Cantidad</label>
              <input v-model.number="newProduct.quantity" type="number" id="quantity" class="form-control" required />
            </div>
            <SearchBtnComponent button-text="Register" class="text-center"/>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.search-product {
  background: var(--background-color);
  margin-top: 150px;
}
.register-product {
  background: var(--background-color);
}

h2 {
  color: var(--text-color);
  font-family: 'Funnel Sans', sans-serif;
  font-weight: 800;
  font-size: clamp(2rem, 5vw, 3rem);
}
label {
  color: var(--text-color);
  font-family: 'Albert Sans', sans-serif;
  font-size: 1.2rem;
  font-weight: 600;
  letter-spacing: 0.1px;
}
</style>
