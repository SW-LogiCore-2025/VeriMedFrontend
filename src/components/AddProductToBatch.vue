<script setup>
import { ref, computed } from 'vue'
import api from "@/services/api.js"
import { MESSAGES } from '@/constants/messages.js'

const newProduct = ref({
  productTypeId: null,
  quantity: null,
  expirationDate: ''
})

const productTypes = ref([])
const currentBatch = ref(null)

const loadProductTypes = async () => {
  try {
    const response = await api.getProductTypes()
    productTypes.value = response.data
  } catch (error) {
    console.error('Error loading product types:', error)
    throw error
  }
}

const createProduct = async () => {
  if (!currentBatch.value) {
    alert(MESSAGES.NO_BATCH_SELECTED)
    return
  }

  if (!newProduct.value.productTypeId || !newProduct.value.quantity) {
    alert(MESSAGES.MISSING_FIELDS)
    return
  }

  try {
    const productData = {
      batchCode: currentBatch.value.code,
      productTypeId: newProduct.value.productTypeId,
      quantity: newProduct.value.quantity
    }

    await api.createProduct(productData)
    newProduct.value = { productTypeId: null, quantity: null, expirationDate: '' }
    alert(MESSAGES.PRODUCT_ADDED)
  } catch (error) {
    console.error('Error creating product:', error)
    alert(MESSAGES.ERROR_CREATING_PRODUCT)
  }
}
</script>

<template>
  <section class="section-container">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">Agregar Producto al Batch</h2>
        <p class="section-description">Añade productos específicos al batch seleccionado</p>
      </div>

      <div class="form-container">
        <form @submit.prevent="createProduct" class="modern-form">
          <div class="form-group">
            <label for="productTypeId" class="modern-label"><i class="fas fa-pills"></i>Tipo de producto</label>
            <select v-model="newProduct.productTypeId" id="productTypeId" class="modern-select" required>
              <option value="" disabled>Seleccione un tipo de producto</option>
              <option v-for="type in productTypes" :key="type.id" :value="type.id">
                {{ type.name }} - {{ type.manufacturer }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label for="quantity" class="modern-label"><i class="fas fa-sort-numeric-up"></i>Cantidad</label>
            <input v-model.number="newProduct.quantity" type="number" id="quantity" class="modern-input" placeholder="Ingrese la cantidad" required/>
          </div>
          <div class="form-submit">
            <button type="submit" class="btn-primary-custom">
              <i class="fas fa-plus"></i>Agregar Producto al Batch
            </button>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>