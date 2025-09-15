// File: src/HomePage.tsx
import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, query, where, getDocs } from "firebase/firestore";
import { MovieNight } from './types';

function HomePage() {
    // FIX: Define the types for our state
    const [approvedMovies, setApprovedMovies] = useState<MovieNight[]>([]);
    const [activeMovie, setActiveMovie] = useState<MovieNight | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAndSetMovie = async () => {
            const q = query(collection(db, "movieNights"), where("status", "==", "Approved"));
            const querySnapshot = await getDocs(q);
            const moviesList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MovieNight));
            setApprovedMovies(moviesList);

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const currentMovie = moviesList.find(movie => {
                const showDate = new Date(`${movie.showDate}T00:00:00`);
                const activeWindowStart = new Date(showDate);
                activeWindowStart.setDate(showDate.getDate() - 6);
                return today >= activeWindowStart && today <= showDate;
            });
            
            // FIX: currentMovie can be undefined, which is fine
            setActiveMovie(currentMovie || null);
            setIsLoading(false);
        };

        fetchAndSetMovie();
    }, []);

    if (isLoading) {
        return <div className="page-message">Finding the current feature...</div>;
    }

    if (!activeMovie) {
        return <div className="page-message">No movie is currently active. Check the Showings page for what's next!</div>;
    }

    return (
        <div className="active-movie-card">
            <div className="poster-column">
                {/* FIX: Check if posterURL exists before rendering */}
                {activeMovie.posterURL && <img src={activeMovie.posterURL} alt={`${activeMovie.movieTitle} Poster`} />}
            </div>
            <div className="details-column">
                <h2>You're Invited!</h2>
                <p style={{ fontStyle: 'italic', marginTop: '-1rem' }}>by {activeMovie.hostName}</p>
                <h3>{activeMovie.movieTitle}</h3>
                <p>Showing on: <strong>{activeMovie.showDate}</strong></p>
                <p style={{ borderLeft: `3px solid var(--color-gold)`, paddingLeft: '1rem', fontStyle: 'italic' }}>
                    "This will be a great night! Can't wait to see everyone there for this classic film."
                </p>
            </div>
        </div>
    );
}

export default HomePage;