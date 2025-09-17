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
    userId() {
      const userStore = useUserStore();
      return userStore.userId; // Obtiene el ID del usuario logueado desde Pinia
    },
  },
};
</script>