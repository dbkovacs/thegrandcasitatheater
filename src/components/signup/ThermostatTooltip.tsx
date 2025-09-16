// src/components/signup/ThermostatTooltip.tsx
import React from 'react';
import { MovieNight } from '../../types';

interface ThermostatTooltipProps {
  entries: MovieNight[];
}

const ThermostatTooltip: React.FC<ThermostatTooltipProps> = ({ entries }) => {
  return (
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs bg-slate-900 border border-brand-gold/50 text-white text-xs rounded-lg shadow-lg p-3">
      <p className="font-bold text-brand-gold mb-1 border-b border-slate-700 pb-1">Previously chosen by:</p>
      <ul className="space-y-1">
        {entries.map((movie, index) => (
          <li key={index}>
            <span className="font-semibold">{movie.hostName}</span> for <span className="italic">"{movie.movieTitle}"</span>
          </li>
        ))}
      </ul>
      <div className="absolute left-1/2 -translate-x-1/2 bottom-[-5px] w-2.5 h-2.5 bg-slate-900 transform rotate-45 border-r border-b border-brand-gold/50"></div>
    </div>
  );
};

export default ThermostatTooltip;
// Build Date: 2025-09-16 10:55 AM