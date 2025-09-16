// src/components/layout/Footer.jsx
import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const buildTimestamp = "2025-09-16 02:33 PM";

  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center text-xs text-gray-500 font-mono">
          <p>&copy; {currentYear} The Grand Casita Theater. All Rights Reserved.</p>
          <p>Build: {buildTimestamp}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
// Build Date: 2025-09-16 02:33 PM