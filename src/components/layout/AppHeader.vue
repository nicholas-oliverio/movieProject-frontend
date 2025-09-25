<template>
  <v-app-bar>
    <v-toolbar-title>Plime Video</v-toolbar-title>
    <v-spacer />

    <v-btn v-if="!isAuthed" variant="text" :to="{ path: '/login' }">Login</v-btn>
    <v-btn v-else variant="text" @click="doLogout">Logout</v-btn>
  </v-app-bar>

   <v-dialog v-model="dialog" max-width="420">
    <v-card>
      <v-card-title>Profilo</v-card-title>

      <v-card-text>
        <div v-if="auth.user">
          <p><strong>Nome:</strong></p>
          <p><strong>Email:</strong></p>
        </div>
      </v-card-text>

      <v-card-actions>
        <v-btn variant="text" @click="dialog=false">Chiudi</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()
const dialog = ref(false)
const isAuthed = computed(() => !!auth.token)


function doLogout() {
  auth.logout()              
  router.push('/login')      
}

</script>
