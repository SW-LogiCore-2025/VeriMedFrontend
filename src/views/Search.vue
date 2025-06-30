<script setup>
import { ref, onMounted, computed } from 'vue'
import api from "@/services/api.js"
import SearchProductLayout from "@/components/layout/SearchProductLayout.vue"
import SearchBtnComponent from "@/components/ui/SearchBtnComponent.vue"
import { useBatches } from '@/composables/useBatches.js'
import { useProductGroups } from '@/composables/useProductGroups.js'
import { MESSAGES } from '@/constants/messages.js'

// Composables
const {
  batches,
  currentBatch,
  loadAllBatches,
  loadProductsForBatch,
  selectBatch,
  clearCurrentBatch
} = useBatches()

const { groupProductsByNameAndManufacturer } = useProductGroups()

// State
const productTypes = ref([])

const newProductType = ref({
  name: '',
  manufacturer: '',
})

const newBatch = ref({
  nameBatch: '',
  certificateUrl: ''
})

const newProduct = ref({
  productTypeId: null,
  quantity: null,
  expirationDate: ''
})

// Computed
const currentBatchGroupedProducts = computed(() => {
  return groupProductsByNameAndManufacturer(currentBatch.value?.products)
})

// Methods
const loadProductTypes = async () => {
  try {
    const response = await api.getProductTypes()
    productTypes.value = response.data
  } catch (error) {
    console.error('Error loading product types:', error)
    throw error
  }
}

const initializeData = async () => {
  try {
    await Promise.all([
      loadAllBatches(),
      loadProductTypes()
    ])
  } catch (error) {
    alert(MESSAGES.ERROR_LOADING_DATA)
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
    newProductType.value = { name: '', manufacturer: ''}
    await loadProductTypes()
  } catch (error) {
    console.error('Error creating product type:', error)
    alert(MESSAGES.ERROR_CREATING_PRODUCT_TYPE)
  }
}

const createBatch = async () => {
  if (!newBatch.value.nameBatch || !newBatch.value.certificateUrl) {
    alert(MESSAGES.MISSING_FIELDS)
    return
  }

  try {
    const response = await api.createBatch({
      nameBatch: newBatch.value.nameBatch,
      certificateUrl: newBatch.value.certificateUrl
    })

    await loadAllBatches()

    const createdBatch = batches.value.find(batch => batch.code === response.data.code)
    currentBatch.value = createdBatch || response.data

    alert(`${MESSAGES.BATCH_CREATED}: ${response.data.code}`)
    newBatch.value = { nameBatch: '', certificateUrl: '' }
  } catch (error) {
    console.error('Error creating batch:', error)
    alert(MESSAGES.ERROR_CREATING_BATCH)
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
    await loadProductsForBatch(currentBatch.value.code)
    alert(MESSAGES.PRODUCT_ADDED)
  } catch (error) {
    console.error('Error creating product:', error)
    alert(MESSAGES.ERROR_CREATING_PRODUCT)
  }
}

const finalizeBatch = () => {
  clearCurrentBatch()
  alert(MESSAGES.BATCH_FINALIZED)
}

const handleBatchSelection = (batch) => {
  selectBatch(batch)
  alert(`Batch seleccionado: ${batch.code}`)
}

const getGroupedProductsForBatch = (batch) => {
  return groupProductsByNameAndManufacturer(batch.products)
}

onMounted(initializeData)
</script>

<template>

  <!-- Crear Tipo de Producto -->
  <section class="section-container">
    <div class="container">
      <div class="section-header">
        <div class="step-indicator step-1"><span class="step-number">1</span></div>
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

  <!-- Crear Batch -->
  <section class="section-container alternate-bg">
    <div class="container">
      <div class="section-header">
        <div class="step-indicator step-2"><span class="step-number">2</span></div>
        <h2 class="section-title">Crear Batch</h2>
        <p class="section-description">Crea un nuevo lote para agrupar productos relacionados</p>
      </div>

      <div class="form-container">
        <div v-if="!currentBatch" class="modern-form">
          <form @submit.prevent="createBatch">
            <div class="form-group">
              <label for="nameBatch" class="modern-label"><i class="fas fa-tags"></i>Nombre del Lote</label>
              <input v-model="newBatch.nameBatch" type="text" id="nameBatch" class="modern-input" placeholder="Ej: Lote Primavera 2024" required/>
            </div>
            <div class="form-group">
              <label for="certificateUrl" class="modern-label"><i class="fas fa-certificate"></i>URL del Certificado</label>
              <input v-model="newBatch.certificateUrl" type="url" id="certificateUrl" class="modern-input" placeholder="https://ejemplo.com/certificado.pdf" required/>
            </div>
            <div class="form-submit">
              <button type="submit" class="btn-primary-custom"><i class="fas fa-plus-circle"></i>Crear Nuevo Batch</button>
            </div>
          </form>
        </div>

        <div v-else class="active-batch-card">
          <div class="batch-header">
            <i class="fas fa-check-circle batch-icon"></i>
            <div class="batch-info">
              <h3 class="batch-title">Batch Activo</h3>
              <p class="batch-code">{{ currentBatch.code }}</p>
            </div>
          </div>
          <div class="batch-stats">
            <div class="stat-item">
              <i class="fas fa-box"></i>
              <span>{{ currentBatch.products?.length || 0 }} productos</span>
            </div>
          </div>
          <button @click="finalizeBatch" class="btn-secondary-custom">
            <i class="fas fa-flag-checkered"></i>
            Finalizar Batch
          </button>
        </div>
      </div>
    </div>
  </section>

  <!-- Agregar Producto -->
  <section class="section-container">
    <div class="container">
      <div class="section-header">
        <div class="step-indicator step-3">
          <span class="step-number">3</span>
        </div>
        <h2 class="section-title">Agregar Producto al Batch</h2>
        <p class="section-description">Añade productos específicos al batch seleccionado</p>
      </div>

      <!-- Selector de batch si no hay uno activo -->
      <div v-if="!currentBatch && batches.length" class="batch-selector">
        <h4 class="selector-title">Seleccionar Batch:</h4>
        <div class="batch-grid">
          <div v-for="batch in batches" :key="batch.code" class="batch-card-selector" @click="selectBatch(batch)">
            <div class="card-header-small">
              <h6>{{ batch.code }}</h6>
            </div>
            <div class="card-stats">
              <span><i class="fas fa-box"></i> {{ batch.products.length }} productos</span>
              <span><i class="fas fa-calendar"></i> {{ new Date(batch.createdAt).toLocaleDateString() }}</span>
            </div>
          </div>
        </div>
      </div>

      <div v-if="!currentBatch && !batches.length" class="empty-state">
        <i class="fas fa-inbox"></i>
        <h4>No hay batches disponibles</h4>
        <p>Debe crear primero un batch para continuar</p>
      </div>

      <div v-if="currentBatch" class="form-container">
        <form @submit.prevent="createProduct" class="modern-form">
          <div class="form-group-horizontal">
            <div class="form-group flex-grow">
              <label class="modern-label">
                <i class="fas fa-target"></i>Batch destino
              </label>
              <input :value="currentBatch.code" type="text" class="modern-input readonly" readonly/>
            </div>
            <button @click="clearCurrentBatch" type="button" class="btn-outline-custom">
              <i class="fas fa-exchange-alt"></i>Cambiar
            </button>
          </div>

          <div class="form-group">
            <label for="productTypeId" class="modern-label">
              <i class="fas fa-pills"></i>Tipo de producto
            </label>
            <select v-model="newProduct.productTypeId" id="productTypeId" class="modern-select" required>
              <option value="" disabled>Seleccione un tipo de producto</option>
              <option v-for="type in productTypes" :key="type.id" :value="type.id">
                {{ type.name }} - {{ type.manufacturer }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label for="quantity" class="modern-label">
              <i class="fas fa-sort-numeric-up"></i>Cantidad
            </label>
            <input v-model.number="newProduct.quantity" type="number" id="quantity" class="modern-input" placeholder="Ingrese la cantidad" required/>
          </div>

          <div class="form-submit">
            <button type="submit" class="btn-primary-custom">
              <i class="fas fa-plus"></i>Agregar Producto al Batch
            </button>
          </div>
        </form>

        <!-- Tabla de productos en el batch actual -->
        <div v-if="currentBatch && currentBatch.products && currentBatch.products.length" class="products-table-container">
          <h5 class="table-title">
            <i class="fas fa-list"></i>
            Productos en el batch {{ currentBatch.code }}
          </h5>
          <div class="modern-table-wrapper">
            <table class="modern-table">
              <thead>
                <tr>
                  <th><i class="fas fa-pills"></i> Medicamento</th>
                  <th><i class="fas fa-industry"></i> Fabricante</th>
                  <th><i class="fas fa-sort-numeric-up"></i> Cantidad</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="productGroup in currentBatchGroupedProducts" :key="productGroup.name + productGroup.manufacturer">
                  <td class="product-name">{{ productGroup.name }}</td>
                  <td class="manufacturer">{{ productGroup.manufacturer }}</td>
                  <td class="quantity">
                    <span class="quantity-badge">{{ productGroup.count }}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Lista de Batches -->
  <section class="section-container alternate-bg">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">
          <i class="fas fa-archive"></i>Batches Disponibles
        </h2>
        <p class="section-description">Vista general de todos los batches creados</p>
      </div>

      <div v-if="batches.length" class="batches-grid">
        <div v-for="batch in batches" :key="batch.code" class="batch-card" :class="{ 'active-batch': currentBatch && currentBatch.code === batch.code }" @click="handleBatchSelection(batch)">
          <div class="batch-card-header">
            <div class="batch-title-section">
              <h5 class="batch-name">{{ batch.nameBatch }}</h5>
              <span v-if="currentBatch && currentBatch.code === batch.code" class="active-badge">
                <i class="fas fa-star"></i> Activo
              </span>
            </div>
            <div class="batch-actions">
              <a :href="batch.certificateUrl" target="_blank" class="certificate-btn" @click.stop>
                <i class="fas fa-certificate"></i>Certificado
              </a>
            </div>
          </div>

          <div class="batch-card-body">
            <div class="batch-meta">
              <div class="meta-item">
                <i class="fas fa-barcode"></i>
                <span class="batch-code">{{ batch.code }}</span>
              </div>
              <div class="meta-item">
                <i class="fas fa-calendar-alt"></i>
                <span>{{ new Date(batch.createdAt).toLocaleDateString() }}</span>
              </div>
              <div class="meta-item">
                <i class="fas fa-box"></i>
                <span>{{ batch.products.length }} productos</span>
              </div>
            </div>

            <div v-if="batch.products.length > 0" class="products-summary">
              <h6 class="summary-title"><i class="fas fa-list-ul"></i>Productos incluidos:</h6>
              <div class="products-list">
                <div v-for="productGroup in getGroupedProductsForBatch(batch)" :key="productGroup.name + productGroup.manufacturer" class="product-item">
                  <div class="product-info">
                    <strong>{{ productGroup.name }}</strong>
                    <small>{{ productGroup.manufacturer }}</small>
                  </div>
                  <span class="product-count">{{ productGroup.count }}</span>
                </div>
              </div>
            </div>

            <div v-else class="empty-products">
              <i class="fas fa-inbox"></i><span>Sin productos asociados</span>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="empty-state-large">
        <i class="fas fa-archive"></i>
        <h3>No hay batches disponibles</h3>
        <p>Comience creando su primer batch de productos</p>
      </div>
    </div>
  </section>
</template>

<style scoped>

.hero-section {
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
  color: white;
  padding: 2rem 0;
  margin-top: 0; /* Removido el margen superior para que funcione con el layout */
}

.hero-content {
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
}

.hero-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.hero-subtitle {
  font-size: 1.125rem;
  opacity: 0.9;
  margin-bottom: 0;
}

.section-container {
  padding: 3rem 0;
}

.alternate-bg {
  background-color: var(--gray-50);
}

.section-header {
  text-align: center;
  margin-top: 80px;
  margin-bottom: 2.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.step-indicator {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  box-shadow: var(--shadow-lg);
}
.step-indicator.step-1 {
  background: linear-gradient(135deg, var(--secondary-color), #059669);
}
.step-indicator.step-2 {
  background: linear-gradient(135deg, var(--secondary-color), #059669);
}

.step-indicator.step-3 {
  background: linear-gradient(135deg, var(--accent-color), #d97706);
}

.step-number {
  color: white;
  font-size: 1.25rem;
  font-weight: 700;
}

.section-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--gray-900);
  margin-bottom: 0.5rem;
}

.section-description {
  font-size: 1rem;
  color: var(--gray-500);
  max-width: 600px;
}

/* Form Styles */
.form-container {
  max-width: 600px;
  margin: 0 auto;
}

.modern-form {
  background: white;
  padding: 2rem;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--gray-200);
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-group-horizontal {
  display: flex;
  gap: 1rem;
  align-items: end;
  margin-bottom: 1.25rem;
}

.flex-grow {
  flex: 1;
}

.modern-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: var(--gray-700);
  margin-bottom: 0.5rem;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.modern-input,
.modern-select {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid var(--gray-200);
  border-radius: var(--border-radius);
  font-size: 0.95rem;
  transition: var(--transition);
  background-color: white;
}

.modern-input:focus,
.modern-select:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgb(37 99 235 / 0.1);
}

.modern-input.readonly {
  background-color: var(--gray-50);
  color: var(--gray-500);
}

.modern-input::placeholder {
  color: var(--gray-400);
}

.form-submit {
  text-align: center;
  margin-top: 1.5rem;
}

/* Button Styles */
.btn-primary-custom {
  background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
  color: white;
  border: none;
  padding: 0.75rem 1.75rem;
  border-radius: var(--border-radius);
  font-weight: 600;
  font-size: 0.95rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: var(--transition);
  box-shadow: var(--shadow);
}

.btn-primary-custom:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.btn-secondary-custom {
  background: linear-gradient(135deg, var(--gray-500), var(--gray-700));
  color: white;
  border: none;
  padding: 0.65rem 1.25rem;
  border-radius: var(--border-radius);
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: var(--transition);
}

.btn-outline-custom {
  background: transparent;
  color: var(--primary-color);
  border: 2px solid var(--primary-color);
  padding: 0.75rem 1.25rem;
  border-radius: var(--border-radius);
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: var(--transition);
  white-space: nowrap;
}

.btn-outline-custom:hover {
  background: var(--primary-color);
  color: white;
}

/* Active Batch Card */
.active-batch-card {
  background: linear-gradient(135deg, var(--secondary-color), #059669);
  color: white;
  padding: 1.75rem;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-lg);
}

.batch-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.25rem;
}

.batch-icon {
  font-size: 1.75rem;
}

.batch-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
}

.batch-code {
  font-family: 'Courier New', monospace;
  font-size: 0.8rem;
  opacity: 0.9;
  margin: 0;
}

.batch-stats {
  margin-bottom: 1.25rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
}

/* Resto de estilos igual pero con espaciados más compactos */
.batch-selector {
  margin-bottom: 1.5rem;
}

.selector-title {
  color: var(--gray-700);
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.batch-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.batch-card-selector {
  background: white;
  border: 2px solid var(--gray-200);
  border-radius: var(--border-radius);
  padding: 1rem;
  cursor: pointer;
  transition: var(--transition);
}

.batch-card-selector:hover {
  border-color: var(--primary-color);
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.card-header-small h6 {
  font-weight: 700;
  color: var(--gray-900);
  margin-bottom: 0.5rem;
  font-size: 1rem;
}

.card-stats {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 0.8rem;
  color: var(--gray-500);
}

/* Table Styles - más compacta */
.products-table-container {
  margin-top: 1.5rem;
}

.table-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--gray-700);
  margin-bottom: 1rem;
  font-weight: 600;
  font-size: 1.1rem;
}

.modern-table-wrapper {
  background: white;
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: var(--shadow);
}

.modern-table {
  width: 100%;
  border-collapse: collapse;
}

.modern-table thead th {
  background: var(--gray-50);
  padding: 0.875rem;
  text-align: left;
  font-weight: 600;
  color: var(--gray-700);
  border-bottom: 1px solid var(--gray-200);
  font-size: 0.9rem;
}

.modern-table tbody td {
  padding: 0.875rem;
  border-bottom: 1px solid var(--gray-100);
  font-size: 0.9rem;
}

.modern-table tbody tr:hover {
  background-color: var(--gray-50);
}

.product-name {
  font-weight: 600;
  color: var(--gray-900);
}

.manufacturer {
  color: var(--gray-500);
}

.quantity-badge {
  background: var(--primary-color);
  color: white;
  padding: 0.25rem 0.65rem;
  border-radius: 9999px;
  font-weight: 600;
  font-size: 0.8rem;
}

/* Batch Cards - más compactas */
.batches-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1.25rem;
}

.batch-card {
  background: white;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  border: 2px solid var(--gray-200);
  cursor: pointer;
  transition: var(--transition);
  overflow: hidden;
}

.batch-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-xl);
  border-color: var(--primary-color);
}

.batch-card.active-batch {
  border-color: var(--secondary-color);
  box-shadow: 0 0 0 3px rgb(16 185 129 / 0.1);
}

.batch-card-header {
  background: var(--gray-50);
  padding: 1.25rem;
  border-bottom: 1px solid var(--gray-200);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.batch-title-section {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.batch-name {
  font-weight: 700;
  color: var(--gray-900);
  margin: 0;
  font-size: 1.1rem;
}

.active-badge {
  background: var(--secondary-color);
  color: white;
  padding: 0.2rem 0.65rem;
  border-radius: 9999px;
  font-size: 0.7rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.certificate-btn {
  background: var(--primary-color);
  color: white;
  padding: 0.5rem 0.875rem;
  border-radius: var(--border-radius);
  text-decoration: none;
  font-size: 0.8rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: var(--transition);
}

.certificate-btn:hover {
  background: var(--primary-dark);
  color: white;
  text-decoration: none;
  transform: scale(1.05);
}

.batch-card-body {
  padding: 1.25rem;
}

.batch-meta {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  margin-bottom: 1.25rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: var(--gray-600);
}

.batch-code {
  font-family: 'Courier New', monospace;
  background: var(--gray-100);
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-size: 0.7rem;
}

.products-summary {
  border-top: 1px solid var(--gray-200);
  padding-top: 1rem;
}

.summary-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--gray-700);
  margin-bottom: 0.65rem;
}

.products-list {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.product-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.4rem;
  background: var(--gray-50);
  border-radius: 6px;
}

.product-info strong {
  display: block;
  color: var(--gray-900);
  font-size: 0.8rem;
}

.product-info small {
  color: var(--gray-500);
  font-size: 0.7rem;
}

.product-count {
  background: var(--accent-color);
  color: white;
  padding: 0.2rem 0.4rem;
  border-radius: 9999px;
  font-weight: 600;
  font-size: 0.7rem;
}

/* Empty States */
.empty-state,
.empty-state-large {
  text-align: center;
  padding: 2rem 1rem;
  color: var(--gray-500);
}

.empty-state i,
.empty-state-large i {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-state h4,
.empty-state-large h3 {
  color: var(--gray-700);
  margin-bottom: 0.5rem;
}

.empty-products {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: var(--gray-400);
  font-style: italic;
  padding: 0.875rem;
  text-align: center;
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-title {
    font-size: 1.875rem;
  }

  .section-title {
    font-size: 1.75rem;
  }

  .modern-form {
    padding: 1.25rem;
  }

  .form-group-horizontal {
    flex-direction: column;
    align-items: stretch;
  }

  .batches-grid {
    grid-template-columns: 1fr;
  }

  .batch-card-header {
    flex-direction: column;
    gap: 0.875rem;
    align-items: stretch;
  }

  .batch-title-section {
    justify-content: center;
  }

  :root {
    --navbar-height: 80px; /* Define la altura del navbar aquí */
  }

  .section-container:first-of-type {
    margin-top: var(--navbar-height);
    padding-top: 2rem;
  }
}

/* Animations - más sutiles */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.section-container {
  animation: fadeInUp 0.5s ease-out;
}

.batch-card,
.modern-form,
.active-batch-card {
  animation: fadeInUp 0.5s ease-out;
}
</style>