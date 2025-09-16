// src/components/theater/SceneSelection.jsx
import React from 'react';
import { Button } from '../ui/Button'; // CORRECTED PATH
import { Play } from 'lucide-react';

const scenes = [
  { id: 1, name: 'Arrival on Arrakis', timestamp: '0:12:35' },
  { id: 2, name: 'The Spice Harvest', timestamp: '0:42:15' },
  { id: 3, name: 'Paul\'s Vision', timestamp: '1:15:20' },
  { id: 4, name: 'Riding the Sandworm', timestamp: '2:05:45' },
];

const SceneSelection = () => {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/80 rounded-2xl p-6 shadow-lg h-full flex flex-col">
      <h2 className="text-xl font-bold text-white mb-4">Scene Selection</h2>
      
      <ul className="space-y-3 flex-grow overflow-y-auto pr-2">
        {scenes.map((scene) => (
          <li key={scene.id} className="flex items-center justify-between bg-gray-900/50 p-3 rounded-lg">
            <div>
              <p className="font-semibold text-gray-200">{scene.name}</p>
              <p className="text-sm text-gray-500 font-mono">{scene.timestamp}</p>
            </div>
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-amber-400">
              <Play className="h-5 w-5" />
              <span className="sr-only">Play scene {scene.name}</span>
            </Button>
          </li>
        ))}
      </ul>
      <p className="text-xs text-gray-600 text-right font-mono mt-4">
        Build Date: 2025-09-16 02:43 PM
      </p>
    </div>
  );
};

export default SceneSelection;
// Build Date: 2025-09-16 02:43 PM