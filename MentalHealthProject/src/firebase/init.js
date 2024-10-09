import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
// import { getAnalytics } from 'firebase/analytics'

const firebaseConfig = {
  apiKey: 'AIzaSyBLHD0QlApXB4u7elS5FH2vIayove07BXA',
  authDomain: 'fit5032project-a3ac5.firebaseapp.com',
  projectId: 'fit5032project-a3ac5',
  storageBucket: 'fit5032project-a3ac5.appspot.com',
  messagingSenderId: '661781321631',
  appId: '1:661781321631:web:7cb300fe83bc693b2f0faa',
  measurementId: 'G-GF9YS45Y69'
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
// const analytics = getAnalytics(app)
const auth = getAuth(app)
const db = getFirestore(app)
export { app, auth, db }
