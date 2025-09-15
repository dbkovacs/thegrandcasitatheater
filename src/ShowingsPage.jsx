// File: src/ShowingsPage.jsx
import React from 'react';
import { db } from './firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore'; // Added orderBy
import CalendarIcon from './CalendarIcon'; // 1. Import the new CalendarIcon component

// A reusable card component for this page
const MovieCard = ({ movie, isHistory = false }) => (
    <div className="showings-card">
        <div className="showings-poster-container">
            <img src={movie.posterUrl} alt={`${movie.movieTitle} Poster`} />
            {/* 2. Place the CalendarIcon over the poster */}
            {movie.showDate && <CalendarIcon dateString={movie.showDate} />}
        </div>
        <div className="showings-card-details">
            <h3 className="showings-card-title">{movie.movieTitle}</h3>
            {isHistory ? (
                <p className="showings-card-date">Shown on: <strong>{movie.showDate}</strong></p>
            ) : (
                <p className="showings-card-date">Showing on: <strong>{movie.showDate}</strong></p>
            )}
        </div>
    </div>
);

function ShowingsPage() {
    const [activeMovies, setActiveMovies] = React.useState([]);
    const [comingSoonMovies, setComingSoonMovies] = React.useState([]);
    const [historyMovies, setHistoryMovies] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

    React.useEffect(() => {
        const categorizeMovies = (movieList) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const active = [];
            const comingSoon = [];
            const history = [];

            movieList.forEach(movie => {
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
            
            // Sort movies by date
            const sortByDate = (a, b) => new Date(a.showDate) - new Date(b.showDate);
            setActiveMovies(active.sort(sortByDate));
            setComingSoonMovies(comingSoon.sort(sortByDate));
            setHistoryMovies(history.sort((a,b) => new Date(b.showDate) - new Date(a.showDate))); // History descending
        };

        const fetchMovies = async () => {
            setIsLoading(true);
            try {
                const moviesCollection = collection(db, "movieNights");
                const q = query(
                    moviesCollection, 
                    where("status", "==", "Approved"),
                    orderBy("showDate", "asc") // Order by date for consistency
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

    if (isLoading) return <div className="page-message">Loading shows...</div>;
    if (error) return <div className="page-message error">{error}</div>;

    return (
        <div className="page-container">
            {/* You're Invited Section */}
            {activeMovies.length > 0 && (
                <section className="showings-section">
                    <h2 className="page-title">Current Movie</h2> {/* Changed title for clarity */}
                    <div className="showings-grid">
                        {activeMovies.map(movie => <MovieCard key={movie.id} movie={movie} />)}
                    </div>
                </section>
            )}

            {/* Coming Soon Section */}
            {comingSoonMovies.length > 0 && (
                <section className="showings-section">
                    <h2 className="page-title">Coming Soon</h2>
                    <div className="showings-grid">
                        {comingSoonMovies.map(movie => <MovieCard key={movie.id} movie={movie} />)}
                    </div>
                </section>
            )}

            {/* History Section */}
            {historyMovies.length > 0 && (
                <section className="showings-section">
                    <h2 className="page-title">Past Showings</h2>
                    <div className="showings-grid">
                        {historyMovies.map(movie => <MovieCard key={movie.id} movie={movie} isHistory={true} />)}
                    </div>
                </section>
            )}

            {activeMovies.length === 0 && comingSoonMovies.length === 0 && historyMovies.length === 0 && (
                <p className="page-message">No movies to show yet. Check back soon!</p>
            )}
        </div>
    );
}

export default ShowingsPage;
// END - 2025-09-15 13:30 PM