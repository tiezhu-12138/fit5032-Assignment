// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBLHD0QlApXB4u7elS5FH2vIayove07BXA",
  authDomain: "fit5032project-a3ac5.firebaseapp.com",
  projectId: "fit5032project-a3ac5",
  storageBucket: "fit5032project-a3ac5.appspot.com",
  messagingSenderId: "661781321631",
  appId: "1:661781321631:web:7cb300fe83bc693b2f0faa",
  measurementId: "G-GF9YS45Y69"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const db = getFirestore(app)
export { app, auth, db }
