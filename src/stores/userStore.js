import { defineStore } from 'pinia';
import { axiosData } from '../service/axios';
import { transactionService } from '../service/transactionService';
import { useCryptoStore } from './cryptoStore';

export const useUserStore = defineStore('user', {
  state: () => ({
    userName: null,
    portfolio: {}, // ej: { btc: 0.5, eth: 1.2 }
    transactions: [],
    loading: false,
    currentTransaction: null,
    analysisResults: [],
    isAnalysisLoading: false,
  }),
  getters: {
    getHolding: (state) => (cryptoCode) => {
      return state.portfolio[cryptoCode] || 0;
    },
  },
  actions: {
    async login(userName) {
      this.userName = userName;
      await this.fetchUserPortfolio();
    },
    logout() {
      this.userName = null;
      this.portfolio = {};
      this.transactions = [];
      this.analysisResults = [];
    },
    async fetchTransaction(id) {
      this.loading = true;
      try {
        this.currentTransaction = await transactionService.fetchTransactionById(id);
      } catch (error) {
        console.error("Error fetching transaction:", error);
        this.currentTransaction = null;
      } finally {
        this.loading = false;
      }
    },
    async updateTransaction(transactionData) {
      if (!transactionData || !transactionData._id) {
        throw new Error("Invalid transaction data for update.");
      }
      this.loading = true;
      try {
        await transactionService.updateTransaction(transactionData._id, transactionData);
        // Después de actualizar, limpiar la transacción específica y refrescar todo el portafolio
        this.currentTransaction = null;
        await this.fetchUserPortfolio();
      } catch (error) {
        console.error("Error updating transaction:", error);
        throw error; // Re-lanzar para ser atrapado en el componente
      } finally {
        this.loading = false;
      }
    },
    async fetchUserPortfolio() {
      if (!this.userName) return;

      this.loading = true;
      try {
        const response = await axiosData.get(`/transactions?q=${JSON.stringify({ user_id: this.userName })}`);
        this.transactions = response.data;
        
        const newPortfolio = {};
        this.transactions.forEach(trx => {
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

        // Asegurarse de que no haya saldos negativos por imprecisiones de punto flotante
        for (const crypto in newPortfolio) {
          if (newPortfolio[crypto] < 0) {
            newPortfolio[crypto] = 0;
          }
        }

        this.portfolio = newPortfolio;
      } catch (error) {
        console.error("Error fetching user portfolio:", error);
        this.portfolio = {}; // Resetear en caso de error
      } finally {
        this.loading = false;
      }
    },
    async fetchAnalysis() {
      if (!this.userName) return;
      this.isAnalysisLoading = true;
      
      const cryptoStore = useCryptoStore();

      try {
        // Asegurarse de que el portafolio del usuario y los precios de las criptos estén cargados
        await this.fetchUserPortfolio();
        await cryptoStore.fetchPrices();
        
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