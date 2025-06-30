import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8080/api/verimed',
  headers: {
    'Content-Type': 'application/json',
  }
})

export default {
  // Productos
  getProductsByBatch(batchCode) {
    return api.get('/product', { params: { code: batchCode } })
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
      certificateUrl: batch.certificateUrl
    })
  }
}