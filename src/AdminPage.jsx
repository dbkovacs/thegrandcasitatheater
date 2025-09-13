// File: src/AdminPage.jsx
import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, query, where, getDocs, doc, updateDoc, orderBy } from 'firebase/firestore';
import PendingMovieItem from './PendingMovieItem';

const buildTimestamp = "2025-09-13 14:53 PM";

function AdminPage() {
    // State for both sections
    const [pendingMovies, setPendingMovies] = useState([]);
    const [approvedMovies, setApprovedMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // State for the inline editing functionality in the table
    const [editingMovieId, setEditingMovieId] = useState(null);
    const [newShowDate, setNewShowDate] = useState('');

    // Fetch both pending AND approved movies
    const fetchAllMovies = async () => {
        setIsLoading(true);
        try {
            const movieNightsCollection = collection(db, "movieNights");

            // Query for Pending movies
            const pendingQuery = query(movieNightsCollection, where("status", "==", "Pending Review"));
            const pendingSnapshot = await getDocs(pendingQuery);
            setPendingMovies(pendingSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

            // Query for Approved movies for the schedule table
            const approvedQuery = query(movieNightsCollection, where("status", "==", "Approved"), orderBy("showDate", "asc"));
            const approvedSnapshot = await getDocs(approvedQuery);
            setApprovedMovies(approvedSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        } catch (err) {
            setError('Failed to fetch movies. Please try again.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAllMovies();
    }, []);

    // Function to handle starting the edit mode
    const handleEditClick = (movie) => {
        setEditingMovieId(movie.id);
        setNewShowDate(movie.showDate);
    };

    // Function to cancel the edit
    const handleCancelClick = () => {
        setEditingMovieId(null);
        setNewShowDate('');
    };

    // Function to save the updated date to Firestore
    const handleSaveDate = async (movieId) => {
        if (!newShowDate) {
            alert("Please select a date.");
            return;
        }
        try {
            const movieDocRef = doc(db, 'movieNights', movieId);
            await updateDoc(movieDocRef, {
                showDate: newShowDate
            });
            alert("Show date updated successfully!");
            setEditingMovieId(null); // Exit editing mode
            fetchAllMovies(); // Refresh all movie lists
        } catch (error) {
            console.error("Error updating date: ", error);
            alert("Failed to update the date.");
        }
    };

    return (
        <div style={{ fontFamily: 'sans-serif', padding: '2rem', maxWidth: '800px', margin: 'auto' }}>
            <h1>Admin Dashboard</h1>

            {/* Section 1: Approving New Movies */}
            <div style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px', marginBottom: '2rem' }}>
                <h2>Pending Movie Nights ({pendingMovies.length})</h2>
                {isLoading && <p>Loading...</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {!isLoading && pendingMovies.length === 0 && <p>No pending movie nights to approve.</p>}
                <ul style={{ padding: 0, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {pendingMovies.map(movie => (
                        <PendingMovieItem key={movie.id} movie={movie} onApproved={fetchAllMovies} />
                    ))}
                </ul>
            </div>

            {/* Section 2: Schedule Management Table */}
            <div style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}>
                <h2>Schedule Management</h2>
                {isLoading && <p>Loading...</p>}
                {!isLoading && approvedMovies.length === 0 && <p>No approved movies in the schedule.</p>}
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Movie Title</th>
                            <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Show Date</th>
                            <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {approvedMovies.map(movie => (
                            <tr key={movie.id}>
                                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{movie.movieTitle}</td>
                                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                                    {editingMovieId === movie.id ? (
                                        <input 
                                            type="date" 
                                            value={newShowDate} 
                                            onChange={(e) => setNewShowDate(e.target.value)} 
                                        />
                                    ) : (
                                        movie.showDate
                                    )}
                                </td>
                                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                                    {editingMovieId === movie.id ? (
                                        <>
                                            <button onClick={() => handleSaveDate(movie.id)} style={{ marginRight: '5px' }}>Save</button>
                                            <button onClick={handleCancelClick}>Cancel</button>
                                        </>
                                    ) : (
                                        <button onClick={() => handleEditClick(movie)}>Edit</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div style={{ position: 'fixed', bottom: 0, right: 0, padding: '4px 8px', backgroundColor: 'rgba(0,0,0,0.7)', color: 'white', fontSize: '10px', borderTopLeftRadius: '5px' }}>
                Build: {buildTimestamp}
            </div>
        </div>
    );
}

export default AdminPage;
// END - 2025-09-13 14:53 PM