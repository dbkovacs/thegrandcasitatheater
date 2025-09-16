// src/components/reservations/Seat.tsx
import React from 'react';
import { Seat as SeatType } from '../../types';

interface SeatProps {
  seat: SeatType;
  isSelected: boolean;
  onClick: (id: string) => void;
}

const Seat: React.FC<SeatProps> = ({ seat, isSelected, onClick }) => {
  const getSeatClasses = () => {
    if (seat.status === 'reserved') {
      return 'bg-slate-700 text-slate-500 cursor-not-allowed';
    }
    if (isSelected) {
      return 'bg-brand-gold text-brand-dark font-bold ring-2 ring-offset-2 ring-offset-black/50 ring-brand-gold';
    }
    return 'bg-slate-500 hover:bg-slate-400 cursor-pointer';
  };

  return (
    <button
      onClick={() => onClick(seat.id)}
      disabled={seat.status === 'reserved'}
      className={`w-10 h-10 rounded-md flex items-center justify-center text-xs font-semibold transition-all duration-200 ${getSeatClasses()}`}
    >
      {seat.id}
    </button>
  );
};

export default Seat;
// Build Date: 2025-09-16 01:25 PM