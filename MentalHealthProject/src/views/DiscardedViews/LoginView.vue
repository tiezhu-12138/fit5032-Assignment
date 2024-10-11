<script setup>
import { ref } from 'vue'
import { isAuthenticated } from '../../router/index.js'
import { isAdmin } from '../../router/index.js'
import { isSupport } from '../../router/index.js'
import { role } from '../../router/index.js'
import { useRouter } from 'vue-router'

const router = useRouter()
const sanitizeInput = (input) => input.replace(/<script.*?>.*?<\/script>/gi, '') // Basic XSS prevention
const formData = ref({
  username: '',
  password: ''
})

const submitForm = () => {
  const username = sanitizeInput(formData.value.username)
  const password = sanitizeInput(formData.value.password)
  const users = JSON.parse(localStorage.getItem('user')) || []
  const isUserRight = users.find((u) => u.username === username && u.password === password)

  if (isUserRight) {
    alert('Login successful!')
    role.value = isUserRight.role
    if (role.value === 'admin') {
      isAdmin.value = true
      isAuthenticated.value = true
    } else if (role.value === 'support') {
      isSupport.value = true
      isAuthenticated.value = true
    } else {
      isAuthenticated.value = true
    }
    router.push({ name: 'home' })
  } else {
    alert('Invalid username or password. Please try again.')
  }
}
</script>

<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-8 offset-md-2">
        <h1 class="text-center">MINDBRIDGE</h1>
        <p class="text-center">Please enter your username and password to proceed.</p>
        <form @submit.prevent="submitForm">
          <div class="row mb-3">
            <div class="col-md-6 col-sm-6 offset-3">
              <label for="username" class="form-label">Username</label>
              <input type="text" class="form-control" id="username" v-model="formData.username" />
            </div>
          </div>

          <div class="row mb-3">
            <div class="col-md-6 col-sm-6 offset-3">
              <label for="password" class="form-label">Password</label>
              <input
                type="password"
                class="form-control"
                id="password"
                v-model="formData.password"
              />
            </div>
          </div>

          <div class="text-center">
            <button type="submit" class="btn btn-primary me-2 mb-2">Log in</button>
            <p class="text-center">
              Don't have an account? <router-link to="/register">Register</router-link>
            </p>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
body {
  background-color: #395244; /* Sets the background color of the entire page */
  font-family: 'Roboto', sans-serif;
}

.container {
  font-family: 'Roboto', sans-serif;
  max-width: 80vw;
  margin: 0 auto;
  padding: 20px;
  background-color: #f6f0e7;
  border-radius: 10px;
}

button {
  background-color: #395244;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}
</style>
