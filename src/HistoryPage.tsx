// src/HistoryPage.tsx
import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { MovieNight } from './types';

const MovieHistoryCard: React.FC<{ movie: MovieNight }> = ({ movie }) => (
    <div className="bg-brand-card rounded-lg overflow-hidden border border-brand-gold/20 shadow-lg">
        <img 
            src={movie.posterURL || `https://placehold.co/400x600/2a0000/fde047?text=${encodeURIComponent(movie.movieTitle)}`}
            alt={`${movie.movieTitle} Poster`}
            className="w-full h-auto object-cover"
        />
        <div className="p-4">
            <h3 className="font-cinzel text-xl text-white truncate">{movie.movieTitle}</h3>
            <p className="text-sm text-yellow-300/80">Shown on {movie.showDate}</p>
        </div>
    </div>
);

function HistoryPage() {
    const [pastMovies, setPastMovies] = useState<MovieNight[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            setIsLoading(true);
            const today = new Date().toISOString().split('T')[0]; // Get YYYY-MM-DD
            
            const q = query(
                collection(db, "movieNights"), 
                where("status", "==", "Approved"),
                where("showDate", "<", today),
                orderBy("showDate", "desc")
            );

            const querySnapshot = await getDocs(q);
            const moviesList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MovieNight));
            setPastMovies(moviesList);
            setIsLoading(false);
        };
        fetchHistory();
    }, []);

    if (isLoading) return <p className="text-center text-yellow-300/70 p-8">Loading movie history...</p>;

    return (
        <div className="container mx-auto p-4 md:p-8">
            <h1 className="text-4xl md:text-5xl font-bold font-cinzel text-brand-gold text-center mb-8">Theater History</h1>
            {pastMovies.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {pastMovies.map(movie => <MovieHistoryCard key={movie.id} movie={movie} />)}
                </div>
            ) : (
                <p className="text-center text-slate-400">No past movie showings found.</p>
            )}
        </div>
    );
}

export default HistoryPage;
// Build Date: 2025-09-16 01:35 PM