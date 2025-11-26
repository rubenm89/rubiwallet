<template>
  <div class="analysis-view">
    <h1>Análisis de Inversiones</h1>
    <table v-if="!isAnalysisLoading">
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
import { mapState, mapActions } from 'pinia';

export default {
  name: 'AnalysisView',
  computed: {
    ...mapState(useUserStore, ['analysisResults', 'isAnalysisLoading']),
    cryptoLogos() {
      return {
        btc: require('@/assets/bitcoin-logo.png'),
        eth: require('@/assets/ethereum-logo.png'),
        ltc: require('@/assets/litecoin-logo.png'),
      };
    },
  },
  methods: {
    ...mapActions(useUserStore, ['fetchAnalysis']),
  },
  mounted() {
    this.fetchAnalysis();
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
