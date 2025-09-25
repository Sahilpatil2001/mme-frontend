// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCsnovBWG01F6VYDPtZv41mqZlnyM6KSzU",
  authDomain: "auth-fc1f0.firebaseapp.com",
  projectId: "auth-fc1f0",
  storageBucket: "auth-fc1f0.firebasestorage.app",
  messagingSenderId: "373906635890",
  appId: "1:373906635890:web:c944663af2a5c356bcd6eb",
  measurementId: "G-YG2TRE3SQG",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Here changing only firebase config related to the project that backend using
