// File: src/App.jsx
// This file is now the main router for the application.
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// Import your page components
import InvitationPage from './InvitationPage';
import SignUpPage from './SignUpPage';
import AdminPage from './AdminPage';

function App() {
  return (
    <Router>
      <div className="bg-brand-dark min-h-screen text-white">
        {/* Navigation Header */}
        <header className="bg-black/30 shadow-lg">
          <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
            <Link to="/" className="text-2xl font-cinzel text-brand-gold font-bold">
              The Grand Casita Theater
            </Link>
            <div className="space-x-4">
              <Link to="/" className="text-yellow-300/80 hover:text-white transition">Home</Link>
              <Link to="/signup" className="text-yellow-300/80 hover:text-white transition">Host a Night</Link>
              <Link to="/admin" className="text-yellow-300/80 hover:text-white transition">Admin</Link>
            </div>
          </nav>
        </header>

        {/* Main Content Area */}
        <main className="py-8">
          <Routes>
            <Route path="/" element={<InvitationPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </main>
        
      </div>
    </Router>
  );
}

export default App;
// END - 2025-09-15 04:15 PM