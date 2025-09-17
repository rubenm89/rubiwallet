<template>
    <div class="login-view">
      <h1>Inicia Sesión</h1>
      <LoginForm @login="handleLogin" />
  </div>
</template>

<script>
import LoginForm from '@/components/LoginForm.vue';

export default {
  name: "LoginView",
  components: {
      LoginForm
  },

  methods:{
    handleLogin(userId) {
    console.log("ID ingresado:", userId);
      // Por ahora, simplemente mostramos el ID en consola.
      // Más adelante se guardará el ID (por ejemplo, con Pinia o LocalStorage)
      // Y redirigiremos a otra vista usando `this.$router.push("/dashboard");`
    },
  }
}

</script>

<style scoped>
.login-view {
  text-align: center;
  padding: 20px;
}
h1 {
  margin-bottom: 20px;
}
</style>
