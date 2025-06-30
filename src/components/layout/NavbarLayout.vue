<template>
    <nav class="navbar navbar-expand-lg navbar-light fixed-top">
      <div class="container">
        <a class="navbar-brand" href="#"><img src="../../assets/logo.png" alt="logo" style="min-width: 100px; max-width: 120px"></a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
                aria-label="Toggle navigation">
          <span class="pi pi-bars"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <router-link class="nav-link mx-3" to="/">Home</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link mx-3" to="/search">Search</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link mx-3" to="/login">Iniciar Sesión</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link mx-3 register-btn" to="/register">Registrarse</router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </template>
<style scoped>
.navbar {
  background-color: var(--primary-color, #ffffff);
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  z-index: 1030;
}

/* Mantén todos tus estilos existentes para .nav-link, .register-btn, etc. */
.nav-link {
  font-size: 18px;
  font-weight: 400;
  color: var(--secondary-text-color);
  background-color: transparent;
  border: none;
  cursor: pointer;
  position: relative;
  margin: 0 10px;
  padding: 10px 12px;
  letter-spacing: 0.8px;
}

.nav-link::after {
  content: "";
  position: absolute;
  width: 0;
  height: 3px;
  background-color: var(--secondary-text-color);
  bottom: 0;
  left: 0;
  transition: width 0.1s ease-in;
}

.nav-link:hover::after {
  width: 100%;
}

.nav-link:hover {
  color: var(--secondary-text-color);
}

.nav-link.active::after {
  width: 100%;
}

.register-btn {
  background-color: var(--secondary-color);
  border-radius: 20px;
  transition: all 0.3s ease;
}

.register-btn::after {
  display: none;
}

.register-btn:hover {
  background-color: var(--secondary-hover-color);
  transform: translateY(-2px);
}

button {
  padding: 15px 15px;
  border: none;
  color: var(--secondary-text-color);
  font-size: 1.2rem;
  cursor: pointer;
  border-radius: 10px;
  transition: all 0.4s ease;
  outline: none;
  position: relative;
  overflow: hidden;
  font-weight: bold;
}

button:hover {
  color: var(--tertiary-text-color)
}
</style>