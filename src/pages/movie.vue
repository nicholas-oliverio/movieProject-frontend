<route lang="yaml">
path: /movie
meta:
  requiresAuth: true
</route>
<template>
  <div class="flex flex-col min-h-screen">
    <AppHeader />
      <div class="flex-1 overflow-auto p-4">
        <Movie />
      </div>
    <AppFooter />
  </div>
</template>

<script setup>
import Movie from '@/components/movie/Movie.vue';

</script>
