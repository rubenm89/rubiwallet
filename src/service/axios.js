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

export { axiosData, axiosQoutes };