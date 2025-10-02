<route lang="yaml">
  path: /chooseEnemie/arena
  meta:
  requiresAuth: true
</route>

<template>
  <div class="flex flex-col min-h-screen">
    <AppHeader />
      <div class="flex-1 overflow-auto p-4">
        <PokeArena />
      </div>
    <AppFooter />
  </div>
</template>

<script setup>
import PokeArena from '@/components/pokearena/PokeArena.vue';

</script>
