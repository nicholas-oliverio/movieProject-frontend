<route lang="yaml">
path: /movie
meta:
  requiresAuth: true
</route>
<template>
  <div className="flex flex-col min-h-screen">
    <AppHeader />
      <div className="flex-1 overflow-auto p-4">
        <Movie />
      </div>
    <AppFooter />
  </div>
</template>

<script setup>
import Movie from '@/components/movie/Movie.vue';

</script>
