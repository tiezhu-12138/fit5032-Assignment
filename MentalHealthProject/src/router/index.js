import { createRouter, createWebHistory } from 'vue-router'
import { ref } from 'vue'

const isAuthenticated = ref(false)

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
    component: () => import('../views/AccountView.vue')
  },
  {
    path: '/admin',
    name: 'admin',
    component: () => import('../views/AdminView.vue')
  },
  {
    path: '/appointment',
    name: 'appointment',
    component: () => import('../views/AppointmentView.vue')
  },
  {
    path: '/articles',
    name: 'articles',
    component: () => import('../views/ArticlesView.vue')
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
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
export { isAuthenticated }
