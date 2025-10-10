<template>
  <div class="transaction-form">
    <h2>Comprar/Vender Criptomonedas</h2>
    <form @submit.prevent="handleTransaction">
      <label for="crypto">Selecciona una criptomoneda:</label>
      <select v-model="selectedCrypto" id="crypto" @change="updateCryptoPrice" required>
        <option v-for="crypto in availableCryptos" :key="crypto" :value="crypto">
          {{ crypto.toUpperCase() }}
        </option>
      </select>
      <p v-if="currentPrice">Precio de compra: ${{ currentPrice.ask.toFixed(2) }} ARS</p>
      <p v-if="currentPrice">Precio de venta: ${{ currentPrice.bid.toFixed(2) }} ARS</p>

      <label for="quantity">Cantidad:</label>
      <input id="quantity" type="number" step="0.00001" v-model.number="transactionQuantity" 
      placeholder="Ingresa la cantidad" min="0" @change="updateMoney" />

      <label for="money">Monto en Pesos Argentinos:</label>
      <input id="money" type="number" step="0.01" v-model.number="transactionMoney" 
      placeholder="Ingresa el monto" min="0" @change="updateQuantity" />

      <div class="transaction-type">
        <label>
          <input type="radio" value="purchase" v-model="transactionType" /> Comprar
        </label>
        <label>
          <input type="radio" value="sale" v-model="transactionType" /> Vender
        </label>
      </div>

      <button type="submit">Realizar Transacción</button>
    </form>
  </div>
</template>

<script>
import { getCryptoPrice, axiosData } from '../service/axios';
import { useUserStore } from '@/stores/userStore';

export default {
  name: 'TransactionForm',
  data() {
    return {
      availableCryptos: ["btc", "eth", "ltc"],
      selectedCrypto: "btc",
      transactionQuantity: null,
      transactionType: "purchase",
      transactionMoney: null,
      currentPrice: null,
    };
  },
  methods: {
    async updateCryptoPrice() {
      try {
        const data = await getCryptoPrice("binance", this.selectedCrypto, "ars", 1);
        this.currentPrice = { ask: data.ask, bid: data.bid };
        this.updateMoney();
      } catch (error) {
        console.error("Error al obtener la cotización:", error);
        alert("No se pudo obtener el precio de la criptomoneda.");
      }
    },
    updateMoney() {
      if (this.transactionQuantity && this.transactionQuantity > 0 && this.currentPrice) {
        const price = this.transactionType === 'purchase' ? this.currentPrice.ask : this.currentPrice.bid;
        this.transactionMoney = parseFloat((this.transactionQuantity * price).toFixed(2));
      } else {
        this.transactionMoney = null;
      }
    },
    updateQuantity() {
      if (this.transactionMoney && this.transactionMoney > 0 && this.currentPrice) {
        const price = this.transactionType === 'purchase' ? this.currentPrice.ask : this.currentPrice.bid;
        this.transactionQuantity = parseFloat((this.transactionMoney / price).toFixed(5));
      } else {
        this.transactionQuantity = null;
      }
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
        datetime: new Date().toLocaleString("es-AR"),
      };

      try {
        await axiosData.post("/transactions", transactionData);
        alert("Transacción registrada con éxito.");
        this.$emit('transaction-completed'); 
        this.transactionQuantity = null;
        this.transactionMoney = null;
      } catch (error) {
        console.error("Error al registrar la transacción:", error);
        alert("Hubo un error al registrar la transacción.");
      }
    },
  },
  watch: {
    transactionType() {      
      this.updateMoney();
    }
  },
  mounted() {
    this.updateCryptoPrice();
  },
};
</script>

<style scoped>
.transaction-form {
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
}
form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.transaction-type {
  display: flex;
  gap: 1rem;
}
</style>
