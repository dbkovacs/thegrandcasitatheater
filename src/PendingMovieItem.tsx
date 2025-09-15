// File: src/PendingMovieItem.tsx
import React, { useState } from 'react';
import { db, storage } from './firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { MovieNight } from './types';

// FIX: Define types for the component's props
interface PendingMovieItemProps {
    movie: MovieNight;
    onActionComplete: () => void;
}

function PendingMovieItem({ movie, onActionComplete }: PendingMovieItemProps) {
    const [showDate, setShowDate] = useState('');
    const [trailerLink, setTrailerLink] = useState('');
    // FIX: Define the type for file state
    const [posterFile, setPosterFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // FIX: Add type for the form event
    const handleApproveSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!showDate || !posterFile) {
            alert('Validation Failed: Please assign a show date and select a poster file.');
            return;
        }
        setIsSubmitting(true);
        try {
            const posterRef = ref(storage, `posters/${Date.now()}_${posterFile.name}`);
            const snapshot = await uploadBytes(posterRef, posterFile);
            const posterUrl = await getDownloadURL(snapshot.ref);

            const movieDocRef = doc(db, "movieNights", movie.id);
            await updateDoc(movieDocRef, {
                status: "Approved",
                showDate: showDate,
                trailerLink: trailerLink,
                posterURL: posterUrl
            });
            onActionComplete();
        } catch (error) {
            console.error("Error approving movie:", error);
            alert('An error occurred during approval.');
        } finally {
            setIsSubmitting(false);
        }
    };
    
    // FIX: Add type for the change event and check for files
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setPosterFile(e.target.files[0]);
        }
    };

    return (
        <div className="pending-item">
            <h4>{movie.movieTitle}</h4>
            <p>Requested by: {movie.hostName}</p>
            <form onSubmit={handleApproveSubmit} className="pending-form">
                <div>
                    <label htmlFor={`showDate-${movie.id}`}><strong>Assign Show Date</strong></label>
                    <input type="date" id={`showDate-${movie.id}`} value={showDate} onChange={(e) => setShowDate(e.target.value)} required />
                </div>
                <div>
                    <label htmlFor={`trailerLink-${movie.id}`}>Trailer Link (YouTube)</label>
                    <input type="url" id={`trailerLink-${movie.id}`} value={trailerLink} onChange={(e) => setTrailerLink(e.target.value)} placeholder="https://youtube.com/..." />
                </div>
                <div>
                    <label htmlFor={`posterFile-${movie.id}`}><strong>Add Movie Poster</strong></label>
                    <input type="file" id={`posterFile-${movie.id}`} onChange={handleFileChange} accept="image/png, image/jpeg" required />
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Approving...' : 'Approve & Schedule'}</button>
                </div>
            </form>
        </div>
    );
}

export default PendingMovieItem;