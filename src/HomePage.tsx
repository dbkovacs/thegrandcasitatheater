// File: src/HomePage.tsx
import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { MovieNight } from './types';
import { Link } from 'react-router-dom';
import './HomePage.css'; // Import the new CSS file

function HomePage() {
    const [approvedMovies, setApprovedMovies] = useState<MovieNight[]>([]);
    const [activeMovie, setActiveMovie] = useState<MovieNight | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showTrailer, setShowTrailer] = useState(false);

    useEffect(() => {
        const fetchAndSetMovie = async () => {
            const q = query(
                collection(db, "movieNights"),
                where("status", "==", "Approved"),
                orderBy("showDate", "desc") // Get newest first
            );
            const querySnapshot = await getDocs(q);
            const moviesList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MovieNight));
            setApprovedMovies(moviesList);

            // Logic to find the currently "active" movie
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Normalize to the start of the day

            const currentMovie = moviesList.find(movie => {
                const showDate = new Date(`${movie.showDate}T00:00:00`);
                const activeWindowStart = new Date(showDate);
                // The 6-day rule we agreed on
                activeWindowStart.setDate(showDate.getDate() - 6); 
                return today >= activeWindowStart && today <= showDate;
            });
            
            setActiveMovie(currentMovie || null);
            setIsLoading(false);
        };

        fetchAndSetMovie();
    }, []);

    if (isLoading) {
        return <div className="page-message">Finding the current feature...</div>;
    }

    // If there is no "active" movie, we will show the next upcoming movie
    if (!activeMovie) {
        const upcomingMovies = approvedMovies.filter(movie => new Date(`${movie.showDate}T00:00:00`) >= new Date());
        const nextMovie = upcomingMovies.length > 0 ? upcomingMovies[0] : null;

        if (nextMovie) {
            setActiveMovie(nextMovie);
        } else {
            return (
                <div className="page-container text-center">
                    <h1 className="page-title">Upcoming Showings</h1>
                    <p className="page-message">No movie is currently active, but here's what's coming up!</p>
                    <div className="upcoming-list-condensed">
                        {approvedMovies.map(movie => (
                            <div key={movie.id} className="upcoming-item-condensed">
                               <span className="font-bold">{movie.showDate}</span> - {movie.movieTitle}
                            </div>
                        ))}
                    </div>
                </div>
           );
        }
    }

    // Filter out the active movie from the upcoming list
    const upcomingMovies = approvedMovies.filter(movie => movie.id !== activeMovie?.id);

    return (
        <>
            {/* Trailer Modal */}
            {showTrailer && activeMovie?.trailerLink && (
                <div className="trailer-modal-backdrop" onClick={() => setShowTrailer(false)}>
                    <div className="trailer-modal-content" onClick={(e) => e.stopPropagation()}>
                        <iframe
                            width="100%"
                            height="100%"
                            src={activeMovie.trailerLink}
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                         <button onClick={() => setShowTrailer(false)} className="trailer-close-button">&times;</button>
                    </div>
                </div>
            )}

            {/* Main Hero Section */}
            <div 
                className="active-movie-hero" 
                style={{backgroundImage: `url('https://firebasestorage.googleapis.com/v0/b/thegrandcasitatheater.firebasestorage.app/o/posters%2FGemini_Generated_Image_Movie_Poster_Frame_and_Logo.png?alt=media&token=2c4c64e1-2a15-4634-91a3-467eb5a15276')`}}
            >
                <div className="poster-column">
                    {activeMovie?.posterURL && <img src={activeMovie.posterURL} alt={`${activeMovie.movieTitle} Poster`} />}
                </div>
                <div className="details-column">
                    <h2>You're Invited!</h2>
                    <p className="host-byline">by {activeMovie?.hostName}</p>
                    <h1>{activeMovie?.movieTitle}</h1>
                    <p className="showing-on">Showing on: <strong>{activeMovie?.showDate}</strong></p>
                    
                    <div className="cta-buttons">
                        {activeMovie?.trailerLink && (
                             <button onClick={() => setShowTrailer(true)} className="btn-velvet">Watch Trailer</button>
                        )}
                        <Link to={`/reservations/${activeMovie?.id}`} className="btn-velvet primary">Make a Reservation</Link>
                    </div>
                </div>
            </div>
            
            {/* Upcoming List Section */}
            {upcomingMovies.length > 0 && (
                <div className="upcoming-section">
                    <h2>Also Coming Soon...</h2>
                    <div className="upcoming-list">
                       {upcomingMovies.map(movie => (
                           <div key={movie.id} className="upcoming-item">
                                {movie.posterURL && <img src={movie.posterURL} alt={movie.movieTitle} />}
                                <div className="upcoming-details">
                                   <strong>{movie.showDate}</strong>
                                   <p>{movie.movieTitle}</p>
                                </div>
                           </div>
                       ))}
                    </div>
                </div>
            )}
            <div className="build-date">Build Date: 2025-09-17 09:53 AM</div>
        </>
    );
}

export default HomePage;
// Updated HomePage to use the new design with the poster frame and logo.
// END - 2025-09-17 09:53 AM