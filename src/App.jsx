// File: src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import SignUpPage from './SignUpPage';
import AdminPage from './AdminPage';

const buildTimestamp = "2025-09-13 14:11 PM";

// This is the new simple homepage component
function HomePage() {
    return (
        <div style={{ fontFamily: 'sans-serif', padding: '2rem' }}>
            <h1>The Grand Casita Theater</h1>
            <nav>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    <li style={{ marginBottom: '1rem' }}>
                        <Link to="/pick-a-movie">-- Pick a Movie Page --</Link>
                    </li>
                    <li>
                        <Link to="/admin">-- Admin Page --</Link>
                    </li>
                </ul>
            </nav>
            <div style={{ position: 'fixed', bottom: 0, right: 0, padding: '4px 8px', backgroundColor: 'rgba(0,0,0,0.7)', color: 'white', fontSize: '10px', borderTopLeftRadius: '5px' }}>
                Build: {buildTimestamp}
            </div>
        </div>
    );
}

// App component now handles all the routing
function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/pick-a-movie" element={<SignUpPage />} />
                <Route path="/admin" element={<AdminPage />} />
            </Routes>
        </Router>
    );
}

export default App;
// END - 2025-09-13 14:11 PM