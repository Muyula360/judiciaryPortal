'use client';

import { ReactNode } from 'react';
import * as Fa from 'react-icons/fa';

interface TextInputProps {
  value: string;
  label?: string;
  placeholder?: string;
  type?: 'text' | 'number' | 'email' | 'password' | 'tel';
  required?: boolean;
  error?: string;
  isDarkTheme: boolean;
  onChange: (value: string) => void;
  className?: string;
  disabled?: boolean;
  icon?: ReactNode;
  maxLength?: number;
  autoComplete?: string;
}

export default function TextInput({
  value,
  label,
  placeholder = 'Enter text...',
  type = 'text',
  required = false,
  error,
  isDarkTheme,
  onChange,
  className = '',
  disabled = false,
  icon = <Fa.FaSearch className="w-4 h-4" />,
  maxLength,
  autoComplete,
}: TextInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className={className}>
      {label && (
        <label className={`block text-sm font-medium mb-1.5 ${isDarkTheme ? 'text-slate-400' : 'text-gray-600'}`}>
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${isDarkTheme ? 'text-slate-500' : 'text-gray-400'}`}>
            {icon}
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={maxLength}
          autoComplete={autoComplete}
          className={`w-full ${icon ? 'pl-10' : 'pl-4'} pr-4 py-2 rounded-md text-md transition-all duration-300 ${
            error 
              ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
              : isDarkTheme
                ? 'bg-slate-800/80 border-slate-700 text-slate-100 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 hover:bg-slate-800'
                : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-red-400 focus:ring-2 focus:ring-red-400/20 hover:bg-gray-100'
          } border focus:outline-none ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        />
      </div>
      
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}