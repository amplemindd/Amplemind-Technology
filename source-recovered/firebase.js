import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDHi7suPwtQAPzp9XO3gcwKOb4d0C0Hs0",
  authDomain: "amplemind-careers.firebaseapp.com",
  projectId: "amplemind-careers",
  storageBucket: "amplemind-careers.firebasestorage.app",
  messagingSenderId: "650016309131",
  appId: "1:650016309131:web:e96b148c3530c5bece398e"
};

const app = initializeApp(firebaseConfig);

// Firestore Database
export const db = getFirestore(app);

// Authentication
export const auth = getAuth(app);