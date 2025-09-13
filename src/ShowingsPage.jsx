// File: src/ShowingsPage.jsx
import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';

const buildTimestamp = "2025-09-13 14:45 PM";

function ShowingsPage() {
    const [activeMovies, setActiveMovies] = useState([]);
    const [comingSoonMovies, setComingSoonMovies] = useState([]);
    const [historyMovies, setHistoryMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const categorizeMovies = (movieList) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Normalize today's date to midnight

            const active = [];
            const comingSoon = [];
            const history = [];

            movieList.forEach(movie => {
                // Firestore dates are strings like 'YYYY-MM-DD'. Convert to Date objects.
                // Appending T00:00:00 prevents timezone-related date shifts.
                const showDate = new Date(`${movie.showDate}T00:00:00`);
                
                const activeWindowStart = new Date(showDate);
                activeWindowStart.setDate(showDate.getDate() - 6);

                if (today >= activeWindowStart && today <= showDate) {
                    active.push(movie);
                } else if (today < activeWindowStart) {
                    comingSoon.push(movie);
                } else {
                    history.push(movie);
                }
            });
            
            setActiveMovies(active);
            setComingSoonMovies(comingSoon);
            setHistoryMovies(history);
        };

        const fetchMovies = async () => {
            setIsLoading(true);
            try {
                const moviesCollection = collection(db, "movieNights");
                // We only need to fetch 'Approved' movies. The code will sort them.
                const q = query(
                    moviesCollection, 
                    where("status", "==", "Approved"),
                    orderBy("showDate", "desc")
                );
                const querySnapshot = await getDocs(q);
                const movieList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                
                categorizeMovies(movieList);

            } catch (err) {
                console.error("Error fetching movies: ", err);
                setError("Could not load movie data.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchMovies();
    }, []);

    const MovieCard = ({ movie, isHistory = false }) => (
        <div style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', opacity: isHistory ? 0.7 : 1 }}>
            <img src={movie.posterUrl} alt={`${movie.movieTitle} Poster`} style={{ width: '100%', height: '300px', objectFit: 'cover' }} />
            <div style={{ padding: '1rem' }}>
                <h3 style={{ margin: '0 0 0.5rem 0' }}>{movie.movieTitle}</h3>
                <p style={{ margin: 0, fontSize: isHistory ? '0.9rem' : '1rem' }}>
                    {isHistory ? 'Shown on: ' : 'Showing on: '}
                    <strong>{movie.showDate}</strong>
                </p>
            </div>
        </div>
    );

    if (isLoading) return <div style={{ fontFamily: 'sans-serif', padding: '2rem' }}>Loading shows...</div>;
    if (error) return <div style={{ fontFamily: 'sans-serif', padding: '2rem', color: 'red' }}>{error}</div>;

    return (
        <div style={{ fontFamily: 'sans-serif', padding: '2rem', maxWidth: '1200px', margin: 'auto' }}>
            {/* You're Invited Section */}
            <section>
                <h2>You're Invited!</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem' }}>
                    {activeMovies.length > 0 ? (
                        activeMovies.map(movie => <MovieCard key={movie.id} movie={movie} />)
                    ) : (
                        <p>No movie showing this week. Check out what's coming soon!</p>
                    )}
                </div>
            </section>

            {/* Coming Soon Section */}
            <section style={{ marginTop: '3rem' }}>
                <h2>Coming Soon</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem' }}>
                    {comingSoonMovies.length > 0 ? (
                        comingSoonMovies.map(movie => <MovieCard key={movie.id} movie={movie} />)
                    ) : (
                        <p>No upcoming movies scheduled yet. Check back soon!</p>
                    )}
                </div>
            </section>

            {/* History Section */}
            <section style={{ marginTop: '3rem' }}>
                <h2>Past Showings</h2>
                 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem' }}>
                    {historyMovies.length > 0 ? (
                        historyMovies.map(movie => <MovieCard key={movie.id} movie={movie} isHistory={true} />)
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
// END - 2025-09-13 14:45 PM