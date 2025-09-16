// src/components/signup/Thermostat.tsx
import React, { useMemo } from 'react';
import { MovieNight } from '../../types';
import ThermostatTooltip from './ThermostatTooltip';

interface ThermostatProps {
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  historicalData: MovieNight[];
}

const Thermostat: React.FC<ThermostatProps> = ({ value, onChange, historicalData }) => {
  
  // Group historical data by temperature for quick lookup
  const historyByTemp = useMemo(() => {
    return historicalData.reduce((acc, movie) => {
      const temp = movie.thermostat;
      if (!acc[temp]) {
        acc[temp] = [];
      }
      acc[temp].push(movie);
      return acc;
    }, {} as Record<number, MovieNight[]>);
  }, [historicalData]);

  const averageTemp = useMemo(() => {
    if (historicalData.length === 0) return null;
    const total = historicalData.reduce((acc, movie) => acc + movie.thermostat, 0);
    return Math.round(total / historicalData.length);
  }, [historicalData]);

  const entriesForCurrentTemp = historyByTemp[value];

  return (
    <div className="flex flex-col items-center justify-between bg-slate-900/50 border border-slate-700 rounded-lg p-6 h-full">
      <div>
        <label className="text-center block text-sm font-medium text-slate-400">Set Theater Temp</label>
        <p className="text-center text-xs text-slate-500 mb-4">(We'll do our best!)</p>
        <div className="font-serif text-5xl font-bold text-brand-gold mb-4 text-center">{value}°F</div>
      </div>
      
      <div className="w-full relative">
        <input
          type="range"
          min="70"
          max="80"
          value={value}
          onChange={onChange}
          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-gold"
        />
        {entriesForCurrentTemp && <ThermostatTooltip entries={entriesForCurrentTemp} />}
      </div>

      <div className="text-center mt-4 h-10">
        {averageTemp !== null ? (
          <>
            <p className="text-xs text-slate-400">Average guest preference</p>
            <p className="font-semibold text-brand-gold">{averageTemp}°F</p>
          </>
        ) : <div className="animate-pulse h-4 w-24 bg-slate-700 rounded-md mx-auto mt-2"></div>}
      </div>
    </div>
  );
};

export default Thermostat;
// Build Date: 2025-09-16 10:55 AM