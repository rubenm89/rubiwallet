<template>
  <div class="history">      
    <TransactionHistory /> 
  </div>
</template>

<script>
import { useUserStore } from '@/stores/userStore';
import TransactionHistory from '@/components/TransactionHistory.vue';

export default {
  name: 'HistoryView',
  components: { 
    TransactionHistory,
  },
  computed: {
    userName() {
      const userStore = useUserStore();
      return userStore.userName; // Obtiene el usuario logueado desde Pinia
    },
  },
};
</script>