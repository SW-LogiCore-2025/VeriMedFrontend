<script setup>
defineProps({
  buttonText: {
    type: String,
    default: 'Search'
  }
})
</script>

<template>
  <button type="submit" class="btn btn-primary btn-lg  m-4 px-5 py-3"  style="background-color: var(--secondary-color);">
    <span class="text-white">{{ buttonText }}</span>
  </button>
</template>

<style scoped>
button {
  border: none;
  padding: 10px 20px;
  position: relative;
  overflow: hidden;
  transition: background-color 0.3s ease;
}

button::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.05);
  transform: scale(0);
  transition: transform 0.3s ease;
  border-radius: inherit;
}

button:hover {
  background-color: var(--secondary-hover-color);
}

button:hover::after {
  transform: scale(1);
}
</style>