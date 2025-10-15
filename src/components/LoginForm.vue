<template>
  <section>
    <form @submit.prevent="handleSubmit">
      <div>
          <label for="userName">Usuario: </label>
          <input type="text" id="userName" v-model="userName" placeholder="Ingresa tu usuario" required />          
      </div>

      <div>
      <label for="password">Contraseña</label>
      <input type="password" id="password" v-model="password" placeholder="Ingrese su contraseña" required/>
      </div>
      
      <button type="submit">Ingresar</button>
      <p v-show="errorMessage" style="color: red">{{ errorMessage }}</p>
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
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 300px;
  margin: auto;
}
input {
  padding: 5px;
  font-size: 14px;
}
button {
  background-color: #007bff;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
button:hover {
  background-color: #0056b3;
}
</style> 
  