// src/components/invitation/AdultsOnlyModal.tsx
import React from 'react';

interface AdultsOnlyModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

const AdultsOnlyModal: React.FC<AdultsOnlyModalProps> = ({ onConfirm, onCancel }) => {
  return (
    <div 
      className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
      onClick={onCancel}
    >
      <div 
        className="bg-brand-card p-8 rounded-lg shadow-xl text-center max-w-sm w-full border-2 border-red-500/50"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-2xl font-bold mb-4 text-red-400 font-cinzel">Age Restriction</h3>
        <p className="text-slate-200 mb-6">This screening is for adults only (21+). Please confirm you meet the age requirement to proceed.</p>
        <div className="flex justify-center gap-4">
          <button onClick={onConfirm} className="w-full btn-velvet primary">I Confirm</button>
          <button onClick={onCancel} className="w-full btn-velvet">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default AdultsOnlyModal;
// Build Date: 2025-09-16 01:08 PM