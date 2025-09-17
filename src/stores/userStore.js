import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    userName: null, // Aquí guardaremos el usuario
    token: null, // el token de sesión
  }),
  actions: {
    login(userData, token) {
      this.userName = userData.userName;
      this.token = token; 
    },
    logout() {
      this.userName = null; 
      this.token = null;
    },
  },
  getters: {
    isAuthenticated: (state) => !!state.token
  },
});