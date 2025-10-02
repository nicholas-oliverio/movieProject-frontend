<route lang="yaml">
  path: /
  meta:
  requiresAuth: true
</route>

<template>
  <div class="flex flex-col min-h-screen">
    <AppHeader />
      <div class="flex-1 overflow-auto p-4">
        <Home />
      </div>
    <AppFooter />
  </div>
</template>

<script setup>
import Home from '@/components/Home.vue';

</script>
