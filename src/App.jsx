// File: src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import HomePage from './HomePage';
import SignUpPage from './SignUpPage';
import AdminAuth from './AdminAuth';
import ShowingsPage from './ShowingsPage';
import ReservationsPage from './ReservationsPage'; // <-- 1. IMPORT NEW PAGE

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Layout><HomePage /></Layout>} />
                <Route path="/pick-a-movie" element={<Layout><SignUpPage /></Layout>} />
                <Route path="/admin" element={<Layout><AdminAuth /></Layout>} />
                <Route path="/showings" element={<Layout><ShowingsPage /></Layout>} />
                <Route path="/reservations" element={<Layout><ReservationsPage /></Layout>} /> {/* <-- 2. ADD NEW ROUTE */}
            </Routes>
        </Router>
    );
}

export default App;
// END - 2025-09-15 13:30 PM