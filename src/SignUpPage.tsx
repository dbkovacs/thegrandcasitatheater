// src/SignUpPage.tsx
import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { MovieNight } from './types';
import FormHeader from './components/signup/FormHeader';
import TextInput from './components/ui/TextInput';
import RadioGroup from './components/ui/RadioGroup';
import Thermostat from './components/signup/Thermostat'; // <-- IMPORT our new component

function SignUpPage() {
    // Form State
    const [hostName, setHostName] = useState('');
    const [movieTitle, setMovieTitle] = useState('');
    const [audience, setAudience] = useState<'Kids Welcome' | 'Adults Only'>('Kids Welcome');
    const [greeting, setGreeting] = useState('');
    const [notesToDavid, setNotesToDavid] = useState('');
    const [thermostat, setThermostat] = useState(74);
    
    // UI State
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');

    // Historical Data State
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
        // ... (rest of the submit logic is unchanged)
    };

    return (
        <div className="min-h-screen bg-brand-dark flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
            <div className="w-full max-w-4xl">
                <FormHeader />

                <form onSubmit={handleSubmit} className="bg-brand-card border border-brand-gold/20 rounded-2xl shadow-2xl p-6 sm:p-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        
                        <div className="md:col-span-2 flex flex-col gap-6">
                            {/* ... TextInputs and RadioGroup ... */}
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
                         {/* ... Bottom form fields and button ... */}
                    </div>
                </form>
            </div>
        </div>
    );
}

export default SignUpPage;
// Build Date: 2025-09-16