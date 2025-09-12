// Triggering a new Vercel deployment

import React from 'react';

// === EDIT YOUR INVITATION DETAILS HERE ===
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
// ==========================================

function App() {
    // NOTE: All the page logic will be added here in future steps.
    // For now, this is just the basic structure.
    return (
        <div className="bg-brand-dark text-white">
            {/* The main content will be rendered here based on the config object */}
        </div>
    );
}

export default App;
