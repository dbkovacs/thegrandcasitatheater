// File: src/InvitationPage.jsx
// This component is the main home/invitation page, now with a schedule and posters.
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from './firebase.js';
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";

function InvitationPage() {
    const [schedule, setSchedule] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSchedule = async () => {
            setLoading(true);
            try {
                // CHANGED: orderBy("eventDate") is now orderBy("showDate")
                const q = query(collection(db, "movieNights"), where("status", "==", "Approved"), orderBy("showDate", "asc"));
                const querySnapshot = await getDocs(q);
                const scheduleList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setSchedule(scheduleList);
            } catch (err) {
                console.error("Error fetching schedule: ", err);
            } finally {
                setLoading(false);
            }
        };
        fetchSchedule();
    }, []);

    return (
        <div className="container mx-auto p-8">
            {/* ... Welcome section ... */}

            <div className="bg-brand-card shadow-2xl rounded-2xl border-2 border-yellow-300/20 p-8">
                <h2 className="text-4xl font-cinzel text-brand-gold text-center mb-6">Upcoming Showings</h2>
                {loading ? (
                    <p className="text-center text-yellow-300/70">Loading schedule...</p>
                ) : (
                    <div className="space-y-6">
                        {schedule.length > 0 ? (
                            schedule.map(movie => (
                                <div key={movie.id} className="bg-black/20 rounded-lg border border-yellow-300/20 flex items-center overflow-hidden">
                                    {movie.posterURL && (
                                        <img src={movie.posterURL} alt={`${movie.movieTitle} poster`} className="w-24 h-36 object-cover"/>
                                    )}
                                    <div className="p-4">
                                        <p className="font-cinzel text-2xl text-white">{movie.movieTitle}</p>
                                        <p className="text-md text-yellow-300/80">
                                            {/* CHANGED: movie.eventDate is now movie.showDate */}
                                            <span className="font-bold">{movie.showDate}</span> | Hosted by {movie.hostName}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                             <p className="text-center text-yellow-300/70">The schedule is currently empty. Host a night to get it started!</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default InvitationPage;
// END - 2025-09-15 04:31 PM