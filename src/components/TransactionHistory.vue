<template>
  <div class="history">
    <section>
      <h1>Historial de Movimientos</h1>
    <ul>
      <li v-for="(transaction, index) in transactions" :key="index">
        {{ transaction.type }} - {{ transaction.amount }} - {{ transaction.date }}
      </li>
    </ul>
    </section>
  </div>
</template>

<script>
export default {
  name: 'TransactionHistory',
  data() {
    return {
      transactions: [],
    };
  },
  mounted() {
    this.fetchTransactions();
  },
  methods: {
    fetchTransactions() {
      // Simulación de datos. Reemplaza con llamada a API.
      this.transactions = [
        { type: 'Compra', amount: 300, date: '2024-11-17' },
        { type: 'Venta', amount: 500, date: '2024-11-16' },
        { type: 'Compra', amount: 400, date: '2024-11-15' },
      ];
    },
  },
};
</script>

<style scoped>
.history {
  border: 1px solid #ddd;
  padding: 15px;
  border-radius: 8px;
}
</style>