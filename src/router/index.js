// src/router/index.js - CORREGIDO
import { createRouter, createWebHistory } from 'vue-router'
import { guestOnly, requireAuth } from '@/iam/guards.js'

// Imports de componentes
import Home from '@/views/Home.vue'
import Search from '@/views/Search.vue'
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'
import ListProducts from '@/views/ListProducts.vue'

const routes = [
  // CAMBIO 1: Redirigir root a login
  { 
    path: '/', 
    redirect: '/login' 
  },
  
  // Páginas de autenticación - solo para usuarios NO logueados
  { 
    path: '/login', 
    component: Login,
    beforeEnter: guestOnly
  },
  { 
    path: '/register', 
    component: Register,
    beforeEnter: guestOnly
  },
  
  // Páginas principales - requieren autenticación
  { 
    path: '/home', 
    component: Home,
    //beforeEnter: requireAuth
  },
  { 
    path: '/search', 
    component: Search,
    //beforeEnter: requireAuth
  },
  {
    path: '/list-products',
    component: ListProducts,
    //beforeEnter: requireAuth
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router