// components/FormButtons.tsx
'use client';

import * as Fa from 'react-icons/fa';

interface FormButtonsProps {
  isDarkTheme: boolean;
  searchLabel?: string;
  resetLabel?: string;
  onSearch: () => void;
  onReset: () => void;
  isLoading?: boolean;
  className?: string;
}

export default function FormButtons({
  isDarkTheme,
  searchLabel = 'Search',
  resetLabel = 'Reset',
  onSearch,
  onReset,
  isLoading = false,
  className = '',
}: FormButtonsProps) {
  return (
    <div className={`flex flex-col sm:flex-row gap-3 ${className}`}>
      <button
        type="submit"
        disabled={isLoading}
        className={`flex-1 px-4 py-2.5 rounded-md text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
          isDarkTheme
            ? 'bg-red-600 hover:bg-red-700 text-white disabled:bg-red-800/50'
            : 'bg-red-500 hover:bg-red-600 text-white disabled:bg-red-300'
        } disabled:cursor-not-allowed`}
        onClick={onSearch}
      >
        {isLoading ? (
          <>
            <Fa.FaSpinner className="w-4 h-4 animate-spin" />
            Loading...
          </>
        ) : (
          <>
            <Fa.FaSearch className="w-4 h-4" />
            {searchLabel}
          </>
        )}
      </button>
      
      <button
        type="button"
        onClick={onReset}
        disabled={isLoading}
        className={`flex-1 px-4 py-2.5 rounded-md text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
          isDarkTheme
            ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 disabled:opacity-50'
            : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200 disabled:opacity-50'
        } disabled:cursor-not-allowed`}
      >
        <Fa.FaUndo className="w-3.5 h-3.5" />
        {resetLabel}
      </button>
    </div>
  );
}