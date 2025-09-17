<route lang="yaml">
path: /login
meta:
  requiresAuth: false
</route>

<template>
  <Login />
</template>

<script setup>
import Login from '@/components/Login.vue'
</script>
