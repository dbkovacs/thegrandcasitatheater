// File: src/ReservationsPage.tsx
import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, onSnapshot, query, where, addDoc } from 'firebase/firestore';
import { Reservation, Seat } from './types'; // Import our blueprints

// This generates a static list of seats for the theater layout
const generateSeats = (): Seat[] => {
    const rows = ['A', 'B', 'C', 'D'];
    const cols = 6;
    let seats: Seat[] = [];
    for (const row of rows) {
        for (let i = 1; i <= cols; i++) {
            seats.push({ id: `${row}${i}`, status: 'available' });
        }
    }
    return seats;
};

function ReservationsPage() {
    // FIX: Define the types for our state
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [seats, setSeats] = useState<Seat[]>(generateSeats());
    const [selectedSeatIds, setSelectedSeatIds] = useState<string[]>([]);
    const [name, setName] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const movieId = "OeCJW9sWl4LwwYfO8QJD"; // Hardcoded for this specific page
        const q = query(collection(db, "movieNights", movieId, "reservations"));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            // FIX: Explicitly type the array we're building
            const fetchedReservations: Reservation[] = [];
            querySnapshot.forEach((doc) => {
                fetchedReservations.push({ id: doc.id, ...doc.data() } as Reservation);
            });
            setReservations(fetchedReservations);

            const reservedSeatIds = new Set<string>();
            fetchedReservations.forEach(res => {
                if (res.seatIds) {
                    res.seatIds.forEach(id => reservedSeatIds.add(id));
                }
            });

            setSeats(currentSeats => currentSeats.map(seat => ({
                ...seat,
                status: reservedSeatIds.has(seat.id) ? 'reserved' : 'available'
            })));

            setIsLoading(false);
        }, (err) => {
            console.error("Firestore snapshot error: ", err);
            setError("Failed to connect to reservation data.");
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // FIX: Add type for the seatId parameter
    const handleSeatClick = (seatId: string) => {
        const seat = seats.find(s => s.id === seatId);
        // FIX: Check if seat exists before accessing properties
        if (!seat || seat.status === 'reserved') return;

        setSelectedSeatIds(prevSelected =>
            prevSelected.includes(seatId)
                ? prevSelected.filter(id => id !== seatId)
                : [...prevSelected, seatId]
        );
    };

    // FIX: Add type for the form event
    const handleReserve = async (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedSeatIds.length === 0 || !name) {
            alert('Please select at least one seat and provide a name.');
            return;
        }
        const movieId = "OeCJW9sWl4LwwYfO8QJD";
        const reservationsCol = collection(db, "movieNights", movieId, "reservations");
        await addDoc(reservationsCol, { name, seatIds: selectedSeatIds });
        setSelectedSeatIds([]);
        setName('');
    };
    
    // FIX: Add type for the seat parameter
    const getSeatStatus = (seat: Seat): Seat['status'] => {
        if (selectedSeatIds.includes(seat.id)) return 'selected';
        return seat.status;
    }

    return (
        <div>
            {/* JSX for reservations page */}
        </div>
    );
}

export default ReservationsPage;