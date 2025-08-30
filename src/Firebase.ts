// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCsnovBWG01F6VYDPtZv41mqZlnyM6KSzU",
  authDomain: "auth-fc1f0.firebaseapp.com",
  projectId: "auth-fc1f0",
  storageBucket: "auth-fc1f0.appspot.com",
  messagingSenderId: "373906635890",
  measurementId: "G-YG2TRE3SQG",
  appId: "1:373906635890:web:c944663af2a5c356bcd6eb",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
