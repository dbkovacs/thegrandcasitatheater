// File: src/SignUpPage.jsx
// This component contains the form for users to sign up to host a movie night.
import React, from 'react';
import { db } from './firebase.js'; // Import the database connection
import { collection, addDoc } from 'firebase/firestore';

const SignUpPage = () => {
    // State variables to hold the form data
    const [hostName, setHostName] = useState('');
    const [movieTitle, setMovieTitle] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [thermostat, setThermostat] = useState('72');
    const [status, setStatus] = useState(''); // To show feedback to the user

    // Function to handle the slider's value display
    const handleThermostatChange = (e) => {
        setThermostat(e.target.value);
    };
    
    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent the default form submission behavior
        setStatus('Submitting...');

        if (!hostName || !movieTitle || !eventDate) {
            setStatus('Please fill out all required fields.');
            return;
        }

        try {
            // Add a new document with a generated ID to the "movieNights" collection
            await addDoc(collection(db, "movieNights"), {
                hostName: hostName,
                movieTitle: movieTitle,
                eventDate: eventDate,
                thermostat: Number(thermostat), // Store as a number
                status: 'Pending Review', // Set initial status for admin approval
                createdAt: new Date() // Add a timestamp
            });

            // Reset form fields and show success message
            setHostName('');
            setMovieTitle('');
            setEventDate('');
            setThermostat('72');
            setStatus('Success! Your request has been submitted for review.');

        } catch (error) {
            console.error("Error adding document: ", error);
            setStatus('Error. Could not submit request. Please try again.');
        }
    };

    return (
        <div className="container mx-auto p-4 md:p-8 max-w-2xl">
            <div className="bg-brand-card shadow-2xl rounded-2xl overflow-hidden border-2 border-yellow-300/20 p-8">
                <h1 className="text-4xl font-cinzel text-brand-gold mb-2 text-center">Host a Movie Night</h1>
                <p className="text-center text-yellow-300/70 mb-8">Pick a movie and a date, and we'll handle the rest!</p>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    {/* Host Name Input */}
                    <div>
                        <label htmlFor="hostName" className="block text-lg font-cinzel text-brand-gold mb-2">Your Name</label>
                        <input
                            type="text"
                            id="hostName"
                            value={hostName}
                            onChange={(e) => setHostName(e.target.value)}
                            required
                            className="w-full bg-black/20 border-2 border-yellow-300/30 rounded-lg p-3 focus:outline-none focus:border-brand-gold transition-colors"
                            placeholder="e.g., Jane Doe"
                        />
                    </div>

                    {/* Movie Title Input */}
                    <div>
                        <label htmlFor="movieTitle" className="block text-lg font-cinzel text-brand-gold mb-2">Movie Title</label>
                        <input
                            type="text"
                            id="movieTitle"
                            value={movieTitle}
                            onChange={(e) => setMovieTitle(e.target.value)}
                            required
                            className="w-full bg-black/20 border-2 border-yellow-300/30 rounded-lg p-3 focus:outline-none focus:border-brand-gold transition-colors"
                            placeholder="e.g., The Princess Bride"
                        />
                    </div>
                    
                    {/* Event Date Input */}
                    <div>
                        <label htmlFor="eventDate" className="block text-lg font-cinzel text-brand-gold mb-2">Preferred Date</label>
                        <input
                            type="date"
                            id="eventDate"
                            value={eventDate}
                            onChange={(e) => setEventDate(e.target.value)}
                            required
                            className="w-full bg-black/20 border-2 border-yellow-300/30 rounded-lg p-3 focus:outline-none focus:border-brand-gold transition-colors"
                            style={{ colorScheme: 'dark' }} 
                        />
                    </div>

                    {/* Thermostat Slider */}
                    <div>
                        <label htmlFor="thermostat" className="block text-lg font-cinzel text-brand-gold mb-2">Preferred Temp: <span className="font-sans font-bold">{thermostat}°F</span></label>
                        <input
                            type="range"
                            id="thermostat"
                            min="65"
                            max="78"
                            value={thermostat}
                            onChange={handleThermostatChange}
                            className="w-full h-2 bg-black/20 rounded-lg appearance-none cursor-pointer"
                        />
                         <div className="flex justify-between text-xs text-yellow-300/50 mt-1">
                            <span>Cooler (65°)</span>
                            <span>Warmer (78°)</span>
                        </div>
                    </div>
                    
                    {/* Submit Button */}
                    <div className="pt-4">
                        <button 
                            type="submit"
                            className="w-full font-cinzel text-xl font-bold bg-amber-500 hover:bg-amber-600 text-gray-900 py-3 px-4 rounded-lg text-center transition duration-300 ease-in-out transform hover:scale-105 shadow-lg disabled:bg-gray-500"
                            disabled={status === 'Submitting...'}
                        >
                            {status === 'Submitting...' ? 'Sending...' : 'Submit Request'}
                        </button>
                    </div>

                    {/* Status Message */}
                    {status && <p className="text-center text-brand-gold mt-4">{status}</p>}
                </form>
            </div>
        </div>
    );
};

export default SignUpPage;

