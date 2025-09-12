// Main application component with simple routing
// NOTE: All page components are temporarily in this file to resolve a build issue.
// We will separate them into their own files in a later step.
import React, { useState, useEffect } from 'react';

// --- Page Components ---

const AdminPage = () => (
    <div className="container mx-auto p-8">
        <h1 className="text-4xl font-cinzel text-brand-gold mb-8 text-center">Admin Dashboard</h1>
        <div className="bg-brand-card p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-cinzel mb-4">Pending Movie Nights</h2>
            <p className="text-gray-400">No pending movie nights.</p>
        </div>
        <div className="mt-8 bg-brand-card p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-cinzel mb-4">Add Movie Poster</h2>
            <div className="border-4 border-dashed border-gray-600 rounded-lg p-12 text-center cursor-pointer hover:border-brand-gold hover:bg-gray-800 transition-colors">
                <p className="text-gray-400">Drag & Drop Image File Here</p>
                <p className="text-sm text-gray-500 mt-2">or click to select a file</p>
            </div>
        </div>
    </div>
);

const InvitationPage = () => (
    <div className="text-center p-8">
        <h1 className="text-4xl font-cinzel mb-4">A Knight's Tale</h1>
        <p>This is the main invitation page. Content will be built out here.</p>
    </div>
);

const SignUpPage = () => (
    <div className="text-center p-8">
        <h1 className="text-4xl font-cinzel mb-4">Pick a Movie</h1>
        <p>The form to sign up to host a movie will be built here.</p>
    </div>
);


// --- Main App ---

function App() {
    const [currentPage, setCurrentPage] = useState('/');

    useEffect(() => {
        const handleHashChange = () => {
            // Use '#' for the root, and include hash for others
            setCurrentPage(window.location.hash || '#');
        };
        window.addEventListener('hashchange', handleHashChange);
        handleHashChange(); // Set initial page
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    const renderPage = () => {
        switch (currentPage) {
            case '#/admin':
                return <AdminPage />;
            case '#/pick-a-movie':
                return <SignUpPage />;
            default:
                return <InvitationPage />;
        }
    };

    return (
        <div className="bg-brand-dark text-white min-h-screen">
             <nav className="bg-brand-card p-4 text-center">
                <a href="#" className="font-cinzel text-brand-gold p-2">Home</a>
                <a href="#/pick-a-movie" className="font-cinzel text-brand-gold p-2">Pick a Movie</a>
                <a href="#/admin" className="font-cinzel text-brand-gold p-2">Admin</a>
            </nav>
            <main>
                {renderPage()}
            </main>
        </div>
    );
}

export default App;

