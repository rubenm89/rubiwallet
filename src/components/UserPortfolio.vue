<template>
  <section class="user-portfolio">
    <h2>Tus Criptomonedas</h2>
    <div v-if="loading">Cargando portafolio...</div>
    <table v-else-if="hasCrypto">
      <thead>
        <tr>
          <th class="logo-col"></th>
          <th>Criptomoneda</th>
          <th>Cantidad</th>
          <th>Precio Unitario (ARS)</th>
          <th>Valor Total (ARS)</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(cantidad, cripto) in portfolio" :key="cripto">
          <td><img :src="cryptoLogos[cripto]" :alt="cripto" class="crypto-logo"></td>
          <td>{{ cripto.charAt(0).toUpperCase() + cripto.slice(1) }}</td>
          <td>{{ cantidad.toFixed(6) }}</td>
          <td>${{ (prices[cripto]?.bid || 0).toFixed(2) }}</td>
          <td>${{ (cantidad * (prices[cripto]?.bid || 0)).toFixed(2) }}</td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <th colspan="4">Valor Total del Portafolio</th>
          <th>${{ totalPortfolioValue.toFixed(2) }}</th>
        </tr>
      </tfoot>
    </table>
    <p v-else>No tienes criptomonedas en tu portafolio.</p>
  </section>
</template>

<script>
import { mapState } from 'pinia';
import { useUserStore } from '@/stores/userStore';
import { useCryptoStore } from '@/stores/cryptoStore';

export default {
  name: 'UserPortfolio',
  computed: {
    ...mapState(useUserStore, ['portfolio', 'loading']),
    ...mapState(useCryptoStore, ['prices']),
    hasCrypto() {
      return Object.keys(this.portfolio).length > 0;
    },
    totalPortfolioValue() {
      return Object.entries(this.portfolio).reduce((total, [crypto, amount]) => {
        const price = this.prices[crypto]?.bid || 0;
        return total + (amount * price);
      }, 0);
    },
    cryptoLogos() {
      return {
        btc: require('@/assets/bitcoin-logo.png'),
        eth: require('@/assets/ethereum-logo.png'),
        ltc: require('@/assets/litecoin-logo.png'),
      };
    },
  },
};
</script>

<style scoped>
.user-portfolio h2 {
  text-align: center;
  margin-bottom: 1rem;
}

table {
  margin: auto;
  width: 90%;
  border-collapse: collapse;
}

th, td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: center;
  vertical-align: middle;
}

th {
  background-color: #f2f2f2;
}

tfoot {
  font-weight: bold;
}

tfoot th {
  text-align: right;
}

.crypto-logo {
  width: 24px;
  height: 24px;
}

.logo-col {
  width: 40px;
}
</style>
