// File: src/AdminPage.jsx
// This is the new component for the admin dashboard.

import React from 'react';

function AdminPage() {
    // We will add state and logic for handling file uploads here.
    
    return (
        <div className="container mx-auto p-8">
            <h1 className="text-4xl font-cinzel text-brand-gold mb-8 text-center">Admin Dashboard</h1>

            <div className="bg-brand-card p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-cinzel mb-4">Pending Movie Nights</h2>
                {/* In a future step, we will fetch and list the "Pending Review" 
                    movies from Firebase here. Each item will have an "Approve" button
                    that opens the editing and upload area.
                */}
                <p className="text-gray-400">No pending movie nights.</p>
            </div>

            <div className="mt-8 bg-brand-card p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-cinzel mb-4">Add Movie Poster</h2>
                {/* This is where the drag-and-drop component will go. */}
                <div 
                    className="border-4 border-dashed border-gray-600 rounded-lg p-12 text-center cursor-pointer hover:border-brand-gold hover:bg-gray-800 transition-colors"
                >
                    <p className="text-gray-400">Drag & Drop Image File Here</p>
                    <p className="text-sm text-gray-500 mt-2">or click to select a file</p>
                </div>
            </div>
        </div>
    );
}

export default AdminPage;
