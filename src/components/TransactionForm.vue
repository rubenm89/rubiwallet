<template>
  <div class="transaction-card">
    <div class="toggle-buttons">
      <button 
        :class="{ active: transactionType === 'purchase' }" 
        @click="transactionType = 'purchase'">
        Comprar
      </button>
      <button 
        :class="{ active: transactionType === 'sale' }" 
        @click="transactionType = 'sale'">
        Vender
      </button>
    </div>

    <form @submit.prevent="handleTransaction">
      <div class="form-group">
        <label for="crypto">Criptomoneda</label>
        <select v-model="selectedCrypto" id="crypto" @change="updateCryptoPrice" required>
          <option v-for="crypto in availableCryptos" :key="crypto" :value="crypto">
            {{ crypto.toUpperCase() }}
          </option>
        </select>
      </div>

      <div v-if="currentPrice" class="price-display">
        <span>Precio de {{ transactionType === 'purchase' ? 'Compra' : 'Venta' }}: <strong>${{ transactionPrice.toFixed(2) }} ARS</strong></span>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="quantity">Cantidad que {{ transactionType === 'purchase' ? 'compras' : 'vendes' }}</label>
          <input id="quantity" type="number" step="0.000001" v-model.number="transactionQuantity" @input="updateMoney" placeholder="0.00" min="0" />
        </div>
        <div class="form-group">
          <label for="money">Monto en Pesos Argentinos</label>
          <input id="money" type="number" step="0.01" v-model.number="transactionMoney" @input="updateQuantity" placeholder="0.00" min="0" />
        </div>
      </div>

      <button type="submit" class="submit-btn">Realizar Transacción</button>
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
  computed: {
    transactionPrice() {
      if (!this.currentPrice) return 0;
      return this.transactionType === 'purchase' ? this.currentPrice.ask : this.currentPrice.bid;
    }
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
      if (this.transactionQuantity > 0 && this.transactionPrice > 0) {
        this.transactionMoney = parseFloat((this.transactionQuantity * this.transactionPrice).toFixed(2));
      } else if (this.transactionQuantity === null || this.transactionQuantity === 0) {
        this.transactionMoney = null;
      }
    },
    updateQuantity() {
      if (this.transactionMoney > 0 && this.transactionPrice > 0) {
        this.transactionQuantity = parseFloat((this.transactionMoney / this.transactionPrice).toFixed(6));
      } else if (this.transactionMoney === null || this.transactionMoney === 0) {
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
        datetime: new Date().toISOString(),
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
.transaction-card {
  background-color: #fff;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  max-width: 500px;
  margin: 2rem auto;
}

.toggle-buttons {
  display: flex;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 1.5rem;
}

.toggle-buttons button {
  flex: 1;
  padding: 12px;
  border: none;
  background-color: #f7f7f7;
  color: #555;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
}

.toggle-buttons button.active {
  background-color: #4A90E2;
  color: white;
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
}

.form-group label {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.5rem;
}

.form-group select,
.form-group input {
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
}

.price-display {
  text-align: center;
  margin: -0.5rem 0 1.5rem 0;
  font-size: 1rem;
  color: #333;
}

.form-row {
  display: flex;
  gap: 1rem;
}

.form-row .form-group {
  flex: 1;
}

.submit-btn {
  width: 100%;
  padding: 15px;
  border: none;
  border-radius: 8px;
  background-color: #28a745;
  color: white;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 1rem;
}

.submit-btn:hover {
  background-color: #218838;
}
</style>
