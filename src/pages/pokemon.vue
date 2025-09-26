<route lang="yaml">
  path: /pokemon
  meta:
  requiresAuth: true
</route>

<template>
  <div className="flex flex-col min-h-screen">
    <AppHeader />
      <div className="flex-1 overflow-auto p-4">
        <Pokemon />
      </div>
    <AppFooter />
  </div>
</template>

<script setup>
import Pokemon from '@/components/pokemon/Pokemon.vue';

</script>
