// src/api.js
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8080/api/verimed',
  headers: {
    'Content-Type': 'application/json',
  }
})

export default {
  getProductsByCode(code) {
    return api.get('/product', { params: { code } })
  },
  registerProduct(product) {
    return api.post('/product/batch', product)
  },
  getProductTypes() {
    return api.get('/product-type')
  },
  registerProductType(productTypes) {
    return api.post('/product-type', productTypes)
  },
  getBatches() {
    return api.get('/batch')
  },
  registerBatch(batch) {
    return api.post('/batch', batch)
  }
}
