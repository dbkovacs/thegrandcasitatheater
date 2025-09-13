// File: src/SignUpPage.jsx
import React, { useState } from 'react';
import { db } from './firebase.js';
import { collection, addDoc } from "firebase/firestore";

const buildTimestamp = "2025-09-13 14:22 PM";

function SignUpPage() {
    const [hostName, setHostName] = useState('');
    const [movieTitle, setMovieTitle] = useState('');
    const [thermostat, setThermostat] = useState(70);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!hostName || !movieTitle) {
            setMessage('Please fill out all fields.');
            return;
        }
        setIsSubmitting(true);
        setMessage('Submitting your request...');

        try {
            await addDoc(collection(db, "movieNights"), {
                hostName: hostName,
                movieTitle: movieTitle,
                thermostat: Number(thermostat),
                status: 'Pending Review',
                submittedAt: new Date()
            });

            setMessage('Success! Your movie night has been submitted for review.');
            setHostName('');
            setMovieTitle('');
            setThermostat(70);
        } catch (error) {
            console.error("Error adding document: ", error);
            setMessage('An error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={{ fontFamily: 'sans-serif', padding: '2rem', maxWidth: '600px', margin: 'auto' }}>
            <h1>Host a Movie Night</h1>
            <p>Pick a movie and we'll handle the rest!</p>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                    <label htmlFor="hostName">Your Name</label>
                    <input type="text" id="hostName" value={hostName} onChange={(e) => setHostName(e.target.value)} required style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} placeholder="e.g., Jane Doe" />
                </div>
                <div>
                    <label htmlFor="movieTitle">Movie Title</label>
                    <input type="text" id="movieTitle" value={movieTitle} onChange={(e) => setMovieTitle(e.target.value)} required style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} placeholder="e.g., The Princess Bride" />
                </div>
                <div>
                    <label htmlFor="thermostat">Preferred Temp: {thermostat}°F</label>
                    <input type="range" id="thermostat" min="65" max="78" value={thermostat} onChange={(e) => setThermostat(e.target.value)} />
                </div>
                <button type="submit" disabled={isSubmitting} style={{ padding: '10px' }}>
                    {isSubmitting ? 'Submitting...' : 'Submit Request'}
                </button>
            </form>
            {message && <p style={{ marginTop: '1rem', textAlign: 'center' }}>{message}</p>}
             <div style={{ position: 'fixed', bottom: 0, right: 0, padding: '4px 8px', backgroundColor: 'rgba(0,0,0,0.7)', color: 'white', fontSize: '10px', borderTopLeftRadius: '5px' }}>
                Build: {buildTimestamp}
            </div>
        </div>
    );
}

export default SignUpPage;
// END - 2025-09-13 14:22 PM