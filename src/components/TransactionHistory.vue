<template>
  <section class="history">
    <h1>Historial de Movimientos</h1>
    <table v-if="sortedTransactions .length">
      <thead>
        <tr>
          <th>Fecha</th>
          <th>Tipo</th>
          <th>Criptomoneda</th>
          <th>Cantidad</th>
          <th>Monto (ARS)</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="transaction in sortedTransactions " :key="transaction._id">
          <td>{{ new Date(transaction.datetime).toLocaleString('es-AR') }}</td>
          <td :class="transaction.action === 'purchase' ? 'purchase-text' : 'sale-text'">{{ transaction.action === 'purchase' ? 'Compra' : 'Venta' }}</td>
          <td>{{ transaction.crypto_code.toUpperCase() }}</td>
          <td>{{ parseFloat(transaction.crypto_amount).toFixed(6) }}</td>
          <td>${{ parseFloat(transaction.money).toFixed(2) }}</td>
          <td class="actions">
            <button @click="editTransaction(transaction._id)" class="btn-edit">Editar</button>
            <button @click="deleteTransaction(transaction._id)" class="btn-delete">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>
    <p v-else>No hay transacciones en tu historial.</p>
  </section>
</template>

<script>
  import { mapState, mapActions } from 'pinia';
  import { useUserStore } from '@/stores/userStore';
  import { useTransactionStore } from '@/stores/transactionStore';
  
  export default {
    name: 'TransactionHistory',
    computed: {
      ...mapState(useTransactionStore, ['sortedTransactions', 'loading', 'error']),
    },
    async created() {
      this.fetchTransactions();
    },
    methods: {
      ...mapActions(useUserStore, ['fetchUserPortfolio']),
      ...mapActions(useTransactionStore, ['fetchTransactions', 'removeTransaction']),

      editTransaction(transactionId) {
        this.$router.push({ name: 'EditTransaction', params: { id: transactionId } });
      },
      
      async deleteTransaction(transactionId) {
        if (window.confirm('¿Estás seguro de que quieres eliminar esta transacción?')) {
          try {
            await this.removeTransaction(transactionId);
            alert('Transacción eliminada con éxito.');
            // Recalcula el portafolio para reflejar la eliminación
            await this.fetchUserPortfolio();
          } catch (error) {
            alert('Error al eliminar la transacción. Por favor, intenta de nuevo.');
          }
        }
      },
    },
  };
  </script>

<style scoped>
.history {
  padding: 15px;
}

h1 {
  text-align: center;
  margin-bottom: 1.5rem;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin: auto;
}

th, td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: center;
}

th {
  background-color: #f2f2f2;
}

.actions button {
  padding: 6px 12px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin: 0 5px;
}

.btn-edit {
  background-color: #4A90E2;
  color: white;
}

.btn-delete {
  background-color: #D0021B;
  color: white;
}

.purchase-text {
  color: #2E7D32;
  font-weight: bold;
}

.sale-text {
  color: #C62828;
  font-weight: bold;
}
</style>