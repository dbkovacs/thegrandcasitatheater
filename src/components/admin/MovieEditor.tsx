// src/components/admin/MovieEditor.tsx
import React, { useState, useEffect } from 'react';
import { db, storage } from '../../firebase';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { MovieNight } from '../../types';
import TextInput from '../ui/TextInput';
import RadioGroup from '../ui/RadioGroup';
import Button from '../ui/Button';

interface MovieEditorProps {
    movie: MovieNight;
    onUpdate: () => void; // Callback when movie is updated or deleted
    onClose: () => void; // To close the modal/editor
}

const MovieEditor: React.FC<MovieEditorProps> = ({ movie, onUpdate, onClose }) => {
    const [formData, setFormData] = useState<MovieNight>(movie);
    const [posterFile, setPosterFile] = useState<File | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(false);

    useEffect(() => {
        setFormData(movie); // Reset form data if movie prop changes
        setPosterFile(null);
        setDeleteConfirm(false);
    }, [movie]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRadioChange = (name: string, value: string) => {
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setPosterFile(e.target.files[0]);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            let newPosterURL = formData.posterURL;
            if (posterFile) {
                // Delete old poster if it exists and is not the default
                if (formData.posterURL && !formData.posterURL.includes('placehold.co')) {
                    const oldPosterRef = ref(storage, formData.posterURL);
                    try { await deleteObject(oldPosterRef); } catch (err) { console.warn("Could not delete old poster:", err); }
                }

                const posterRef = ref(storage, `posters/${movie.id}_${posterFile.name}`);
                const snapshot = await uploadBytes(posterRef, posterFile);
                newPosterURL = await getDownloadURL(snapshot.ref);
            }

            const movieDocRef = doc(db, "movieNights", movie.id);
            await updateDoc(movieDocRef, {
                ...formData,
                posterURL: newPosterURL,
            });
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
        if (!deleteConfirm) {
            setDeleteConfirm(true);
            return;
        }
        setIsDeleting(true);
        try {
            // Delete poster from storage
            if (formData.posterURL && !formData.posterURL.includes('placehold.co')) {
                const posterRef = ref(storage, formData.posterURL);
                try { await deleteObject(posterRef); } catch (err) { console.warn("Could not delete poster from storage:", err); }
            }
            
            // Delete reservations subcollection first (Firestore limitation)
            const reservationsRef = collection(db, "movieNights", movie.id, "reservations");
            const reservationsSnapshot = await getDocs(reservationsRef);
            const deletePromises = reservationsSnapshot.docs.map(resDoc => deleteDoc(doc(reservationsRef, resDoc.id)));
            await Promise.all(deletePromises);

            // Delete movie document
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
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
            <div className="bg-brand-card p-8 rounded-lg shadow-xl w-full max-w-2xl relative border-2 border-yellow-300/50 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-white text-3xl hover:text-gray-400">&times;</button>
                <h2 className="text-3xl font-cinzel text-brand-gold mb-6 text-center">Edit Movie: {movie.movieTitle}</h2>
                
                <form className="space-y-4">
                    <TextInput label="Movie Title" name="movieTitle" value={formData.movieTitle} onChange={handleChange} />
                    <TextInput label="Host Name" name="hostName" value={formData.hostName} onChange={handleChange} />
                    <TextInput label="Greeting Message" name="greeting" value={formData.greeting || ''} onChange={handleChange} placeholder="Optional greeting" />
                    <TextInput label="Show Date" name="showDate" type="date" value={formData.showDate} onChange={handleChange} />
                    <TextInput label="Thermostat Preference" name="thermostat" type="number" value={formData.thermostat} onChange={handleChange} min="70" max="80" />
                    <TextInput label="Trailer Link" name="trailerLink" type="url" value={formData.trailerLink || ''} onChange={handleChange} placeholder="YouTube URL" />
                    
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Current Poster</label>
                        {formData.posterURL && <img src={formData.posterURL} alt="Current Poster" className="max-h-40 rounded-lg mb-2" />}
                        <input 
                            type="file" 
                            onChange={handleFileChange} 
                            accept="image/png, image/jpeg" 
                            className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-gold/20 file:text-brand-gold hover:file:bg-brand-gold/30"
                        />
                    </div>

                    <RadioGroup
                        label="Audience"
                        name="audience"
                        options={[{label: "Kids Welcome", value: "Kids Welcome"}, {label: "Adults Only", value: "Adults Only"}]}
                        selectedValue={formData.audience || 'Kids Welcome'}
                        onChange={(value) => handleRadioChange('audience', value)}
                    />
                    
                    <RadioGroup
                        label="Status"
                        name="status"
                        options={[{label: "Pending Review", value: "Pending Review"}, {label: "Approved", value: "Approved"}]}
                        selectedValue={formData.status}
                        onChange={(value) => handleRadioChange('status', value)}
                    />

                    <div className="flex justify-between gap-4 mt-8 pt-4 border-t border-slate-700">
                        <Button type="button" onClick={handleDelete} variant="danger" disabled={isDeleting}>
                            {deleteConfirm ? (isDeleting ? 'Deleting...' : 'Confirm Delete?') : 'Delete Movie'}
                        </Button>
                        <Button type="button" onClick={handleSave} variant="primary" disabled={isSaving}>
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MovieEditor;
// Build Date: 2025-09-16 01:50 PM