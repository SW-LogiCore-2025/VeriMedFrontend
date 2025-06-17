import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Search from '@/views/Search.vue'
import Booking from '@/views/Booking.vue'
import Profile from '@/views/Profile.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/search', component: Search },
  { path: '/booking/:id', component: Booking },
  { path: '/profile', component: Profile }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router