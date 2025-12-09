import { defineStore } from 'pinia';
import { useTransactionStore } from './transactionStore';

export const useUserStore = defineStore('user', {
  state: () => ({
    userName: null,
  }),
  getters: {
    portfolio() {
      const transactionStore = useTransactionStore();
      const newPortfolio = {};

      transactionStore.transactions.forEach(trx => {
        const amount = parseFloat(trx.crypto_amount);
        if (!newPortfolio[trx.crypto_code]) {
          newPortfolio[trx.crypto_code] = 0;
        }

        if (trx.action === 'purchase') {
          newPortfolio[trx.crypto_code] += amount;
        } else if (trx.action === 'sale') {
          newPortfolio[trx.crypto_code] -= amount;
        }
      });

      // Ensure no negative balances due to floating point inaccuracies
      for (const crypto in newPortfolio) {
        if (newPortfolio[crypto] < 0) {
          newPortfolio[crypto] = 0;
        }
      }
      return newPortfolio;
    },
    getHolding() {
      return (cryptoCode) => {
        return this.portfolio[cryptoCode] || 0;
      }
    },
  },
  actions: {
    login(userName) {
      this.userName = userName;
    },
    logout() {
      const transactionStore = useTransactionStore();
      this.userName = null;
      transactionStore.transactions = [];
      transactionStore.analysisResults = [];
      transactionStore.currentTransaction = null;
    },
  },
});