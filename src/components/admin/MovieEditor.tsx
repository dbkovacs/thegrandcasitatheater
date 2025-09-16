// src/components/admin/MovieEditor.tsx
import React, { useState, useEffect } from 'react';
import { db, storage } from '../../firebase';
import { doc, updateDoc, deleteDoc, collection, getDocs } from 'firebase/firestore'; // <-- FIXED: Added missing imports
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { MovieNight } from '../../types';
import  TextInput  from '../ui/TextInput';
import  RadioGroup  from '../ui/RadioGroup';
import  Button  from '../ui/Button';

interface MovieEditorProps {
    movie: MovieNight;
    onUpdate: () => void;
    onClose: () => void;
}

const MovieEditor: React.FC<MovieEditorProps> = ({ movie, onUpdate, onClose }) => {
    const [formData, setFormData] = useState<MovieNight>(movie);
    const [posterFile, setPosterFile] = useState<File | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState('');

    useEffect(() => {
        setFormData(movie);
        setPosterFile(null);
        setDeleteConfirm('');
    }, [movie]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: name === 'thermostat' ? Number(value) : value });
    };
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setPosterFile(e.target.files[0]);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            let newPosterURL = formData.posterURL;
            if (posterFile) {
                if (formData.posterURL && !formData.posterURL.includes('placehold.co')) {
                    try {
                        const oldPosterRef = ref(storage, formData.posterURL);
                        await deleteObject(oldPosterRef);
                    } catch (err) { console.warn("Old poster not found, continuing...", err); }
                }
                const posterRef = ref(storage, `posters/${movie.id}_${posterFile.name}`);
                const snapshot = await uploadBytes(posterRef, posterFile);
                newPosterURL = await getDownloadURL(snapshot.ref);
            }

            const movieDocRef = doc(db, "movieNights", movie.id);
            await updateDoc(movieDocRef, { ...formData, posterURL: newPosterURL });
            
            onUpdate();
            onClose();
        } catch (error) {
            console.error("Error updating movie:", error);
            alert('An error occurred while saving.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            if (formData.posterURL && !formData.posterURL.includes('placehold.co')) {
                 try {
                    const posterRef = ref(storage, formData.posterURL);
                    await deleteObject(posterRef);
                 } catch(err) { console.warn("Poster not found, continuing delete...", err); }
            }
            
            const reservationsRef = collection(db, "movieNights", movie.id, "reservations");
            const reservationsSnapshot = await getDocs(reservationsRef);
            const deletePromises = reservationsSnapshot.docs.map(resDoc => deleteDoc(doc(reservationsRef, resDoc.id)));
            await Promise.all(deletePromises);

            await deleteDoc(doc(db, "movieNights", movie.id));
            onUpdate();
            onClose();
        } catch (error) {
            console.error("Error deleting movie:", error);
            alert('An error occurred while deleting.');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-brand-card p-8 rounded-lg shadow-xl w-full max-w-2xl relative border-2 border-yellow-300/50 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-white text-3xl hover:text-gray-400">&times;</button>
                <h2 className="text-3xl font-cinzel text-brand-gold mb-6 text-center">Edit: {movie.movieTitle}</h2>
                
                <form onSubmit={handleSave} className="space-y-4">
                    <TextInput label="Movie Title" name="movieTitle" value={formData.movieTitle} onChange={handleChange} />
                    <TextInput label="Host Name" name="hostName" value={formData.hostName} onChange={handleChange} />
                    <TextInput as="textarea" rows={3} label="Greeting Message" name="greeting" value={formData.greeting || ''} onChange={handleChange} placeholder="Optional greeting" />
                    <TextInput label="Show Date" name="showDate" type="date" value={formData.showDate} onChange={handleChange} />
                    <TextInput label="Thermostat Preference" name="thermostat" type="number" value={formData.thermostat} onChange={handleChange} min="70" max="80" />
                    <TextInput label="Trailer Link" name="trailerLink" type="url" value={formData.trailerLink || ''} onChange={handleChange} placeholder="YouTube URL" />
                    
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Current Poster</label>
                        {formData.posterURL && <img src={formData.posterURL} alt="Current Poster" className="max-h-40 rounded-lg mb-2" />}
                        <input type="file" onChange={handleFileChange} accept="image/png, image/jpeg" className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-gold/20 file:text-brand-gold hover:file:bg-brand-gold/30"/>
                    </div>

                    <RadioGroup label="Audience" options={['Kids Welcome', 'Adults Only']} selectedValue={formData.audience || 'Kids Welcome'} onChange={(value) => setFormData({...formData, audience: value})} />
                    <RadioGroup label="Status" options={['Pending Review', 'Approved']} selectedValue={formData.status} onChange={(value) => setFormData({...formData, status: value})} />

                    <div className="mt-8 pt-4 border-t border-slate-700 space-y-4">
                        <Button type="submit" disabled={isSaving}> {isSaving ? 'Saving...' : 'Save Changes'} </Button>
                        
                        <div className="flex items-center gap-4">
                           <TextInput label="" name="deleteConfirm" value={deleteConfirm} onChange={(e) => setDeleteConfirm(e.target.value)} placeholder={`Type "${movie.movieTitle}" to confirm`} className="flex-grow"/>
                           <Button type="button" onClick={handleDelete} disabled={isDeleting || deleteConfirm !== movie.movieTitle} className="!w-auto bg-red-800 hover:bg-red-700">
                               {isDeleting ? 'Deleting...' : 'Delete'}
                           </Button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MovieEditor;
// Build Date: 2025-09-16 02:20 PM