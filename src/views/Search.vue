<script setup>
import { ref, onMounted } from 'vue'
import api from "@/services/api.js";

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
  <div class="p-6 max-w-4xl mx-auto">
    <h1 class="text-2xl font-bold mb-4">Gestión de Productos</h1>

    <!-- Buscar productos -->
    <form @submit.prevent="fetchProducts" class="mb-6 space-y-4 bg-white shadow p-4 rounded-xl">
      <h2 class="text-xl font-semibold">Buscar Producto</h2>
      <div>
        <label class="block mb-1 font-medium">Código del producto</label>
        <input v-model="searchCode" type="text" class="w-full border px-4 py-2 rounded" required />
      </div>
      <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Buscar</button>
    </form>

    <!-- Resultados -->
    <div v-if="products.length" class="mb-6">
      <h2 class="text-xl font-semibold mb-2">Resultados</h2>
      <ul class="space-y-2">
        <li v-for="product in products" :key="product.id" class="p-4 border rounded shadow">
          <p><strong>ID:</strong> {{ product.id }}</p>
          <p><strong>Serial:</strong> {{ product.serialNumber }}</p>
          <p><strong>Nombre:</strong> {{ product.name.code }}</p>
          <p><strong>Fabricante:</strong> {{ product.manufacturer }}</p>
        </li>
      </ul>
    </div>

    <!-- Registrar producto -->
    <form @submit.prevent="registerProduct" class="space-y-4 bg-white shadow p-4 rounded-xl">
      <h2 class="text-xl font-semibold">Registrar Producto</h2>
      <div>
        <label class="block mb-1 font-medium">Código del lote</label>
        <input v-model="newProduct.batchCode" type="text" class="w-full border px-4 py-2 rounded" required />
      </div>
      <div>
        <label class="block mb-1 font-medium">Tipo de producto</label>
        <select v-model="newProduct.productTypeId" class="w-full border px-4 py-2 rounded" required>
          <option value="" disabled>Seleccione un tipo de producto</option>
          <option v-for="type in productTypes" :key="type.id" :value="type.id">
            {{ type.name }} - {{ type.manufacturer }}
          </option>
        </select>
      </div>

      <div>
        <label class="block mb-1 font-medium">Cantidad</label>
        <input v-model.number="newProduct.quantity" type="number" class="w-full border px-4 py-2 rounded" required />
      </div>
      <button type="submit" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Registrar</button>
    </form>
  </div>
</template>
