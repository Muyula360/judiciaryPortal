'use client';

import * as Fa from 'react-icons/fa';
import { memo, useState, useEffect } from 'react';
import { useDebounce } from '../../../../hooks/useDebounce';

interface SearchingProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;   // 👈 uncommented
  isGridView: boolean;
  setIsGridView: (value: boolean) => void;
  isDarkTheme: boolean;
}

function Searching({
  searchQuery,
  setSearchQuery,
  isGridView,
  setIsGridView,
  isDarkTheme,
}: SearchingProps) {
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const debouncedQuery = useDebounce(localQuery, 300);

  // Update parent only after debounce
  useEffect(() => {
    setSearchQuery(debouncedQuery);
  }, [debouncedQuery, setSearchQuery]);

  // Sync local state when prop changes externally (e.g., clear filter)
  useEffect(() => {
    setLocalQuery(searchQuery);
  }, [searchQuery]);

  return (
    <section className="transition-colors duration-300 mb-3">
      <div className="max-w-2xl mx-auto px-1 py-2">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[180px] relative">
            <Fa.FaSearch
              className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                isDarkTheme ? 'text-slate-400' : 'text-slate-400'
              }`}
            />
            <input
              type="text"
              placeholder="Search systems, tools, links..."
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
              aria-label="Search"
              className={`w-full max-w-full pl-10 pr-4 py-1.5 rounded-md text-sm transition-all duration-300 ${
                isDarkTheme
                  ? 'bg-slate-900 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-rose-500 focus:ring-rose-500/20'
                  : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-rose-400 focus:ring-rose-400/20'
              } border focus:outline-none focus:ring-2`}
            />
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsGridView(!isGridView)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all duration-300 shadow-sm border"
              aria-label={`Switch to ${isGridView ? 'list' : 'grid'} view`}
            >
              {isGridView ? (
                <Fa.FaTh className="w-4 h-4" />
              ) : (
                <Fa.FaList className="w-4 h-4" />
              )}
              <span className="hidden sm:inline text-xs font-medium">
                {isGridView ? 'Grid' : 'List'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default memo(Searching);