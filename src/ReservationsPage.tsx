// src/ReservationsPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';
import { MovieNight } from './types';

// Placeholder for the seat map we will build next
const SeatMap = () => <div className="bg-black/20 p-8 rounded-lg text-center text-slate-400">Seat Map Component Goes Here</div>;

function ReservationsPage() {
  const { movieId } = useParams<{ movieId: string }>();
  const [movie, setMovie] = useState<MovieNight | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMovie = async () => {
      if (!movieId) return;
      setIsLoading(true);
      const docRef = doc(db, 'movieNights', movieId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setMovie({ id: docSnap.id, ...docSnap.data() } as MovieNight);
      } else {
        console.error("No such movie found!");
      }
      setIsLoading(false);
    };

    fetchMovie();
  }, [movieId]);

  if (isLoading) return <p className="text-center text-yellow-300/70 p-8">Loading Reservation Details...</p>;
  if (!movie) return <p className="text-center text-red-400 p-8">Could not find movie details.</p>;

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="text-center mb-8">
        <p className="text-brand-gold font-cinzel">Reservations for</p>
        <h1 className="text-4xl md:text-5xl font-bold font-cinzel text-white">{movie.movieTitle}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <SeatMap />
        </div>
        <div className="lg:col-span-1 bg-brand-card p-6 rounded-2xl border border-yellow-300/20">
          <h2 className="font-cinzel text-2xl text-brand-gold mb-4">Your Selection</h2>
          {/* Reservation form will go here */}
        </div>
      </div>
    </div>
  );
}

export default ReservationsPage;
// Build Date: 2025-09-16 01:08 PM