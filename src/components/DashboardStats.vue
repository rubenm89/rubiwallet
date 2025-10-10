<template>
  <div class="dashboard-stats">
    <CryptoPriceDisplay :prices="prices" />
    <UserPortfolio :prices="prices" />

    <section class="actions">
      <h2>Acciones</h2>
      <div class="action-buttons">
        <button @click="goToOperar" class="action-btn primary">Comprar/Vender</button>
        <button @click="goToHistory" class="action-btn secondary">Ver Historial</button>
      </div>
    </section>
  </div>
</template>

<script>
import { getCryptoPrice } from '../service/axios';
import CryptoPriceDisplay from './CryptoPriceDisplay.vue';
import UserPortfolio from './UserPortfolio.vue';

export default {
  components: {
    CryptoPriceDisplay,
    UserPortfolio,
  },
  data() {
    return {
      prices: {},
    };
  },
  methods: {
    goToHistory() {
      this.$router.push("/history");
    },
    goToOperar() {
      this.$router.push("/operar");
    },
    async fetchCryptoPrices() {
      try {
        const availableCryptos = ["btc", "eth", "ltc"];
        const prices = {};
        for (const crypto of availableCryptos) {
          const data = await getCryptoPrice("binance", crypto, "ars", 1);
          prices[crypto] = {
            ask: data.ask,
            bid: data.bid,
          };
        }
        this.prices = prices;
      } catch (error) {
        console.error("Error al obtener los precios de las criptomonedas:", error);
      }
    },
  },
  mounted() {
    this.fetchCryptoPrices();
    setInterval(this.fetchCryptoPrices, 30000);
  },
};
</script>

<style scoped>
.dashboard-stats {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.actions h2 {
  text-align: center;
  margin-bottom: 1rem;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.action-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
}

.action-btn.primary {
  background-color: #4A90E2;
  color: white;
}

.action-btn.secondary {
  background-color: #f0f0f0;
  color: #333;
  border: 1px solid #ccc;
}

.action-btn:hover {
  transform: translateY(-2px);
}

.action-btn.primary:hover {
  background-color: #357ABD;
}

.action-btn.secondary:hover {
  background-color: #e0e0e0;
}
</style>