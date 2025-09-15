// File: src/AdminPage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { db, storage } from './firebase';
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { MovieNight } from './types'; // Import our blueprint

function AdminPage() {
    // FIX: Apply the MovieNight blueprint to our state
    const [pendingMovies, setPendingMovies] = useState<MovieNight[]>([]);
    const [approvedMovies, setApprovedMovies] = useState<MovieNight[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // FIX: Define types for uploader state
    const [selectedMovieId, setSelectedMovieId] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        const fetchMovies = async () => {
            setLoading(true);
            try {
                const pendingQuery = query(collection(db, "movieNights"), where("status", "==", "Pending Review"));
                const approvedQuery = query(collection(db, "movieNights"), where("status", "==", "Approved"));

                const [pendingSnapshot, approvedSnapshot] = await Promise.all([getDocs(pendingQuery), getDocs(approvedQuery)]);

                const pendingList = pendingSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MovieNight));
                const approvedList = approvedSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MovieNight));

                setPendingMovies(pendingList);
                setApprovedMovies(approvedList);
                setError(null);
            } catch (err) {
                console.error("Error fetching movies: ", err);
                setError("Failed to fetch movie night data.");
            } finally {
                setLoading(false);
            }
        };
        fetchMovies();
    }, []);

    // FIX: Add type for the movieId parameter
    const handleApprove = async (movieId: string) => {
        /* Your approve logic here */
    };
    
    // FIX: Add type for the files parameter
    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            setSelectedFile(acceptedFiles[0]);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': ['.jpeg', '.png', '.gif', '.webp'] },
        multiple: false
    });

    const handleUpload = () => {
        if (!selectedFile || !selectedMovieId) {
            alert("Please select a movie and a file first.");
            return;
        }
        setIsUploading(true);
        setUploadProgress(0);

        const storageRef = ref(storage, `posters/${selectedMovieId}/${selectedFile.name}`);
        const uploadTask = uploadBytesResumable(storageRef, selectedFile);

        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setUploadProgress(progress);
            },
            (error) => {
                console.error("Upload failed: ", error);
                alert("Upload failed.");
                setIsUploading(false);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                    const movieDocRef = doc(db, "movieNights", selectedMovieId);
                    await updateDoc(movieDocRef, { posterURL: downloadURL });
                    
                    setApprovedMovies(movies => movies.filter(m => m.id !== selectedMovieId));
                    setSelectedFile(null);
                    setIsUploading(false);
                    setSelectedMovieId(null);
                });
            }
        );
    };

    const selectedMovieInfo = approvedMovies.find(m => m.id === selectedMovieId);

    // ... The rest of your JSX should now work because TypeScript knows the types ...
    return (
        <div className="container mx-auto p-8">
            <h1 className="text-4xl font-cinzel text-brand-gold mb-8 text-center">Admin Dashboard</h1>
            {/* The JSX for pending movies, etc. */}
            <div className="bg-brand-card p-6 rounded-2xl shadow-2xl border-2 border-yellow-300/20">
                <h2 className="text-2xl font-cinzel text-brand-gold mb-4">Add Movie Poster</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Column 1: List of Approved Movies */}
                    <div>
                        <h3 className="text-lg font-cinzel text-yellow-300/80 mb-2">1. Select an Approved Movie</h3>
                        <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                           {(approvedMovies.filter(m => !m.posterURL).length > 0) ? (
                                approvedMovies.filter(m => !m.posterURL).map(movie => (
                                <div
                                    key={movie.id}
                                    onClick={() => setSelectedMovieId(movie.id)}
                                    className={`p-3 rounded-lg cursor-pointer transition-colors ${selectedMovieId === movie.id ? 'bg-brand-gold text-black' : 'bg-black/20 hover:bg-black/40'}`}
                                >
                                    <p className="font-bold">{movie.movieTitle}</p>
                                    <p className="text-xs">{movie.showDate}</p>
                                </div>
                                ))
                           ) : (
                                <p className="text-yellow-300/70 p-3 bg-black/20 rounded-lg">No approved movies need a poster.</p>
                           )}
                        </div>
                    </div>

                    {/* Column 2: The Uploader */}
                    <div>
                        <h3 className="text-lg font-cinzel text-yellow-300/80 mb-2">2. Upload the Poster</h3>
                        <div {...getRootProps()} className={`border-4 border-dashed rounded-lg p-8 text-center transition-colors ${!selectedMovieId ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-brand-gold'} ${isDragActive ? 'border-brand-gold bg-black/20' : 'border-yellow-300/30'}`}>
                            <input {...getInputProps()} disabled={!selectedMovieId} />
                            {selectedFile ? (
                                <p>{selectedFile.name}</p>
                            ) : (
                                <p>{isDragActive ? 'Drop the file here...' : 'Drag & drop or click to select'}</p>
                            )}
                        </div>

                        {selectedFile && selectedMovieId && (
                            <div className="mt-4 text-center">
                                {isUploading ? (
                                    <div>
                                        <p>Uploading for "{selectedMovieInfo?.movieTitle}"...</p>
                                        <div className="w-full bg-black/30 rounded-full h-2.5 mt-2">
                                            <div className="bg-brand-gold h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
                                        </div>
                                    </div>
                                ) : (
                                    <button onClick={handleUpload} className="btn-velvet">Upload Poster</button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminPage;