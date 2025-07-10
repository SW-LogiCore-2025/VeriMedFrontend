import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'

// Importar PrimeVue y los componentes necesarios
import PrimeVue from 'primevue/config'
import Card from 'primevue/card'
import Dialog from 'primevue/dialog'
import Toast from 'primevue/toast'
import ToastService from 'primevue/toastservice'

import 'primeicons/primeicons.css' // Iconos

const app = createApp(App)

app.use(createPinia())
app.use(router)

// Usar PrimeVue
app.use(PrimeVue)
app.use(ToastService) // Registrar el servicio ToastService

// Registrar componentes globales
app.component('Card', Card)
app.component('Dialog', Dialog)
app.component('Toast', Toast) // Registrar el componente Toast

app.mount('#app')