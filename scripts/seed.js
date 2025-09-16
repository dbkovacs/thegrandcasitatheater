// scripts/seed.js

// IMPORTANT: This script is for Node.js, not the browser.
// It uses CommonJS require() syntax.

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc } = require('firebase/firestore');

// =================================================================
// === 1. PASTE YOUR FIREBASE CONFIG OBJECT FROM src/firebase.ts HERE ===
// =================================================================
const firebaseConfig = {
    apiKey: "AIzaSyAy8X3x1GDiOwy2Yzq4YZQeDF0rKDUq-BA",
    authDomain: "thegrandcasitatheater.firebaseapp.com",
    projectId: "thegrandcasitatheater",
    storageBucket: "thegrandcasitatheater.appspot.com", // Make sure this is correct
    messagingSenderId: "968424924605",
    appId: "1:968424924605:web:253b401e55a97b9a041ed4"
};
// =================================================================

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Sample data for 10 movie nights
const sampleMovieNights = [
  { hostName: "Casey", movieTitle: "The Goonies", thermostat: 73, status: 'Approved', showDate: '2025-08-15' },
  { hostName: "Jordan", movieTitle: "Inception", thermostat: 71, status: 'Approved', showDate: '2025-08-22' },
  { hostName: "Alex", movieTitle: "Spirited Away", thermostat: 75, status: 'Approved', showDate: '2025-08-29' },
  { hostName: "Taylor", movieTitle: "Pulp Fiction", thermostat: 78, status: 'Approved', showDate: '2025-09-05' },
  { hostName: "Morgan", movieTitle: "The Matrix", thermostat: 72, status: 'Approved', showDate: '2025-09-12' },
  { hostName: "Riley", movieTitle: "Finding Nemo", thermostat: 76, status: 'Approved', showDate: '2025-07-18' },
  { hostName: "Jamie", movieTitle: "The Dark Knight", thermostat: 70, status: 'Approved', showDate: '2025-07-25' },
  { hostName: "Pat", movieTitle: "Forrest Gump", thermostat: 74, status: 'Approved', showDate: '2025-08-01' },
  { hostName: "Chris", movieTitle: "The Shawshank Redemption", thermostat: 77, status: 'Approved', showDate: '2025-08-08' },
  { hostName: "Sam", movieTitle: "Jurassic Park", thermostat: 73, status: 'Approved', showDate: '2025-07-11' }
];

async function seedDatabase() {
  console.log('Starting to seed the database...');
  const movieNightsCollection = collection(db, 'movieNights');

  for (const movie of sampleMovieNights) {
    try {
      // Add the status and a submittedAt date to each record
      const docData = {
        ...movie,
        submittedAt: new Date()
      };
      const docRef = await addDoc(movieNightsCollection, docData);
      console.log(`Successfully added "${movie.movieTitle}" with ID: ${docRef.id}`);
    } catch (e) {
      console.error(`Error adding document "${movie.movieTitle}": `, e);
    }
  }

  console.log('Seeding complete!');
}

seedDatabase();
// Build Date: 2025-09-16 10:45 AM