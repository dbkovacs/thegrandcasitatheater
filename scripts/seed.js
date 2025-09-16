// scripts/seed.js
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc } = require('firebase/firestore');

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
    { hostName: "Casey", movieTitle: "The Goonies", thermostat: 73, status: 'Approved', showDate: '2025-09-25', posterURL: 'https://firebasestorage.googleapis.com/v0/b/thegrandcasitatheater.firebasestorage.app/o/posters%2F1757794500387_jaws-poster.jpg?alt=media&token=87a5d012-c3b0-4584-8606-9b10184eff98', greeting: "Hey gang, let's go on an adventure!", audience: 'Kids Welcome', trailerLink: "https://www.youtube.com/watch?v=h-Mekk1Yv6E" },
    { hostName: "Jordan", movieTitle: "Inception", thermostat: 71, status: 'Approved', showDate: '2025-10-02', posterURL: 'https://firebasestorage.googleapis.com/v0/b/thegrandcasitatheater.firebasestorage.app/o/posters%2F1757795393012_coming%20soon%20screen.jpg?alt=media&token=5de68ebe-e8d9-4263-89de-59e3e7cb102e', greeting: "Your mind is the scene of the crime.", audience: 'Adults Only', trailerLink: "https://www.youtube.com/watch?v=YoHD9WEPM00" },
    { hostName: "Alex", movieTitle: "Spirited Away", thermostat: 75, status: 'Approved', showDate: '2025-10-09', posterURL: 'https://firebasestorage.googleapis.com/v0/b/thegrandcasitatheater.firebasestorage.app/o/posters%2F1757796154483_History.jpg?alt=media&token=5d76aae9-b152-4386-bedf-821e02a454bb', greeting: "A magical journey awaits.", audience: 'Kids Welcome', trailerLink: "https://www.youtube.com/watch?v=ByXuk9Qqxkk" },
    { hostName: "Taylor", movieTitle: "Pulp Fiction", thermostat: 78, status: 'Approved', showDate: '2025-10-16', posterURL: 'https://firebasestorage.googleapis.com/v0/b/thegrandcasitatheater.firebasestorage.app/o/posters%2F1757796689568_Currentweek.jpg?alt=media&token=de721428-4e8a-41be-8a35-856e87d83a45', greeting: "You won't know the facts until you've seen the fiction.", audience: 'Adults Only', trailerLink: "https://www.youtube.com/watch?v=s75d4y66sKk" },
    { hostName: "Morgan", movieTitle: "The Matrix", thermostat: 72, status: 'Approved', showDate: '2025-10-23', posterURL: 'https://firebasestorage.googleapis.com/v0/b/thegrandcasitatheater.firebasestorage.app/o/posters%2F1757966260110_Vincent%20VanGogh.jpg?alt=media&token=88942494-83b4-405b-b8e5-dc24f92d5275', greeting: "Welcome to the real world.", audience: 'Adults Only', trailerLink: "https://www.youtube.com/watch?v=vKQi3bBA1y8" },
    { hostName: "Jamie", movieTitle: "The Dark Knight", thermostat: 70, status: 'Approved', showDate: '2025-07-25', posterURL: 'https://firebasestorage.googleapis.com/v0/b/thegrandcasitatheater.firebasestorage.app/o/posters%2F1757794500387_jaws-poster.jpg?alt=media&token=87a5d012-c3b0-4584-8606-9b10184eff98', greeting: 'Why so serious?', audience: 'Adults Only', trailerLink: 'https://www.youtube.com/watch?v=EXeTwQWrcwY' },
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
// Build Date: 2025-09-16 02:25 PM