<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '../firebase/init.js' // Adjust the path if necessary

// Reactive variables for authentication state and roles
import { isAuthenticated } from '../router/index.js'
import { isAdmin } from '../router/index.js'
import { isSupport } from '../router/index.js'
import { role } from '../router/index.js'

const router = useRouter()
const sanitizeInput = (input) => input.replace(/<script.*?>.*?<\/script>/gi, '') // Basic XSS prevention

const formData = ref({
  email: '',
  password: ''
})

const submitForm = async () => {
  const email = sanitizeInput(formData.value.email)
  const password = sanitizeInput(formData.value.password)

  try {
    // Sign in the user with Firebase Auth
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    // Fetch user data from Firestore to get the role
    const userDocRef = doc(db, 'users', user.uid)
    const userDocSnap = await getDoc(userDocRef)

    if (userDocSnap.exists()) {
      const userData = userDocSnap.data()
      role.value = userData.role

      // Set authentication and role flags
      isAuthenticated.value = true
      if (role.value === 'admin') {
        isAdmin.value = true
      } else if (role.value === 'support') {
        isSupport.value = true
      }

      alert('Login successful!')
      router.push({ name: 'home' })
    } else {
      // User data not found in Firestore
      alert('User data not found.')
    }
  } catch (error) {
    const errorCode = error.code
    const errorMessage = error.message

    if (errorCode === 'auth/user-not-found' || errorCode === 'auth/wrong-password') {
      alert('Invalid email or password. Please try again.')
    } else {
      alert(errorMessage)
    }
  }
}
</script>

<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-8 offset-md-2">
        <h1 class="text-center">MINDBRIDGE</h1>
        <p class="text-center">Please enter your email and password to proceed.</p>
        <form @submit.prevent="submitForm">
          <div class="row mb-3">
            <div class="col-md-6 col-sm-6 offset-3">
              <label for="email" class="form-label">Email</label>
              <input type="email" class="form-control" id="email" v-model="formData.email" />
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
