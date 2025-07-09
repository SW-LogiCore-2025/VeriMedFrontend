<script setup>
import { ref } from 'vue'
import api from "@/services/api.js"
import { MESSAGES } from '@/constants/messages.js'

const newProductType = ref({
  name: '',
  manufacturer: '',
})

const productTypes = ref([])

const loadProductTypes = async () => {
  try {
    const response = await api.getProductTypes()
    productTypes.value = response.data
  } catch (error) {
    console.error('Error loading product types:', error)
    throw error
  }
}

const createProductType = async () => {
  if (!newProductType.value.name || !newProductType.value.manufacturer) {
    alert(MESSAGES.MISSING_FIELDS)
    return
  }

  try {
    await api.createProductType(newProductType.value)
    alert(MESSAGES.PRODUCT_TYPE_CREATED)
    newProductType.value = { name: '', manufacturer: '' }
    await loadProductTypes()
  } catch (error) {
    console.error('Error creating product type:', error)
    alert(MESSAGES.ERROR_CREATING_PRODUCT_TYPE)
  }
}
</script>

<template>
  <section class="section-container">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">Crear Tipo de Producto</h2>
        <p class="section-description">Define los tipos de medicamentos que serán incluidos en los batches</p>
      </div>

      <div class="form-container">
        <form @submit.prevent="createProductType" class="modern-form">
          <div class="form-group">
            <label for="typeName" class="modern-label"><i class="fas fa-pills"></i>Nombre del tipo de producto</label>
            <input v-model="newProductType.name" type="text" id="typeName" class="modern-input" placeholder="Ej: Paracetamol 500mg" required/>
          </div>
          <div class="form-group">
            <label for="manufacturer" class="modern-label"><i class="fas fa-industry"></i>Fabricante</label>
            <input v-model="newProductType.manufacturer" type="text" id="manufacturer" class="modern-input" placeholder="Ej: Laboratorios ABC" required/>
          </div>
          <div class="form-submit">
            <button type="submit" class="btn-primary-custom">
              <i class="fas fa-plus-circle"></i>Crear Tipo de Producto</button>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Colores principales */
:root {
  --primary-color: #6C8AC3;
  --primary-color-hover: #5A75B0;
  --secondary-color: #FFFFFF;
  --text-color: #333333;
  --text-color-light: #FFFFFF;
}


.btn-primary-custom {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 5px;
  background-color: var(--primary-color);
  color: var(--text-color-light);
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.btn-primary-custom:hover {
  background-color: var(--primary-color-hover);
  transform: translateY(-2px);
}

.btn-primary-custom.active {
  background-color: var(--primary-color-hover);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
}


/* Títulos */
.section-title {
  font-size: 24px;
  font-weight: bold;
  color: var(--primary-color);
  text-align: center;
  margin-bottom: 1rem;
}

.section-description {
  font-size: 16px;
  color: var(--text-color);
  text-align: center;
  margin-bottom: 2rem;
}

/* Formularios */
.form-container {
  max-width: 600px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 1.5rem;
}

.modern-label {
  display: block;
  font-size: 14px;
  font-weight: bold;
  color: var(--text-color);
  margin-bottom: 0.5rem;
}

.modern-input,
.modern-select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
  color: var(--text-color);
}

.modern-input:focus,
.modern-select:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 4px rgba(108, 138, 195, 0.5);
}

.btn-primary-custom[type="submit"] {
  width: 100%;
  background-color: var(--primary-color);
  color: var(--text-color-light);
  font-size: 16px;
  font-weight: bold;
  padding: 0.75rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-primary-custom[type="submit"]:hover {
  background-color: var(--primary-color-hover);
}
</style>