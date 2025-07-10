// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { guestOnly, requireAuth } from '@/iam/guards.js'

import Home from '@/views/Home.vue'
import Search from '@/views/Search.vue'
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'
import ListProducts from '@/views/ListProducts.vue'

const routes = [
  // Redirige la ruta raíz al login
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login', // Agregar el nombre de la ruta
    component: Login,
    beforeEnter: guestOnly
  },
  { path: '/home', component: Home }, // Ruta para la vista Home
  { path: '/search', component: Search },
  {
    path: '/register',
    name: 'register', // Agregar el nombre de la ruta
    component: Register,
    beforeEnter: guestOnly
  },
  {
    path: '/list-products',
    component: ListProducts
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router