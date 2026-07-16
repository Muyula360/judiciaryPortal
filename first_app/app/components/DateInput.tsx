// components/DateInput.tsx
'use client';

import { useRef } from 'react';
import * as Fa from 'react-icons/fa';

interface DateInputProps {
  value: string;
  label: string;
  required?: boolean;
  error?: string;
  isDarkTheme: boolean;
  onChange: (value: string) => void;
  icon?: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export default function DateInput({
  value,
  label,
  required = false,
  error,
  isDarkTheme,
  onChange,
  icon = <Fa.FaCalendarAlt className="w-4 h-4" />,
  className = '',
  disabled = false,
}: DateInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className={`relative ${className}`}>
      <label className={`block text-sm font-medium mb-1.5 ${isDarkTheme ? 'text-slate-400' : 'text-gray-600'}`}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      <div className="relative">
        <div className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${isDarkTheme ? 'text-slate-500' : 'text-gray-400'} z-10`}>
          {icon}
        </div>
        
        <input
          ref={inputRef}
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`w-full pl-10 pr-3 py-2.5 rounded-md text-sm transition-all duration-300 ${
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