// src/App.jsx
import React from 'react';
import Header from './components/layout/Header';
import MediaControls from './components/theater/MediaControls';
import HostControls from './components/theater/HostControls';
import SceneSelection from './components/theater/SceneSelection';
import Footer from './components/layout/Footer';

function App() {
  // --- Data for our components ---
  // In a real application, this might come from an API or state management
  const hostName = 'Adriana';
  const requestedTemp = 68;
  const currentMedia = {
    title: 'Dune: Part Two',
    description: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.',
    imageUrl: 'https://placehold.co/1200x675/000000/FFFFFF/png?text=Dune:%20Part%20Two',
    durationMinutes: 166,
    rating: 'PG-13',
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col font-sans">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Media Player Section (Left) */}
          <div className="lg:col-span-2">
            <MediaControls media={currentMedia} />
          </div>

          {/* Host Controls & Scenes (Right) */}
          <div className="flex flex-col gap-8">
            <HostControls 
              hostName={hostName} 
              thermostat={requestedTemp} 
            />
            <SceneSelection />
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;
// Build Date: 2025-09-16 02:26 PM