
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAKdT1opa15lPQrsahs4bPU4sk8JvfhIYc",
  authDomain: "budyy-ai.firebaseapp.com",
  projectId: "budyy-ai",
  storageBucket: "budyy-ai.firebasestorage.app",
  messagingSenderId: "451997885422",
  appId: "1:451997885422:web:1514c135b4dffd8d0a24ff",
  measurementId: "G-5DTHGVRL63"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Export Auth and Firestore for usage in components
export const auth = getAuth(app);
export const db = getFirestore(app);
