import axios from 'axios';

//PARA DATOS DE USUARIOS
const axiosData = axios.create({
    baseURL: 'https://labor3-d60e.restdb.io/rest/',
    headers: {'x-apikey': '64a2e9bc86d8c525a3ed8f63'}
});

axiosData.interceptors.response.use(
  response => response,
  error => {
    console.error("Error en la respuesta de la API de datos:", error);
    return Promise.reject(error);
  }
);

////////////////////////////////////////////////////////////////////////////
//PARA DATOS DE CRYPTO
const axiosQoutes = axios.create({
  baseURL: 'https://criptoya.com/api/',
  headers: {'Content-Type':'application/json'}
});

axiosQoutes.interceptors.response.use(
  response => response,
  error => {
    console.error("Error en la respuesta de la API de cotizaciones:", error);
    return Promise.reject(error);
  }
);

// FUNCIÓN PARA OBTENER EL PRECIO DE CRIPTOMONEDAS
export const getCryptoPrice = async (exchange, crypto, fiat, volume) => {
  try {
    const url = `https://api.allorigins.win/raw?url=https://criptoya.com/api/${exchange}/${crypto}/${fiat}/${volume}`;
    console.log("URL generada:", `${url}`);  // <-- LOG DE LA URL COMPLETA
    const response = await axiosQoutes.get(url);     
    return response.data;    
  } catch (error) {    
    console.error("Error al obtener cotización:", error);
    throw error;
  }
};

export { axiosData, axiosQoutes };