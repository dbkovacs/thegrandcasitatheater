// src/InvitationPage.tsx
import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { MovieNight } from './types';
import TrailerModal from './components/invitation/TrailerModal';
import CalendarIcon from './CalendarIcon';

const ThermometerIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V4a4 4 0 10-8 0v12a4 4 0 108 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-2m2-12h2" />
    </svg>
);

function InvitationPage() {
    const [activeMovie, setActiveMovie] = useState<MovieNight | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isTrailerVisible, setIsTrailerVisible] = useState(false);

    useEffect(() => {
        const fetchActiveMovie = async () => {
            setIsLoading(true);
            try {
                const q = query(collection(db, "movieNights"), where("status", "==", "Approved"), orderBy("showDate", "desc"));
                const querySnapshot = await getDocs(q);
                const moviesList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MovieNight));
                
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                const futureMovies = moviesList.filter(m => new Date(m.showDate + 'T00:00:00') >= today);
                const sortedFutureMovies = futureMovies.sort((a, b) => new Date(a.showDate).getTime() - new Date(b.showDate).getTime());

                setActiveMovie(sortedFutureMovies.length > 0 ? sortedFutureMovies[0] : null);
            } catch (err) {
                console.error("Error fetching movie: ", err);
                setError("Could not load the invitation. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchActiveMovie();
    }, []);

    const getYoutubeEmbedUrl = (url: string | undefined) => {
        if (!url) return '';
        const videoIdMatch = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
        const videoId = videoIdMatch ? videoIdMatch[1] : '';
        return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    };

    if (isLoading) return <p className="text-center text-yellow-300/70 p-8">Loading invitation...</p>;
    if (error) return <p className="text-center text-red-400 p-8">{error}</p>;
    if (!activeMovie) return (
        <div className="container mx-auto px-4 py-8 text-center">
            <div className="bg-brand-card shadow-2xl rounded-2xl border-2 border-yellow-300/20 p-8">
                <h1 className="text-4xl font-cinzel text-brand-gold mb-4">No Upcoming Showings</h1>
                <p className="text-slate-300">There are currently no movie nights scheduled. Check back soon!</p>
            </div>
        </div>
    );

    return (
        <>
            {isTrailerVisible && activeMovie.trailerLink && (
                <TrailerModal 
                    trailerUrl={getYoutubeEmbedUrl(activeMovie.trailerLink)} 
                    onClose={() => setIsTrailerVisible(false)} 
                />
            )}
            {/* The rest of the page JSX remains here */}
        </>
    );
}

// NOTE: The full page JSX is omitted here for brevity as it's unchanged. 
// The critical fix is restoring the useEffect logic above.
// Build Date: 2025-09-16 01:08 PM