<template>
  <header>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Albert+Sans:ital,wght@0,100..900;1,100..900&family=Funnel+Sans:ital,wght@0,300..800;1,300..800&display=swap" rel="stylesheet">
  </header>
  <nav class="navbar navbar-expand-md  fixed-top">
    <NavbarLayout/>
  </nav>
  <RouterView />
  <footer>

  </footer>
</template>

<script setup>
import NavbarLayout from "@/components/layout/NavbarLayout.vue";
</script>

<style>
:root {
  --primary-color: #142443;
  --primary-dark: #0a1529;
  --primary-hover-color: #3e4564;
  --secondary-color: #6c8ac3;
  --secondary-hover-color: #a4bdec;
  --background-color: #e6ecf8;
  --background-light-color: #d1ddf3;
  --text-color: #142443;
  --secondary-text-color: #d1ddf3;
  --tertiary-text-color: #a49e97;
  --navbar-height: 80px;

  /* Variables adicionales que necesitas para los botones */
  --gray-400: #9ca3af;
  --gray-500: #6b7280;
  --gray-600: #4b5563;
  --gray-700: #374151;
  --gray-900: #111827;
  --border-radius: 12px;
  --shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  --transition: all 0.3s ease;
}

html {
  font-size: 16px;
  font-family: poppins, sans-serif;
  background-color: var(--primary-color);
}
body{
  padding-top: var(--navbar-height);
  margin: 0;
}

.navbar {
  background-color: var(--primary-color);
  color: var(--secondary-text-color);
  min-height: 80px;
  font-size: 20px;
  z-index: 1030;
}
</style>