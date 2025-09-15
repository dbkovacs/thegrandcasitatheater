// File: src/AdminPage.jsx
// This is the component for the admin dashboard.
import React from 'react';

function AdminPage() {
    // We will add state and logic for handling file uploads here.
    return (
        <div className="container mx-auto p-8">
            <h1 className="text-4xl font-cinzel text-brand-gold mb-8 text-center">Admin Dashboard</h1> [cite: 3]

            {/* Section for Pending Reviews */}
            <div className="bg-brand-card p-6 rounded-2xl shadow-2xl border-2 border-yellow-300/20 mb-8">
                <h2 className="text-2xl font-cinzel text-brand-gold mb-4">Pending Movie Nights</h2>
                {/* In a future step, we will fetch and list movies from Firebase here. */}
                <p className="text-yellow-300/70">No pending movie nights.</p>
            </div>

            {/* Section for Adding a Poster */}
            <div className="bg-brand-card p-6 rounded-2xl shadow-2xl border-2 border-yellow-300/20"> 
                <h2 className="text-2xl font-cinzel text-brand-gold mb-4">Add Movie Poster</h2> 
                {/* This is where the drag-and-drop component will go. */}
                <div className="border-4 border-dashed border-yellow-300/30 rounded-lg p-12 text-center cursor-pointer hover:border-brand-gold hover:bg-black/20 transition-colors"> [cite: 6]
                    <p className="text-yellow-300/70">Drag & Drop Image File Here</p> [cite: 6]
                    <p className="text-sm text-yellow-300/50 mt-2">or click to select a file</p> [cite: 6]
                </div>
            </div>
        </div>
    );
}

export default AdminPage;
// END - 2025-09-15 04:15 PM