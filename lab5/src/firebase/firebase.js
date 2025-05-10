// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCeNDQYkeWhCG3uqbOCZJx5oAN2KMKhFJI",
  authDomain: "city-construction-management.firebaseapp.com",
  projectId: "city-construction-management",
  storageBucket: "city-construction-management.firebasestorage.app",
  messagingSenderId: "348853124400",
  appId: "1:348853124400:web:9007df501c31b7fe001cf5",
  measurementId: "G-WPHCC2NBXF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };