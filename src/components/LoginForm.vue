<template>
  <section>
    <form @submit.prevent="handleSubmit">
      <div>
          <label for="userName">Usuario: </label>
          <input type="text" id="userName" v-model="userStore.userName" placeholder="Ingresa tu usuario" required />          
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
import { useRouter } from 'vue-router'// esto nose para que

export default {
  setup() {
    const userStore = useUserStore()
    const router = useRouter() 
    const password = ref('')
    const errorMessage = ref('')

    const handleSubmit = () => {
        if (!userStore.userName || !password.value) {
        errorMessage.value = 'Por favor, completa ambos campos.'
      } else {
        errorMessage.value = ''

        // Aquí es donde deberías realizar la autenticación (ejemplo con datos estáticos)
        // Ejemplo de datos del usuario
        const userData = { userName: userStore.userName, password: password.value }
        const token = 'algun_token_aca'; // Este token vendría de tu API tras autenticar al usuario
        
        // Llamamos al método de login de la store (almacenando usuario y token)
        userStore.login(userData, token) // Guarda el usuario en Pinia
        console.log('Usuario:', userStore.userName) // Sacar después        
        console.log('Contraseña:', password.value) // Sacar después
        console.log('en el userData hay:', userData)
        
        router.push('/dashboard') // Redirige al dashboard
      }
    }

    return { userStore, password, errorMessage, handleSubmit }
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
  