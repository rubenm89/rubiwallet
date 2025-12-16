import { defineStore } from 'pinia';
import { getCryptoPrice } from '../service/cryptoService';

export const useCryptoStore = defineStore('crypto', {
  state: () => ({
    prices: {},
    loading: false,
    error: null,
    availableCryptos: ["btc", "eth", "ltc"],
    priceUpdateInterval: null,
  }),

  getters: {
    getPrice: (state) => (cryptoCode) => {
      return state.prices[cryptoCode];
    },
  },

  actions: {
    async fetchPrices() {
      this.loading = true;
      this.error = null;
      try {
        const prices = {};
        for (const crypto of this.availableCryptos) {
          const data = await getCryptoPrice("binance", crypto, "ars", 1);
          prices[crypto] = {
            ask: data.ask,
            bid: data.bid,
          };
        }
        this.prices = prices;
      } catch (error) {
        this.error = "Error al obtener los precios de las criptomonedas.";
        console.error(this.error, error);
      } finally {
        this.loading = false;
      }
    },
    startPriceUpdates() {
      if (this.priceUpdateInterval) {
        clearInterval(this.priceUpdateInterval);//limpiar si ya existe
      }
      this.fetchPrices(); // Obtener de inmediato
      this.priceUpdateInterval = setInterval(() => {
        this.fetchPrices();
      }, 30000); // Actualizar cada 30 segundos
    },
    stopPriceUpdates() {
      if (this.priceUpdateInterval) {
        clearInterval(this.priceUpdateInterval);
        this.priceUpdateInterval = null;
      }
    },
  },
});
