<script setup>
import { isAuthenticated } from '../router/index.js'
import { useRouter } from 'vue-router'

const router = useRouter()

const logout = () => {
  isAuthenticated.value = false
  router.push({ name: 'Login' })
}
</script>

<template>
  <div class="container">
    <header class="d-flex justify-content-center py-3">
      <ul class="nav nav-pills">
        <li class="nav-item">
          <router-link to="/" class="nav-link" active-class="active" aria-current="page"
            >Home</router-link
          >
        </li>
        <li class="nav-item" v-if="isAuthenticated">
          <router-link to="/about" class="nav-link" active-class="active">About</router-link>
        </li>

        <li class="nav-item" v-if="!isAuthenticated">
          <router-link to="/login" class="nav-link" active-class="active">Login</router-link>
        </li>

        <li class="nav-item" v-else>
          <button class="nav-link btn btn-link disabled">Login</button>
        </li>

        <li class="nav-item" v-if="isAuthenticated">
          <button class="nav-link btn tn-link" @click="logout">Logout</button>
        </li>

        <li class="nav-item">
          <router-link to="/login" class="nav-link" active-class="active">Self Tests</router-link>
        </li>

        <li class="nav-item">
          <router-link to="/appointments" class="nav-link" active-class="active"
            >Mood Tracking</router-link
          >
        </li>

        <li class="nav-item">
          <router-link to="/appointments" class="nav-link" active-class="active"
            >Resources</router-link
          >
        </li>

        <li class="nav-item">
          <router-link to="/appointments" class="nav-link" active-class="active"
            >Appointments</router-link
          >
        </li>

        <li class="nav-item">
          <router-link to="/appointments" class="nav-link" active-class="active"
            >Articles</router-link
          >
        </li>
      </ul>
    </header>
  </div>
</template>

<style scoped>
.b-example-divider {
  height: 3rem;
  background-color: rgba(0, 0, 0, 0.1);
  border: solid rgba(0, 0, 0, 0.15);
  border-width: 1px 0;
  box-shadow:
    inset 0 0.5em 1.5em rgba(0, 0, 0, 0.1),
    inset 0 0.125em 0.5em rgba(0, 0, 0, 0.15);
}

.form-control-dark {
  color: #fff;
  background-color: var(--bs-dark);
  border-color: var(--bs-gray);
}
.form-control-dark:focus {
  color: #fff;
  background-color: var(--bs-dark);
  border-color: #fff;
  box-shadow: 0 0 0 0.25rem rgba(255, 255, 255, 0.25);
}

.bi {
  vertical-align: -0.125em;
  fill: currentColor;
}

.text-small {
  font-size: 85%;
}

.dropdown-toggle {
  outline: 0;
}
</style>
