
'use client';

import * as Fa from 'react-icons/fa';

interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectInputProps {
  value: string | number;
  options: SelectOption[] | string[];
  label?: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
  isDarkTheme: boolean;
  onChange: (value: string) => void;
  className?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export default function SelectInput({
  value,
  options,
  label,
  placeholder = 'Select an option...',
  required = false,
  error,
  isDarkTheme,
  onChange,
  className = '',
  disabled = false,
  icon = <Fa.FaCalendarAlt className="w-4 h-4" />,
}: SelectInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };
  const normalizedOptions = options.map(opt => 
    typeof opt === 'string' ? { value: opt, label: opt } : opt
  );

  return (
    <div className={className}>
      {label && (
        <label className={`block text-sm font-medium mb-1.5 ${isDarkTheme ? 'text-slate-400' : 'text-gray-600'}`}>
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${isDarkTheme ? 'text-slate-500' : 'text-gray-400'} z-10`}>
            {icon}
          </div>
        )}
        <select
          value={value}
          onChange={handleChange}
          disabled={disabled}
          className={`w-full ${icon ? 'pl-10' : 'pl-4'} pr-10 py-2.5 rounded-md text-sm transition-all duration-300 appearance-none cursor-pointer ${
            error 
              ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
              : isDarkTheme
                ? 'bg-slate-800/80 border-slate-700 text-slate-100 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 hover:bg-slate-800'
                : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-red-400 focus:ring-2 focus:ring-red-400/20 hover:bg-gray-100'
          } border focus:outline-none ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <option value="">{placeholder}</option>
          {normalizedOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <Fa.FaChevronDown 
          className={`absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${
            isDarkTheme ? 'text-slate-500' : 'text-gray-400'
          }`}
        />
      </div>
      
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}