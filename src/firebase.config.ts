// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBW61Jv5lpuSGhjhjzhaI-GUg4z44hJKYU",
  authDomain: "exercicereact.firebaseapp.com",
  projectId: "exercicereact",
  storageBucket: "exercicereact.appspot.com",
  messagingSenderId: "350875820259",
  appId: "1:350875820259:web:2d86cdb489bcf0df8ae5d6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const firestore = getFirestore();

export { auth, firestore };
