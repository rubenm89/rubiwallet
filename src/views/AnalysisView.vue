<template>
  <div class="analysis-view">
    <h1>Análisis de Inversiones</h1>
    <table v-if="!isLoading">
      <thead>
        <tr>
          <th class="logo-col"></th>
          <th>Criptomoneda</th>
          <th>Total Invertido</th>
          <th>Valor Actual / Realizado</th>
          <th>Resultado</th>
          <th>Estado</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in analysisResults" :key="item.crypto">
          <td><img :src="cryptoLogos[item.crypto]" :alt="item.crypto" class="crypto-logo"></td>
          <td>{{ item.crypto.toUpperCase() }}</td>
          <td>${{ item.totalInvested.toFixed(2) }}</td>
          <td>${{ item.currentValueOrRealized.toFixed(2) }}</td>
          <td :class="item.result >= 0 ? 'positive' : 'negative'">
            ${{ item.result.toFixed(2) }}
          </td>
          <td><span :class="['status', item.status === 'Vendido' ? 'sold' : 'holding']">{{ item.status }}</span></td>
        </tr>
      </tbody>
    </table>
    <p v-else>Calculando resultados...</p>
  </div>
</template>

<script>
import { useUserStore } from '@/stores/userStore';
import { axiosData, getCryptoPrice } from '../service/axios';

export default {
  name: 'AnalysisView',
  data() {
    return {
      analysisResults: [],
      isLoading: true,
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
  methods: {
    async calculateInvestmentResults() {
      const userStore = useUserStore();
      const userId = userStore.userName;
      if (!userId) return;

      try {
        const transactionsResponse = await axiosData.get(`/transactions?q=${JSON.stringify({ user_id: userId })}`);
        const transactions = transactionsResponse.data;

        const groupedByCrypto = transactions.reduce((acc, trx) => {
          if (!acc[trx.crypto_code]) {
            acc[trx.crypto_code] = [];
          }
          acc[trx.crypto_code].push(trx);
          return acc;
        }, {});

        const results = [];
        const cryptoCodes = Object.keys(groupedByCrypto);

        const prices = {};
        for (const code of cryptoCodes) {
          try {
            const priceData = await getCryptoPrice('binance', code, 'ars', 1);
            prices[code] = priceData.bid;
          } catch (e) {
            prices[code] = 0; // Assign 0 if price fetch fails for a crypto
          }
        }

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

          if (currentHolding < 0.000001) {
            finalResult = totalMoneyGained - totalMoneySpent;
            currentValueOrRealized = totalMoneyGained;
          } else {
            const currentValue = currentHolding * (prices[code] || 0);
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
        this.isLoading = false;
      }
    },
  },
  mounted() {
    this.calculateInvestmentResults();
  },
};
</script>

<style scoped>
.analysis-view {
  max-width: 900px;
  margin: auto;
  padding: 2rem;
}

h1 {
  text-align: center;
  margin-bottom: 1.5rem;
}

table {
  width: 100%;
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

.crypto-logo {
  width: 24px;
  height: 24px;
}

.logo-col {
  width: 40px;
}

.positive {
  color: #28a745;
  font-weight: bold;
}

.negative {
  color: #dc3545;
  font-weight: bold;
}

.status {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: bold;
  color: white;
}

.status.sold {
  background-color: #6c757d;
}

.status.holding {
  background-color: #17a2b8;
}
</style>
