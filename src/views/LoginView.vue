<template>
    <div class="login-view">
      <h1>Inicia Sesión</h1>
      <LoginForm />
  </div>
</template>

<script>
import LoginForm from '@/components/LoginForm.vue';

export default {
  name: "LoginView",
  components: {
      LoginForm
  },
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
