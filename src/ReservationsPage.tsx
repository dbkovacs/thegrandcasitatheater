// src/ReservationsPage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { db } from './firebase';
import { doc, getDoc, collection, onSnapshot, addDoc } from 'firebase/firestore';
import { MovieNight, Seat as SeatType, Reservation } from './types';
import Seat from './components/reservations/Seat';
import Button from './components/ui/Button';
import TextInput from './components/ui/TextInput';

const generateSeats = (): SeatType[] => {
    const seats: SeatType[] = [];
    for (let i = 1; i <= 4; i++) seats.push({ id: `A${i}`, status: 'available', type: 'beanbag' });
    for (let i = 1; i <= 4; i++) seats.push({ id: `B${i}`, status: 'available', type: 'recliner' });
    for (let i = 1; i <= 3; i++) seats.push({ id: `C${i}`, status: 'available', type: 'recliner' });
    for (let i = 1; i <= 4; i++) seats.push({ id: `D${i}`, status: 'available', type: 'recliner' });
    return seats;
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
    const [allReservations, setAllReservations] = useState<Reservation[]>([]);

    useEffect(() => {
        if (!movieId) {
            setIsLoading(false);
            return;
        }

        const fetchMovie = async () => {
            const docRef = doc(db, 'movieNights', movieId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setMovie({ id: docSnap.id, ...docSnap.data() } as MovieNight);
            } else {
                 console.error("No such movie found!");
            }
        };
        fetchMovie();

        const reservationsCol = collection(db, 'movieNights', movieId, 'reservations');
        const unsubscribe = onSnapshot(reservationsCol, (snapshot) => {
            const reservedSeatIds = new Set<string>();
            const resList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Reservation));
            setAllReservations(resList);
            resList.forEach(res => res.seatIds.forEach(id => reservedSeatIds.add(id)));
            
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
            setTimeout(() => setMessage(''), 5000);
        } catch (error) {
            console.error('Error saving reservation:', error);
            setMessage('Could not save reservation. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return <p className="text-center text-yellow-300/70 p-8 text-lg animate-pulse">Loading Seating Chart...</p>;
    if (!movie) return <p className="text-center text-red-400 p-8">Could not find movie details for this showing.</p>;

    const renderSeatRow = (rowSeats: SeatType[]) => (
        <div className="flex justify-center gap-2 md:gap-4">
            {rowSeats.map(seat => (
                <Seat 
                    key={seat.id} 
                    seat={seat} 
                    isSelected={selectedSeatIds.includes(seat.id)}
                    onClick={handleSeatClick} 
                    isAisleSeat={seat.id === 'A4' || seat.id === 'B4' || seat.id === 'C3' || seat.id === 'D4'} 
                />
            ))}
        </div>
    );

    return (
        <div className="container mx-auto p-4 md:p-8">
            <div className="text-center mb-8">
                <p className="text-brand-gold font-cinzel">Reservations for</p>
                <h1 className="text-4xl md:text-5xl font-bold font-cinzel text-white">{movie.movieTitle}</h1>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-black/20 p-6 rounded-2xl flex flex-col items-center gap-6">
                    <div className="w-full max-w-lg bg-slate-600 text-white text-center py-2 rounded shadow-lg">SCREEN</div>
                    <div className="flex flex-col items-center gap-4 mt-6">
                        {renderSeatRow(seats.filter(s => s.id.startsWith('A')))}
                        {renderSeatRow(seats.filter(s => s.id.startsWith('B')))}
                        {renderSeatRow(seats.filter(s => s.id.startsWith('C')))}
                        {renderSeatRow(seats.filter(s => s.id.startsWith('D')))}
                    </div>
                    <div className="flex flex-wrap justify-center gap-4 mt-6 text-sm text-slate-300">
                        <div className="flex items-center gap-2"><span className="w-5 h-5 rounded-full bg-slate-500"></span> Bean Bag</div>
                        <div className="flex items-center gap-2"><span className="w-5 h-5 rounded-md bg-slate-500"></span> Recliner</div>
                        <div className="flex items-center gap-2"><span className="w-5 h-5 rounded-md bg-brand-gold"></span> Selected</div>
                        <div className="flex items-center gap-2"><span className="w-5 h-5 rounded-md bg-slate-700"></span> Reserved</div>
                    </div>
                </div>
                <div className="lg:col-span-1 bg-brand-card p-6 rounded-2xl border border-yellow-300/20 self-start">
                    <form onSubmit={handleSubmit}>
                        <h2 className="font-cinzel text-2xl text-brand-gold mb-4">Your Selection</h2>
                        <TextInput label="Your Name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name" />
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-slate-400 mb-1">Seats</label>
                            <div className="bg-slate-900/50 border border-slate-700 rounded-md p-3 min-h-[44px] text-slate-50">{selectedSeatIds.sort().join(', ') || <span className="text-slate-500">Select seats from the map</span>}</div>
                        </div>
                        <div className="mt-6"><Button type="submit" disabled={isSubmitting || !name || selectedSeatIds.length === 0}>{isSubmitting ? 'Reserving...' : 'Confirm Reservation'}</Button></div>
                        {message && <p className="text-center mt-4 text-brand-gold text-sm">{message}</p>}
                    </form>
                    {allReservations.length > 0 && (
                        <>
                            <div className="my-6 border-t border-yellow-300/20"></div>
                            <h3 className="font-cinzel text-xl text-brand-gold mb-3">Confirmed Guests</h3>
                            <ul className="space-y-2 max-h-48 overflow-y-auto pr-2">
                                {allReservations.sort((a, b) => a.name.localeCompare(b.name)).map((res) => (
                                    <li key={res.id} className="bg-slate-900/50 p-2 rounded-md text-sm text-slate-300 flex justify-between items-center">
                                        <span className="font-semibold">{res.name}</span>
                                        <span className="text-yellow-300/70">{res.seatIds.sort().join(', ')}</span>
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ReservationsPage;
// Build Date: 2025-09-16 02:35 PM