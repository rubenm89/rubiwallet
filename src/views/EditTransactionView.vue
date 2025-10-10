<template>
  <div class="edit-transaction-view">
    <h1>Editar Transacción</h1>
    <form v-if="transaction" @submit.prevent="updateTransaction">
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
        <button type="submit" class="btn-save">Guardar Cambios</button>
        <button type="button" @click="cancel" class="btn-cancel">Cancelar</button>
      </div>
    </form>
    <p v-else>Cargando transacción...</p>
  </div>
</template>

<script>
import { axiosData } from '../service/axios';

export default {
  name: 'EditTransactionView',
  data() {
    return {
      transaction: null,
    };
  },
  methods: {
    async fetchTransaction() {
      const transactionId = this.$route.params.id;
      try {
        const response = await axiosData.get(`/transactions/${transactionId}`);
        // The API returns datetime in ISO format, need to format for datetime-local input
        const apiDate = new Date(response.data.datetime);
        // Adjust for local timezone offset
        const timezoneOffset = apiDate.getTimezoneOffset() * 60000; //offset in milliseconds
        const localDate = new Date(apiDate.getTime() - timezoneOffset);
        response.data.datetime = localDate.toISOString().slice(0, 16);
        this.transaction = response.data;
      } catch (error) {
        console.error("Error al obtener la transacción:", error);
        alert("No se pudo cargar la información de la transacción.");
      }
    },
    async updateTransaction() {
      const transactionId = this.transaction._id;
      const dataToUpdate = {
        crypto_amount: this.transaction.crypto_amount.toString(),
        money: this.transaction.money.toString(),
        datetime: new Date(this.transaction.datetime).toISOString(),
      };

      try {
        await axiosData.patch(`/transactions/${transactionId}`, dataToUpdate);
        alert("Transacción actualizada con éxito.");
        this.$router.push('/history');
      } catch (error) {
        console.error("Error al actualizar la transacción:", error);
        alert("No se pudo guardar los cambios.");
      }
    },
    cancel() {
      this.$router.push('/history');
    },
  },
  mounted() {
    this.fetchTransaction();
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
</style>
