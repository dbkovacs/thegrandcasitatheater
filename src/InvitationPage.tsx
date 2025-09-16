// src/InvitationPage.tsx
import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { MovieNight } from './types';
import TrailerModal from './components/invitation/TrailerModal';
import CalendarIcon from './CalendarIcon'; // <-- Import the calendar icon

// A small component for the Thermometer Icon
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
            // ... (data fetching logic is unchanged)
        };
        fetchActiveMovie();
    }, []);

    const getYoutubeEmbedUrl = (url: string | undefined) => {
        // ... (function is unchanged)
    };

    if (isLoading || !activeMovie) {
        // ... (loading/error/no movie states are unchanged)
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
                    <div className="bg-black/20 p-4 md:p-8 text-center">
                        <img 
                            src={activeMovie.posterURL} 
                            alt={`${activeMovie.movieTitle} Poster`} 
                            className="max-h-[500px] mx-auto rounded-lg shadow-lg"
                        />
                    </div>

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
                        
                        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-center">
                            
                            {/* Calendar Icon */}
                            <div className="flex flex-col items-center">
                                <CalendarIcon dateString={activeMovie.showDate} />
                            </div>

                            {/* Audience */}
                            <div className="flex flex-col items-center justify-center">
                                 <div className={`p-4 rounded-lg w-full h-full flex flex-col items-center justify-center ${
                                    activeMovie.audience === 'Adults Only' ? 'bg-red-900/30 text-red-300' : 'bg-green-900/30 text-green-300'
                                }`}>
                                    <p className="font-cinzel text-xl font-bold">{activeMovie.audience}</p>
                                    <p className="text-xs">{activeMovie.audience === 'Adults Only' ? '(21+)' : '(Family Friendly)'}</p>
                                </div>
                            </div>
                            
                            {/* Requested Temp */}
                            <div className="flex flex-col items-center justify-center">
                                 <div className="p-4 rounded-lg w-full h-full flex flex-col items-center justify-center bg-slate-900/30">
                                     <p className="text-xs text-slate-400 mb-1">Requested Temp</p>
                                     <div className="flex items-center gap-2 text-brand-gold">
                                         <ThermometerIcon />
                                         <p className="font-serif font-bold text-2xl">{activeMovie.thermostat}°F</p>
                                     </div>
                                </div>
                            </div>

                        </div>
                        
                        <div className="mt-8 pt-8 border-t border-yellow-300/20 grid grid-cols-1 sm:grid-cols-2 gap-4">
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
// Build Date: 2025-09-16 01:05 PM