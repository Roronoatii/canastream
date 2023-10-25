import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBob6GlUqBimy5S92SVgWKSu5edmsEmkao",
  authDomain: "canastream-e788f.firebaseapp.com",
  projectId: "canastream-e788f",
  storageBucket: "canastream-e788f.appspot.com",
  messagingSenderId: "620683719072",
  appId: "1:620683719072:web:a6521320e8bc8d095734c5",
  measurementId: "G-LV1J0T21D9"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth();
const firestore = getFirestore();

export { auth, firestore };