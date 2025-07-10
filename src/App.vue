<template>
  <header>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Albert+Sans:ital,wght@0,100..900;1,100..900&family=Funnel+Sans:ital,wght@0,300..800;1,300..800&display=swap" rel="stylesheet">
  </header>
  
  <nav class="navbar">
    <NavbarLayout/>
  </nav>
  
  <main class="main-content">
    <RouterView />
  </main>
  
  <Toast />
</template>

<script setup>
import { onMounted } from 'vue'
import NavbarLayout from "@/components/layout/NavbarLayout.vue"
import { useAuthStore } from '@/iam/auth.js'

const authStore = useAuthStore()

// SINCRONIZAR ESTADO AL CARGAR LA APLICACIÓN
onMounted(() => {
  console.log('🚀 App montado - Sincronizando estado de autenticación...')
  authStore.syncWithAuth()
  
  // Debug: mostrar estado actual
  console.log('📊 Estado después de sincronizar:', {
    isLoggedIn: authStore.isLoggedIn,
    user: authStore.user
  })
})
</script>

<style>
:root {
  --primary-color: #203459;
  --primary-dark: #0a1529;
  --primary-light: #3e4564;
  --secondary-color: #6c8ac3;
  --secondary-light: #a4bdec;
  --accent-color: #4f46e5;
  
  --bg-primary: #e6ecf8;
  --bg-secondary: #f8fafc;
  --bg-card: #ffffff;
  
  --text-primary: #142443;
  --text-secondary: #64748b;
  --text-light: #d1ddf3;
  --text-white: #ffffff;
  
  --border-color: #e2e8f0;
  --border-radius: 12px;
  --border-radius-lg: 16px;
  --shadow-sm: 0 1px 3px 0 rgb(0 0 0 / 0.1);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  
  --navbar-height: 80px;
  --spacing-xs: 0.5rem;
  --spacing-sm: 1rem;
  --spacing-md: 1.5rem;
  --spacing-lg: 2rem;
  --spacing-xl: 3rem;
  
  --transition: all 0.3s ease;
  --transition-fast: all 0.15s ease;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Albert Sans', sans-serif;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  line-height: 1.6;
  padding-top: var(--navbar-height);
}

.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: var(--navbar-height);
  background-color: var(--primary-color);
  box-shadow: var(--shadow-md);
  z-index: 1000;
}

.main-content {
  min-height: calc(100vh - var(--navbar-height));
  padding: 0;
}

.text-primary { color: var(--text-primary) !important; }
.text-secondary { color: var(--text-secondary) !important; }
.text-white { color: var(--text-white) !important; }

.bg-primary { background-color: var(--bg-primary) !important; }
.bg-secondary { background-color: var(--bg-secondary) !important; }
.bg-card { background-color: var(--bg-card) !important; }

.p-0 { padding: 0 !important; }
.p-1 { padding: var(--spacing-xs) !important; }
.p-2 { padding: var(--spacing-sm) !important; }
.p-3 { padding: var(--spacing-md) !important; }
.p-4 { padding: var(--spacing-lg) !important; }

.m-0 { margin: 0 !important; }
.m-1 { margin: var(--spacing-xs) !important; }
.m-2 { margin: var(--spacing-sm) !important; }
.m-3 { margin: var(--spacing-md) !important; }
.m-4 { margin: var(--spacing-lg) !important; }

.mb-2 { margin-bottom: var(--spacing-sm) !important; }
.mb-3 { margin-bottom: var(--spacing-md) !important; }
.mb-4 { margin-bottom: var(--spacing-lg) !important; }

.flex { display: flex; }
.flex-col { flex-direction: column; }
.items-center { align-items: center; }
.justify-center { justify-content: center; }
.justify-between { justify-content: space-between; }
.text-center { text-align: center; }
.w-full { width: 100%; }
.h-full { height: 100%; }

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-sm);
}

:root {
  --p-primary-color: var(--primary-color);
  --p-primary-contrast-color: var(--text-white);
  --p-surface-0: var(--bg-card);
  --p-surface-50: var(--bg-secondary);
  --p-surface-100: var(--bg-primary);
}

.p-button {
  font-family: 'Albert Sans', sans-serif;
  font-weight: 500;
  border-radius: var(--border-radius);
  transition: var(--transition);
}

.p-inputtext {
  font-family: 'Albert Sans', sans-serif;
  border-radius: var(--border-radius);
  border: 1px solid var(--border-color);
  transition: var(--transition);
}

.p-inputtext:focus {
  border-color: var(--secondary-color);
  box-shadow: 0 0 0 2px rgba(108, 138, 195, 0.2);
}

.p-card {
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);
  border: none;
}

@media (max-width: 768px) {
  .container {
    padding: 0 var(--spacing-xs);
  }
  
  :root {
    --navbar-height: 70px;
  }
}

::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: var(--bg-secondary);
}

::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--text-secondary);
}

.p-card {
  background: linear-gradient(135deg, #203459 0%, #2c4a6b 100%) !important;
  color: white !important;
}

.p-button {
  background: #6c8ac3 !important;
  border-color: #6c8ac3 !important;
}

.p-button:hover {
  background: #5a75b0 !important;
  border-color: #5a75b0 !important;
}
</style>