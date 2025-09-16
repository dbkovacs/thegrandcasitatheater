// src/ReservationsPage.tsx
// ... (all existing imports and generateSeats function) ...

function ReservationsPage() {
    // ... (all existing state and useEffect for fetching movie and reservations) ...
    const [allReservations, setAllReservations] = useState<Reservation[]>([]); // New state for all reservations

    useEffect(() => {
        // ... (existing movie fetch logic) ...

        const reservationsCol = collection(db, 'movieNights', movieId, 'reservations');
        const unsubscribe = onSnapshot(reservationsCol, (snapshot) => {
            const reservedSeatIds = new Set<string>();
            const currentAllReservations: Reservation[] = []; // Collect all reservations
            snapshot.docs.forEach(doc => {
                const reservation = { id: doc.id, ...doc.data() } as Reservation;
                currentAllReservations.push(reservation);
                reservation.seatIds.forEach(id => reservedSeatIds.add(id));
            });
            
            setAllReservations(currentAllReservations); // Update all reservations state
            setSeats(currentSeats => currentSeats.map(seat => ({
                ...seat,
                status: reservedSeatIds.has(seat.id) ? 'reserved' : 'available',
            })));
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [movieId]);

    // ... (handleSeatClick and handleSubmit functions are unchanged) ...

    if (isLoading) return <p className="text-center text-yellow-300/70 p-8">Loading Seating Chart...</p>;
    if (!movie) return <p className="text-center text-red-400 p-8">Could not find movie details.</p>;

    const renderSeatRow = (rowPrefix: string, rowSeats: SeatType[]) => {
        // ... (this function is unchanged) ...
    };

    return (
        <div className="container mx-auto p-4 md:p-8">
            {/* ... (movie title and screen layout remain unchanged) ... */}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-black/20 p-6 rounded-2xl flex flex-col items-center gap-6">
                    {/* ... (screen, seat map, and legend remain unchanged) ... */}
                </div>

                <div className="lg:col-span-1 bg-brand-card p-6 rounded-2xl border border-yellow-300/20 self-start">
                    {/* ... (reservation form remains unchanged) ... */}

                    {/* All Reservations Log */}
                    {allReservations.length > 0 && (
                        <>
                            <div className="my-6 border-t border-yellow-300/20"></div>
                            <h3 className="font-cinzel text-xl text-brand-gold mb-3">Confirmed Guests</h3>
                            <ul className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-2">
                                {allReservations
                                    .sort((a, b) => a.name.localeCompare(b.name))
                                    .map((res) => (
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
// Build Date: 2025-09-16 01:50 PM