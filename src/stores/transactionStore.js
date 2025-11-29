import { defineStore } from 'pinia';
import { transactionService } from '@/service/transactionService';
import { useUserStore } from './userStore';

export const useTransactionStore = defineStore('transactions', {
  state: () => ({
    transactions: [],
    loading: false,
    error: null,
  }),

  getters: {
    sortedTransactions(state) {
      // Ordena las transacciones por fecha, de más reciente a más antigua
      return [...state.transactions].sort((a, b) => new Date(b.datetime) - new Date(a.datetime));
    },
  },

  actions: {
    async fetchTransactions() {
      const userStore = useUserStore();
      if (!userStore.userName) {
        this.error = 'No hay un usuario para cargar transacciones.';
        console.error(this.error);
        return;
      }

      this.loading = true;
      this.error = null;
      try {
        this.transactions = await transactionService.getAllTransactions(userStore.userName);
      } catch (error) {
        this.error = error.message;
        console.error('Error en el store al obtener transacciones:', error);
      } finally {
        this.loading = false;
      }
    },

    async removeTransaction(transactionId) {
      this.loading = true;
      this.error = null;
      try {
        await transactionService.deleteTransaction(transactionId);
        // Elimina la transacción del estado local para actualizar la UI al instante
        this.transactions = this.transactions.filter(t => t._id !== transactionId);
      } catch (error) {
        this.error = error.message;
        console.error('Error en el store al eliminar transacción:', error);
        throw error; // Propagar el error para que el componente pueda reaccionar
      } finally {
        this.loading = false;
      }
    },

    async addTransaction(transactionData) {
      const userStore = useUserStore();
      this.loading = true;
      this.error = null;
      try {
        const newTransaction = await transactionService.postTransaction(transactionData);
        this.transactions.push(newTransaction); // Actualiza el estado local
        await userStore.fetchUserPortfolio(); // Recalcula el portafolio
      } catch (error) {
        this.error = error.message;
        console.error('Error en el store al añadir transacción:', error);
        throw error; // Propagar para que el componente reaccione
      } finally {
        this.loading = false;
      }
    },
  },
});
