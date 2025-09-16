// scripts/seed.js
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc } = require('firebase/firestore');

// PASTE YOUR FIREBASE CONFIG FROM src/firebase.ts
const firebaseConfig = {
    apiKey: "AIzaSyAy8X3x1GDiOwy2Yzq4YZQeDF0rKDUq-BA",
    authDomain: "thegrandcasitatheater.firebaseapp.com",
    projectId: "thegrandcasitatheater",
    storageBucket: "thegrandcasitatheater.appspot.com",
    messagingSenderId: "968424924605",
    appId: "1:968424924605:web:253b401e55a97b9a041ed4"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const sampleMovieNights = [
    { hostName: "Casey", movieTitle: "The Goonies", thermostat: 73, status: 'Approved', showDate: '2025-09-25', posterURL: 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/eBU7gC767_pA8XyI9y2A3a4zYmt.jpg', greeting: "Hey gang, let's go on an adventure!", audience: 'Kids Welcome', trailerLink: "https://www.youtube.com/watch?v=h-Mekk1Yv6E" },
    { hostName: "Jordan", movieTitle: "Inception", thermostat: 71, status: 'Approved', showDate: '2025-10-02', posterURL: 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/oYuLEt3znuj4FRUS8bgAaBYnZo7.jpg', greeting: "Your mind is the scene of the crime.", audience: 'Adults Only', trailerLink: "https://www.youtube.com/watch?v=YoHD9WEPM00" },
    { hostName: "Alex", movieTitle: "Spirited Away", thermostat: 75, status: 'Approved', showDate: '2025-10-09', posterURL: 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/39wmItIW2asRooAcZBSnI8rvM6p.jpg', greeting: "A magical journey awaits.", audience: 'Kids Welcome', trailerLink: "https://www.youtube.com/watch?v=ByXuk9Qqxkk" },
    { hostName: "Taylor", movieTitle: "Pulp Fiction", thermostat: 78, status: 'Approved', showDate: '2025-10-16', posterURL: 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/d5iIlFn5s0ImszYzBPb8KpgUvIW.jpg', greeting: "You won't know the facts until you've seen the fiction.", audience: 'Adults Only', trailerLink: "https://www.youtube.com/watch?v=s75d4y66sKk" },
    { hostName: "Morgan", movieTitle: "The Matrix", thermostat: 72, status: 'Approved', showDate: '2025-10-23', posterURL: 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/f89JAYsAFSSdsEVtk8Bqg1JweA.jpg', greeting: "Welcome to the real world.", audience: 'Adults Only', trailerLink: "https://www.youtube.com/watch?v=vKQi3bBA1y8" },
    { hostName: "Jamie", movieTitle: "The Dark Knight", thermostat: 70, status: 'Approved', showDate: '2025-07-25', posterURL: 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/qJ2tW6WMUDux911r6m7haRef0WH.jpg', greeting: 'Why so serious?', audience: 'Adults Only', trailerLink: 'https://www.youtube.com/watch?v=EXeTwQWrcwY' },
];

async function seedDatabase() {
  console.log('Starting to seed the database with new data...');
  const movieNightsCollection = collection(db, 'movieNights');

  for (const movie of sampleMovieNights) {
    try {
      const docData = { ...movie, submittedAt: new Date() };
      const docRef = await addDoc(movieNightsCollection, docData);
      console.log(`Successfully added "${movie.movieTitle}" with ID: ${docRef.id}`);
    } catch (e) {
      console.error(`Error adding document "${movie.movieTitle}": `, e);
    }
  }
  console.log('Seeding complete!');
}

seedDatabase();
// Build Date: 2025-09-16 01:55 PM