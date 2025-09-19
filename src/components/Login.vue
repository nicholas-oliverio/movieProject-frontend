<template>
<div class="min-h-screen flex items-center justify-center">
  <div class="mx-auto max-w-xs w-full py-6">
    <h1 class="text-xl font-semibold mb-4 text-center">LOGIN</h1>

    <v-form @submit.prevent="doLogin" class="d-flex flex-column align-center ga-10"
    >
      <v-text-field
        v-model.trim="name"
        label="Username"
        autocomplete="username"
        variant="outlined"
        density="compact"
        style="max-width: 200px; width: 100%; height: 35px;"
        :disabled="loading"
        required
      />
      <v-text-field
        v-model="password"
        :type="showPassword ? 'text' : 'password'"
        label="Password"
        autocomplete="current-password"
        variant="outlined"
        density="compact"
        style="max-width: 200px; width: 100%; height: 35px;"
        :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
        @click:append-inner="showPassword = !showPassword"
        :disabled="loading"
        required
        
      />
      <v-btn
        type="submit"
        color="white"
        size="small"
        :loading="loading"
        :disabled="!name || !password"
        style="max-width: 200px; width: 100%; height: 35px;"
      >
        Entra
      </v-btn>

      <v-alert v-if="error" type="error" density="compact" class="w-full text-center" closable>
        {{ error }}
      </v-alert>
    </v-form>
  </div>
</div>


</template>


<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/axios'
import { useAuthStore } from '@/stores/auth'




const name = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const error = ref('')
const route = useRoute()
const router = useRouter()
const auth = useAuthStore()


const doLogin = async () => {
  error.value = ''
  loading.value = true
  try {
    const res = await api.post('/login', {
      name: name.value,
      password: password.value,
    })
  
    auth.login(res.data.token)


    const back = (route.query.redirect as string) || '/'
    await router.replace(back)
  } catch (e: any) {
    error.value = e?.response?.data?.msg || 'Credenziali non valide'
  } finally {
    loading.value = false
  }
}
</script>
