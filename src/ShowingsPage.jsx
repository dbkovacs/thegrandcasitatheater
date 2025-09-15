// File: src/ShowingsPage.jsx
import React from 'react';
import { db } from './firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import CalendarIcon from './CalendarIcon';

// The only change is in the <p> tag for the date
const MovieCard = ({ movie, isHistory = false }) => (
    <div className="showings-card">
        <div className="showings-poster-container">
            <img src={movie.posterUrl} alt={`${movie.movieTitle} Poster`} />
            {movie.showDate && <CalendarIcon dateString={movie.showDate} />}
        </div>
        <div className="showings-card-details">
            <h3 className="showings-card-title">{movie.movieTitle}</h3>
            {/* Using a non-breaking space (&nbsp;) to keep the date on one line */}
            <p className="showings-card-date">
                {isHistory ? 'Shown on:' : 'Showing on:'}&nbsp;<strong>{movie.showDate}</strong>
            </p>
        </div>
    </div>
);


// ... (the rest of the component is unchanged)
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
            const active = [], comingSoon = [], history = [];
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
            const sortByDate = (a, b) => new Date(a.showDate) - new Date(b.showDate);
            setActiveMovies(active.sort(sortByDate));
            setComingSoonMovies(comingSoon.sort(sortByDate));
            setHistoryMovies(history.sort((a,b) => new Date(b.showDate) - new Date(a.showDate)));
        };

        const fetchMovies = async () => {
            setIsLoading(true);
            try {
                const moviesCollection = collection(db, "movieNights");
                const q = query(
                    moviesCollection, 
                    where("status", "==", "Approved"),
                    orderBy("showDate", "asc")
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

    const allMovies = [...activeMovies, ...comingSoonMovies, ...historyMovies];

    return (
        <div className="page-container">
             <h2 className="page-title"><span>Showings</span></h2>
             {allMovies.length > 0 ? (
                <div className="showings-grid">
                    {allMovies.map(movie => <MovieCard key={movie.id} movie={movie} />)}
                </div>
             ) : (
                <p className="page-message">No movies to show.</p>
             )}
        </div>
    );
}

export default ShowingsPage;
// END - 2025-09-15 13:12 PM