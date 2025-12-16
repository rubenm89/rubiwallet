<template>
  <div class="edit-transaction-view">
    <h1>Editar Transacción</h1>
    <p v-if="loading">Cargando transacción...</p>
    <form v-if="transaction" @submit.prevent="saveChanges">
      <label for="crypto">Criptomoneda:</label>
      <input id="crypto" :value="transaction.crypto_code.toUpperCase()" disabled />

      <label for="action">Tipo de Operación:</label>
      <input id="action" :value="transaction.action === 'purchase' ? 'Compra' : 'Venta'" disabled />

      <label for="quantity">Cantidad:</label>
      <input id="quantity" type="number" step="0.000001" v-model.number="transaction.crypto_amount" required />

      <label for="money">Monto (ARS):</label>
      <input id="money" type="number" step="0.01" v-model.number="transaction.money" required />

      <label for="datetime">Fecha y Hora:</label>
      <input id="datetime" type="datetime-local" v-model="transaction.datetime" required />

      <div class="form-actions">
        <button type="submit" class="btn-save" :disabled="loading">
          {{ loading ? 'Guardando...' : 'Guardar Cambios' }}
        </button>
        <button type="button" @click="cancel" class="btn-cancel">Cancelar</button>
      </div>
    </form>
  </div>
</template>

<script>
import { mapActions, mapState } from 'pinia';
import { useTransactionStore } from '@/stores/transactionStore';

export default {
  name: 'EditTransactionForm',
  data() {
    return {
      transaction: null, // Estado local para la transacción en edición separado del store
    };
  },
  computed: {
    ...mapState(useTransactionStore, ['loading', 'currentTransaction']),
  },
  watch: {
    currentTransaction(newTx) {
      if (newTx) {
        // Clonar para evitar la mutación directa del estado de Pinia
        this.transaction = { ...newTx };
      }
    }
  },
  methods: {
    ...mapActions(useTransactionStore, ['updateTransaction', 'getTransactionById']),
    async saveChanges() {
      if (!this.transaction) return;
      try {
        const { _id, crypto_amount, money, datetime } = this.transaction;
        await this.updateTransaction(_id, { crypto_amount, money, datetime });
        alert("Transacción actualizada con éxito.");
        this.$router.push('/history');
      } catch (error) {
        console.error("Error al guardar cambios en el formulario:", error);
        alert("Error al actualizar la transacción: " + error.message);
      }
    },
    cancel() {
      this.$router.push('/history');
    },
  },
  created() {
    const transactionId = this.$route.params.id;
    this.getTransactionById(transactionId);
  },
};
</script>

<style scoped>
.edit-transaction-view {
  max-width: 600px;
  margin: auto;
  padding: 2rem;
  border: 1px solid #ccc;
  border-radius: 10px;
}

form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

input {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

input:disabled {
  background-color: #f2f2f2;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}

.btn-save {
  background-color: #28a745;
  color: white;
}

.btn-cancel {
  background-color: #6c757d;
  color: white;
}

button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>
