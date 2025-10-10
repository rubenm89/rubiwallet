<template>
  <section class="history">
    <h1>Historial de Movimientos</h1>
    <table v-if="transactions.length">
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
        <tr v-for="transaction in transactions" :key="transaction._id">
          <td>{{ new Date(transaction.datetime).toLocaleString('es-AR') }}</td>
          <td>{{ transaction.action === 'purchase' ? 'Compra' : 'Venta' }}</td>
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
import { useUserStore } from '@/stores/userStore';
import { axiosData } from '../service/axios';

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
    async fetchTransactions() {
      const userStore = useUserStore();
      const userId = userStore.userName;
      if (!userId) {
        alert("No se pudo identificar al usuario.");
        return;
      }

      try {
        const response = await axiosData.get(`/transactions?q=${JSON.stringify({ user_id: userId })}`);
        // Sort transactions by date, newest first
        this.transactions = response.data.sort((a, b) => new Date(b.datetime) - new Date(a.datetime));
      } catch (error) {
        console.error("Error al obtener el historial de transacciones:", error);
        alert("No se pudo cargar el historial.");
      }
    },
    async deleteTransaction(transactionId) {
      if (!confirm("¿Estás seguro de que quieres eliminar esta transacción?")) {
        return;
      }

      try {
        await axiosData.delete(`/transactions/${transactionId}`);
        this.transactions = this.transactions.filter(t => t._id !== transactionId);
        alert("Transacción eliminada con éxito.");
      } catch (error) {
        console.error("Error al eliminar la transacción:", error);
        alert("No se pudo eliminar la transacción.");
      }
    },
    editTransaction(transactionId) {
      this.$router.push(`/edit/${transactionId}`);
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
</style>