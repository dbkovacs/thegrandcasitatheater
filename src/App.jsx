// File: src/App.jsx
// This is the main application component. It handles routing to display the correct page.
// NOTE: All page components are temporarily in this file to resolve a build issue.
import React from 'react';

// --- Page Components (temporary location) ---

const SignUpPage = () => {
    // This component will be moved to its own file later
    return (
        <div className="text-center p-8">
            <h1 className="text-4xl font-cinzel mb-4">Pick a Movie</h1>
            <p>The form to sign up to host a movie will be built here.</p>
        </div>
    );
};

const AdminPage = () => {
    // This component will be moved to its own file later
    return (
        <div className="text-center p-8">
            <h1 className="text-4xl font-cinzel mb-4">Admin Page</h1>
            <p>The admin dashboard will be built here.</p>
        </div>
    );
};

const InvitationPage = () => {
    // This component will be moved to its own file later
    return (
        <div className="text-center p-8">
            <h1 className="text-4xl font-cinzel mb-4">A Knight's Tale</h1>
            <p>This is the main invitation page. Content will be built out here.</p>
        </div>
    );
};


// --- Main App ---

function App() {
    const [currentPage, setCurrentPage] = React.useState('/');

    React.useEffect(() => {
        const handleHashChange = () => {
            setCurrentPage(window.location.hash || '#');
        };
        window.addEventListener('hashchange', handleHashChange);
        handleHashChange();
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
// END - 2025-09-12 18:25 PM

