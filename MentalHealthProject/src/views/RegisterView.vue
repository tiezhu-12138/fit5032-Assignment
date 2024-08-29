<script setup>
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Divider from 'primevue/divider'
import { ref } from 'vue'

const userInfo = ref({
  username: '',
  password: ''
})

const clearForm = () => {
  userInfo.value.username = ''
  userInfo.value.password = ''
}

const submitForm = () => {
  const username = userInfo.value.username
  const password = userInfo.value.password
  let userInfo = JSON.parse(localStorage.getItem('userInfo')) || []

  const isExist = userInfo.find((user) => user.username === username)
  if (isExist) {
    alert('Username already exists. Please try another one.')
    clearForm()
    return
  } else {
    const userRole = username.toLowerCase().includes('admin')
      ? 'admin'
      : username.toLowerCase().includes('support')
        ? 'support'
        : 'user'
    userInfo.push({
      username: username,
      password: password,
      role: userRole
    })
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
              <label for="username">Username</label>
              <InputText id="username" v-model="userInfo.username" />
            </div>
          </div>

          <div class="row mb-3">
            <div class="col-md-6 col-sm-6 offset-3">
              <label for="Password">Password</label>
              <Password v-model="userInfo.password">
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
