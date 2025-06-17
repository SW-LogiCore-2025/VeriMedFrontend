<script setup>
import ActionBtnComponent from "@/components/ui/ActionBtnComponent.vue";
</script>

<template>
  <div class="heroe pb-5" style="height: 100%">
    <div class="container">
      <div class="row d-flex">
        <div class="col-12 justify-content-center text-center">
          <h1>VeriMed</h1>
          <div class="d-flex justify-content-center">
            <h2>Rastrea tu medicamento o fármaco</h2>
          </div>
          <h3 class="text center mt-3">¿No estas seguro que tu producto sea oficial?</h3>
          <ActionBtnComponent/>
          <img src="@/assets/inyectable.png" alt="VeriMed Main Banner" class="img-fluid d-flex mt-3" style="max-height: 400px">
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.heroe {
  background: var(--primary-color);
  height: 100vh;
}
h1 {
  color: var(--secondary-text-color);
  font-family: 'Funnel Sans', sans-serif;
  font-weight: 800;
  font-size: clamp(2rem, 5vw, 4rem);
  text-align: center;
  margin-top: 200px;
}
h2 {
  color: var(--secondary-text-color);
  font-family: 'Albert Sans', sans-serif;
  font-size: clamp(1rem, 3vw, 2rem);
  font-weight: 200;
}
h3 {
  color: var(--secondary-text-color);
  font-family: 'Albert Sans', sans-serif;
  font-size: clamp(0.8rem, 2vw, 1rem);
  font-weight: 100;
  margin-top: 20px;
}
img {
  display: block;
  margin: 0 auto; /* Centra la imagen horizontalmente */
  padding: 1rem;
  border: 2px solid transparent;
  background-image:
      linear-gradient(var(--primary-color), var(--primary-color)), linear-gradient(to right, var(--secondary-color), var(--secondary-hover-color));
  background-origin: border-box;
  background-clip: padding-box, border-box;
  overflow: hidden;
  border-radius: 2rem;
  max-width: 100%;
  height: auto;
}
</style>