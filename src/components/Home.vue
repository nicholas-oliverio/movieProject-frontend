<template>
 <v-container style="height: 550px; width: 900px;margin-top:100px; display: flex; justify-content: center;
                     flex-direction: column; align-items: center; gap: 20px;">
      <h1>Welcome</h1>
      <p style="font-size: 10px;">wait for loading...</p>
      <v-progress-circular v-if="loading"
          color="red"
          indeterminate
      ></v-progress-circular>
 </v-container>
</template>
<script setup>

const loading = ref(true)
</script>