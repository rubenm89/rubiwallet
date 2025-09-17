<template>
  <div class="dashboard">
    <section>       
      <div class="crypto-prices">
        <ul>
          <li v-for="crypto in availableCryptos" :key="crypto">  
            <img :src="cryptoLogos[crypto]" :alt="crypto" class="crypto-logo">  
            {{ crypto.toUpperCase() }}: ${{ cryptoPrices[crypto]?.toFixed(2) || 'Cargando...' }} ARS
          </li>
        </ul>
      </div>
      
      <h2>Tus Criptomonedas</h2>
      <table>
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
    </section>

    <section>
      <h2>Historial</h2>
      <button @click="goToHistory">Ver Historial de Compra/Venta</button>
    </section>

    <section>
      <h2>Comprar/Vender Criptomonedas</h2>
      <form @submit.prevent="handleTransaction">
        <label for="crypto">Selecciona una criptomoneda:</label>
        <select v-model="selectedCrypto" id="crypto" @change="updateCryptoPrice" required>
          <option v-for="crypto in availableCryptos" :key="crypto" :value="crypto">
            {{ crypto.toUpperCase() }}
          </option>
        </select>
        <p>Precio actual: ${{ currentPrice.toFixed(2) }} ARS</p>

        <label for="quantity">Cantidad:</label>
        <input id="quantity" type="number" step="0.00001" v-model.number="transactionQuantity" 
        placeholder="Ingresa la cantidad" min="0" @change="updateMoney" />

        <label for="money">Monto en Pesos Argentinos:</label>
        <input id="money" type="number" step="0.01" v-model.number="transactionMoney" 
        placeholder="Ingresa el monto" min="0" @change="updateQuantity" />

        <label>
          <input type="radio" value="purchase" v-model="transactionType" /> Comprar
        </label>
        <label>
          <input type="radio" value="sale" v-model="transactionType" /> Vender
        </label>

        <button type="submit">Realizar Transacción</button>
      </form>
    </section>
  </div>
</template>

<script>
import { getCryptoPrice } from '../service/axios';
import { axiosData } from '../service/axios';
import { useUserStore } from '@/stores/userStore';

export default {
  data() {
    return {
      userCrypto: {},      
      availableCryptos: ["btc", "eth", "ltc"],
      selectedCrypto: "btc",
      transactionQuantity: null,
      transactionType: "purchase", // Compra por defecto
      transactionMoney: null,
      currentPrice: 0,// Cotización en ARS
      cryptoPrices: {} // Almacena los precios actuales de todas las criptomonedas
    };
  },
  computed: {
    cryptoLogos() {
      return {       
        btc: require('@/assets/bitcoin-logo.png'),
        eth: require('@/assets/ethereum-logo.png'),
        ltc: require('@/assets/litecoin-logo.png')
      };
    }
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

        // Filtrar criptos con balance cero
        for (const crypto in portfolio) {
          if (portfolio[crypto] <= 0.000001) { // Umbral pequeño para evitar problemas de punto flotante
            delete portfolio[crypto];
          }
        }

        this.userCrypto = portfolio;
      } catch (error) {
        console.error("Error al obtener el portafolio del usuario:", error);
        alert("No se pudo cargar tu portafolio de criptomonedas.");
      }
    },
    async fetchCryptoPrices() { 
      try {
        const prices = {};
        for (const crypto of this.availableCryptos) {
          const data = await getCryptoPrice("binance", crypto, "ars", 1); //API criptoya
          prices[crypto] = data.ask; //Precio de compra
        }
        this.cryptoPrices = prices;
        this.updateCryptoPrice(); // Actualiza el precio inicial del select
      } catch (error) {
        console.error("Error al obtener los precios de las criptomonedas:", error);
        alert("No se pudieron cargar los precios de las criptomonedas.");
      }
    },
    async updateCryptoPrice() {
      try {
        const data = await getCryptoPrice("binance", this.selectedCrypto, "ars", 1);
        this.currentPrice = data.ask;
      } catch (error) {
        console.error("Error al obtener la cotización:", error);
        alert("No se pudo obtener el precio de la criptomoneda.");
      }
    },
    updateMoney() {
      if (this.transactionQuantity && this.transactionQuantity > 0) {
        this.transactionMoney = parseFloat((this.transactionQuantity * this.currentPrice).toFixed(2));
      } else {
        this.transactionMoney = null;
      }
    },
    updateQuantity() {
      if (this.transactionMoney && this.transactionMoney > 0) {
        this.transactionQuantity = parseFloat((this.transactionMoney / this.currentPrice).toFixed(5));
      } else {
        this.transactionQuantity = null;
      }
    },
    goToHistory() {
      this.$router.push("/history");
    },
    async handleTransaction() {
      const userStore = useUserStore();
      const userId = userStore.userName;

      if (!userId) {
        alert("Error: No se ha identificado al usuario. Por favor, inicie sesión de nuevo.");
        return;
      }

      if (!this.transactionQuantity || this.transactionQuantity <= 0) {
        alert("Por favor, ingresa una cantidad válida.");
        return;
      }
      const transactionData = {
        user_id: userId,
        action: this.transactionType,
        crypto_code: this.selectedCrypto,
        crypto_amount: this.transactionQuantity.toString(),
        money: this.transactionMoney.toString(),
        datetime: new Date().toLocaleString("es-AR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      };
      try {
        await axiosData.post("/transactions", transactionData);
        alert("Transacción registrada con éxito.");
        // Recargar el portafolio para reflejar la nueva transacción
        await this.fetchUserPortfolio();
        // Limpiar campos del formulario
        this.transactionQuantity = null;
        this.transactionMoney = null;
      } catch (error) {
        console.error("Error al registrar la transacción:", error);
        alert("Hubo un error al registrar la transacción.");
      }
    },
  },
  mounted() {
    this.fetchCryptoPrices();
    this.fetchUserPortfolio();
  }
};
</script>
  
<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}
.crypto-prices {
  margin-bottom: 1rem;    
}

table{
  margin: auto;
}

.crypto-prices ul {
  list-style: none;
  padding: 0;
}
.crypto-prices li {
  font-size: 1rem;
  margin: 0.2rem 0;
}
.crypto-logo {
  width: 30px;
  height: 30px;
  margin-right: 10px;
  vertical-align: middle;
}
</style>