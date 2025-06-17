<template>
  <div ref="appWrapper">
    <header class="header">
      <router-link to="/" class="nav-link logo">VeriMed</router-link>

      <!-- Botón de menú -->
      <button class="menu-btn" @click="toggleMenu">
        {{ menuOpen ? '✕' : '☰' }}
      </button>

      <!-- Navegación -->
      <nav
        ref="navMenu"
        :class="['nav-links', { open: menuOpen }]"
      >
        <router-link to="/" class="nav-link" @click="closeMenu">Home</router-link>
        <router-link to="/search" class="nav-link" @click="closeMenu">Search</router-link>
        <!-- <router-link to="/profile" class="nav-link" @click="closeMenu">Profile</router-link> -->
      </nav>
    </header>

    <router-view />
  </div>
</template>

<script>
export default {
  data() {
    return {
      menuOpen: false
    };
  },
  methods: {
    toggleMenu() {
      this.menuOpen = !this.menuOpen;
      if (this.menuOpen) {
        document.addEventListener('click', this.handleClickOutside);
      } else {
        document.removeEventListener('click', this.handleClickOutside);
      }
    },
    closeMenu() {
      this.menuOpen = false;
      document.removeEventListener('click', this.handleClickOutside);
    },
    handleClickOutside(event) {
      const nav = this.$refs.navMenu;
      const button = event.target.closest('.menu-btn');
      if (nav && !nav.contains(event.target) && !button) {
        this.closeMenu();
      }
    }
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside);
  }
};
</script>

<style scoped>
.header {
  background-color: #003366;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  position: relative;
}

.logo {
  font-size: 1.5rem;
}

.menu-btn {
  display: none;
  font-size: 2rem;
  color: white;
  background: none;
  border: none;
  cursor: pointer;
}

.nav-links {
  display: flex;
  gap: 1.5rem;
}

.nav-link {
  font-weight: bold;
  font-size: 1.1rem;
  color: white;
  text-decoration: none;
}

@media (max-width: 768px) {
  .menu-btn {
    display: block;
  }

  .nav-links {
    display: none;
    flex-direction: column;
    background-color: #003366;
    position: absolute;
    top: 100%;
    right: 0;
    width: 70vw;
    padding: 1rem;
    box-shadow: -2px 0 5px rgba(0, 0, 0, 0.3);
    z-index: 10;
  }

  .nav-links.open {
    display: flex;
  }
}
</style>
