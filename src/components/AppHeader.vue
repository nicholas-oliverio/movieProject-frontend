<template>
  <v-app-bar>
    <v-toolbar-title>Plime Video</v-toolbar-title>
    <v-spacer />
    <v-btn variant="text" @click="openDetailsProfile">PROFILE</v-btn>
    <v-btn v-if="!isAuthed" variant="text" :to="{ path: '/login' }">Login</v-btn>
    <v-btn v-else variant="text" @click="doLogout">Logout</v-btn>
  </v-app-bar>

   <v-dialog v-model="dialog" max-width="420">
    <v-card>
      <v-card-title>Profilo</v-card-title>

      <v-card-text>
        <div v-if="loading">Caricamento…</div>
        <div v-else-if="error" class="text-error">{{ error }}</div>
        <div v-else-if="detail">
          <p><strong>Nome:</strong> {{ detail.name }}</p>
          <p><strong>Email:</strong> {{ detail.email }}</p>
        </div>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="dialog=false">Chiudi</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import api from '@/axios'

const auth = useAuthStore()
const router = useRouter()
const dialog = ref(false)
const loading = ref(false)
const error = ref("")
const isAuthed = computed(() => !!auth.token)
const detail = ref(null)

function doLogout() {
  auth.logout()              
  router.push('/login')      
}

async function openDetailsProfile() {
 
  dialog.value = true;
  loading.value = true;
  error.value = "";
  detail.value = null;
  try {
    const { data } = await api.get("/me");
    detail.value = data.data || data; 

  } catch (err) {
    console.error("Errore profilo:", err);
    error.value = err?.response?.data?.error || err?.message || "Errore profilo";
  } finally {
    loading.value = false;
  }
}

</script>
