// File: src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { db } from './firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

import SignUpPage from './SignUpPage';
import AdminAuth from './AdminAuth';
import ShowingsPage from './ShowingsPage';

const buildTimestamp = "2025-09-13 18:05 PM";

function HomePage() {
  const [activeMovie, setActiveMovie] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
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

  return (
    <div className="site-wrapper">
      <header className="site-header">
        <h1>The Grand Casita Theater</h1>
      </header>
      
      <main className="home-container">
        {isLoading ? (
          <p>Loading...</p>
        ) : activeMovie ? (
          <div className="active-movie-card">
            <div className="poster-column">
              <img src={activeMovie.posterUrl} alt={`${activeMovie.movieTitle} Poster`} />
            </div>
            <div className="details-column">
              <h2>You're Invited!</h2>
              <p style={{ fontStyle: 'italic', marginTop: '-1rem' }}>by {activeMovie.hostName}</p>
              <h3>{activeMovie.movieTitle}</h3>
              <p>Showing on: <strong>{activeMovie.showDate}</strong></p>
              <p style={{ borderLeft: `3px solid ${'var(--color-gold)'}`, paddingLeft: '1rem', fontStyle: 'italic' }}>
                "This will be a great night! Can't wait to see everyone there for this classic film."
              </p>
            </div>
          </div>
        ) : (
          <div style={{background: 'rgba(0,0,0,0.4)', padding: '2rem', borderRadius: '8px', textAlign: 'center'}}>
            <h2 style={{ fontFamily: 'var(--font-heading)' }}>No Movie This Week</h2>
            <p>There is no movie scheduled for this week. Check out what's on the horizon!</p>
          </div>
        )}
        <nav>
          <ul className="home-nav">
            <li><Link to="/showings">Showings & History</Link></li>
            <li><Link to="/pick-a-movie">Host a Movie Night</Link></li>
          </ul>
        </nav>
      </main>

      <footer className="site-footer">
        <div className="admin-link">
          <Link to="/admin">Admin</Link>
        </div>
        <div style={{ position: 'fixed', bottom: 0, right: 0, padding: '4px 8px', backgroundColor: 'rgba(0,0,0,0.7)', color: 'white', fontSize: '10px', borderTopLeftRadius: '5px' }}>
            Build: {buildTimestamp}
        </div>
      </footer>
    </div>
  );
}

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
// END - 2025-09-13 19:51 PM