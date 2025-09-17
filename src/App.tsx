// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import InvitationPage from './InvitationPage';
import ReservationsPage from './ReservationsPage';
import SignUpPage from './SignUpPage';
import AdminAuth from './AdminAuth';
import HistoryPage from './HistoryPage';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

function App() {
  return (
    <Router>
      <div className="bg-brand-dark text-white min-h-screen flex flex-col font-sans">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<InvitationPage />} />
            <Route path="/reservations/:movieId" element={<ReservationsPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/admin" element={<AdminAuth />} />
            <Route path="/history" element={<HistoryPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
// Updated routing: InvitationPage is now the home page. Removed old HomePage route.
// END - 2025-09-17 10:10 AM