// File: src/SignUpPage.jsx
// This component contains the form for users to request a movie night.
import React, { useState } from 'react';
import { db } from './firebase.js';
import { collection, addDoc } from "firebase/firestore";

function SignUpPage() {
    const [hostName, setHostName] = useState('');
    const [movieTitle, setMovieTitle] = useState('');
    const [showDate, setShowDate] = useState(''); // CHANGED from eventDate
    const [thermostat, setThermostat] = useState(70);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!hostName || !movieTitle || !showDate) { // CHANGED from eventDate
            setMessage('Please fill out all fields.');
            return;
        }
        setIsSubmitting(true);
        setMessage('Submitting your request...');

        try {
            await addDoc(collection(db, "movieNights"), {
                hostName: hostName,
                movieTitle: movieTitle,
                showDate: showDate, // CHANGED from eventDate
                thermostat: Number(thermostat),
                status: 'Pending Review',
                submittedAt: new Date()
            });

            setMessage('Success! Your movie night has been submitted for review.');
            setHostName('');
            setMovieTitle('');
            setShowDate(''); // CHANGED from setEventDate
            setThermostat(70);
        } catch (error) {
            console.error("Error adding document: ", error);
            setMessage('An error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto p-4 md:p-8 max-w-2xl">
            <div className="bg-brand-card p-8 rounded-2xl shadow-2xl border-2 border-yellow-300/20">
                <h1 className="text-4xl font-cinzel text-brand-gold mb-2 text-center">Pick a Movie</h1>
                <p className="text-center text-yellow-300/70 mb-8">Ready to host? Fill out the details below to get started.</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* ... other form fields ... */}
                    <div>
                        <label htmlFor="showDate" className="block text-sm font-bold text-yellow-300/80 mb-2 font-cinzel">Requested Date</label>
                        {/* CHANGED from eventDate */}
                        <input type="date" id="showDate" value={showDate} onChange={(e) => setShowDate(e.target.value)} className="w-full bg-black/30 border-2 border-yellow-300/30 rounded-lg p-3 text-white focus:outline-none focus:border-brand-gold" style={{ colorScheme: 'dark' }} />
                    </div>
                    {/* ... other form fields ... */}
                    <div className="pt-4">
                        <button type="submit" disabled={isSubmitting} className="w-full btn-velvet text-lg">
                            {isSubmitting ? 'Submitting...' : 'Submit Request'}
                        </button>
                    </div>
                </form>
                {message && <p className="text-center mt-6 text-brand-gold">{message}</p>}
            </div>
        </div>
    );
}

export default SignUpPage;
// END - 2025-09-15 04:31 PM