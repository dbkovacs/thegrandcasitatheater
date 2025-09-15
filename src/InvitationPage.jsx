// File: src/InvitationPage.jsx
// This component is the main home/invitation page.
import React from 'react';
import { Link } from 'react-router-dom';

function InvitationPage() {
    return (
        <div className="text-center p-8 container mx-auto">
            <div className="bg-brand-card shadow-2xl rounded-2xl border-2 border-yellow-300/20 p-12">
                <h1 className="text-6xl font-cinzel text-brand-gold text-shadow mb-4">
                    Welcome to The Grand Casita
                </h1>
                <p className="text-yellow-300/70 text-lg max-w-3xl mx-auto mb-8">
                    An exclusive, private cinema experience designed for friends and family. Here, you choose the movie, you set the date, and we provide the magic. Ready to host an unforgettable movie night?
                </p>
                <Link to="/signup" className="btn-velvet text-xl">
                    Host A Movie Night
                </Link>
            </div>
        </div>
    );
}

export default InvitationPage;
// END - 2025-09-15 04:15 PM