import { axiosData } from './axios';

export const transactionService = {
  async fetchTransactionById(id) {
    try {
      const response = await axiosData.get(`/transactions/${id}`);
      // La API devuelve la fecha y hora en formato ISO, es necesario formatearla para el input datetime-local
      const apiDate = new Date(response.data.datetime);
      // Ajustar según la zona horaria local
      const timezoneOffset = apiDate.getTimezoneOffset() * 60000; //desplazamiento en milisegundos
      const localDate = new Date(apiDate.getTime() - timezoneOffset);
      response.data.datetime = localDate.toISOString().slice(0, 16);
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
      return true; // Indicar éxito
    } catch (error) {
      console.error("Error al actualizar la transacción:", error);
      throw new Error("No se pudo guardar los cambios.");
    }
  },
};
