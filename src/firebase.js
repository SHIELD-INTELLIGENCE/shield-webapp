// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAbH5YC-Kf7S0jI_gE311rjFtHI6EAbKI8",
  authDomain: "feeds-a8b14.firebaseapp.com",
  projectId: "feeds-a8b14",
  storageBucket: "feeds-a8b14.firebasestorage.app",
  messagingSenderId: "760399764274",
  appId: "1:760399764274:web:b68a8b0dc02e3fae82552b"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
