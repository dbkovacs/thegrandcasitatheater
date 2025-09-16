// src/SignUpPage.tsx
import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { MovieNight } from './types';
import FormHeader from './components/signup/FormHeader';
import TextInput from './components/ui/TextInput';
import RadioGroup from './components/ui/RadioGroup';
import Thermostat from './components/signup/Thermostat';

function SignUpPage() {
    const [hostName, setHostName] = useState('');
    const [movieTitle, setMovieTitle] = useState('');
    const [audience, setAudience] = useState<'Kids Welcome' | 'Adults Only'>('Kids Welcome');
    const [greeting, setGreeting] = useState('');
    const [notesToDavid, setNotesToDavid] = useState('');
    const [thermostat, setThermostat] = useState(74);
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const [historicalMovies, setHistoricalMovies] = useState<MovieNight[]>([]);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const q = query(collection(db, "movieNights"), where("status", "==", "Approved"));
                const querySnapshot = await getDocs(q);
                const movies = querySnapshot.docs.map(doc => doc.data() as MovieNight);
                setHistoricalMovies(movies);
            } catch (error) {
                console.error("Error fetching historical movie data: ", error);
            }
        };
        fetchHistory();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!hostName || !movieTitle) {
            setMessage('Please fill out Your Name and Movie Title.');
            return;
        }
        setIsSubmitting(true);
        setMessage('Submitting your request...');

        try {
            await addDoc(collection(db, "movieNights"), {
                hostName, movieTitle, audience, greeting, notesToDavid,
                thermostat: Number(thermostat),
                status: 'Pending Review',
                submittedAt: new Date()
            });

            setMessage('Success! Your movie night has been submitted for review.');
            setHostName(''); setMovieTitle(''); setAudience('Kids Welcome');
            setGreeting(''); setNotesToDavid(''); setThermostat(74);
            setTimeout(() => setMessage(''), 5000);

        } catch (error) {
            console.error("Error adding document: ", error);
            setMessage('An error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-brand-dark flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
            <div className="w-full max-w-4xl">
                <FormHeader />

                <form onSubmit={handleSubmit} className="bg-brand-card border border-brand-gold/20 rounded-2xl shadow-2xl p-6 sm:p-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-2 flex flex-col gap-6">
                            <TextInput
                                label="Your Name"
                                value={hostName}
                                onChange={(e) => setHostName(e.target.value)}
                                placeholder="e.g., Jane Doe"
                            />
                            <TextInput
                                label="Movie Title"
                                value={movieTitle}
                                onChange={(e) => setMovieTitle(e.target.value)}
                                placeholder="e.g., The Princess Bride (1987)"
                            />
                            <RadioGroup
                                label="Audience"
                                selectedValue={audience}
                                options={['Kids Welcome', 'Adults Only']}
                                onChange={setAudience}
                            />
                            <TextInput
                                as="textarea"
                                label="Greeting for Your Guests"
                                value={greeting}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setGreeting(e.target.value)}
                                placeholder="e.g., 'I grew up loving this movie, hope you join me!'"
                                rows={4}
                            />
                        </div>

                        <div className="md:col-span-1">
                            <Thermostat 
                                value={thermostat} 
                                onChange={(e) => setThermostat(parseInt(e.target.value))}
                                historicalData={historicalMovies}
                            />
                        </div>
                    </div>

                    <div className="mt-8 border-t border-slate-700 pt-8">
                         <TextInput
                            label="Notes to David (Optional)"
                            value={notesToDavid}
                            onChange={(e) => setNotesToDavid(e.target.value)}
                            placeholder="e.g., 'Make sure it's the widescreen version!'"
                        />
                        <div className="mt-6">
                            <button type="submit" disabled={isSubmitting} className="w-full btn-velvet text-lg">
                                {isSubmitting ? 'Submitting...' : 'Submit Movie Night'}
                            </button>
                        </div>
                        {message && <p className="text-center mt-4 text-brand-gold">{message}</p>}
                    </div>
                </form>
            </div>
        </div>
    );
}

export default SignUpPage;
// Build Date: 2025-09-16 10:55 AM