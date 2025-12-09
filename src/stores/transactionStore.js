import { defineStore } from 'pinia';
import { transactionService } from '@/service/transactionService';
import { useUserStore } from './userStore';
import { useCryptoStore } from './cryptoStore';

export const useTransactionStore = defineStore('transactions', {
  state: () => ({
    transactions: [],
    loading: false,
    error: null,
    currentTransaction: null,
    analysisResults: [],
    isAnalysisLoading: false,
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

    async getTransactionById(id) {
      this.loading = true;
      try {
        this.currentTransaction = await transactionService.getTransactionById(id);
      } catch (error) {
        console.error("Error, transaccion no encontrada - ", error);
        this.currentTransaction = null;
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

    async updateTransaction(transactionId, transactionData) {
      this.loading = true;
      this.error = null;
      try {
        const updatedTransaction = await transactionService.updateTransaction(transactionId, transactionData);

        // Actualiza la transacción en el estado local para reflejar los cambios en la UI.
        const index = this.transactions.findIndex(t => t._id === transactionId);
        if (index !== -1) {
          this.transactions[index] = updatedTransaction;
        }
        
      } catch (error) {
        this.error = error.message;
        console.error('Error en el store al actualizar transacción:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async addTransaction(transactionData) {
      this.loading = true;
      this.error = null;
      try {
        const newTransaction = await transactionService.postTransaction(transactionData);
        this.transactions.push(newTransaction); // Actualiza el estado local
      } catch (error) {
        this.error = error.message;
        console.error('Error en el store al añadir transacción:', error);
        throw error; // Propagar para que el componente reaccione
      } finally {
        this.loading = false;
      }
    },

    async fetchAnalysis() {
      const userStore = useUserStore();
      if (!userStore.userName) return;
      this.isAnalysisLoading = true;
      
      const cryptoStore = useCryptoStore();

      try {
                
        await this.fetchTransactions();// recargar el historial
        await cryptoStore.fetchPrices();//obtener precios actulizados
        
        const transactions = this.transactions;
        const prices = cryptoStore.prices;

        const groupedByCrypto = transactions.reduce((acc, trx) => {
          if (!acc[trx.crypto_code]) {
            acc[trx.crypto_code] = [];
          }
          acc[trx.crypto_code].push(trx);
          return acc;
        }, {});

        const results = [];
        const cryptoCodes = Object.keys(groupedByCrypto);

        for (const code of cryptoCodes) {
          const txs = groupedByCrypto[code];
          let totalMoneySpent = 0;
          let totalMoneyGained = 0;
          let totalAmountPurchased = 0;
          let totalAmountSold = 0;

          txs.forEach(trx => {
            if (trx.action === 'purchase') {
              totalMoneySpent += parseFloat(trx.money);
              totalAmountPurchased += parseFloat(trx.crypto_amount);
            } else if (trx.action === 'sale') {
              totalMoneyGained += parseFloat(trx.money);
              totalAmountSold += parseFloat(trx.crypto_amount);
            }
          });

          const currentHolding = totalAmountPurchased - totalAmountSold;
          let finalResult = 0;
          let currentValueOrRealized = 0;
          let status = 'Vendido';
          
          const currentPrice = prices[code] ? prices[code].bid : 0;

          if (currentHolding < 0.000001) {
            finalResult = totalMoneyGained - totalMoneySpent;
            currentValueOrRealized = totalMoneyGained;
          } else {
            const currentValue = currentHolding * currentPrice;
            finalResult = (currentValue + totalMoneyGained) - totalMoneySpent;
            currentValueOrRealized = currentValue + totalMoneyGained;
            status = 'En Cartera';
          }

          results.push({
            crypto: code,
            totalInvested: totalMoneySpent,
            currentValueOrRealized: currentValueOrRealized,
            result: finalResult,
            status: status,
          });
        }

        this.analysisResults = results;
      } catch (error) {
        console.error("Error al calcular el análisis de inversiones:", error);
        alert("No se pudo realizar el análisis.");
      } finally {
        this.isAnalysisLoading = false;
      }
    },
  },
});
