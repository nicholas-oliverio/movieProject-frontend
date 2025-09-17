import axios from "axios";
import router from '@/router'
import { useAuthStore } from '@/stores/auth'

const api = axios.create({
  baseURL: "http://localhost:3000", // backend Express
  timeout: 5000,
  headers: { 'Content-Type': 'application/json' }
});

// Interceptor: aggiunge token se presente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  r => r,
  e => {
    if (e?.response?.status === 401) {
      const auth = useAuthStore()
      auth.logout()
      router.push({ path: '/login', query: { redirect: router.currentRoute.value.fullPath } })
    }
    return Promise.reject(e)
  }
)

export default api;
