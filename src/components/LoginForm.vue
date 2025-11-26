<template>
  <section>
    <form @submit.prevent="handleSubmit">
      <label for="userName">Usuario</label>
      <input type="text" id="userName" v-model="userName" placeholder="Ingresa tu usuario" required />

      <label for="password">Contraseña</label>
      <input type="password" id="password" v-model="password" placeholder="Ingrese su contraseña" required/>
      
      <button type="submit">Ingresar</button>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    </form>
  </section>    
</template>

<script>
import { ref } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { useRouter } from 'vue-router'

export default {
  setup() {
    const userStore = useUserStore()
    const router = useRouter()
    const userName = ref('')
    const password = ref('')
    const errorMessage = ref('')

    const handleSubmit = () => {
        if (!userName.value || !password.value) {
        errorMessage.value = 'Por favor, completa ambos campos.'
      } else {
        errorMessage.value = ''
       
        userStore.login(userName.value)
        
        router.push('/dashboard') 
      }
    }

    return { userName, password, errorMessage, handleSubmit }
  }
}
</script>

<style scoped>
form {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 10px;
  max-width: 300px;
  margin: auto;
  align-items: center;
}
label {
  text-align: left;
}
input {
  padding: 5px;
  font-size: 14px;
  width: 100%;
  box-sizing: border-box;
}
button {
  grid-column: 1 / -1;
  background-color: #007bff;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 100%;
  box-sizing: border-box;
}
.error-message {
  grid-column: 1 / -1;
  text-align: center;
  margin: 0;
  color: red;
}
button:hover {
  background-color: #0056b3;
}
</style> 
  