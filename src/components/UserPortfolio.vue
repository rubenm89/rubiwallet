<template>
  <section class="user-portfolio">
    <h2>Tus Criptomonedas</h2>
    <table v-if="hasCrypto">
      <thead>
        <tr>
          <th>Criptomoneda</th>
          <th>Cantidad</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(cantidad, cripto) in userCrypto" :key="cripto">
          <td>{{ cripto.charAt(0).toUpperCase() + cripto.slice(1) }}</td>
          <td>{{ cantidad.toFixed(6) }}</td>
        </tr>
      </tbody>
    </table>
    <p v-else>No tienes criptomonedas en tu portafolio.</p>
  </section>
</template>

<script>
import { axiosData } from '../service/axios';
import { useUserStore } from '@/stores/userStore';

export default {
  name: 'UserPortfolio',
  data() {
    return {
      userCrypto: {},
    };
  },
  computed: {
    hasCrypto() {
      return Object.keys(this.userCrypto).length > 0;
    },
  },
  methods: {
    async fetchUserPortfolio() {
      const userStore = useUserStore();
      const userId = userStore.userName;
      if (!userId) return;

      try {
        const response = await axiosData.get(`/transactions?q=${JSON.stringify({ user_id: userId })}`);
        const transactions = response.data;
        const portfolio = {};

        for (const trx of transactions) {
          const amount = parseFloat(trx.crypto_amount);
          if (!portfolio[trx.crypto_code]) {
            portfolio[trx.crypto_code] = 0;
          }
          if (trx.action === 'purchase') {
            portfolio[trx.crypto_code] += amount;
          } else if (trx.action === 'sale') {
            portfolio[trx.crypto_code] -= amount;
          }
        }

        for (const crypto in portfolio) {
          if (portfolio[crypto] <= 0.000001) {
            delete portfolio[crypto];
          }
        }

        this.userCrypto = portfolio;
      } catch (error) {
        console.error("Error al obtener el portafolio del usuario:", error);
        alert("No se pudo cargar tu portafolio de criptomonedas.");
      }
    },
  },
  mounted() {
    this.fetchUserPortfolio();
  },
};
</script>

<style scoped>
.user-portfolio {
  /* Styles for this component can go here */
}

table {
  margin: auto;
  width: 50%;
  border-collapse: collapse;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
}

th {
  background-color: #f2f2f2;
}
</style>
