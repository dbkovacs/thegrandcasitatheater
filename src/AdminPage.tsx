// src/AdminPage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { db } from './firebase';
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { MovieNight } from './types';
import MovieEditor from './components/admin/MovieEditor';

const MovieListItem: React.FC<{ movie: MovieNight, onEdit: (movie: MovieNight) => void }> = ({ movie, onEdit }) => (
    <div className="bg-brand-card/50 p-3 rounded-lg flex items-center gap-4 group">
        <img src={movie.posterURL || 'https://placehold.co/80x120/2a0000/fde047?text=?'} alt={movie.movieTitle} className="w-12 h-18 object-cover rounded"/>
        <div className="flex-grow">
            <p className="font-bold text-white">{movie.movieTitle}</p>
            <p className="text-xs text-slate-300">{movie.showDate} ({movie.status})</p>
        </div>
        <button onClick={() => onEdit(movie)} className="btn-velvet text-xs px-3 py-1 opacity-0 group-hover:opacity-100 transition-opacity">Edit</button>
    </div>
);

function AdminPage() {
    const [pendingMovies, setPendingMovies] = useState<MovieNight[]>([]);
    const [approvedMovies, setApprovedMovies] = useState<MovieNight[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editingMovie, setEditingMovie] = useState<MovieNight | null>(null);

    const fetchMovies = useCallback(async () => {
        setIsLoading(true);
        const pendingQuery = query(collection(db, "movieNights"), where("status", "==", "Pending Review"), orderBy("submittedAt", "asc"));
        const approvedQuery = query(collection(db, "movieNights"), where("status", "==", "Approved"), orderBy("showDate", "desc"));
        
        const [pendingSnapshot, approvedSnapshot] = await Promise.all([getDocs(pendingQuery), getDocs(approvedQuery)]);
        
        setPendingMovies(pendingSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MovieNight)));
        setApprovedMovies(approvedSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MovieNight)));
        setIsLoading(false);
    }, []);

    useEffect(() => {
        fetchMovies();
    }, [fetchMovies]);

    return (
        <div className="container mx-auto p-4 md:p-8">
            <h1 className="text-4xl font-cinzel text-brand-gold mb-8 text-center">Admin Dashboard</h1>
            
            {editingMovie && <MovieEditor movie={editingMovie} onUpdate={fetchMovies} onClose={() => setEditingMovie(null)} />}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <section>
                    <h2 className="text-2xl font-cinzel text-yellow-300/80 mb-4">Pending Review ({pendingMovies.length})</h2>
                    <div className="space-y-4">
                        {isLoading ? <p>Loading...</p> : pendingMovies.length > 0 ? (
                            pendingMovies.map(movie => <MovieListItem key={movie.id} movie={movie} onEdit={setEditingMovie} />)
                        ) : (
                            <p className="text-slate-400">No movies are currently pending review.</p>
                        )}
                    </div>
                </section>
                <section>
                    <h2 className="text-2xl font-cinzel text-yellow-300/80 mb-4">Approved Movies ({approvedMovies.length})</h2>
                     <div className="space-y-4">
                        {isLoading ? <p>Loading...</p> : approvedMovies.map(movie => <MovieListItem key={movie.id} movie={movie} onEdit={setEditingMovie} />)}
                    </div>
                </section>
            </div>
        </div>
    );
}

export default AdminPage;
// Build Date: 2025-09-16 02:20 PM