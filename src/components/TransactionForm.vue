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
        <select v-model="selectedCrypto" id="crypto" required>
          <option v-for="crypto in availableCryptos" :key="crypto" :value="crypto">
            {{ crypto.toUpperCase() }}
          </option>
        </select>
      </div>

      <div v-if="currentPrice" class="price-display">
        <span>Precio de {{ transactionType === 'purchase' ? 'Compra' : 'Venta' }}: <strong>${{ transactionPrice.toFixed(2) }} ARS</strong></span>
      </div>
      <div v-else class="price-display">
        <span>Cargando precio...</span>
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

      <button type="submit" class="submit-btn" :disabled="!currentPrice">Realizar Transacción</button>
    </form>
  </div>
</template>

<script>
import { useUserStore } from '@/stores/userStore';
import { useCryptoStore } from '@/stores/cryptoStore';
import { useTransactionStore } from '@/stores/transactionStore';
import { mapState } from 'pinia';

export default {
  name: 'TransactionForm',
  data() {
    return {
      selectedCrypto: "btc",
      transactionQuantity: null,
      transactionType: "purchase",
      transactionMoney: null,
    };
  },
  computed: {
    ...mapState(useCryptoStore, ['availableCryptos']),
    currentPrice() {
      const cryptoStore = useCryptoStore();
      return cryptoStore.getPrice(this.selectedCrypto);
    },
    transactionPrice() {
      if (!this.currentPrice) return 0;
      return this.transactionType === 'purchase' ? this.currentPrice.ask : this.currentPrice.bid;
    }
  },
  methods: {
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
      const transactionStore = useTransactionStore();

      if (!userStore.userName) {
        alert("Error: No se ha identificado al usuario. Por favor, inicie sesión de nuevo.");
        return;
      }

      if (!this.transactionQuantity || this.transactionQuantity <= 0) {
        alert("Por favor, ingresa una cantidad válida.");
        return;
      }

      if (this.transactionType === 'sale') {
        const holding = userStore.getHolding(this.selectedCrypto);
        if (this.transactionQuantity > holding) {
          alert(`No tienes suficientes fondos. Saldo actual: ${holding.toFixed(6)} ${this.selectedCrypto.toUpperCase()}.`);
          return;
        }
      }

      const transactionData = {
        user_id: userStore.userName,
        action: this.transactionType,
        crypto_code: this.selectedCrypto,
        crypto_amount: this.transactionQuantity.toString(),
        money: this.transactionMoney.toString(),
        datetime: new Date().toISOString(),
      };

      try {
        await transactionStore.addTransaction(transactionData);
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
    },
    selectedCrypto() {
      this.updateMoney();
    }
  },
  mounted() {
    const cryptoStore = useCryptoStore();
    if (Object.keys(cryptoStore.prices).length === 0) {
      cryptoStore.fetchPrices();
    }
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
