// src/components/ui/RadioGroup.tsx
import React from 'react';

const RadioGroup = ({ label, selectedValue, options, onChange }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-400 mb-2">{label}</label>
      <div className="flex gap-4">
        {options.map(option => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`flex-1 py-3 px-4 border rounded-md text-center font-semibold transition-all duration-200 ${
              selectedValue === option
                ? 'bg-brand-gold text-brand-dark border-brand-gold ring-2 ring-offset-2 ring-offset-brand-card ring-brand-gold'
                : 'bg-slate-900/50 border-slate-700 text-slate-300 hover:border-slate-500'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default RadioGroup;
// Build Date: 2025-09-16 10:22 AM