// File: src/PendingMovieItem.jsx
import React, { useState } from 'react';
import { db } from './firebase';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

function PendingMovieItem({ movie, onActionComplete }) {
    const [showDate, setShowDate] = useState('');
    const [trailerLink, setTrailerLink] = useState('');
    const [posterFile, setPosterFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleApproveSubmit = async (e) => {
        e.preventDefault();
        if (!showDate || !posterFile) {
            alert('Validation Failed: Please assign a show date and select a poster file.');
            return;
        }
        setIsSubmitting(true);
        try {
            const storage = getStorage();
            const posterRef = ref(storage, `posters/${Date.now()}_${posterFile.name}`);
            const snapshot = await uploadBytes(posterRef, posterFile);
            const posterUrl = await getDownloadURL(snapshot.ref);

            const movieDocRef = doc(db, 'movieNights', movie.id);
            await updateDoc(movieDocRef, {
                status: 'Approved',
                showDate: showDate,
                trailerLink: trailerLink,
                posterUrl: posterUrl
            });

            alert(`'${movie.movieTitle}' has been approved!`);
            onActionComplete(); 
        } catch (err) {
            console.error("Error during approval process: ", err);
            alert('An error occurred. Failed to approve movie.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- NEW DELETE FUNCTION ---
    const handleReject = async () => {
        if (window.confirm(`Are you sure you want to reject and delete the request for "${movie.movieTitle}"?`)) {
            try {
                await deleteDoc(doc(db, 'movieNights', movie.id));
                alert('Request has been deleted.');
                onActionComplete(); // Refresh the list in the parent component
            } catch (error) {
                console.error("Error deleting document: ", error);
                alert("Failed to delete the request.");
            }
        }
    };

    return (
        <li style={{ border: '1px solid #007bff', padding: '1rem', borderRadius: '8px', backgroundColor: '#f0f8ff', listStyle: 'none' }}>
            <h3>{movie.movieTitle}</h3>
            <small>Requested by: {movie.hostName}</small>
            <form onSubmit={handleApproveSubmit} style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* ... form inputs are unchanged ... */}
                <div>
                    <label htmlFor={`showDate-${movie.id}`}><strong>Assign Show Date</strong></label>
                    <input type="date" id={`showDate-${movie.id}`} value={showDate} onChange={(e) => setShowDate(e.target.value)} required style={{ padding: '0.5rem', width: '100%', boxSizing: 'border-box' }} />
                </div>
                <div>
                    <label htmlFor={`trailerLink-${movie.id}`}><strong>Movie Trailer Embed Link</strong></label>
                    <input type="text" id={`trailerLink-${movie.id}`} value={trailerLink} onChange={(e) => setTrailerLink(e.target.value)} placeholder="e.g., https://www.youtube.com/embed/..." style={{ padding: '0.5rem', width: '100%', boxSizing: 'border-box' }} />
                </div>
                <div>
                    <label htmlFor={`posterFile-${movie.id}`}><strong>Add Movie Poster</strong></label>
                    <input type="file" id={`posterFile-${movie.id}`} onChange={(e) => setPosterFile(e.target.files[0])} accept="image/png, image/jpeg" required style={{ padding: '0.5rem', width: '100%', boxSizing: 'border-box' }} />
                </div>
                {/* --- NEW BUTTONS WRAPPER --- */}
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button type="submit" disabled={isSubmitting} style={{ flexGrow: 1, padding: '0.75rem', border: 'none', backgroundColor: '#28a745', color: 'white', cursor: 'pointer', borderRadius: '4px' }}>
                        {isSubmitting ? 'Uploading...' : 'Approve'}
                    </button>
                    <button type="button" onClick={handleReject} style={{ padding: '0.75rem', border: 'none', backgroundColor: '#dc3545', color: 'white', cursor: 'pointer', borderRadius: '4px' }}>
                        Reject
                    </button>
                </div>
            </form>
        </li>
    );
}

export default PendingMovieItem;
// END - 2025-09-15 14:40 PM