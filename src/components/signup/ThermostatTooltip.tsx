// src/components/signup/ThermostatTooltip.tsx
import React from 'react';
import  MovieNight  from '../../types';

interface ThermostatTooltipProps {
  entries: MovieNight[];
}

const ThermostatTooltip: React.FC<ThermostatTooltipProps> = ({ entries }) => {
  // We'll format the date for the popup
  const formatDate = (dateString: string) => {
    const date = new Date(`${dateString}T00:00:00`);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-max max-w-xs bg-slate-900 border border-brand-gold/50 text-white text-xs rounded-lg shadow-lg p-3 z-10">
      <p className="font-bold text-brand-gold mb-1 border-b border-slate-700 pb-1">Previously chosen by:</p>
      <ul className="space-y-1 max-h-24 overflow-y-auto">
        {entries.map((movie, index) => (
          <li key={index}>
            <span className="font-semibold">{movie.hostName}</span> for <span className="italic">"{movie.movieTitle}"</span> on {formatDate(movie.showDate)}
          </li>
        ))}
      </ul>
      <div className="absolute left-1/2 -translate-x-1/2 bottom-[-5px] w-2.5 h-2.5 bg-slate-900 transform rotate-45 border-r border-b border-brand-gold/50"></div>
    </div>
  );
};

export default ThermostatTooltip;
// Build Date: 2025-09-16 12:50 PM