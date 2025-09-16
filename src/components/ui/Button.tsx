// src/components/ui/Button.tsx
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children, disabled, ...props }) => {
  return (
    <button
      {...props}
      disabled={disabled}
      className={`w-full btn-velvet text-lg ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {children}
    </button>
  );
};

export default Button;
// Build Date: 2025-09-16 11:10 AM