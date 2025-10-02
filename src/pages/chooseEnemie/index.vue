<route lang="yaml">
  path: /chooseEnemie
  meta:
  requiresAuth: true
</route>

<template>
  <div class="flex flex-col min-h-screen">
    <AppHeader />
      <div class="flex-1 overflow-auto p-4">
        <PokemonEnemie />
      </div>
    <AppFooter />
  </div>
</template>

<script setup>
import PokemonEnemie from '@/components/pokemonEnemie/PokemonEnemie.vue';

</script>
