// src/PendingMovieItem.tsx
import React, { useState } from 'react';
import { db, storage } from './firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { MovieNight } from './types';
import TextInput from './components/ui/TextInput'; // Reusing our components
import { Button } from './components/ui/Button';

interface PendingMovieItemProps {
    movie: MovieNight;
    onActionComplete: () => void;
}

function PendingMovieItem({ movie, onActionComplete }: PendingMovieItemProps) {
    const [showDate, setShowDate] = useState('');
    const [trailerLink, setTrailerLink] = useState('');
    const [posterFile, setPosterFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleApproveSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!showDate || !posterFile) {
            alert('Please assign a show date and select a poster file.');
            return;
        }
        setIsSubmitting(true);
        try {
            const posterRef = ref(storage, `posters/${movie.id}_${posterFile.name}`);
            const snapshot = await uploadBytes(posterRef, posterFile);
            const posterURL = await getDownloadURL(snapshot.ref);

            const movieDocRef = doc(db, "movieNights", movie.id);
            await updateDoc(movieDocRef, {
                status: "Approved",
                showDate: showDate,
                trailerLink: trailerLink,
                posterURL: posterURL
            });
            onActionComplete();
        } catch (error) {
            console.error("Error approving movie:", error);
            alert('An error occurred during approval.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setPosterFile(e.target.files[0]);
        }
    };

    return (
        <div className="bg-brand-card p-6 rounded-2xl border border-brand-gold/20">
            <h3 className="text-2xl font-cinzel text-white">{movie.movieTitle}</h3>
            <p className="text-sm text-slate-400 mb-4">Requested by: {movie.hostName}</p>
            
            <form onSubmit={handleApproveSubmit} className="space-y-4">
                <TextInput
                    label="Assign Show Date"
                    type="date"
                    value={showDate}
                    onChange={(e) => setShowDate(e.target.value)}
                    required
                />
                <TextInput
                    label="Trailer Link (YouTube)"
                    type="url"
                    value={trailerLink}
                    onChange={(e) => setTrailerLink(e.target.value)}
                    placeholder="https://youtube.com/..."
                />
                 <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Movie Poster</label>
                    <input 
                        type="file" 
                        onChange={handleFileChange} 
                        accept="image/png, image/jpeg" 
                        required 
                        className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-gold/20 file:text-brand-gold hover:file:bg-brand-gold/30"
                    />
                </div>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Approving...' : 'Approve & Schedule'}
                </Button>
            </form>
        </div>
    );
}

export default PendingMovieItem;
// Build Date: 2025-09-16 01:35 PM