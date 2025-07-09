<script setup>
import { ref } from 'vue'

const batches = ref([])
const currentBatch = ref(null)

const handleBatchSelection = (batch) => {
  currentBatch.value = batch
  alert(`Batch seleccionado: ${batch.code}`)
}
</script>

<template>
  <section class="section-container alternate-bg">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title"><i class="fas fa-archive"></i>Batches Disponibles</h2>
        <p class="section-description">Vista general de todos los batches creados</p>
      </div>

      <div v-if="batches.length" class="batches-grid">
        <div v-for="batch in batches" :key="batch.code" class="batch-card" @click="handleBatchSelection(batch)">
          <div class="batch-card-header">
            <h5 class="batch-name">{{ batch.nameBatch }}</h5>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>