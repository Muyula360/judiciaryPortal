// components/SearchableDropdown.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import * as Fa from 'react-icons/fa';

interface SearchableDropdownProps {
  value: string;
  searchTerm: string;
  options: string[];
  placeholder?: string;
  label?: string;
  required?: boolean;
  error?: string;
  isDarkTheme: boolean;
  onSelect: (value: string) => void;
  onSearchChange: (term: string) => void;
  onDropdownToggle?: (isOpen: boolean) => void;
  icon?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  maxHeight?: string;
}

export default function SearchableDropdown({
  value,
  searchTerm,
  options,
  placeholder = 'Search or select...',
  label,
  required = false,
  error,
  isDarkTheme,
  onSelect,
  onSearchChange,
  onDropdownToggle,
  icon = <Fa.FaBuilding className="w-4 h-4" />,
  className = '',
  disabled = false,
  maxHeight = 'max-h-60',
}: SearchableDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        onDropdownToggle?.(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onDropdownToggle]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onSearchChange(val);
    setIsOpen(true);
    onDropdownToggle?.(true);
    
    const exactMatch = options.find(opt => opt.toLowerCase() === val.toLowerCase());
    if (exactMatch) {
      onSelect(exactMatch);
    } else {
      onSelect('');
    }
  };

  const handleSelect = (option: string) => {
    onSelect(option);
    onSearchChange(option);
    setIsOpen(false);
    onDropdownToggle?.(false);
    inputRef.current?.blur();
  };

  const handleClear = () => {
    onSelect('');
    onSearchChange('');
    inputRef.current?.focus();
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {label && (
        <label className={`block text-sm font-medium mb-1.5 ${isDarkTheme ? 'text-slate-400' : 'text-gray-600'}`}>
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <div className="relative">
        <div className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${isDarkTheme ? 'text-slate-500' : 'text-gray-400'} z-10`}>
          {icon}
        </div>

        <input
          ref={inputRef}
          type="text"
          value={value || searchTerm}
          onChange={handleInputChange}
          onFocus={() => {
            setIsOpen(true);
            onDropdownToggle?.(true);
          }}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full pl-10 pr-10 py-2.5 rounded-md text-sm transition-all duration-300 ${
            error 
              ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
              : isDarkTheme
                ? 'bg-slate-800/80 border-slate-700 text-slate-100 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 hover:bg-slate-800'
                : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-red-400 focus:ring-2 focus:ring-red-400/20 hover:bg-gray-100'
          } border focus:outline-none ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        />
        {(value || searchTerm) && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-10 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 z-10"
          >
            <Fa.FaTimes className="w-3.5 h-3.5" />
          </button>
        )}
        <Fa.FaChevronDown 
          className={`absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          } ${isDarkTheme ? 'text-slate-500' : 'text-gray-400'}`}
        />
        {isOpen && !disabled && (
          <div className={`absolute z-50 w-full mt-1 rounded-lg border shadow-lg overflow-y-auto ${maxHeight} ${
            isDarkTheme ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
          }`}>
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <div
                  key={option}
                  onClick={() => handleSelect(option)}
                  className={`px-4 py-2.5 text-sm cursor-pointer transition-colors flex items-center gap-2 ${
                    value === option
                      ? isDarkTheme ? 'bg-red-500/20 text-red-400' : 'bg-red-50 text-red-600'
                      : isDarkTheme ? 'hover:bg-slate-700 text-slate-200' : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  {value === option && <Fa.FaCheck className="w-3 h-3 flex-shrink-0" />}
                  <span className={value === option ? 'ml-5' : 'ml-8'}>{option}</span>
                </div>
              ))
            ) : (
              <div className={`px-4 py-3 text-sm text-center ${
                isDarkTheme ? 'text-slate-400' : 'text-gray-500'
              }`}>
                No options found matching "{searchTerm}"
              </div>
            )}
          </div>
        )}
      </div>

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}