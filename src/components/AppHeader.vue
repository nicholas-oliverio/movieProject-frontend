<template>
  <v-app-bar>
    <v-toolbar-title>Plime Video</v-toolbar-title>
    <v-spacer />
    <v-btn variant="text" @click="openDetailsProfile()">PROFILE</v-btn>
    <v-btn v-if="!isAuthed" variant="text" :to="{ path: '/login' }">Login</v-btn>
    <v-btn v-else variant="text" @click="doLogout">Logout</v-btn>
  </v-app-bar>

  <v-dialog v-model="dialog">
   <v-card>
   
      <v-card-title>{{detail?.name}}</v-card-title>
      <p>{{ detail?.email }}</p>
      <v-btn text="Close" @click="dialog=false"></v-btn>
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
const detail = ref()
const isAuthed = computed(() => !!auth.token)


function doLogout() {
  auth.logout()              
  router.push('/login')      
}

async function openDetailsProfile(){

  dialog.value = true
  detail.value = null
  try{
    const {data} = await api.get(`/users/${auth.user.id}`)
    detail.value = data?.data ?? data
  }catch(err){
    console.error('errore nel recupero dei dettagli',err)
  }
}
</script>
