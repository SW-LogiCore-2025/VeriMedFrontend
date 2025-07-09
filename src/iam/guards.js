// src/iam/guards.js
import { auth } from './auth.js'

// Guard simple para rutas que requieren login
export const requireAuth = (to, from, next) => {
  console.log('🔒 Verificando autenticación para:', to.path)
  
  if (auth.checkAuth()) {
    console.log('✅ Usuario autenticado:', auth.getUser().username)
    next() // Usuario logueado, continuar
  } else {
    console.log('❌ Usuario no autenticado, redirigiendo a login')
    next('/login') // No logueado, ir a login
  }
}

// Guard simple para rutas de invitados (login/register)
export const guestOnly = (to, from, next) => {
  console.log('👤 Verificando guest para:', to.path)
  
  if (!auth.checkAuth()) {
    console.log('✅ Usuario no logueado, puede acceder')
    next() // No logueado, continuar
  } else {
    console.log('⚠️ Usuario ya logueado, redirigiendo...')
    // Logueado, redirigir según tipo
    if (auth.isLaboratory()) {
      console.log('🏭 Redirigiendo laboratorio a /search')
      next('/search') // Laboratorio va a búsqueda/gestión
    } else {
      console.log('👨‍⚕️ Redirigiendo paciente a /')
      next('/') // Paciente va al home
    }
  }
}

// Guard simple para laboratorios únicamente
export const laboratoryOnly = (to, from, next) => {
  console.log('🏭 Verificando acceso de laboratorio para:', to.path)
  
  if (auth.checkAuth() && auth.isLaboratory()) {
    console.log('✅ Es laboratorio, acceso permitido')
    next() // Es laboratorio, continuar
  } else if (auth.checkAuth()) {
    console.log('❌ No es laboratorio, redirigiendo a home')
    next('/') // Logueado pero no es laboratorio
  } else {
    console.log('❌ No logueado, redirigiendo a login')
    next('/login') // No logueado
  }
}

// Guard simple para pacientes únicamente
export const patientOnly = (to, from, next) => {
  console.log('👨‍⚕️ Verificando acceso de paciente para:', to.path)
  
  if (auth.checkAuth() && auth.isPatient()) {
    console.log('✅ Es paciente, acceso permitido')
    next() // Es paciente, continuar
  } else if (auth.checkAuth()) {
    console.log('❌ No es paciente, redirigiendo a search')
    next('/search') // Logueado pero no es paciente
  } else {
    console.log('❌ No logueado, redirigiendo a login')
    next('/login') // No logueado
  }
}