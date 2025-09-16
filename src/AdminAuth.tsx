// src/AdminAuth.tsx
import React, { useState } from 'react';
import AdminPage from './AdminPage';

function AdminAuth() {
    const CORRECT_PASSWORD = 'kovadmin';
    const [isAuthenticated, setIsAuthenticated] = useState(sessionStorage.getItem('isAdminAuthenticated') === 'true');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === CORRECT_PASSWORD) {
            sessionStorage.setItem('isAdminAuthenticated', 'true');
            setIsAuthenticated(true);
            setError('');
        } else {
            setError('Incorrect password.');
        }
        setPassword('');
    };

    if (isAuthenticated) {
        return <AdminPage />;
    }

    return (
        <div className="min-h-screen bg-brand-dark flex items-center justify-center">
            <div className="w-full max-w-md">
                <form onSubmit={handleLogin} className="bg-brand-card shadow-2xl rounded-2xl border-2 border-yellow-300/20 p-8 space-y-6">
                    <h2 className="text-3xl font-cinzel text-brand-gold text-center">Admin Access</h2>
                    <div>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter password"
                            className="block w-full bg-slate-900/50 border border-slate-700 rounded-md shadow-sm py-2 px-3 text-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-brand-gold"
                        />
                    </div>
                    <button type="submit" className="w-full btn-velvet primary">Login</button>
                    {error && <p className="text-center text-red-400">{error}</p>}
                </form>
            </div>
        </div>
    );
}

export default AdminAuth;
// Build Date: 2025-09-16 01:35 PM