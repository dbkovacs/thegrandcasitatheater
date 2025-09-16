// src/AdminPage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { db } from './firebase';
import { collection, query, where, getDocs, orderBy, updateDoc, doc } from "firebase/firestore";
import { MovieNight } from './types';
import MovieEditor from './components/admin/MovieEditor'; // <-- Import MovieEditor

interface PendingMovieItemProps {
    movie: MovieNight;
    onActionComplete: () => void;
    onEdit: (movie: MovieNight) => void; // New prop to open editor
}

// Re-defining PendingMovieItem for AdminPage for a cleaner layout
const PendingMovieItem: React.FC<PendingMovieItemProps> = ({ movie, onActionComplete, onEdit }) => {
    return (
        <div className="bg-brand-card p-4 rounded-lg border border-brand-gold/20 flex justify-between items-center">
            <div>
                <h3 className="text-xl font-cinzel text-white truncate">{movie.movieTitle}</h3>
                <p className="text-sm text-slate-400">Requested by: {movie.hostName}</p>
            </div>
            <div className="flex gap-2">
                <button onClick={() => onEdit(movie)} className="btn-velvet text-xs px-3 py-1">Edit</button>
                {/* Approve/Reject logic will be handled via the editor now,
                    but you could add quick approve/reject buttons here if desired. */}
            </div>
        </div>
    );
};


function AdminPage() {
    const [pendingMovies, setPendingMovies] = useState<MovieNight[]>([]);
    const [approvedMovies, setApprovedMovies] = useState<MovieNight[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editingMovie, setEditingMovie] = useState<MovieNight | null>(null); // State for movie being edited

    const fetchMovies = useCallback(async () => {
        setIsLoading(true);
        const pendingQuery = query(collection(db, "movieNights"), where("status", "==", "Pending Review"), orderBy("submittedAt", "asc"));
        const approvedQuery = query(collection(db, "movieNights"), where("status", "==", "Approved"), orderBy("showDate", "desc"));

        const [pendingSnapshot, approvedSnapshot] = await Promise.all([getDocs(pendingQuery), getDocs(approvedQuery)]);
        const pendingList = pendingSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MovieNight));
        const approvedList = approvedSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MovieNight));

        setPendingMovies(pendingList);
        setApprovedMovies(approvedList);
        setIsLoading(false);
    }, []);

    useEffect(() => {
        fetchMovies();
    }, [fetchMovies]);

    const handleReorderApproved = async (movieId: string, direction: 'up' | 'down') => {
        // This is a simplified reordering for display.
        // For persistent reordering, you'd need a 'sortOrder' field in Firestore
        // and update multiple documents.
        const currentApproved = [...approvedMovies];
        const index = currentApproved.findIndex(m => m.id === movieId);
        if (index === -1) return;

        let newIndex = index;
        if (direction === 'up' && index > 0) newIndex = index - 1;
        if (direction === 'down' && index < currentApproved.length - 1) newIndex = index + 1;

        if (newIndex !== index) {
            const [reorderedMovie] = currentApproved.splice(index, 1);
            currentApproved.splice(newIndex, 0, reorderedMovie);
            setApprovedMovies(currentApproved);

            // To make this persistent, you'd update a 'sortOrder' field in Firestore
            // on the affected movies and re-fetch, or simply update state if display order is enough.
            // For now, it's a visual reorder.
            // A more robust solution would involve updating two documents' sortOrder fields.
            alert('Reordering is currently visual only. For persistent reordering, a "sortOrder" field and database updates are needed.');
        }
    };


    return (
        <div className="container mx-auto p-4 md:p-8">
            <h1 className="text-4xl font-cinzel text-brand-gold mb-8 text-center">Admin Dashboard</h1>
            
            {editingMovie && (
                <MovieEditor 
                    movie={editingMovie}
                    onUpdate={fetchMovies}
                    onClose={() => setEditingMovie(null)}
                />
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Pending Reviews Column */}
                <section>
                    <h2 className="text-2xl font-cinzel text-yellow-300/80 mb-4">Pending Review ({pendingMovies.length})</h2>
                    <div className="space-y-6">
                        {isLoading ? <p>Loading...</p> : pendingMovies.length > 0 ? (
                            pendingMovies.map(movie => (
                                <PendingMovieItem key={movie.id} movie={movie} onActionComplete={fetchMovies} onEdit={setEditingMovie} />
                            ))
                        ) : (
                            <p className="text-slate-400">No movies are currently pending review.</p>
                        )}
                    </div>
                </section>

                {/* Approved Movies Column */}
                <section>
                    <h2 className="text-2xl font-cinzel text-yellow-300/80 mb-4">Approved Movies ({approvedMovies.length})</h2>
                     <div className="space-y-4">
                        {isLoading ? <p>Loading...</p> : approvedMovies.length > 0 ? (
                            approvedMovies.map(movie => (
                                <div key={movie.id} className="bg-brand-card/50 p-3 rounded-lg flex items-center gap-4 group">
                                    <img src={movie.posterURL} alt={movie.movieTitle} className="w-12 h-16 object-cover rounded"/>
                                    <div className="flex-grow">
                                        <p className="font-bold text-white">{movie.movieTitle}</p>
                                        <p className="text-xs text-slate-300">{movie.showDate}</p>
                                    </div>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => setEditingMovie(movie)} className="btn-velvet text-xs px-3 py-1">Edit</button>
                                        <button onClick={() => handleReorderApproved(movie.id, 'up')} className="btn-velvet text-xs px-3 py-1">↑</button>
                                        <button onClick={() => handleReorderApproved(movie.id, 'down')} className="btn-velvet text-xs px-3 py-1">↓</button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-slate-400">No movies have been approved yet.</p>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}

export default AdminPage;
// Build Date: 2025-09-16 01:50 PM