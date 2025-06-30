import { ref } from 'vue'
import api from "@/services/api.js"

export function useBatches() {
  const batches = ref([])
  const currentBatch = ref(null)

  const loadAllBatches = async () => {
    try {
      const response = await api.getBatches()
      batches.value = response.data
      await loadProductsForAllBatches()
    } catch (error) {
      console.error('Error loading batches:', error)
      throw error
    }
  }

  const loadProductsForAllBatches = async () => {
    for (const batch of batches.value) {
      try {
        const productsResponse = await api.getProductsByBatch(batch.code)
        batch.products = productsResponse.data
      } catch (error) {
        console.error(`Error loading products for batch ${batch.code}:`, error)
        batch.products = []
      }
    }
  }

  const loadProductsForBatch = async (batchCode) => {
    try {
      const productsResponse = await api.getProductsByBatch(batchCode)

      // Actualizar en el array de batches
      const batchIndex = batches.value.findIndex(b => b.code === batchCode)
      if (batchIndex !== -1) {
        batches.value[batchIndex].products = productsResponse.data
      }

      // Actualizar currentBatch si es el mismo
      if (currentBatch.value && currentBatch.value.code === batchCode) {
        currentBatch.value = {
          ...currentBatch.value,
          products: productsResponse.data
        }
      }
    } catch (error) {
      console.error(`Error al cargar productos para batch ${batchCode}:`, error)
    }
  }

  const selectBatch = (batch) => {
    currentBatch.value = batch
  }

  const clearCurrentBatch = () => {
    currentBatch.value = null
  }

  return {
    batches,
    currentBatch,
    loadAllBatches,
    loadProductsForBatch,
    selectBatch,
    clearCurrentBatch
  }
}