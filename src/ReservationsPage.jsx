// File: src/ReservationsPage.jsx
import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, query, onSnapshot, addDoc, serverTimestamp, orderBy } from 'firebase/firestore';

// --- THIS IS THE UPDATED SEAT LAYOUT ---
// Positions and IDs have been updated to match your new image.
const seatLayout = [
    // Row A (Front)
    { id: 'A1', type: 'chair', top: '78%', left: '22%' },
    { id: 'A2', type: 'chair', top: '78%', left: '38%' },
    { id: 'A3', type: 'chair', top: '78%', left: '61%' },
    { id: 'A4', type: 'chair', top: '78%', left: '77%' },
    // Row B (Middle)
    { id: 'B1', type: 'chair', top: '55%', left: '29%' },
    { id: 'B2', type: 'chair', top: '55%', left: '49%' },
    { id: 'B3', type: 'chair', top: '55%', left: '70%' },
    // Row C (Back)
    { id: 'C1', type: 'chair', top: '38%', left: '33%' },
    { id: 'C2', type: 'chair', top: '38%', left: '45%' },
    { id: 'C3', type: 'chair', top: '38%', left: '57%' },
    { id: 'C4', type: 'chair', top: '38%', left: '68%' },
];

function ReservationsPage() {
    const [seats, setSeats] = useState(seatLayout.map(s => ({ ...s, status: 'available' })));
    const [reservations, setReservations] = useState([]);
    const [selectedSeatIds, setSelectedSeatIds] = useState([]);
    const [reserverName, setReserverName] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const q = query(collection(db, "reservations"), orderBy("timestamp", "desc"));
        
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const fetchedReservations = [];
            querySnapshot.forEach((doc) => {
                fetchedReservations.push({ id: doc.id, ...doc.data() });
            });
            
            const reservedSeatIds = new Set();
            fetchedReservations.forEach(res => {
                if(res.seatIds) {
                    res.seatIds.forEach(id => reservedSeatIds.add(id));
                }
            });

            setSeats(
                seatLayout.map(seat => ({
                    ...seat,
                    status: reservedSeatIds.has(seat.id) ? 'reserved' : 'available'
                }))
            );
            
            setReservations(fetchedReservations);
            setIsLoading(false);
        }, (err) => {
            console.error("Firestore snapshot error: ", err);
            setError("Failed to connect to reservation data. Check Firestore rules and query.");
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleSeatClick = (seatId) => {
        const seat = seats.find(s => s.id === seatId);
        if (seat.status === 'reserved') return;

        setSelectedSeatIds(prevSelected => 
            prevSelected.includes(seatId) 
                ? prevSelected.filter(id => id !== seatId)
                : [...prevSelected, seatId]
        );
    };

    const handleReserve = async () => {
        if (selectedSeatIds.length === 0 || !reserverName.trim()) {
            alert('Please select at least one seat and enter your name.');
            return;
        }
        try {
            await addDoc(collection(db, "reservations"), {
                name: reserverName.trim(),
                seatIds: selectedSeatIds,
                timestamp: serverTimestamp()
            });
            setSelectedSeatIds([]);
            setReserverName('');
            alert('Success! Your seats have been reserved.');
        } catch (error) {
            console.error("Error adding reservation: ", error);
            alert('There was an error saving your reservation. Please try again.');
        }
    };
    
    const seatStatus = (seat) => {
        if (selectedSeatIds.includes(seat.id)) return 'selected';
        return seats.find(s => s.id === seat.id)?.status || 'available';
    }

    const canReserve = selectedSeatIds.length > 0 && reserverName.trim();

    if (error) {
        return <div className="page-message error">{error}</div>;
    }

    return (
        <div className="reservation-page-grid">
            <div className="seating-chart-container">
                <h2 className="page-title">Reserve Your Seats</h2>
                 <div className="seating-legend">
                    <div><span className="seat-icon available"></span> Available</div>
                    <div><span className="seat-icon selected"></span> Selected</div>
                    <div><span className="seat-icon reserved"></span> Reserved</div>
                </div>
                <div className="seating-map-wrapper">
                    <div className="seating-map">
                        {isLoading ? (
                            <div className="loading-message">Loading Seating Chart...</div>
                        ) : (
                            seats.map(seat => (
                                <div 
                                    key={seat.id}
                                    className={`seat ${seat.type} ${seatStatus(seat)}`}
                                    style={{ top: seat.top, left: seat.left }}
                                    onClick={() => handleSeatClick(seat.id)}
                                >
                                    {seat.id}
                                </div>
                            ))
                        )}
                    </div>
                </div>
                 <div className="reservation-form">
                    <p>Selected Seats: <strong>{selectedSeatIds.join(', ') || 'None'}</strong></p>
                    <input 
                        type="text" 
                        value={reserverName}
                        onChange={(e) => setReserverName(e.target.value)}
                        placeholder="Enter your name to reserve" 
                        className="name-input"
                    />
                    <button onClick={handleReserve} disabled={!canReserve} className="reserve-button">
                        {canReserve ? 'Reserve Now' : 'Select Seats & Name'}
                    </button>
                </div>
            </div>
            <div className="reservation-log-container">
                 <h2 className="page-title">Reservation Log</h2>
                 <ul className="reservation-log-list">
                    {isLoading ? (
                        <li>Loading reservations...</li>
                    ) : reservations.length > 0 ? (
                        reservations.map(res => (
                            <li key={res.id}>
                                <strong>{res.name}</strong> reserved {res.seatIds.join(', ')}
                            </li>
                        ))
                    ) : (
                        <li>No reservations yet.</li>
                    )}
                 </ul>
            </div>
        </div>
    );
}

export default ReservationsPage;
// END - 2025-09-15 13:40 PM