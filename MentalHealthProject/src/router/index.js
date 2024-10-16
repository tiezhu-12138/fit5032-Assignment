import { createRouter, createWebHistory } from 'vue-router'
import { isAuthenticated, isAdmin, isSupport, role } from '../firebase/auth'

console.log('User authenticated:', isAuthenticated.value);
console.log('User role:', role.value);

const routes = [
  // {
  //   path: '/email',
  //   name: 'Email',
  //   component: () => import('../views/DiscardedViews/EmailTestView.vue')
  // },
  {
    path: '/FBLogin',
    name: 'FBLogin',
    component: () => import('../views/FBLoginView.vue')
  },
  {
    path: '/FBRegister',
    name: 'FBRegister',
    component: () => import('../views/FBRegisterView.vue')
  },
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomeView.vue')
  },
  {
    path: '/admin',
    name: 'admin',
    component: () => import('../views/AdminView.vue'),
    beforEnter: (to, from, next) => {
      if (isAdmin.value && isAuthenticated.value) {
        next()
      } else {
        next({ name: 'FBlogin' })
      }
    }
  },
  {
    path: '/articles',
    name: 'articles',
    component: () => import('../views/ReviewView.vue')
  },
  // {
  //   path: '/login',
  //   name: 'login',
  //   component: () => import('../views/LoginView.vue')
  // },
  {
    path: '/moodtrack',
    name: 'moodtrack',
    component: () => import('../views/MoodTrackView.vue')
  },
  // {
  //   path: '/register',
  //   name: 'register',
  //   component: () => import('../views/DiscardedViews/RegisterView.vue')
  // },
  {
    path: '/resource',
    name: 'resource',
    component: () => import('../views/ResourceView.vue')
  },
  // {
  //   path: '/tests',
  //   name: 'tests',
  //   component: () => import('../views/DiscardedViews/TestsView.vue')
  // },
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
// export { isAuthenticated }
// export { isAdmin }
// export { isSupport }
// export { role }
