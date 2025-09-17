<template>
    <div class="dashboard">
      <!--<h1>Bienvenido, {{ userName }}</h1>  -->
      <h1>Bienvenido, <p v-if="userStore.userName">{{ userStore.userName }}</p>
        <p v-else>visitante</p></h1>    
      <DashboardStats />
    </div>
</template>  

<script>
import { useUserStore } from '@/stores/userStore';
import DashboardStats from '@/components/DashboardStats.vue';

export default {
  name: 'DashboardView',
  components: {
    DashboardStats,
  },
  setup() {
    const userStore = useUserStore();
    
    console.log("Estado del store en DashboardView:", userStore);      
    console.log("Valor de userStore.userName:", userStore.userName);
    
    return { userStore };
  }
};
</script>

<style scoped>
.dashboard {
  padding: 20px;
}
</style>