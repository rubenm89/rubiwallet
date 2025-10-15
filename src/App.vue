<template>
  <nav v-if="showNav">
    <router-link to="/dashboard">Dashboard</router-link> |
    <router-link to="/operar">Operar</router-link> |
    <router-link to="/history">Historial</router-link> |
    <router-link to="/analysis">Análisis</router-link> |
    <a @click="logout">Logout</a>
  </nav>
  <router-view/>
  <footer>
      <p>Laboratorio 3 - Cursado Intensivo - 2024</p>
  </footer>
</template>

<script>
import { useUserStore } from '@/stores/userStore';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

export default {
  setup() {
    const userStore = useUserStore();
    const route = useRoute();

    const isLoggedIn = computed(() => !!userStore.userName);

    const showNav = computed(() => {
      const hiddenRoutes = ['home', 'login', 'about'];
      return isLoggedIn.value && !hiddenRoutes.includes(route.name);
    });

    const logout = () => {
      userStore.logout();
      window.location.href = '/';
    };

    return { isLoggedIn, showNav, logout };
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* estos 3 son para ver que onda, sino lo borro */
  min-height: 100vh; /* Asegura que el contenedor ocupe al menos toda la altura de la pantalla */
  display: flex;
  flex-direction: column;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #c22b17;
  cursor: pointer; /* Add cursor pointer for logout link */
}

nav a.router-link-exact-active {
  color: #120a8a;
}
footer {
  background-color: #333;
  color: #fff;
  text-align: center;
  padding: 20px 0;
  font-size: 14px;
  margin-top: auto; /* Esto empuja el footer al final */
  width: 100%;
}  
footer p {
  margin: 0;
  font-size: 15px;
  color: #bbb;
}  
footer a {
  color: #4A90E2;
  text-decoration: none;
  margin: 0 10px;
  transition: color 0.3s ease;
}  
footer a:hover {
  color: #357ABD;
}
section {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  background-color: #e9e9e9;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* Sombra suave */
}
</style>
