// src/components/invitation/TrailerModal.tsx
import React from 'react';

interface TrailerModalProps {
  trailerUrl: string;
  onClose: () => void;
}

const TrailerModal: React.FC<TrailerModalProps> = ({ trailerUrl, onClose }) => {
  // Prevent clicks inside the modal from closing it
  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div 
      className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
      onClick={onClose} // Close modal on backdrop click
    >
      <div 
        className="bg-gray-900 rounded-lg overflow-hidden shadow-xl w-full max-w-4xl relative border-2 border-yellow-300/50"
        onClick={handleContentClick}
      >
        <button onClick={onClose} className="absolute top-2 right-4 text-white text-4xl hover:text-gray-400 z-10">&times;</button>
        <div className="relative pb-[56.25%] h-0"> {/* 16:9 Aspect Ratio */}
          <iframe 
            src={trailerUrl} 
            title="YouTube video player" 
            frameBorder="0" 
            allow="autoplay; encrypted-media;" 
            allowFullScreen 
            className="absolute top-0 left-0 w-full h-full"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default TrailerModal;
// Build Date: 2025-09-16 12:50 PM