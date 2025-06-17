<template>
  <div class="p-4">
    <h2 class="text-2xl font-bold">Reserva de Cochera</h2>
    <p class="mt-2">Estás reservando la cochera con ID: {{ $route.params.id }}</p>
    <form class="mt-4 space-y-3">
      <input type="datetime-local" class="border p-2 rounded w-full" />
      <button class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Confirmar Reserva
      </button>
    </form>
  </div>
</template>