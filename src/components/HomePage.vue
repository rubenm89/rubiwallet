<template>
    <div>
        <h1>RubiWallet</h1>
        <img src="../assets/LogoRubiwallet.webp" alt="LogoRubiwallet" class="logo" @click="goToLogin" >
        <br>
        <p>Clik en la imagen para ingresar</p>
    </div>  
</template>

<script>
    export default {
        name: "HomePage", 
        methods: {
        goToLogin() {
            this.$router.push('/login'); 
            },  
        }
    }
</script>

<style>
.logo { 
  width: 400px; /* Cambia el tamaño a lo que necesites */
  height: auto; /* Mantén la proporción de la imagen */
  border-radius: 50%; /* Hace que la imagen sea redonda */
  object-fit: cover; /* Asegura que la imagen se recorte para ajustarse al círculo */
  margin: 20px auto; /* Centra la imagen con margen */
  display: block; /* Asegura que se comporte como un bloque */
  cursor: pointer; /* Cambia el cursor al pasar sobre la imagen */
  transition: transform 0.2s ease; /* Agrega una animación suave */
}

.logo:hover {
  transform: scale(1.1); /* Aumenta ligeramente el tamaño al pasar el cursor */
}

</style>

