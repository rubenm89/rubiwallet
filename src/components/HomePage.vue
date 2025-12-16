<template>
    <div>
        <h1>RubiWallet</h1>
        <RouterLink to="/login">
            <img src="../assets/LogoRubiwallet.webp" alt="LogoRubiwallet" class="logo">
        </RouterLink>
        <br>
        <p>Click en la imagen para ingresar</p>
    </div>  
</template>

<script>
    export default {
        name: "HomePage", 
    }
</script>

<style>
.logo { 
  width: 400px; 
  height: auto; 
  border-radius: 50%; 
  object-fit: cover; 
  margin: 20px auto; 
  display: block; 
  cursor: pointer; 
  transition: transform 0.2s ease; 
}

.logo:hover {
  transform: scale(1.1); 
}

</style>

