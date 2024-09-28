<script setup>
import { isAuthenticated } from '../router/index.js'
import { isAdmin } from '../router/index.js'
import { isSupport } from '../router/index.js'
import { useRouter } from 'vue-router'

const router = useRouter()

const logout = () => {
  isAuthenticated.value = false
  isAdmin.value = false
  isSupport.value = false

  router.push({ name: 'home' })
}
</script>

<template>
  <div class="container-fluid">
    <header class="d-flex justify-content-between align-items-center py-3">
      <h1 class="navbar-brand mb-0 mx-auto" style="order: 1; font-weight: bold; padding-left: 20px">
        MINDBRIDGE
      </h1>
      <ul class="nav nav-pills flex-grow-1 justify-content-center" style="order: 2">
        <li class="nav-item">
          <router-link to="/" class="nav-link" active-class="active" aria-current="page"
            >Home</router-link
          >
        </li>

        <li class="nav-item">
          <router-link to="/tests" class="nav-link" active-class="active">Self Tests</router-link>
        </li>

        <li class="nav-item">
          <router-link to="/moodtrack" class="nav-link" active-class="active"
            >Mood Tracking</router-link
          >
        </li>

        <li class="nav-item">
          <router-link to="/resource" class="nav-link" active-class="active">Resources</router-link>
        </li>

        <li class="nav-item">
          <router-link to="/review" class="nav-link" active-class="active">Review</router-link>
        </li>

        <li class="nav-item" v-if="isAdmin || (isSupport && isAuthenticated)">
          <router-link to="/appointment" class="nav-link" active-class="active"
            >Appointment</router-link
          >
        </li>

        <li class="nav-item" v-if="isAdmin && isAuthenticated">
          <router-link to="/admin" class="nav-link" active-class="active"
            >Adimin Dashboard</router-link
          >
        </li>

        <li class="nav-item" v-if="isAuthenticated">
          <router-link to="/account" class="nav-link" active-class="active">Account</router-link>
        </li>
      </ul>
      <ul class="nav" style="order: 3; padding-right: 20px">
        <li class="nav-item" v-if="!isAuthenticated">
          <router-link to="/login" class="btn btn-outline-light login-button" active-class="active"
            >Log in</router-link
          >
        </li>
        <li class="nav-item" v-if="isAuthenticated">
          <button class="nav-link btn tn-link" @click="logout">Log out</button>
        </li>
      </ul>
    </header>
  </div>
</template>

<style scoped>
.container-fluid {
  background-color: #395244; /* Dark green background */
  color: #f6f0e7; /* Light beige text color */
  padding-left: 0;
  padding-right: 0;
}

.navbar-brand {
  font-family: 'Roboto', sans-serif;
  color: #f6f0e7;
  font-size: 1.5em;
  font-weight: bold;
}

.nav-link {
  font-family: 'Roboto', sans-serif;
  color: #f6f0e7;
}

.nav-link:hover {
  color: #395244; /* Dark green text on focus/hover */
  background-color: #f6f0e7; /* Light beige background on focus/hover */
}

.nav-link:focus {
  color: #395244; /* Dark green text on focus/hover */
  background-color: #f6f0e7; /* Light beige background on focus/hover */
  outline: none !important;
}

.login-button {
  border: 2px solid #f6f0e7; /* Add a border to the login button */
  border-radius: 5px; /* Rounded corners for the border */
  color: #f6f0e7; /* Text color for the button */
}

.login-button:focus,
.login-button:hover {
  background-color: #f6f0e7; /* Background color on focus and hover */
  color: #395244; /* Text color on focus and hover */
}

@media (max-width: 768px) {
  .nav-pills {
    flex-direction: column; /* Stack the links vertically on small screens */
    align-items: center;
  }
}
</style>
