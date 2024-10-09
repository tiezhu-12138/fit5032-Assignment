import { createRouter, createWebHistory } from 'vue-router'
import { ref } from 'vue'

const isAuthenticated = ref(false)
const isAdmin = ref(false)
const isSupport = ref(false)
const role = ref('')

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomeView.vue')
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/AboutView.vue')
  },
  {
    path: '/account',
    name: 'account',
    component: () => import('../views/AccountView.vue'),
    beforenter: (to, from, next) => {
      if (isAuthenticated.value) {
        next()
      } else {
        next({ name: 'login' })
      }
    }
  },
  {
    path: '/admin',
    name: 'admin',
    component: () => import('../views/AdminView.vue'),
    beforenter: (to, from, next) => {
      if (isAdmin.value && isAuthenticated.value) {
        next()
      } else {
        next({ name: 'login' })
      }
    }
  },
  {
    path: '/appointment',
    name: 'appointment',
    component: () => import('../views/AppointmentView.vue'),
    beforenter: (to, from, next) => {
      if (isAdmin.value || (isSupport.value && isAuthenticated.value)) {
        next()
      } else {
        next({ name: 'login' })
      }
    }
  },
  {
    path: '/articles',
    name: 'articles',
    component: () => import('../views/ReviewView.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue')
  },
  {
    path: '/moodtrack',
    name: 'moodtrack',
    component: () => import('../views/MoodTrackView.vue')
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/RegisterView.vue')
  },
  {
    path: '/resource',
    name: 'resource',
    component: () => import('../views/ResourceView.vue')
  },
  {
    path: '/tests',
    name: 'tests',
    component: () => import('../views/TestsView.vue')
  },
  {
    path: '/review',
    name: 'review',
    component: () => import('../views/ReviewView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
export { isAuthenticated }
export { isAdmin }
export { isSupport }
export { role }
