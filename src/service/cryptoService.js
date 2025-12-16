import { axiosQoutes } from './axios';

export const getCryptoPrice = async (exchange, crypto, fiat, volume) => {
  try {
    const url = `${exchange}/${crypto}/${fiat}/${volume}`;   
    const response = await axiosQoutes.get(url);     
    return response.data;    
  } catch (error) {    
    console.error("Error al obtener cotización:", error);
    throw error;
  }
};
