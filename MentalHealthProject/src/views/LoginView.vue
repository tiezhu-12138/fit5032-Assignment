<script setup>
import { ref } from 'vue'
import { isAuthenticated } from '../router/index.js'
import { isAdmin } from '../router/index.js'
import { isSupport } from '../router/index.js'
import { useRouter } from 'vue-router'

const formData = ref({
  username: '',
  password: ''
})

const username = 'username'
const password = 'password'
const router = useRouter()

const submitForm = () => {
  if (formData.value.username === username && formData.value.password === password) {
    // alert('Login successful!')
    isAuthenticated.value = true
    router.push({ name: 'About' })
  } else {
    alert('Login failed. Please try again.')
  }
}
</script>

<template>
  <!-- Library Login Form -->
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
.container {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  max-width: 80vw;
  margin: 0 auto;
  padding: 20px;
  /* background-color: #e0bfbf; */
  border-radius: 10px;
}
</style>
