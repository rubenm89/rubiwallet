import { axiosData } from './axios';

export const transactionService = {
  async getAllTransactions(userId) {
    try {
      const response = await axiosData.get(`/transactions?q=${JSON.stringify({ user_id: userId })}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener las transacciones:", error);
      throw new Error("No se pudo cargar el historial de transacciones.");
    }
  },

  async getTransactionById(id) {
    try {
      const response = await axiosData.get(`/transactions/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener la transacción:", error);
      throw new Error("No se pudo cargar la información de la transacción.");
    }
  },

  async updateTransaction(id, data) {
    const dataToUpdate = {
      crypto_amount: data.crypto_amount.toString(),
      money: data.money.toString(),
      datetime: new Date(data.datetime).toISOString(),
    };

    try {
      await axiosData.patch(`/transactions/${id}`, dataToUpdate);
    } catch (error) {
      console.error("Error al actualizar la transacción:", error);
      throw new Error("No se pudo guardar los cambios.");
    }
  },
  
  async deleteTransaction(id) {
    try {
      await axiosData.delete(`/transactions/${id}`);
    } catch (error) {
      console.error("Error al eliminar la transacción:", error);
      throw new Error("No se pudo eliminar la transacción.");
    }
  },

  async postTransaction(transactionData) {
    try {
        const response = await axiosData.post('/transactions', transactionData);
        return response.data;
    } catch (error) {
        console.error('Error al registrar la transacción:', error.response.data);
        throw new Error('Error al registrar la transacción');
    }
}

};
