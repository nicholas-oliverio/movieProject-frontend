/**
 * router/index.js
 * Automatic routes for `./src/pages/*.vue`
 */

import { createRouter, createWebHistory } from 'vue-router/auto'
import { setupLayouts } from 'virtual:generated-layouts'
import { routes } from 'vue-router/auto-routes'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: setupLayouts(routes),
})

function parseJwt(token) {
  try {
    const base64 = token.split('.')[1]
    const json = atob(base64)
    return JSON.parse(json)
  } catch {
    return null
  }
}
function isTokenValid(token) {
  if (!token) return false
  const p = parseJwt(token)
  if (!p || !p.exp) return false
  return p.exp * 1000 > Date.now()
}

const PUBLIC_PATHS = ['/login', '/register']

router.beforeEach((to) => {
  const auth = useAuthStore()
  const valid = isTokenValid(auth.token)
  const isPublic = PUBLIC_PATHS.includes(to.path)

  if (isPublic) {
    if (valid && to.path === '/login') return { path: '/' }
    return true
  }

  const requires = to.meta?.requiresAuth ?? true
  if (requires && !valid) {
    return { path: '/login', query: { redirect: to.fullPath } }
  }

  return true
})

router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (localStorage.getItem('vuetify:dynamic-reload')) {
      console.error('Dynamic import error, reloading page did not fix it', err)
    } else {
      console.log('Reloading page to fix dynamic import error')
      localStorage.setItem('vuetify:dynamic-reload', 'true')
      location.assign(to.fullPath)
    }
  } else {
    console.error(err)
  }
})

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload')
})

export default router
