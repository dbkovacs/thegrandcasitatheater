// File: src/ShowingsPage.jsx
import React from 'react';
import { db } from './firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';

// A reusable card component for this page
const MovieCard = ({ movie, isHistory = false }) => (
    <div className="showings-card">
        <div className="showings-poster-container">
            <img src={movie.posterUrl} alt={`${movie.movieTitle} Poster`} />
        </div>
        <div className="showings-card-details">
            <h3 className="showings-card-title">{movie.movieTitle}</h3>
            <p className="showings-card-date">
                {isHistory ? 'Shown on: ' : 'Showing on: '}
                <strong>{movie.showDate}</strong>
            </p>
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
                    where("status", "==", "Approved")
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
                    <h2 className="page-title">You're Invited!</h2>
                    <div className="showings-grid">
                        {activeMovies.map(movie => <MovieCard key={movie.id} movie={movie} />)}
                    </div>
                </section>
            )}

            {/* Coming Soon Section */}
            <section className="showings-section">
                <h2 className="page-title">Coming Soon</h2>
                {comingSoonMovies.length > 0 ? (
                    <div className="showings-grid">
                        {comingSoonMovies.map(movie => <MovieCard key={movie.id} movie={movie} />)}
                    </div>
                ) : (
                    <p className="page-message">No upcoming movies scheduled yet. Check back soon!</p>
                )}
            </section>

            {/* History Section */}
            <section className="showings-section">
                <h2 className="page-title">Past Showings</h2>
                {historyMovies.length > 0 ? (
                    <div className="showings-grid">
                        {historyMovies.map(movie => <MovieCard key={movie.id} movie={movie} isHistory={true} />)}
                    </div>
                ) : (
                    <p className="page-message">No past movies to show.</p>
                )}
            </section>
        </div>
    );
}

export default ShowingsPage;
// END - 2025-09-15 10:11 AM