// scripts/seed.js
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc } = require('firebase/firestore');

const firebaseConfig = {
    apiKey: "AIzaSyAy8X3x1GDiOwy2Yzq4YZQeDF0rKDUq-BA",
    authDomain: "thegrandcasitatheater.firebaseapp.com",
    projectId: "thegrandcasitatheater",
    storageBucket: "thegrandcasitatheater.appspot.com", // Make sure this is correct
    messagingSenderId: "968424924605",
    appId: "1:968424924605:web:253b401e55a97b9a041ed4"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const sampleMovieNights = [
    { hostName: "Casey", movieTitle: "The Goonies", thermostat: 73, status: 'Approved', showDate: '2025-09-25', posterURL: 'https://i.imgur.com/8SoH9iS.jpg', greeting: "Hey gang, let's go on an adventure!", audience: 'Kids Welcome' },
    { hostName: "Jordan", movieTitle: "Inception", thermostat: 71, status: 'Approved', showDate: '2025-10-02', posterURL: 'https://i.imgur.com/s052Z3s.jpg', greeting: "Your mind is the scene of the crime.", audience: 'Adults Only' },
    { hostName: "Alex", movieTitle: "Spirited Away", thermostat: 75, status: 'Approved', showDate: '2025-10-09', posterURL: 'https://i.imgur.com/z4b0m3v.jpg', greeting: "A magical journey awaits.", audience: 'Kids Welcome' },
    { hostName: "Taylor", movieTitle: "Pulp Fiction", thermostat: 78, status: 'Approved', showDate: '2025-10-16', posterURL: 'https://i.imgur.com/a7s64v1.jpg', greeting: "You won't know the facts until you've seen the fiction.", audience: 'Adults Only' },
    { hostName: "Morgan", movieTitle: "The Matrix", thermostat: 72, status: 'Approved', showDate: '2025-10-23', posterURL: 'https://i.imgur.com/5uA9m9c.jpg', greeting: "Welcome to the real world.", audience: 'Adults Only' },
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
// Build Date: 2025-09-16 01:05 PM