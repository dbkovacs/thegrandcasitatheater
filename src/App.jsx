// File: src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { db } from './firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

import SignUpPage from './SignUpPage';
import AdminAuth from './AdminAuth';
import ShowingsPage from './ShowingsPage';

const buildTimestamp = "2025-09-13 17:24 PM";

// ====================================================================
// The New Homepage Component
// ====================================================================
function HomePage() {
  const [activeMovie, setActiveMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // This hook will fetch all 'Approved' movies and find the one that is active this week.
  useEffect(() => {
    const findActiveMovie = async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const moviesCollection = collection(db, "movieNights");
      const q = query(moviesCollection, where("status", "==", "Approved"));
      const querySnapshot = await getDocs(q);
      const approvedMovies = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      const currentMovie = approvedMovies.find(movie => {
        const showDate = new Date(`${movie.showDate}T00:00:00`);
        const activeWindowStart = new Date(showDate);
        activeWindowStart.setDate(showDate.getDate() - 6);
        return today >= activeWindowStart && today <= showDate;
      });

      setActiveMovie(currentMovie);
      setIsLoading(false);
    };

    findActiveMovie();
  }, []);

  const pageStyles = {
    textAlign: 'center',
    padding: '2rem',
    maxWidth: '900px',
    margin: '0 auto'
  };

  const headerStyles = {
    fontFamily: 'var(--font-heading)',
    fontSize: '3rem',
    color: 'var(--color-bronze)',
    marginBottom: '2rem'
  };
  
  const cardStyles = {
    border: `2px solid ${'var(--color-terracotta)'}`,
    borderRadius: '8px',
    padding: '2rem',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
  };

  const posterStyles = {
    width: '300px',
    maxWidth: '100%',
    borderRadius: '4px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
  };
  
  const navStyles = {
    display: 'flex',
    justifyContent: 'center',
    gap: '2rem',
    listStyle: 'none',
    padding: 0,
    marginTop: '3rem',
    fontSize: '1.2rem'
  };

  return (
    <div style={pageStyles}>
      <header>
        <h1 style={headerStyles}>The Grand Casita Theater</h1>
      </header>
      <main>
        {isLoading ? (
          <p>Loading...</p>
        ) : activeMovie ? (
          <div style={cardStyles}>
            <img src={activeMovie.posterUrl} alt={`${activeMovie.movieTitle} Poster`} style={posterStyles} />
            <h2 style={{ fontFamily: 'var(--font-heading)', marginTop: '1.5rem' }}>You're Invited!</h2>
            <p style={{ fontStyle: 'italic', marginTop: '-1rem' }}>by {activeMovie.hostName}</p>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', color: 'var(--color-terracotta)', margin: '1rem 0' }}>{activeMovie.movieTitle}</h3>
            <p>Showing on: <strong>{activeMovie.showDate}</strong></p>
            {/* Note: Host Message is a placeholder for now. We can add this to the forms later. */}
            <p style={{ borderLeft: `3px solid ${'var(--color-gold)'}`, paddingLeft: '1rem', fontStyle: 'italic' }}>
              "This will be a great night! Can't wait to see everyone there for this classic film."
            </p>
          </div>
        ) : (
          <div style={cardStyles}>
            <h2 style={{ fontFamily: 'var(--font-heading)' }}>No Movie This Week</h2>
            <p>There is no movie scheduled for this week. Check out what's on the horizon!</p>
          </div>
        )}
      </main>
      <footer>
        <nav>
          <ul style={navStyles}>
            <li><Link to="/showings">Coming Soon & History</Link></li>
            <li><Link to="/pick-a-movie">Host a Movie Night</Link></li>
          </ul>
        </nav>
        <div style={{ marginTop: '3rem', fontSize: '0.8rem' }}>
          <Link to="/admin" style={{ color: 'rgba(93, 73, 58, 0.5)'}}>Admin</Link>
        </div>
      </footer>
       <div style={{ position: 'fixed', bottom: 0, right: 0, padding: '4px 8px', backgroundColor: 'rgba(0,0,0,0.7)', color: 'white', fontSize: '10px', borderTopLeftRadius: '5px' }}>
          Build: {buildTimestamp}
      </div>
    </div>
  );
}


// ====================================================================
// The Main App Router (No changes here)
// ====================================================================
function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/pick-a-movie" element={<SignUpPage />} />
                <Route path="/admin" element={<AdminAuth />} />
                <Route path="/showings" element={<ShowingsPage />} />
            </Routes>
        </Router>
    );
}

export default App;
// END - 2025-09-13 17:24 PM