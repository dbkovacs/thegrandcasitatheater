// File: src/ShowingsPage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { db } from './firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';

const buildTimestamp = "2025-09-13 14:31 PM";

function ShowingsPage() {
    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMovies = async () => {
            setIsLoading(true);
            try {
                const moviesCollection = collection(db, "movieNights");
                // Query for movies that are either 'Approved' or 'Archived'
                const q = query(
                    moviesCollection, 
                    where("status", "in", ["Approved", "Archived"]),
                    orderBy("showDate", "desc") // Order by date, newest first
                );
                const querySnapshot = await getDocs(q);
                const movieList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setMovies(movieList);
            } catch (err) {
                console.error("Error fetching movies: ", err);
                setError("Could not load movie data.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchMovies();
    }, []);

    // Separate movies into 'Coming Soon' and 'History' using useMemo for efficiency
    const comingSoonMovies = useMemo(() => 
        movies.filter(m => m.status === 'Approved'), 
    [movies]);
    
    const archivedMovies = useMemo(() => 
        movies.filter(m => m.status === 'Archived'), 
    [movies]);


    if (isLoading) {
        return <div style={{ fontFamily: 'sans-serif', padding: '2rem' }}>Loading shows...</div>;
    }

    if (error) {
        return <div style={{ fontFamily: 'sans-serif', padding: '2rem', color: 'red' }}>{error}</div>;
    }

    return (
        <div style={{ fontFamily: 'sans-serif', padding: '2rem', maxWidth: '1200px', margin: 'auto' }}>
            <h1>Showings</h1>

            {/* Coming Soon Section */}
            <section>
                <h2>Coming Soon</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem' }}>
                    {comingSoonMovies.length > 0 ? (
                        comingSoonMovies.map(movie => (
                            <div key={movie.id} style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                                <img src={movie.posterUrl} alt={`${movie.movieTitle} Poster`} style={{ width: '100%', height: '300px', objectFit: 'cover' }} />
                                <div style={{ padding: '1rem' }}>
                                    <h3 style={{ margin: '0 0 0.5rem 0' }}>{movie.movieTitle}</h3>
                                    <p style={{ margin: 0 }}>Showing on: <strong>{movie.showDate}</strong></p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No upcoming movies scheduled yet. Check back soon!</p>
                    )}
                </div>
            </section>

            {/* History Section */}
            <section style={{ marginTop: '3rem' }}>
                <h2>Past Showings</h2>
                 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem' }}>
                    {archivedMovies.length > 0 ? (
                        archivedMovies.map(movie => (
                            <div key={movie.id} style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden', opacity: 0.7 }}>
                                <img src={movie.posterUrl} alt={`${movie.movieTitle} Poster`} style={{ width: '100%', height: '300px', objectFit: 'cover' }} />
                                <div style={{ padding: '1rem' }}>
                                    <h3 style={{ margin: '0 0 0.5rem 0' }}>{movie.movieTitle}</h3>
                                     <p style={{ margin: 0, fontSize: '0.9rem' }}>Shown on: {movie.showDate}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No past movies to show.</p>
                    )}
                </div>
            </section>
            
            <div style={{ position: 'fixed', bottom: 0, right: 0, padding: '4px 8px', backgroundColor: 'rgba(0,0,0,0.7)', color: 'white', fontSize: '10px', borderTopLeftRadius: '5px' }}>
                Build: {buildTimestamp}
            </div>
        </div>
    );
}

export default ShowingsPage;
// END - 2025-09-13 14:31 PM