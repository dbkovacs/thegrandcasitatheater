// File: src/AdminPage.jsx
import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';

function AdminPage() {
    const [pendingMovies, setPendingMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // State for the movie being edited
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [showDate, setShowDate] = useState('');
    const [trailerLink, setTrailerLink] = useState('');
    const [posterFile, setPosterFile] = useState(null); // File object state

    // Function to fetch pending movies from Firestore
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

    // Fetch movies when the component mounts
    useEffect(() => {
        fetchPendingMovies();
    }, []);

    // Handler to select a movie and pre-fill the form
    const handleSelectMovie = (movie) => {
        setSelectedMovie(movie);
        // Pre-fill date from user's request if available
        setShowDate(movie.eventDate || '');
        setTrailerLink('');
        setPosterFile(null);
    };

    // Handler for the final approval submission
    const handleApproveSubmit = async (e) => {
        e.preventDefault();
        if (!selectedMovie || !showDate) {
            alert('Please assign a show date.');
            return;
        }

        // **NOTE: File upload logic will be added in the next step.**
        // For now, we will just update the Firestore document.
        console.log('Selected poster file:', posterFile); // We'll use this file later

        try {
            const movieDocRef = doc(db, 'movieNights', selectedMovie.id);
            await updateDoc(movieDocRef, {
                status: 'Approved',
                showDate: showDate,
                trailerLink: trailerLink,
                // posterUrl: 'URL_FROM_UPLOAD' // This will be added later
            });

            alert(`'${selectedMovie.movieTitle}' has been approved!`);
            
            // Reset form and refresh list
            setSelectedMovie(null);
            fetchPendingMovies();

        } catch (err) {
            console.error("Error updating document: ", err);
            alert('Failed to approve movie.');
        }
    };

    return (
        <div style={{ fontFamily: 'sans-serif', padding: '2rem', maxWidth: '800px', margin: 'auto' }}>
            <h1>Admin Dashboard</h1>

            {/* Section for Pending Reviews */}
            <div style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}>
                <h2>Pending Movie Nights ({pendingMovies.length})</h2>
                {isLoading && <p>Loading...</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {!isLoading && pendingMovies.length === 0 && <p>No pending movie nights.</p>}
                
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {pendingMovies.map(movie => (
                        <li key={movie.id} style={{ borderBottom: '1px solid #eee', padding: '1rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <strong>{movie.movieTitle}</strong>
                                <br />
                                <small>Requested by: {movie.hostName} on {movie.eventDate}</small>
                            </div>
                            <button onClick={() => handleSelectMovie(movie)} style={{ padding: '0.5rem 1rem' }}>
                                Approve
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Section for Editing and Approving a Selected Movie */}
            {selectedMovie && (
                <div style={{ border: '1px solid #007bff', padding: '1rem', borderRadius: '8px', marginTop: '2rem', backgroundColor: '#f0f8ff' }}>
                    <h3>Approving: {selectedMovie.movieTitle}</h3>
                    <form onSubmit={handleApproveSubmit}>
                        {/* Assign Date */}
                        <div style={{ marginBottom: '1rem' }}>
                            <label htmlFor="showDate" style={{ display: 'block', marginBottom: '0.5rem' }}><strong>Assign Show Date</strong></label>
                            <input
                                type="date"
                                id="showDate"
                                value={showDate}
                                onChange={(e) => setShowDate(e.target.value)}
                                required
                                style={{ padding: '0.5rem', width: '100%', boxSizing: 'border-box' }}
                            />
                        </div>

                        {/* Trailer Link */}
                        <div style={{ marginBottom: '1rem' }}>
                            <label htmlFor="trailerLink" style={{ display: 'block', marginBottom: '0.5rem' }}><strong>Movie Trailer Embed Link</strong></label>
                            <input
                                type="text"
                                id="trailerLink"
                                value={trailerLink}
                                onChange={(e) => setTrailerLink(e.target.value)}
                                placeholder="e.g., https://www.youtube.com/embed/..."
                                style={{ padding: '0.5rem', width: '100%', boxSizing: 'border-box' }}
                            />
                        </div>

                        {/* Poster Upload */}
                        <div style={{ marginBottom: '1rem' }}>
                            <label htmlFor="posterFile" style={{ display: 'block', marginBottom: '0.5rem' }}><strong>Add Movie Poster</strong></label>
                            <input
                                type="file"
                                id="posterFile"
                                onChange={(e) => setPosterFile(e.target.files[0])}
                                accept="image/png, image/jpeg"
                                style={{ padding: '0.5rem', width: '100%', boxSizing: 'border-box' }}
                            />
                            <small>Note: Poster upload functionality will be connected next.</small>
                        </div>

                        {/* Action Buttons */}
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                            <button type="submit" style={{ padding: '0.75rem 1.5rem', border: 'none', backgroundColor: '#28a745', color: 'white', cursor: 'pointer', borderRadius: '4px' }}>
                                Save and Approve
                            </button>
                            <button type="button" onClick={() => setSelectedMovie(null)} style={{ padding: '0.75rem 1.5rem', border: 'none', backgroundColor: '#6c757d', color: 'white', cursor: 'pointer', borderRadius: '4px' }}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}

export default AdminPage;
// END - 2025-09-13 13:29 PM