// src/ReservationsPage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { db } from './firebase';
import { doc, getDoc, collection, onSnapshot, addDoc } from 'firebase/firestore';
import { MovieNight, Seat as SeatType, Reservation } from './types';
import Seat from './components/reservations/Seat';

const generateSeats = (): SeatType[] => {
    return ['A', 'B', 'C', 'D'].flatMap(row => 
        Array.from({ length: 6 }, (_, i) => ({ id: `${row}${i + 1}`, status: 'available' }))
    );
};

function ReservationsPage() {
    const { movieId } = useParams<{ movieId: string }>();
    const [movie, setMovie] = useState<MovieNight | null>(null);
    const [seats, setSeats] = useState<SeatType[]>(generateSeats());
    const [selectedSeatIds, setSelectedSeatIds] = useState<string[]>([]);
    const [name, setName] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!movieId) return;

        const fetchMovie = async () => {
            const docRef = doc(db, 'movieNights', movieId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setMovie({ id: docSnap.id, ...docSnap.data() } as MovieNight);
            }
        };

        fetchMovie();

        const reservationsCol = collection(db, 'movieNights', movieId, 'reservations');
        const unsubscribe = onSnapshot(reservationsCol, (snapshot) => {
            const reservedSeatIds = new Set<string>();
            snapshot.docs.forEach(doc => {
                const reservation = doc.data() as Reservation;
                reservation.seatIds.forEach(id => reservedSeatIds.add(id));
            });
            
            setSeats(currentSeats => currentSeats.map(seat => ({
                ...seat,
                status: reservedSeatIds.has(seat.id) ? 'reserved' : 'available',
            })));
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [movieId]);
    
    const handleSeatClick = useCallback((seatId: string) => {
        setSelectedSeatIds(prev =>
            prev.includes(seatId)
                ? prev.filter(id => id !== seatId)
                : [...prev, seatId]
        );
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || selectedSeatIds.length === 0 || !movieId) {
            setMessage('Please enter your name and select at least one seat.');
            return;
        }
        setIsSubmitting(true);
        setMessage('Confirming your reservation...');
        try {
            await addDoc(collection(db, 'movieNights', movieId, 'reservations'), {
                name: name.trim(),
                seatIds: selectedSeatIds,
            });
            setMessage(`Success! Your seat${selectedSeatIds.length > 1 ? 's are' : ' is'} reserved.`);
            setSelectedSeatIds([]);
            setName('');
        } catch (error) {
            console.error('Error saving reservation:', error);
            setMessage('Could not save reservation. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return <p className="text-center text-yellow-300/70 p-8">Loading Seating Chart...</p>;
    if (!movie) return <p className="text-center text-red-400 p-8">Could not find movie details.</p>;

    return (
        <div className="container mx-auto p-4 md:p-8">
            <div className="text-center mb-8">
                <p className="text-brand-gold font-cinzel">Reservations for</p>
                <h1 className="text-4xl md:text-5xl font-bold font-cinzel text-white">{movie.movieTitle}</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-black/20 p-6 rounded-2xl flex flex-col items-center gap-6">
                    <div className="w-full max-w-lg bg-slate-600 text-white text-center py-2 rounded shadow-lg">
                        SCREEN
                    </div>
                    <div className="grid grid-cols-6 gap-2 md:gap-4">
                        {seats.map(seat => (
                            <Seat 
                                key={seat.id} 
                                seat={seat} 
                                isSelected={selectedSeatIds.includes(seat.id)}
                                onClick={handleSeatClick} 
                            />
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-1 bg-brand-card p-6 rounded-2xl border border-yellow-300/20 self-start">
                    <form onSubmit={handleSubmit}>
                        <h2 className="font-cinzel text-2xl text-brand-gold mb-4">Your Selection</h2>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-slate-400 mb-1">Your Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter your name"
                                className="block w-full bg-slate-900/50 border border-slate-700 rounded-md shadow-sm py-2 px-3 text-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-brand-gold"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-slate-400 mb-1">Seats</label>
                            <div className="bg-slate-900/50 border border-slate-700 rounded-md p-3 min-h-[44px] text-slate-50">
                                {selectedSeatIds.sort().join(', ') || <span className="text-slate-500">Select seats from the map</span>}
                            </div>
                        </div>
                        <button type="submit" disabled={isSubmitting || !name || selectedSeatIds.length === 0} className="w-full btn-velvet primary">
                            {isSubmitting ? 'Reserving...' : 'Confirm Reservation'}
                        </button>
                        {message && <p className="text-center mt-4 text-brand-gold text-sm">{message}</p>}
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ReservationsPage;
// Build Date: 2025-09-16 01:25 PM