<template>
  <div class="history">      
    <TransactionHistory /> 
  </div>
</template>

<script>

import TransactionHistory from '@/components/TransactionHistory.vue';

export default {
  name: 'HistoryView',
  components: { 
    TransactionHistory,
  },

};
</script>