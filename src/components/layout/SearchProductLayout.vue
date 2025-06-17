<script setup>
import { ref, onMounted, watch } from 'vue'
const menor = ref('')
const showTerms = ref(false)
const formRef = ref(null)
const isVisible = ref(false)

onMounted(() => {
  const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          isVisible.value = true
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
  )
  if (formRef.value) observer.observe(formRef.value)
})

const selectedPlan = ref('')
const days = ['Lunes', 'Miércoles', 'Jueves']
const selectedDays = ref([])

watch(selectedPlan, (val) => {
  if (val === 'paquete1' || val === 'paquete4') {
    selectedDays.value = []
  } else if (val === 'paquete2') {
    selectedDays.value = []
  } else if (val === 'paquete3') {
    selectedDays.value = [...days]
  }
})

function handleSingleDay() {
  if (selectedDays.value.length > 1) {
    selectedDays.value = [selectedDays.value[selectedDays.value.length - 1]]
  }
}
function handleTwoDays() {
  if (selectedDays.value.length > 2) {
    selectedDays.value = selectedDays.value.slice(-2)
  }
}
</script>

<template>
  <div class="form m-4" ref="formRef" :class="['form', { 'animate': isVisible }]">
    <div class="h1 text-center">Formulario de Inscripción</div>

    <!-- Nombre y apellido -->
    <div class="row d-flex justify-content-center g-3">
      <div class="col-md-6">
        <input class="form-control" placeholder="Nombre" id="nombre" name="nombre" type="text" required />
      </div>
      <div class="col-md-6">
        <input class="form-control" placeholder="Apellidos" id="apellidos" name="apellidos" type="text" required />
      </div>
    </div>

    <!-- Datos de contacto -->
    <div class="row d-flex justify-content-center g-3">
      <div class="col-md-6">
        <input class="form-control" placeholder="Celular*" id="celular" name="celular" type="text" />
      </div>
      <div class="col-md-6">
        <input class="form-control" placeholder="Email*" id="email" name="email" type="email" />
      </div>
      <label class="annotation form-text px-4 mt-2">*En caso el alumno sea menor de edad puede dejarlo en blanco</label>
    </div>

    <!-- Documento -->
    <div class="row d-flex justify-content-center g-3">
      <div class="col-md-4">
        <select class="form-control" id="tipo_documento" name="tipo_documento" required>
          <option value="" disabled selected>Tipo doc.</option>
          <option value="documento1">DNI</option>
          <option value="documento2">C.E.</option>
          <option value="documento3">Pasaporte</option>
        </select>
      </div>
      <div class="col-md-8">
        <input class="form-control" placeholder="Nro. de documento" id="documento" name="documento" type="text" required />
      </div>
    </div>

    <!-- Seleccione un paquete -->
    <div class="col-md-12 mb-3">
      <select class="form-control" id="paquete" name="paquete" required v-model="selectedPlan">
        <option value="" disabled selected>Seleccione un paquete</option>
        <option value="paquete1">Plan Recreativo</option>
        <option value="paquete2">Plan Proyección</option>
        <option value="paquete3">Plan Competitivo</option>
        <option value="paquete4">Plan Representación</option>
      </select>
    </div>
    <!-- Selección de días según el paquete elegido -->
    <div v-if="selectedPlan" class="col-md-12 mb-4 inscription-days">
      <label class="mb-3">Días de inscripción:</label>

      <!-- Paquete 1 y 4: Selección de un solo día (radio buttons) -->
      <div v-if="selectedPlan === 'paquete1' || selectedPlan === 'paquete4'" class="d-flex flex-row align-items-center gap-3">
        <!-- Se muestra un radio button por cada día disponible. Solo se puede seleccionar un día. -->
        <div v-for="day in days" :key="day" class="d-flex flex-row align-items-center">
          <input
              type="radio"
              :id="`day-${day}`"
              :value="day"
              v-model="selectedDays[0]"
              name="singleDay"
              class="form-check-input"
          />
          <label :for="`day-${day}`" class="ms-2 me-3">{{ day }}</label>
        </div>
      </div>
      <!-- Paquete 2: Selección de exactamente dos días (checkboxes) -->
      <div class="d-flex flex-row align-items-center gap-3" v-else-if="selectedPlan === 'paquete2'">
        <!-- Se muestran checkboxes para los días. Solo se pueden seleccionar dos días.-->
        <div v-for="day in days" :key="day" class="d-flex flex-row align-items-center">
          <input
              type="checkbox"
              :id="`day-${day}`"
              :value="day"
              v-model="selectedDays"
              :disabled="selectedDays.length === 2 && !selectedDays.includes(day)"
              @change="handleTwoDays"
              class="form-check-input"
          />
          <label :for="`day-${day}`" class="ms-2 me-3">{{ day }}</label>
        </div>
      </div>
      <small class="d-block mt-3" v-if="selectedPlan === 'paquete2'">Debes seleccionar exactamente 2 días</small>

      <!-- Paquete 3: Todos los días seleccionados y deshabilitados -->
      <div class="d-flex flex-row align-items-center gap-3" v-else-if="selectedPlan === 'paquete3'">
        <!-- Todos los días aparecen seleccionados y deshabilitados. -->
        <div v-for="day in days" :key="day" class="d-flex flex-row align-items-center">
          <input
              type="checkbox"
              :id="`day-${day}`"
              :value="day"
              v-model="selectedDays"
              checked
              disabled
              class="form-check-input"
          />
          <label :for="`day-${day}`" class="ms-2 me-3">{{ day }}</label>
        </div>
      </div>
    </div>

    <!-- Experiencia -->
    <div class="form-check mb-4">
      <input class="form-check-input mt-1" type="checkbox" id="experience" name="experience" />
      <label class="form-check-label mx-3" for="experience">
        He hecho esgrima antes (competitivo o recreativo)
      </label>
    </div>

    <!-- Es menor de edad -->
    <div class="form-check mb-4">
      <input class="form-check-input mt-1" type="checkbox" id="menor" v-model="menor" name="menor" />
      <label class="form-check-label mx-3" for="menor">El alumno es menor de edad</label>
    </div>

    <!-- Datos del apoderado -->
    <div class="mb-4" v-if="menor">
      <div class="row d-flex justify-content-center g-3">
        <div class="col-md-6">
          <input class="form-control mt-0" placeholder="Nombre Apoderado" id="nombreApoderado" name="nombreApoderado" type="text" required />
        </div>
        <div class="col-md-6">
          <input class="form-control mt-0" placeholder="Apellidos Apoderado" id="apellidosApoderado" name="apellidosApoderado" type="text" required />
        </div>
      </div>
      <div class="row d-flex justify-content-cente g-3r">
        <div class="col-md-6">
          <input class="form-control" placeholder="Celular Apoderado" id="celularApoderado" name="celularApoderado" type="text" required />
        </div>
        <div class="col-md-6">
          <input class="form-control" placeholder="Email Apoderado" id="emailApoderado" name="emailApoderado" type="email" required />
        </div>
      </div>
      <div class="row d-flex justify-content-center g-3">
        <div class="col-md-4">
          <select class="form-control" id="tipoDocumentoApoderado" name="tipoDocumentoApoderado" required>
            <option value="" disabled selected>Tipo doc.</option>
            <option value="documentoApoderado1">DNI</option>
            <option value="documentoApoderado2">C.E.</option>
            <option value="documentoApoderado3">Pasaporte</option>
          </select>
        </div>
        <div class="col-md-8">
          <input class="form-control" placeholder="Nro. de documento" id="documento" name="documento" type="text" required />
        </div>
      </div>
    </div>

    <!-- Terminos y condiciones -->
    <div class="form-check mb-4">
      <input class="form-check-input mt-1" type="checkbox" id="terminos" name="terminos" required />
      <label class="form-check-label mx-3" for="terminos">
        Acepto los <span style="color: var(--tertiary-text-color); cursor:pointer;" @click="showTerms = true">términos y condiciones</span> (Exoneración de responsabilidad)
      </label>
    </div>

    <input value="Enviar información" class="btn" type="submit" />
  </div>
</template>

<style scoped>
.form {
  width: 500px;
  height: auto;
  background: var(--primary-color);
  padding: 50px;
  color: var(--secondary-text-color);
  border-radius: 17px;
  font-size: 1em;
  font-family: "Funnel Sans", sans-serif;
}
.form.animate {
  animation: bounce 1s;
}

.form input[type="text"],
.form input[type="password"],
.form input[type="email"],
.form select,
.form option{
  opacity: 1;
  display: block;
  outline: none;
  width: 100%;
  padding: 13px 18px;
  font-weight: 300;
  margin: 20px 0 0 0;
  font-size: 0.75em;
  border: 1px solid var(--background-color);
  border-radius: 15px;
  background: transparent;
  color: var(--secondary-text-color);
  background-color: var(--primary-color);
}
.form input::placeholder {
  color: var(--secondary-text-color); /* Cambia esta variable al color deseado */
}


.form input[type="checkbox"]{
  opacity: 1;
  padding: 7px 7px;
  font-size: 0.75em;
  background: transparent;
  border: 1px solid var(--background-color);
  color: var(--secondary-text-color);
}
.form input[type="checkbox"]:checked{
  appearance: none;
  width: 8px;
  height: 8px;
  position: relative;
}
.form input[type="checkbox"]:checked::after {
  content: '✔';
  color: var(--secondary-text-color);
  font-size: 0.75em;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.form input[type="radio"]{
  opacity: 1;
  padding: 7px 7px;
  font-size: 0.75em;
  background: transparent;
  border: 1px solid var(--background-color);
  color: var(--secondary-text-color);
}
.form input[type="radio"]:checked{
  appearance: none;
  width: 8px;
  height: 8px;
  position: relative;
}
.form input[type="radio"]:checked::after {
  content: '✔';
  color: var(--secondary-text-color);
  font-size: 0.75em;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

label {
  color: var(--secondary-text-color);
  font-family: 'Albert Sans', sans-serif;
  font-size: 0.75em;
  font-weight: 400;
  letter-spacing: 0.8px;
}
.annotation {
  font-size: 0.6rem;
}

.login input:focus,
.form option:focus{
  animation: bounce 1s;
  -webkit-appearance: none;
}



.login input[type=submit],
.login input[type=button],
.h1 {
  border: 0;
  outline: 0;
  width: 100%;
  border-radius: 500px;
  font-weight: 600;
  animation: bounce2 1.6s;
  font-size: 1.5em;
}

.form input[type=text],
.form input[type="email"],
.form-control,
.form option,
.form input[type=radio],
.form input[type=checkbox],
.form label{
  animation: bounce 1s;
  -webkit-appearance: none;
}
.inscription-days {
  padding-left: 6px;
}

.form input[type=password],
.form option{
  animation: bounce1 1.3s;
}

small {
  font-family: 'Albert Sans', sans-serif;
  font-size: 0.7em;
  font-weight: 200;
  letter-spacing: 0.8px;
  color: var(--secondary-hover-color);
}

@media only screen and (max-width: 600px) {
  .form {
    width: 70%;
    padding: 3em;
  }
}
@keyframes bounce {
  0% {
    transform: translateY(-250px);
    opacity: 0;
  }
}
@keyframes bounce1 {
  0% {
    opacity: 0;
  }

  40% {
    transform: translateY(-100px);
    opacity: 0;
  }
}
@keyframes bounce2 {
  0% {
    opacity: 0;
  }

  70% {
    transform: translateY(-20px);
    opacity: 0;
  }
}
</style>