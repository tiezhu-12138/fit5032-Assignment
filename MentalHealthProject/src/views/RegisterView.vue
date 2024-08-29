<script setup>
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Divider from 'primevue/divider'
import { useRouter } from 'vue-router'
import { ref } from 'vue'

const router = useRouter()

const userInfo = ref({
  username: '',
  password: ''
})

const clearForm = () => {
  ;(userInfo.value.username = ''), (userInfo.value.password = '')
}

const submitForm = () => {
  const username = userInfo.value.username
  const password = userInfo.value.password
  let user = JSON.parse(localStorage.getItem('user')) || []

  const isExist = user.some((u) => u.username === username)
  if (isExist) {
    alert('Username already exists. Please try another one.')
    clearForm()
  } else {
    let userRole = 'user' // Default role
    if (username.toLowerCase().includes('admin')) {
      userRole = 'admin'
    } else if (username.toLowerCase().includes('support')) {
      userRole = 'support'
    } else {
      userRole = 'user'
    }

    user.push({
      username: username,
      password: password,
      role: userRole
    })
    localStorage.setItem('user', JSON.stringify(user))
    alert('Registration successful!')
    clearForm()
    router.push({ name: 'home' })
  }
}

const errors = ref({
  username: null,
  password: null,
  confirmPassword: null
})

const validateName = (blur) => {
  if (userInfo.value.username.length < 3) {
    if (blur) errors.value.username = 'Name must be at least 3 characters'
  } else {
    errors.value.username = null
  }
}

const validatePassword = (blur) => {
  const password = userInfo.value.password
  const minLength = 8
  const hasUppercase = /[A-Z]/.test(password)
  const hasLowercase = /[a-z]/.test(password)
  const hasNumber = /\d/.test(password)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

  if (password.length < minLength) {
    if (blur) errors.value.password = `Password must be at least ${minLength} characters long.`
  } else if (!hasUppercase) {
    if (blur) errors.value.password = 'Password must contain at least one uppercase letter.'
  } else if (!hasLowercase) {
    if (blur) errors.value.password = 'Password must contain at least one lowercase letter.'
  } else if (!hasNumber) {
    if (blur) errors.value.password = 'Password must contain at least one number.'
  } else if (!hasSpecialChar) {
    if (blur) errors.value.password = 'Password must contain at least one special character.'
  } else {
    errors.value.password = null
  }
}

// const validateConfirmPassword = (blur) => {
//   if (formData.value.password !== formData.value.confirmPassword) {
//     if (blur) errors.value.confirmPassword = 'Passwords do not match.'
//   } else {
//     errors.value.confirmPassword = null
//   }
// }
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
              <label for="username">Username</label>
              <InputText
                id="username"
                v-model="userInfo.username"
                @blur="() => validateName(true)"
              />
              <div v-if="errors.username" class="text-danger">{{ errors.username }}</div>
            </div>
          </div>

          <div class="row mb-3">
            <div class="col-md-6 col-sm-6 offset-3">
              <label for="Password">Password</label>
              <Password v-model="userInfo.password" @blur="() => validatePassword(true)">
                <template #header>
                  <div class="font-semibold text-xm mb-4">Pick a password</div>
                </template>
                <template #footer>
                  <Divider />
                  <ul class="pl-2 ml-2 my-0 leading-normal">
                    <li>At least one lowercase</li>
                    <li>At least one uppercase</li>
                    <li>At least one numeric</li>
                    <li>Minimum 8 characters</li>
                  </ul>
                  <div v-if="errors.password" class="text-danger">{{ errors.password }}</div>
                </template>
              </Password>
            </div>
          </div>

          <div class="text-center">
            <button type="submit" class="btn btn-primary me-2 mb-2">Sign up</button>
            <!-- <p class="text-center">
              Don't have an account? <router-link to="/register">Register</router-link>
            </p> -->
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style></style>
