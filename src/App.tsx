// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import InvitationPage from './InvitationPage';
import SignUpPage from './SignUpPage';
import AdminPage from './AdminPage';
import ReservationsPage from './ReservationsPage'; // <-- Import ReservationsPage

function App() {
  return (
    <Router>
      <div className="bg-brand-dark min-h-screen text-white">
        {/* ... Header is unchanged ... */}
        
        <main className="py-8">
          <Routes>
            <Route path="/" element={<InvitationPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/reservations/:movieId" element={<ReservationsPage />} /> {/* <-- UPDATED ROUTE */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
// Build Date: 2025-09-16 01:25 PM