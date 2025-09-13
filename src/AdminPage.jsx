// File: src/AdminPage.jsx
import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

function AdminPage() {
    const [pendingMovies, setPendingMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [selectedMovie, setSelectedMovie] = useState(null);
    const [showDate, setShowDate] = useState('');
    const [trailerLink, setTrailerLink] = useState('');
    const [posterFile, setPosterFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

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

    const handleSelectMovie = (movie) => {
        setSelectedMovie(movie);
        setShowDate(movie.eventDate || '');
        setTrailerLink('');
        setPosterFile(null);
    };

    // --- MODIFIED FUNCTION ---
    const handleApproveSubmit = async (e) => {
        e.preventDefault();
        
        // NEW: Add a log to see the state right before validation
        console.log('Submitting with these values:', {
            showDate: showDate,
            posterFile: posterFile
        });

        // NEW: More specific validation alerts
        if (!showDate) {
            alert('Validation Failed: Please make sure to assign a show date.');
            return;
        }
        if (!posterFile) {
            alert('Validation Failed: Please make sure to select a poster file.');
            return;
        }

        setIsSubmitting(true);

        try {
            const storage = getStorage();
            const posterRef = ref(storage, `posters/${Date.now()}_${posterFile.name}`);
            const snapshot = await uploadBytes(posterRef, posterFile);
            const posterUrl = await getDownloadURL(snapshot.ref);

            const movieDocRef = doc(db, 'movieNights', selectedMovie.id);
            await updateDoc(movieDocRef, {
                status: 'Approved',
                showDate: showDate,
                trailerLink: trailerLink,
                posterUrl: posterUrl
            });

            alert(`'${selectedMovie.movieTitle}' has been approved!`);
            
            setSelectedMovie(null);
            fetchPendingMovies();

        } catch (err) {
            console.error("Error during approval process: ", err);
            alert('An error occurred. Failed to approve movie.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={{ fontFamily: 'sans-serif', padding: '2rem', maxWidth: '800px', margin: 'auto' }}>
            <h1>Admin Dashboard</h1>
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

            {selectedMovie && (
                <div style={{ border: '1px solid #007bff', padding: '1rem', borderRadius: '8px', marginTop: '2rem', backgroundColor: '#f0f8ff' }}>
                    <h3>Approving: {selectedMovie.movieTitle}</h3>
                    <form onSubmit={handleApproveSubmit}>
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
                        <div style={{ marginBottom: '1rem' }}>
                            <label htmlFor="posterFile" style={{ display: 'block', marginBottom: '0.5rem' }}><strong>Add Movie Poster</strong></label>
                            <input
                                type="file"
                                id="posterFile"
                                onChange={(e) => setPosterFile(e.target.files[0])}
                                accept="image/png, image/jpeg"
                                required
                                style={{ padding: '0.5rem', width: '100%', boxSizing: 'border-box' }}
                            />
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                            <button type="submit" disabled={isSubmitting} style={{ padding: '0.75rem 1.5rem', border: 'none', backgroundColor: '#28a745', color: 'white', cursor: 'pointer', borderRadius: '4px', opacity: isSubmitting ? 0.6 : 1 }}>
                                {isSubmitting ? 'Uploading...' : 'Save and Approve'}
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
// END - 2025-09-13 13:52 PM