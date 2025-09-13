// File: src/App.jsx
// This is the main application component. It handles routing to display the correct page.
import React from 'react';
import SignUpPage from './SignUpPage';
import AdminPage from './AdminPage';
import InvitationPage from './InvitationPage';

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
// END - 2025-09-13 10:42 AM