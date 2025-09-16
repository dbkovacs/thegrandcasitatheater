// src/components/theater/MediaControls.tsx
import React from 'react';
import { Button } from '../ui/Button';
import { Play, Info } from 'lucide-react';

// Define the shape of the 'media' object
interface MediaProps {
  media: {
    title: string;
    description: string;
    imageUrl: string;
    durationMinutes: number;
    rating: string;
  };
}

const MediaControls: React.FC<MediaProps> = ({ media }) => {
  // Destructure for easier access
  const { title, description, imageUrl, durationMinutes, rating } = media;

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/80 rounded-2xl shadow-lg overflow-hidden h-full flex flex-col">
      {/* Media Image */}
      <div className="aspect-video w-full overflow-hidden">
        <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
      </div>

      {/* Media Content */}
      <div className="p-6 flex-grow flex flex-col">
        <div className="flex items-baseline gap-4 mb-2">
          <h1 className="text-3xl font-bold text-white">{title}</h1>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span>{`${Math.floor(durationMinutes / 60)}h ${durationMinutes % 60}m`}</span>
            <span className="text-gray-600">•</span>
            <span className="border border-gray-600 px-1.5 py-0.5 rounded text-xs">{rating}</span>
          </div>
        </div>
        <p className="text-gray-300 mb-6 text-base leading-relaxed flex-grow">
          {description}
        </p>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-gray-900 font-bold flex-grow sm:flex-grow-0">
            <Play className="mr-2 h-5 w-5" />
            Begin Showing
          </Button>
          <Button size="lg" variant="outline" className="text-white border-gray-600 hover:bg-gray-700 hover:text-white flex-grow sm:flex-grow-0">
            <Info className="mr-2 h-5 w-5" />
            More Info
          </Button>
        </div>
      </div>
       <p className="text-xs text-gray-600 text-right font-mono p-2">
        Build Date: 2025-09-16 03:13 PM
      </p>
    </div>
  );
};

export default MediaControls;
// Build Date: 2025-09-16 03:13 PM