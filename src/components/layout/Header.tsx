// src/components/layout/Header.jsx
import React from 'react';
import { UserCircle } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="text-2xl font-bold tracking-wider text-white">
            <span className="text-amber-400">THE GRAND</span> CASITA THEATER
          </div>
          <button className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors">
            <UserCircle className="h-6 w-6 text-gray-300" />
            <span className="sr-only">User Profile</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
// Build Date: 2025-09-16 02:29 PM
