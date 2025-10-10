<template>
  <div class="crypto-prices">
    <h2>Precios del Mercado</h2>
    <ul>
      <li v-for="crypto in availableCryptos" :key="crypto">
        <img :src="cryptoLogos[crypto]" :alt="crypto" class="crypto-logo" />
        <span class="crypto-name">{{ crypto.toUpperCase() }}</span>
        <div class="prices">
          <span>Compra: ${{ prices[crypto]?.ask?.toFixed(2) || 'Cargando...' }} ARS</span>
          <span>Venta: ${{ prices[crypto]?.bid?.toFixed(2) || 'Cargando...' }} ARS</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'CryptoPriceDisplay',
  props: {
    prices: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      availableCryptos: ["btc", "eth", "ltc"],
    };
  },
  computed: {
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
.crypto-prices {
  padding: 1rem;
}

.crypto-prices ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.crypto-prices li {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  text-align: center;
  width: 220px; 
}

.crypto-logo {
  width: 40px;
  height: 40px;
  margin-bottom: 0.5rem;
}

.crypto-name {
  font-weight: bold;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}

.prices {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 0.9rem;
}

.prices span {
  margin: 0.1rem 0;
}
</style>