import React, { useState, useEffect } from 'react';

// === Style Component to Inject CSS Directly ===
// This resolves the issue by embedding styles directly into the component,
// making it self-contained for compilation.
const AppStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Inter:wght@400;500&display=swap');

    .font-cinzel {
      font-family: 'Cinzel', serif;
    }

    .text-shadow {
      text-shadow: 0 2px 4px rgba(0,0,0,0.6);
    }

    .bg-brand-dark {
      background-color: #380000;
    }

    .bg-brand-card {
      background-color: #2a0000;
    }

    .text-brand-gold {
      color: #fde047; /* Tailwind's yellow-300 */
    }

    .video-container {
      position: relative;
      padding-bottom: 56.25%; /* 16:9 aspect ratio */
      height: 0;
      overflow: hidden;
    }

    .video-container iframe {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }

    /* =================================
       Velvet Curtain Button Style
       ================================= */
    .btn-velvet {
      font-family: 'Cinzel', serif;
      font-weight: 700;
      padding: 0.75rem 1.5rem;
      border-radius: 0.5rem;
      border: 1px solid #000;
      color: #fde047;
      background-color: #4c0000;
      background-image: linear-gradient(45deg, rgba(0,0,0,0.2) 25%, transparent 25%, transparent 50%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.2) 75%, transparent 75%, transparent);
      background-size: 20px 20px;
      box-shadow: inset 0 0 10px rgba(0,0,0,0.7);
      transition: all 0.3s ease;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      text-decoration: none; /* For <a> tags */
      cursor: pointer; /* For <button> tags */
    }

    .btn-velvet:hover {
      background-color: #fde047;
      color: #4c0000;
      box-shadow: inset 0 0 10px rgba(0,0,0,0.3), 0 0 10px rgba(255, 255, 255, 0.3);
      background-image: none;
    }
  `}</style>
);


// === Main App Component ===
export default function App() {
  // Configuration object for the event details
  const config = {
    inviterName: "Dustin",
    inviterComment: "After reserving your seat, wait for the Swig invite to load. Stacy's Treat!",
    movieTitle: "A Knight's Tale",
    movieTagline: "\"He Will Rock You\"",
    moviePosterUrl: "https://thegrandcasitatheater.com/movieposter.png",
    youtubeTrailerUrl: "https://www.youtube.com/embed/dFojvOFWir4?si=98gEyRnkqk7eM6S9",
    isAdultsOnly: true,
    showProductsButton: true,
    eventTimezone: "America/Denver",
    eventDate: {
        year: 2025, month: 8, day: 25, display: "Thursday, August 21, 2025"
    },
    eventTime: {
        startHour: 18, startMinute: 30, durationHours: 2, display: "Doors Open at 6:00 PM<br>Movie Starts 6:30 PM"
    },
    eventLocationAddress: "2392 Old Rosebud Ln, South Jordan, UT 84095",
    eventLocationGoogleMapsUrl: "https://maps.google.com/?q=2392+Old+Rosebud+Ln,+South+Jordan,+UT+84095",
  };

  const [isEventOver, setIsEventOver] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);
  const [showAgeModal, setShowAgeModal] = useState(false);

  useEffect(() => {
    const eventDateTime = new Date(config.eventDate.year, config.eventDate.month - 1, config.eventDate.day, 23, 59, 59);
    const today = new Date();
    if (today > eventDateTime) {
        setIsEventOver(true);
    }
  }, [config.eventDate]);

  const handleReserveSeat = (e) => {
    if (config.isAdultsOnly) {
      e.preventDefault();
      setShowAgeModal(true);
    }
  };

  return (
    <>
      <AppStyles />
      <div className="bg-brand-dark text-white font-sans">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="relative max-w-4xl mx-auto">
            <main id="main-content" className="bg-brand-card shadow-2xl rounded-2xl overflow-hidden border-2 border-yellow-300/20 relative z-10">
              <div className="md:flex">
                {/* Left Side: Movie Poster */}
                <div className="md:w-1/2 p-4 md:p-8 flex flex-col items-center justify-center bg-black/20">
                  <div className="relative w-full max-w-sm mx-auto">
                    <img src="https://thegrandcasitatheater.com/Gemini_Generated_Image_q6fw4mq6fw4mq6fwtransflogov4.png" alt="Ornate Frame" className="w-full h-auto" onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/600x900/000000/FFFFFF?text=Frame' }} />
                    <div className="absolute" style={{ top: '34%', left: '20%', width: '60%', height: '65%' }}>
                      <img id="movie-poster" className="w-full h-full" src={config.moviePosterUrl} alt={`Poster for ${config.movieTitle}`} style={{ objectFit: 'contain' }} onError={(e) => { e.target.onerror = null; e.target.src=`https://placehold.co/600x900/2a0000/fde047?text=${encodeURIComponent(config.movieTitle)}` }}/>
                    </div>
                  </div>
                </div>

                {/* Right Side: Invitation Details */}
                <div id="invitation-details" className="p-8 md:p-12 md:w-1/2 flex flex-col justify-center">
                  {isEventOver ? (
                    <>
                      <h1 className="text-4xl md:text-5xl font-bold mb-4 text-shadow font-cinzel">Event Has Passed</h1>
                      <div className="mb-6 bg-black/20 p-4 rounded-lg border-l-4 border-yellow-300/50">
                        <p className="text-gray-300 italic">This movie night is over. Check the history for details and sign up to host your own!</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="text-lg md:text-xl text-brand-gold font-semibold mb-2 text-shadow font-cinzel">You're Invited By</p>
                      <h1 className="text-4xl md:text-5xl font-bold mb-4 text-shadow font-cinzel">{config.inviterName}</h1>
                      <div className="mb-6 bg-black/20 p-4 rounded-lg border-l-4 border-yellow-300/50">
                        <p className="text-gray-300 italic">{config.inviterComment}</p>
                      </div>
                      <div className="my-4 border-t border-yellow-300/20"></div>
                      <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-shadow font-cinzel">{config.movieTitle}</h2>
                      <p className="text-md text-gray-300 mt-2 mb-4">{config.movieTagline}</p>
                      <div className="my-4 space-y-3 text-gray-300">
                        <div className="flex items-center gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-300/70 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 002-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            <span className="font-semibold">{config.eventDate.display}</span>
                        </div>
                        <div className="flex items-start gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-300/70 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <span className="font-semibold leading-tight" dangerouslySetInnerHTML={{ __html: config.eventTime.display }}></span>
                        </div>
                        <div className="flex items-start gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-300/70 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            <div><a href={config.eventLocationGoogleMapsUrl} target="_blank" rel="noreferrer" className="hover:text-brand-gold transition-colors font-semibold"><span>{config.eventLocationAddress}</span></a></div>
                        </div>
                      </div>
                      <div className="my-4 text-center p-3 rounded-lg border-2 border-transparent bg-red-900/30 border-red-500/50">
                          <div className="inline-flex items-center space-x-4"><span className="font-cinzel text-brand-gold text-xl font-bold">{config.isAdultsOnly ? 'Adults Only' : 'Kids Welcome'}</span></div>
                          <p className="text-gray-300 mt-1 text-sm h-4">{config.isAdultsOnly ? 'This screening is for adults only (21+).' : 'This is a family-friendly screening.'}</p>
                      </div>
                    </>
                  )}
                  
                  {/* VELVET CURTAIN ACTIONS */}
                  <div className="mt-6 w-full space-y-2">
                      {!isEventOver && <div className="flex"><button onClick={() => setShowTrailer(true)} className="btn-velvet w-full">Watch Trailer</button></div>}
                      {!isEventOver && <div className="flex gap-2"><a href="reservations.html" onClick={handleReserveSeat} className="btn-velvet w-1/2">Reserve Seat</a><a href="swigdrinkorder.html" className="btn-velvet w-1/2">Order a Drink</a></div>}
                      <div className="flex gap-2">
                          <a href="history.html" className="btn-velvet w-1/2 leading-tight">Coming Soon<br/>History</a>
                          <a href="signups.html" className="btn-velvet w-1/2">Pick a Movie</a>
                      </div>
                      {config.showProductsButton && <div className="flex"><a href="products.html" className="btn-velvet w-full">Products</a></div>}
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        
        {/* Trailer Modal */}
        {showTrailer && (
            <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
                <div className="bg-gray-900 rounded-lg overflow-hidden shadow-xl w-full max-w-4xl relative border-2 border-yellow-300/50">
                    <button onClick={() => setShowTrailer(false)} className="absolute top-2 right-4 text-white text-4xl hover:text-gray-400 z-10">&times;</button>
                    <div className="video-container">
                        <iframe src={`${config.youtubeTrailerUrl}?autoplay=1`} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                    </div>
                </div>
            </div>
        )}

        {/* Adults Only Modal */}
        {showAgeModal && (
            <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
                <div className="bg-brand-card p-8 rounded-lg shadow-xl text-center max-w-sm w-full border-2 border-red-500/50">
                    <h3 className="text-2xl font-bold mb-4 text-red-400 font-cinzel">Age Restriction</h3>
                    <p className="text-gray-200 mb-6">This screening is for adults only (21+). Please confirm you meet the age requirement to proceed.</p>
                    <div className="flex justify-center gap-4">
                        <a href="reservations.html" className="w-full px-6 py-3 bg-yellow-300 hover:bg-yellow-400 text-stone-900 font-bold rounded-lg transition-colors font-cinzel">I Confirm</a>
                        <button onClick={() => setShowAgeModal(false)} className="w-full px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-bold rounded-lg transition-colors font-cinzel">Cancel</button>
                    </div>
                </div>
            </div>
        )}
      </div>
    </>
  );
}

