import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    userName: null, // Aquí guardaremos el usuario
  }),
  actions: {
    login(userName) {
      this.userName = userName;
    },
    logout() {
      this.userName = null;
    },
  },
});