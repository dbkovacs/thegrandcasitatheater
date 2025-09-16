// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// Import your page components
import InvitationPage from './InvitationPage';
import SignUpPage from './SignUpPage';
import AdminPage from './AdminPage';

function App() {
  return (
    <Router>
      <div className="bg-brand-dark bg-ceiling-pattern bg-repeat bg-blend-overlay bg-white/5 min-h-screen text-white">
        {/* Navigation Header */}
        <header className="bg-black/30 shadow-lg backdrop-blur-sm sticky top-0 z-50">
          <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
            <Link to="/" className="text-2xl font-serif text-brand-gold font-bold tracking-wider">
              The Grand Casita Theater
            </Link>
            <div className="space-x-6">
              <Link to="/" className="text-yellow-300/80 hover:text-white transition font-semibold">Home</Link>
              <Link to="/signup" className="text-yellow-300/80 hover:text-white transition font-semibold">Host a Night</Link>
              <Link to="/admin" className="text-yellow-300/80 hover:text-white transition font-semibold">Admin</Link>
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
// Build Date: 2025-09-16 10:15 AM