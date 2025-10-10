<template>
  <div class="operar-view">
    <h1>Operar con Criptomonedas</h1>
    <TransactionForm @transaction-completed="handleSuccess" />
  </div>
</template>

<script>
import TransactionForm from '@/components/TransactionForm.vue';

export default {
  name: 'OperarView',
  components: {
    TransactionForm,
  },
  methods: {
    handleSuccess() {
      this.$router.push('/dashboard');
    },
  },
};
</script>

<style scoped>
.operar-view {
  max-width: 600px;
  margin: auto;
  padding: 1rem;
}
</style>
