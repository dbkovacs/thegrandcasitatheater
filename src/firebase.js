// File: src/firebase.js
// This file initializes the Firebase connection for the entire application.

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
    // PASTE YOUR FIREBASE CONFIG OBJECT HERE
    apiKey: "AIzaSyAy8X3x1GDiOwy2Yzq4YZQeDF0rKDUq-BA",
  authDomain: "thegrandcasitatheater.firebaseapp.com",
  projectId: "thegrandcasitatheater",
  storageBucket: "thegrandcasitatheater.firebasestorage.app",
  messagingSenderId: "968424924605",
  appId: "1:968424924605:web:253b401e55a97b9a041ed4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

export { db };
