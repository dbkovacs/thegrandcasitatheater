// File: src/Layout.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const buildTimestamp = "2025-09-15 10:05 AM";

function Layout({ children }) {
  return (
    <div className="site-wrapper">
      <header className="site-header">
        <h1><Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>The Grand Casita Theater</Link></h1>
      </header>
      
      <main className="main-container">
        {children}
      </main>

      <footer className="site-footer">
        <div className="footer-nav">
          <Link to="/showings">Showings & History</Link>
          <Link to="/pick-a-movie">Host a Movie Night</Link>
        </div>
        <div className="admin-link">
          <Link to="/admin">Admin</Link>
        </div>
      </footer>
      <div style={{ position: 'fixed', bottom: 0, right: 0, padding: '4px 8px', backgroundColor: 'rgba(0,0,0,0.7)', color: 'white', fontSize: '10px', borderTopLeftRadius: '5px' }}>
          Build: {buildTimestamp}
      </div>
    </div>
  );
}

export default Layout;
// END - 2025-09-15 10:05 AM