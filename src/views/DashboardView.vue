<template>
    <div class="dashboard">     
      <h1>Bienvenido, <span v-if="userStore.userName">{{ userStore.userName }}</span>
        <span v-else>visitante</span></h1>    
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
        
    return { userStore };
  }
};
</script>

<style scoped>
.dashboard {
  padding: 20px;
}
</style>