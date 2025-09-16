// src/components/reservations/Seat.tsx
import React from 'react';
import { Seat as SeatType } from '../../types';

interface SeatProps {
  seat: SeatType;
  isSelected: boolean;
  onClick: (id: string) => void;
  isAisleSeat: boolean;
}

const Seat: React.FC<SeatProps> = ({ seat, isSelected, onClick, isAisleSeat }) => {
  const getSeatClasses = () => {
    if (seat.status === 'reserved') return 'bg-slate-700 text-slate-500 cursor-not-allowed';
    if (isSelected) return 'bg-brand-gold text-brand-dark font-bold ring-2 ring-offset-2 ring-offset-black/50 ring-brand-gold';
    return 'bg-slate-500 hover:bg-slate-400 cursor-pointer';
  };

  const isBeanBag = seat.type === 'beanbag';
  const shapeClasses = isBeanBag ? 'rounded-full' : 'rounded-md';
  const aisleClasses = isAisleSeat ? 'mr-4 md:mr-8' : ''; // Aisle spacing

  return (
    <div className={`relative ${aisleClasses}`}>
        <button
            onClick={() => seat.status !== 'reserved' && onClick(seat.id)}
            disabled={seat.status === 'reserved'}
            className={`w-10 h-10 flex items-center justify-center text-xs font-semibold transition-all duration-200 ${getSeatClasses()} ${shapeClasses}`}
            title={seat.id}
        >
            <span className="sr-only">{seat.id}</span>
            <span className="text-lg">{seat.id}</span>
        </button>
    </div>
  );
};

export default Seat;
// Build Date: 2025-09-16 02:25 PM