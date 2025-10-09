// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.WATCHLIST_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.WATCHLIST_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.WATCHLIST_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.WATCHLIST_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.WATCHLIST_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.WATCHLIST_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage };