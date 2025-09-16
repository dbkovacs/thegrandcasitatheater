// src/components/theater/HostControls.jsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal } from 'lucide-react';

const HostControls = ({ hostName, thermostat }) => {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/80 rounded-2xl p-6 shadow-lg h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white">Host Controls</h2>
        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
          <SlidersHorizontal className="h-5 w-5" />
          <span className="sr-only">Adjust Settings</span>
        </Button>
      </div>

      <div className="flex-grow flex flex-col items-center justify-center text-center">
        <div className="mb-6">
          <p className="text-lg font-medium text-gray-300">
            <span className="font-semibold text-amber-400">{hostName}</span> requested the Theater be set to <span className="font-semibold text-cyan-400">{thermostat}°F</span>.
          </p>
          <p className="text-sm text-gray-500 mt-1">Please plan accordingly.</p>
        </div>
      </div>
      
      <p className="text-xs text-gray-600 text-right font-mono mt-4">
        Build Date: 2025-09-16 02:24 PM
      </p>
    </div>
  );
};

export default HostControls;
// Build Date: 2025-09-16 02:24 PM