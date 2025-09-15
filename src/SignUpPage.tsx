// File: src/SignUpPage.tsx
import React, { useState } from 'react';
import { db } from './firebase';
import { collection, addDoc } from "firebase/firestore";

function SignUpPage() {
    // State for all our new fields
    const [hostName, setHostName] = useState('');
    const [movieTitle, setMovieTitle] = useState('');
    const [audience, setAudience] = useState<'Kids Welcome' | 'Adults Only'>('Kids Welcome');
    const [greeting, setGreeting] = useState('');
    const [notesToDavid, setNotesToDavid] = useState('');
    const [thermostat, setThermostat] = useState(74); // New default
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!hostName || !movieTitle) {
            setMessage('Please fill out Your Name and Movie Title.');
            return;
        }
        setIsSubmitting(true);
        setMessage('Submitting your request...');

        try {
            // Add the new fields to our Firebase document
            await addDoc(collection(db, "movieNights"), {
                hostName,
                movieTitle,
                audience,
                greeting,
                notesToDavid,
                thermostat: Number(thermostat),
                status: 'Pending Review',
                submittedAt: new Date()
            });

            setMessage('Success! Your movie night has been submitted for review.');
            // Reset form
            setHostName('');
            setMovieTitle('');
            setAudience('Kids Welcome');
            setGreeting('');
            setNotesToDavid('');
            setThermostat(74);

        } catch (error) {
            console.error("Error adding document: ", error);
            setMessage('An error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="signup-page-container">
            <div className="signup-header">
                <h1 className="font-cinzel text-5xl">The Grand Casita Theater</h1>
                <p>Create Your Perfect Movie Night</p>
            </div>

            <form onSubmit={handleSubmit} className="signup-form">
                <div className="form-main-panel">
                    {/* --- Left Side of Form --- */}
                    <div className="form-fields">
                        <label>Your Name</label>
                        <input type="text" value={hostName} onChange={(e) => setHostName(e.target.value)} placeholder="e.g., Jane Doe" />

                        <label>Movie Title</label>
                        <input type="text" value={movieTitle} onChange={(e) => setMovieTitle(e.target.value)} placeholder="e.g., The Princess Bride (1987)" />
                        
                        <label>Notes to David (Optional)</label>
                        <input type="text" value={notesToDavid} onChange={(e) => setNotesToDavid(e.target.value)} placeholder="e.g., 'Make sure it's the widescreen version!'" />

                        <label>Audience</label>
                        <div className="radio-group">
                            <label className={audience === 'Kids Welcome' ? 'selected' : ''}>
                                <input type="radio" value="Kids Welcome" checked={audience === 'Kids Welcome'} onChange={() => setAudience('Kids Welcome')} />
                                Kids Welcome
                            </label>
                            <label className={audience === 'Adults Only' ? 'selected' : ''}>
                                <input type="radio" value="Adults Only" checked={audience === 'Adults Only'} onChange={() => setAudience('Adults Only')} />
                                Adults Only
                            </label>
                        </div>
                        
                        <label>Greeting for Your Guests</label>
                        <textarea value={greeting} onChange={(e) => setGreeting(e.target.value)} placeholder="e.g., 'I grew up loving this movie, hope you join me!'" rows={4}></textarea>
                    </div>

                    {/* --- Right Side of Form (Thermostat) --- */}
                    <div className="form-thermostat-panel">
                        <label>Set Theater Temp</label>
                        <p className="thermostat-subtitle">(We'll do our best!)</p>
                        <div className="thermostat-display">{thermostat}°F</div>
                        <div className="thermostat-slider-container">
                             <input
                                type="range"
                                min="70"
                                max="80"
                                value={thermostat}
                                onChange={(e) => setThermostat(parseInt(e.target.value))}
                                className="thermostat-slider"
                            />
                        </div>
                    </div>
                </div>

                <button type="submit" disabled={isSubmitting} className="submit-button">
                    {isSubmitting ? 'Submitting...' : 'Submit Movie Night'}
                </button>
                 {message && <p className="form-message">{message}</p>}
            </form>
        </div>
    );
}

export default SignUpPage;