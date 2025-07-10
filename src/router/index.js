// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { guestOnly, requireAuth } from '@/iam/guards.js'

import Home from '@/views/Home.vue'
import Search from '@/views/Search.vue'
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'
import ListProducts from '@/views/ListProducts.vue'

const routes = [
  // Ruta raíz redirige al login si no está autenticado, o al Home si lo está
  {
    path: '/',
    beforeEnter: (to, from, next) => {
      const isLoggedIn = requireAuth() // Verifica si el usuario está autenticado
      if (isLoggedIn) {
        next('/home') // Redirige al Home si está autenticado
      } else {
        next('/login') // Redirige al Login si no está autenticado
      }
    }
  },
  { path: '/home', component: Home }, // Ruta para la vista Home
  { path: '/search', component: Search },
  {
    path: '/login',
    name: 'login', // Agregar el nombre de la ruta
    component: Login,
    beforeEnter: guestOnly
  },
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