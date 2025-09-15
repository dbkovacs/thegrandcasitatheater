// File: src/firebase.js
// This file initializes the Firebase connection for the entire application.

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage'; // Import storage

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAy8X3x1GDiOwy2Yzq4YZQeDF0rKDUq-BA",
    authDomain: "thegrandcasitatheater.firebaseapp.com",
    projectId: "thegrandcasitatheater",
    storageBucket: "thegrandcasitatheater.appspot.com", // Make sure this is correct
    messagingSenderId: "968424924605",
    appId: "1:968424924605:web:253b401e55a97b9a041ed4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

// Initialize Cloud Storage and get a reference to the service
const storage = getStorage(app); // Initialize storage

export { db, storage }; // Export storage
// END - 2025-09-15 04:21 PM