import axios from 'axios'

const api = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}api/verimed`, // Usar la variable de entorno
  headers: {
    'Content-Type': 'application/json',
  }
})

export default {
  // Productos
  getProducts(params) {
    return api.get('/product', { params })
  },
  getProductById(id) {
    return api.get(`/product/${id}`)
  },
  getProductsByType() {
    return api.get('/product/by-type')
  },
  createProduct(product) {
    return api.post('/product/batch', product)
  },

  // Tipos de producto
  getProductTypes() {
    return api.get('/product-type')
  },
  createProductType(productType) {
    return api.post('/product-type', {
      name: productType.name,
      manufacturer: productType.manufacturer
    })
  },

  // Batches
  getBatches() {
    return api.get('/batch')
  },

  createBatch(batch) {
    return api.post('/batch', {
      nameBatch: batch.nameBatch,
      certificateUrl: batch.certificateUrl,
      userId: batch.userId // Asegúrate de incluir este campo
    })
  },

  getBatchesByUser(userId) {
    return api.get(`/batch/by-user/${userId}`)
  },

  getContractName() {
    return axios.get(`${import.meta.env.VITE_BACKEND_URL}blockchain/contract-name`); // Ruta completa sin usar la baseURL
  }
}