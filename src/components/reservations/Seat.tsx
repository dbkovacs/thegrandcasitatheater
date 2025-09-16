// src/components/reservations/Seat.tsx
import React from 'react';
import { Seat as SeatType } from '../../types';

interface SeatProps {
  seat: SeatType;
  isSelected: boolean;
  onClick: (id: string) => void;
  isAisleSeat: boolean;
  isBeanBag: boolean; // New prop for bean bag
}

const Seat: React.FC<SeatProps> = ({ seat, isSelected, onClick, isAisleSeat, isBeanBag }) => {
  const getSeatClasses = () => {
    if (seat.status === 'reserved') {
      return 'bg-slate-700 text-slate-500 cursor-not-allowed';
    }
    if (isSelected) {
      return 'bg-brand-gold text-brand-dark font-bold ring-2 ring-offset-2 ring-offset-black/50 ring-brand-gold';
    }
    return 'bg-slate-500 hover:bg-slate-400 cursor-pointer';
  };

  const getSeatShapeClasses = () => {
      return isBeanBag ? 'rounded-full' : 'rounded-md'; // Circle for bean bag, square for others
  };

  return (
    <div className={`relative ${isAisleSeat ? 'mr-8' : ''}`}> {/* Add margin for aisle */}
        <button
            onClick={() => onClick(seat.id)}
            disabled={seat.status === 'reserved'}
            className={`w-10 h-10 flex items-center justify-center text-xs font-semibold transition-all duration-200 ${getSeatClasses()} ${getSeatShapeClasses()}`}
        >
            {isBeanBag ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.975 2.887a1 1 0 00-.363 1.118l1.519 4.674c.3.921-.755 1.688-1.539 1.118l-3.975-2.887a1 1 0 00-1.176 0l-3.975 2.887c-.784.57-1.838-.197-1.539-1.118l1.519-4.674a1 1 0 00-.363-1.118L2.203 9.098c-.783-.57-.381-1.81.588-1.81h4.915a1 1 0 00.95-.69l1.519-4.674z" />
                </svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 9v3m0 0v3m0-3h-4.667M21 12H3m18 0a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2h14a2 2 0 012 2v3z" />
                </svg>
            )}
            {seat.id}
        </button>
    </div>
  );
};

export default Seat;
// Build Date: 2025-09-16 01:50 PM