// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import InvitationPage from './InvitationPage';
import SignUpPage from './SignUpPage';
import AdminPage from './AdminPage';
import ReservationsPage from './ReservationsPage';
import HistoryPage from './HistoryPage'; // <-- Import HistoryPage

function App() {
  return (
    <Router>
      <div className="bg-brand-dark min-h-screen text-white">
        <header className="bg-black/30 shadow-lg backdrop-blur-sm sticky top-0 z-50">
          <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
            <Link to="/" className="text-2xl font-serif text-brand-gold font-bold tracking-wider">
              The Grand Casita Theater
            </Link>
            <div className="space-x-6">
              <Link to="/" className="text-yellow-300/80 hover:text-white transition font-semibold">Home</Link>
              <Link to="/history" className="text-yellow-300/80 hover:text-white transition font-semibold">History</Link> {/* <-- ADDED LINK */}
              <Link to="/signup" className="text-yellow-300/80 hover:text-white transition font-semibold">Host a Night</Link>
              <Link to="/admin" className="text-yellow-300/80 hover:text-white transition font-semibold">Admin</Link>
            </div>
          </nav>
        </header>
        
        <main className="py-8">
          <Routes>
            <Route path="/" element={<InvitationPage />} />
            <Route path="/history" element={<HistoryPage />} /> {/* <-- ADDED ROUTE */}
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/reservations/:movieId" element={<ReservationsPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
// Build Date: 2025-09-16 01:35 PM