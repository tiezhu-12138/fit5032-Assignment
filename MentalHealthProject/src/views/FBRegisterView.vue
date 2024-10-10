<script setup>
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Divider from 'primevue/divider'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { auth, db } from '../firebase/init.js'

const router = useRouter()
const userInfo = ref({
  email: '',
  password: '',
  confirmPassword: '',
})

const errors = ref({
  email: null,
  password: null,
  confirmPassword: null
})

const clearForm = () => {
  userInfo.value.email = ''
  userInfo.value.password = ''
  userInfo.value.confirmPassword = ''
  errors.value.email = null
  errors.value.password = null
  errors.value.confirmPassword = null
}

// const submitForm = () => {
//   // Perform validation
//   validateEmail(true)
//   validatePassword(true)
//   validateConfirmPassword(true)

//   if (errors.value.email || errors.value.password || errors.value.confirmPassword) {
//     alert('Please fix the errors before submitting.')
//     return
//   }

//   const email = userInfo.value.email
//   const password = userInfo.value.password

//   console.log('Auth:', auth)
//   console.log('Firestore DB:', db)

//   createUserWithEmailAndPassword(auth, email, password)
//     .then((userCredential) => {
//       // User registered successfully
//       const user = userCredential.user
//       console.log('User registered:', user.uid)

//       let userRole = 'user' // Default role
//       if (email.toLowerCase().includes('admin')) {
//         userRole = 'admin'
//       } else if (email.toLowerCase().includes('support')) {
//         userRole = 'support'
//       }
//       console.log('Assigned role:', userRole)

//       // Save additional user info to Firestore
//       setDoc(doc(db, 'users', user.uid), {
//         email: email,
//         role: userRole,
//       })
//         .then(() => {
//           alert('Registration successful!')
//           clearForm()
//           router.push({ name: 'home' })
//         })
//         .catch((error) => {
//           console.error('Error saving user data: ', error)
//           alert('Error saving user data.')
//         })
//     })
//     .catch((error) => {
//       console.error('Registration error:', error)
//       const errorCode = error.code
//       const errorMessage = error.message
//       if (errorCode === 'auth/email-already-in-use') {
//         alert('Email already in use. Please try another one.')
//         clearForm()
//       } else {
//         alert(errorMessage)
//       }
//     })
// }
const submitForm = async () => {
  // Perform validation

  console.log('Before validation');
  validateEmail(true);
  validatePassword(true);
  validateConfirmPassword(true);
  console.log('After validation');

  if (errors.value.email || errors.value.password || errors.value.confirmPassword) {
    console.log('Validation errors:', errors.value);
    alert('Please fix the errors before submitting.');
    return;
  }

  console.log('Validation passed');

  const email = userInfo.value.email;
  const password = userInfo.value.password;

  console.log('Attempting to create user with email:', email);

  try {
    // Create user with Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log('User registered:', user.uid);

    // Determine user role
    let userRole = 'user'; // Default role
    if (email.toLowerCase().includes('admin')) {
      userRole = 'admin';
    } else if (email.toLowerCase().includes('support')) {
      userRole = 'support';
    }
    console.log('Assigned role:', userRole);

    // Save additional user info to Firestore
    await setDoc(doc(db, 'users', user.uid), {
      email: email,
      role: userRole,
    });

    alert('Registration successful!');
    clearForm();
    router.push({ name: 'home' });
  } catch (error) {
    console.error('Registration error:', error);
    const errorCode = error.code;
    const errorMessage = error.message;

    if (errorCode === 'auth/email-already-in-use') {
      alert('Email already in use. Please try another one.');
      clearForm();
    } else {
      alert('Registration error: ' + errorMessage);
    }
  }
};


const validateEmail = (blur) => {
  const email = userInfo.value.email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    if (blur) errors.value.email = 'Please enter a valid email address.'
  } else {
    errors.value.email = null
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

const validateConfirmPassword = (blur) => {
  if (userInfo.value.password !== userInfo.value.confirmPassword) {
    if (blur) errors.value.confirmPassword = 'Passwords do not match.'
  } else {
    errors.value.confirmPassword = null
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
              <label for="email">Email</label>
              <InputText id="email" v-model="userInfo.email" @blur="() => validateEmail(true)" />
              <div v-if="errors.email" class="text-danger">{{ errors.email }}</div>
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

          <div class="row mb-3">
            <div class="col-md-6 col-sm-6 offset-3">
              <label for="confirmPassword">Confirm Password</label>
              <Password
                id="confirmPassword"
                v-model="userInfo.confirmPassword"
                @blur="() => validateConfirmPassword(true)"
                :feedback="false"
              />
              <div v-if="errors.confirmPassword" class="text-danger">
                {{ errors.confirmPassword }}
              </div>
            </div>
          </div>

          <div class="text-center">
            <button type="submit" class="btn btn-primary me-2 mb-2">Sign up</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
