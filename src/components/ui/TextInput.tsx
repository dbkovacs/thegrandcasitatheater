// src/components/ui/TextInput.tsx
import React from 'react';

// Define the props interface to ensure type safety
interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  as?: 'input' | 'textarea';
  label: string;
}

const TextInput: React.FC<TextInputProps> = ({ as = 'input', label, ...props }) => {
  const commonClasses = "block w-full bg-slate-900/50 border border-slate-700 rounded-md shadow-sm py-2 px-3 text-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-brand-gold transition";
  
  const InputComponent = as;

  return (
    <div>
      <label className="block text-sm font-medium text-slate-400 mb-1">{label}</label>
      <InputComponent 
        {...props}
        className={commonClasses}
      />
    </div>
  );
};

export default TextInput;
// Build Date: 2025-09-16 10:25 AM