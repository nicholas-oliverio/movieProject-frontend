

<template>
  <div class="mx-auto max-w-sm py-10">
    <h1 class="text-2xl font-semibold mb-6">Login</h1>

    <!-- Se usi Vuetify, togli questo form "puro" e usa quello sotto -->
    <form class="space-y-4" @submit.prevent="doLogin" v-if="!useVuetify">
      <input
        v-model.trim="name"
        type="text"
        placeholder="Username"
        class="w-full border rounded px-3 py-2"
        autocomplete="username"
        required
      />
      <input
        v-model="password"
        :type="showPassword ? 'text' : 'password'"
        placeholder="Password"
        class="w-full border rounded px-3 py-2"
        autocomplete="current-password"
        required
      />
      <label class="text-sm flex items-center gap-2">
        <input type="checkbox" v-model="showPassword" />
        Mostra password
      </label>

      <button
        class="w-full rounded bg-black text-white py-2 disabled:opacity-50"
        :disabled="loading"
        type="submit"
      >
        {{ loading ? 'Accesso…' : 'Entra' }}
      </button>

      <p v-if="error" class="text-red-600 text-sm mt-2">{{ error }}</p>
    </form>


    <v-form v-else @submit.prevent="doLogin">
      <v-text-field
        v-model.trim="name"
        label="Username"
        autocomplete="username"
        variant="outlined"
        density="comfortable"
        :disabled="loading"
        required
        class="mb-3"
      />
      <v-text-field
        v-model="password"
        :type="showPassword ? 'text' : 'password'"
        label="Password"
        autocomplete="current-password"
        variant="outlined"
        density="comfortable"
        :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
        @click:append-inner="showPassword = !showPassword"
        :disabled="loading"
        required
        class="mb-3"
      />
      <v-btn
        type="submit"
        color="primary"
        block
        :loading="loading"
        :disabled="!name || !password"
      >
        Entra
      </v-btn>

      <v-alert v-if="error" type="error" class="mt-3" density="compact">
        {{ error }}
      </v-alert>
    </v-form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/axios'
import { useAuthStore } from '@/stores/auth'

// Se usi Vuetify metti true
const useVuetify = true

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
    // salva token
    auth.login(res.data.token)

    // redirect dove voleva andare (query ?redirect=...), altrimenti home
    const back = (route.query.redirect as string) || '/'
    await router.replace(back)
  } catch (e: any) {
    error.value = e?.response?.data?.msg || 'Credenziali non valide'
  } finally {
    loading.value = false
  }
}
</script>
