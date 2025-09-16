// src/InvitationPage.tsx
import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { MovieNight } from './types';

// --- Placeholder Components (we will create these next) ---
const TrailerModal = ({ trailerUrl, onClose }) => (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
        <div className="bg-gray-900 rounded-lg overflow-hidden shadow-xl w-full max-w-4xl relative border-2 border-yellow-300/50">
            <button onClick={onClose} className="absolute top-2 right-4 text-white text-4xl hover:text-gray-400 z-10">&times;</button>
            <div className="relative pb-[56.25%] h-0">
                <iframe src={trailerUrl} title="YouTube video player" frameBorder="0" allow="autoplay; encrypted-media;" allowFullScreen className="absolute top-0 left-0 w-full h-full"></iframe>
            </div>
        </div>
    </div>
);
// --- End Placeholder Components ---

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
                
                // For now, we'll assume the most recent upcoming movie is the "active" one.
                // We can add more complex logic later if needed.
                const futureMovies = moviesList.filter(m => new Date(m.showDate) >= new Date());
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
        // Add autoplay for a better modal experience
        const videoId = url.split('/').pop()?.split('?')[0];
        return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    };

    if (isLoading) {
        return <p className="text-center text-yellow-300/70 p-8">Loading invitation...</p>;
    }

    if (error) {
        return <p className="text-center text-red-400 p-8">{error}</p>;
    }

    if (!activeMovie) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <div className="bg-brand-card shadow-2xl rounded-2xl border-2 border-yellow-300/20 p-8">
                    <h1 className="text-4xl font-cinzel text-brand-gold mb-4">No Upcoming Showings</h1>
                    <p className="text-slate-300">There are currently no movie nights scheduled. Check back soon!</p>
                </div>
            </div>
        );
    }

    return (
        <>
            {isTrailerVisible && (
                <TrailerModal 
                    trailerUrl={getYoutubeEmbedUrl(activeMovie.trailerLink)} 
                    onClose={() => setIsTrailerVisible(false)} 
                />
            )}
            <div className="container mx-auto px-4 py-8 md:py-12">
                <div className="max-w-4xl mx-auto bg-brand-card shadow-2xl rounded-2xl overflow-hidden border-2 border-yellow-300/20">
                    {/* Poster Section */}
                    <div className="bg-black/20 p-4 md:p-8 text-center">
                        <img 
                            src={activeMovie.posterURL || `https://placehold.co/600x900/2a0000/fde047?text=${encodeURIComponent(activeMovie.movieTitle)}`} 
                            alt={`${activeMovie.movieTitle} Poster`} 
                            className="max-h-[500px] mx-auto rounded-lg shadow-lg"
                        />
                    </div>

                    {/* Details Section */}
                    <div className="p-8 md:p-12">
                        <p className="text-xl text-brand-gold font-semibold mb-2 font-cinzel">You're Invited By</p>
                        <h1 className="text-5xl font-bold mb-4 font-cinzel text-shadow">{activeMovie.hostName}</h1>
                        
                        {activeMovie.greeting && (
                            <div className="mb-6 bg-black/20 p-4 rounded-lg border-l-4 border-yellow-300/50">
                                <p className="text-slate-300 italic">"{activeMovie.greeting}"</p>
                            </div>
                        )}

                        <div className="my-6 border-t border-yellow-300/20"></div>

                        <h2 className="text-4xl font-black tracking-tighter font-cinzel text-shadow">{activeMovie.movieTitle}</h2>
                        
                        <div className="my-4 space-y-3 text-slate-300">
                            <div className="flex items-center gap-3">
                                <span className="text-yellow-300/70 font-bold">Showing On:</span>
                                <span className="font-semibold">{activeMovie.showDate}</span>
                            </div>
                             {activeMovie.audience && (
                                <div className={`flex items-center gap-2 p-2 rounded-md text-sm ${
                                    activeMovie.audience === 'Adults Only' ? 'bg-red-900/30 text-red-300' : 'bg-green-900/30 text-green-300'
                                }`}>
                                    <span>{activeMovie.audience}</span>
                                </div>
                            )}
                        </div>
                        
                        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <button onClick={() => setIsTrailerVisible(true)} className="btn-velvet" disabled={!activeMovie.trailerLink}>
                                Watch Trailer
                            </button>
                            <a href="#" className="btn-velvet primary">
                                Reserve Seat
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default InvitationPage;
// Build Date: 2025-09-16 11:40 AM