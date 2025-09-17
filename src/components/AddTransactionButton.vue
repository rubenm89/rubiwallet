<template>
  <div class="add-transaction">
    <button @click="goToAddTransaction">Agregar Transacción</button>
  </div>
</template>
  
<script>
export default {
  name: 'AddTransactionButton',
  methods: {
    goToAddTransaction() {
      this.$router.push('/add-transaction'); // Redirige a la vista para agregar transacciones
    },
  },
};
</script>
  
<style scoped>
button {
  background-color: #28a745;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
button:hover {
  background-color: #218838;
}
</style>