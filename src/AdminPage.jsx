// File: src/AdminPage.jsx
import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import PendingMovieItem from './PendingMovieItem'; // Import the new component

const buildTimestamp = "2025-09-13 14:22 PM";

function AdminPage() {
    const [pendingMovies, setPendingMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchPendingMovies = async () => {
        setIsLoading(true);
        try {
            const movieNightsCollection = collection(db, "movieNights");
            const q = query(movieNightsCollection, where("status", "==", "Pending Review"));
            const querySnapshot = await getDocs(q);
            const movies = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setPendingMovies(movies);
        } catch (err) {
            setError('Failed to fetch movies. Please try again.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingMovies();
    }, []);

    return (
        <div style={{ fontFamily: 'sans-serif', padding: '2rem', maxWidth: '800px', margin: 'auto' }}>
            <h1>Admin Dashboard</h1>
            <div style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}>
                <h2>Pending Movie Nights ({pendingMovies.length})</h2>
                {isLoading && <p>Loading...</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {!isLoading && pendingMovies.length === 0 && <p>No pending movie nights to approve.</p>}
                
                <ul style={{ padding: 0, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {pendingMovies.map(movie => (
                        <PendingMovieItem key={movie.id} movie={movie} onApproved={fetchPendingMovies} />
                    ))}
                </ul>
            </div>
            <div style={{ position: 'fixed', bottom: 0, right: 0, padding: '4px 8px', backgroundColor: 'rgba(0,0,0,0.7)', color: 'white', fontSize: '10px', borderTopLeftRadius: '5px' }}>
                Build: {buildTimestamp}
            </div>
        </div>
    );
}

export default AdminPage;
// END - 2025-09-13 14:22 PM