// File: src/AdminAuth.jsx
import React, { useState } from 'react';
import AdminPage from './AdminPage';

const buildTimestamp = "2025-09-13 16:40 PM";

// This is the component that will act as a gatekeeper for the AdminPage
function AdminAuth() {
    // --- IMPORTANT ---
    // Change your password here.
    const CORRECT_PASSWORD = 'kovadmin';

    // Check sessionStorage to see if user is already logged in for this session
    const [isAuthenticated, setIsAuthenticated] = useState(
        sessionStorage.getItem('isAdminAuthenticated') === 'true'
    );
    
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        if (password === CORRECT_PASSWORD) {
            // If password is correct, set a flag in sessionStorage and update state
            sessionStorage.setItem('isAdminAuthenticated', 'true');
            setIsAuthenticated(true);
            setError('');
        } else {
            setError('Incorrect password.');
        }
        setPassword('');
    };

    // If user is authenticated, show the real AdminPage.
    if (isAuthenticated) {
        return <AdminPage />;
    }

    // If user is NOT authenticated, show the login form.
    return (
        <div style={{ fontFamily: 'sans-serif', textAlign: 'center', paddingTop: '100px' }}>
            <h2>Admin Access</h2>
            <form onSubmit={handleLogin}>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    style={{ padding: '10px', fontSize: '1rem', marginRight: '10px' }}
                />
                <button type="submit" style={{ padding: '10px', fontSize: '1rem' }}>
                    Login
                </button>
            </form>
            {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
            <div style={{ position: 'fixed', bottom: 0, right: 0, padding: '4px 8px', backgroundColor: 'rgba(0,0,0,0.7)', color: 'white', fontSize: '10px', borderTopLeftRadius: '5px' }}>
                Build: {buildTimestamp}
            </div>
        </div>
    );
}

export default AdminAuth;
// END - 2025-09-13 16:40 PM