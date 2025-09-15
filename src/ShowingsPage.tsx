// File: src/ShowingsPage.tsx
import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { MovieNight } from './types';

// FIX: Add types for the component's props
interface MovieCardProps {
    movie: MovieNight;
    isHistory?: boolean;
}

const MovieCard = ({ movie, isHistory = false }: MovieCardProps) => (
    <div className="showings-card">
        <div className="showings-poster-container">
            {movie.posterURL && <img src={movie.posterURL} alt={`${movie.movieTitle} Poster`} />}
        </div>
        <div className="showings-details">
            <h3>{movie.movieTitle}</h3>
            <p>
                {isHistory ? 'Shown On' : 'Showing On'}: <strong>{movie.showDate}</strong>
            </p>
        </div>
    </div>
);

function ShowingsPage() {
    // FIX: Define the types for our state arrays
    const [allMovies, setAllMovies] = useState<MovieNight[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const q = query(collection(db, "movieNights"), where("status", "==", "Approved"));
                const querySnapshot = await getDocs(q);
                const moviesList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MovieNight));
                // FIX: Add types to the sort function to ensure correct comparison
                const sortedMovies = moviesList.sort((a, b) => new Date(a.showDate).getTime() - new Date(b.showDate).getTime());
                setAllMovies(sortedMovies);
            } catch (err) {
                console.error("Error fetching movies: ", err);
                setError("Could not load movie data.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchMovies();
    }, []);

    return (
        <div className="page-container">
            <h1 className="page-title">All Showings</h1>
            {isLoading && <p className="page-message">Loading all showings...</p>}
            {error && <p className="page-message error">{error}</p>}
            {!isLoading && !error && (
                allMovies.length > 0 ? (
                    <div className="showings-grid">
                        {allMovies.map(movie => <MovieCard key={movie.id} movie={movie} />)}
                    </div>
                ) : (
                    <p className="page-message">No movies to show.</p>
                )
            )}
        </div>
    );
}

export default ShowingsPage;