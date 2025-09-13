// File: src/PendingMovieItem.jsx
import React, { useState } from 'react';
import { db } from './firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const buildTimestamp = "2025-09-13 14:22 PM";

function PendingMovieItem({ movie, onApproved }) {
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

            alert(`'${movie.movieTitle}' has been approved and the poster has been uploaded!`);
            onApproved(); // This tells the parent page to refresh its list
        } catch (err) {
            console.error("Error during approval process: ", err);
            alert('An error occurred. Failed to approve movie.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <li style={{ border: '1px solid #007bff', padding: '1rem', borderRadius: '8px', backgroundColor: '#f0f8ff', listStyle: 'none' }}>
            <h3>{movie.movieTitle}</h3>
            <small>Requested by: {movie.hostName}</small>
            <form onSubmit={handleApproveSubmit} style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
                <button type="submit" disabled={isSubmitting} style={{ padding: '0.75rem 1.5rem', border: 'none', backgroundColor: '#28a745', color: 'white', cursor: 'pointer', borderRadius: '4px', opacity: isSubmitting ? 0.6 : 1 }}>
                    {isSubmitting ? 'Uploading...' : 'Approve Movie'}
                </button>
            </form>
        </li>
    );
}

export default PendingMovieItem;
// END - 2025-09-13 14:22 PM