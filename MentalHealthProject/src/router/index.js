import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
// import AboutView from '../views/AboutView.vue'
// import AccountView from '../views/AccountView.vue'
// import AdminView from '../views/AdminView.vue'
// import AppointmentView from '../views/AppointmentView.vue'
// import ArticlesView from '../views/ArticlesView.vue'
// import LoginView from '../views/LoginView.vue'
// import MoodTrackView from '../views/MoodTrackView.vue'
// import RegisterView from '../views/RegisterView.vue'
// import ResourceView from '../views/ResourceView.vue'
// import TestsView from '../views/TestsView.vue'
import { ref } from 'vue'

const isAuthenticated = ref(false)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
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
