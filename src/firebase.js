import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC8-hI0aZEe_kCl3aMjA-eEOUAuRd_z5oo",
  authDomain: "abhivriddhi-organics.firebaseapp.com",
  projectId: "abhivriddhi-organics",
  storageBucket: "abhivriddhi-organics.firebasestorage.app",
  messagingSenderId: "86721489507",
  appId: "1:86721489507:web:54d009aafe8cb01236a656",
  measurementId: "G-8VYRLBKRWR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
