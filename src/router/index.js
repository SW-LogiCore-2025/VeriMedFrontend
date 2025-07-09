// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { guestOnly, requireAuth } from '@/iam/guards.js' // ← LÍNEA NUEVA

// Tus imports existentes
import Home from '@/views/Home.vue'
import Search from '@/views/Search.vue'
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'
import ListProducts from '@/views/ListProducts.vue'
// import Profile from '@/views/Profile.vue' // Si tienes una vista de perfil


const routes = [
  // Rutas públicas (sin cambios)
  { path: '/', component: Home },
  { path: '/search', component: Search },
  
  // Rutas de autenticación - solo para usuarios NO logueados
  { 
    path: '/login', 
    component: Login,
    beforeEnter: guestOnly  // ← AGREGADO: evita que usuarios logueados accedan
  },
  { 
    path: '/register', 
    component: Register,
    beforeEnter: guestOnly  // ← AGREGADO: evita que usuarios logueados accedan
  },
  {
    path: '/list-products',
    component: ListProducts
  }
  // Si tienes ruta de perfil, descomenta esta línea:
  // { path: '/profile', component: Profile, beforeEnter: requireAuth },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router