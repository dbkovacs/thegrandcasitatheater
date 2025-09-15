// File: src/InvitationPage.jsx
// This component is the main home/invitation page, now with a schedule.
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from './firebase.js';
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";

function InvitationPage() {
    const [schedule, setSchedule] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                // Query for movies that are 'Approved' and order them by the event date
                const q = query(
                    collection(db, "movieNights"), 
                    where("status", "==", "Approved"),
                    orderBy("eventDate", "asc")
                );

                const querySnapshot = await getDocs(q);
                const scheduleList = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setSchedule(scheduleList);
            } catch (err) {
                console.error("Error fetching schedule: ", err);
                // Optionally set an error state here to show in the UI
            } finally {
                setLoading(false);
            }
        };

        fetchSchedule();
    }, []);

    return (
        <div className="container mx-auto p-8">
            {/* Welcome Section */}
            <div className="text-center bg-brand-card shadow-2xl rounded-2xl border-2 border-yellow-300/20 p-12 mb-12">
                <h1 className="text-6xl font-cinzel text-brand-gold text-shadow mb-4">
                    Welcome to The Grand Casita
                </h1>
                <p className="text-yellow-300/70 text-lg max-w-3xl mx-auto mb-8">
                    An exclusive, private cinema experience designed for friends and family. Here, you choose the movie, you set the date, and we provide the magic.
                </p>
                <Link to="/signup" className="btn-velvet text-xl">
                    Host A Movie Night
                </Link>
            </div>

            {/* Upcoming Showings Section */}
            <div className="bg-brand-card shadow-2xl rounded-2xl border-2 border-yellow-300/20 p-8">
                <h2 className="text-4xl font-cinzel text-brand-gold text-center mb-6">Upcoming Showings</h2>
                {loading ? (
                    <p className="text-center text-yellow-300/70">Loading schedule...</p>
                ) : (
                    <div className="space-y-4">
                        {schedule.length > 0 ? (
                            schedule.map(movie => (
                                <div key={movie.id} className="bg-black/20 p-4 rounded-lg border border-yellow-300/20">
                                    <p className="font-cinzel text-2xl text-white">{movie.movieTitle}</p>
                                    <p className="text-md text-yellow-300/80">
                                        <span className="font-bold">{movie.eventDate}</span> | Hosted by {movie.hostName}
                                    </p>
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
// END - 2025-09-15 04:20 PM