// app/home/components/SideLink.tsx
'use client';

import Link from 'next/link';
import * as Fa from 'react-icons/fa';
import { useLinks, DEFAULT_LINKS } from '../../../hooks/useLinks';

interface SideLinksProps {
  isDarkTheme?: boolean;
  className?: string;
  categorySlug?: string;
  limit?: number;
  showExternalOnly?: boolean;
  maxHeight?: string;
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
}

export default function SideLinks({ 
  isDarkTheme = false, 
  className = '',
  categorySlug,
  limit = 10,
  showExternalOnly = true,
  maxHeight = 'h-[400px]',
  searchQuery: externalSearchQuery = '',
  setSearchQuery: externalSetSearchQuery,
}: SideLinksProps) {

  const { 
    filteredLinks, 
    loading, 
    error, 
    refetch,
    setSearchQuery: internalSetSearchQuery,
    searchQuery: internalSearchQuery,
  } = useLinks({
    categorySlug,
    limit,
    showExternalOnly,
    searchQuery: externalSearchQuery,
  });

  const renderIcon = (iconName: string, className: string, color?: string) => {
    const IconComponent = Fa[iconName as keyof typeof Fa];
    if (!IconComponent) return <Fa.FaQuestion className={className} />;
    return <IconComponent className={className} style={color ? { color } : undefined} />;
  };

  const isInternalLink = (url: string): boolean => {
    return url.startsWith('/') || url.startsWith('../') || url.startsWith('./');
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    internalSetSearchQuery(value);
    if (externalSetSearchQuery) {
      externalSetSearchQuery(value);
    }
  };

  const currentSearchQuery = externalSearchQuery || internalSearchQuery;

  if (loading) {
    return (
      <section className={`px-3 sm:px-0 lg:px-0 pt-6 pb-3 ${className}`}>
        <div className="mb-4">
          <div className="relative items-center justify-center m-auto">
            <div className={`w-90 h-10 rounded-lg animate-pulse ${isDarkTheme ? 'bg-slate-800' : 'bg-gray-200'}`} />
          </div>
        </div>
        <div className={`overflow-y-auto pr-2 pt-1 pe-2 scrollbar-thin ${maxHeight}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className={`block rounded-lg py-2 px-4 border ${
                  isDarkTheme ? 'bg-slate-800 border-slate-700' : 'bg-gray-100 border-gray-200'
                }`}>
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg ${isDarkTheme ? 'bg-slate-700' : 'bg-gray-200'}`} />
                    <div className="flex-1">
                      <div className={`h-4 rounded ${isDarkTheme ? 'bg-slate-700' : 'bg-gray-200'} w-3/4`} />
                      <div className={`h-3 rounded ${isDarkTheme ? 'bg-slate-700' : 'bg-gray-200'} w-1/2 mt-1`} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }


  if (error) {
    return (
      <section className={`px-3 sm:px-0 lg:px-0 pt-6 pb-3 ${className}`}>
        <div className={`text-center py-8 rounded-lg border ${
          isDarkTheme ? 'bg-slate-900/50 border-slate-800' : 'bg-white/50 border-slate-200'
        }`}>
          <Fa.FaExclamationTriangle className="w-8 h-8 text-amber-400 mx-auto mb-2" />
          <p className={`text-sm ${isDarkTheme ? 'text-slate-400' : 'text-slate-600'}`}>
            {error}
          </p>
          <button
            onClick={refetch}
            className={`mt-3 px-4 py-1.5 rounded-lg text-sm transition-all duration-300 ${
              isDarkTheme
                ? 'bg-rose-500 hover:bg-rose-600 text-white'
                : 'bg-rose-500 hover:bg-rose-600 text-white'
            }`}
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className={`px-3 sm:px-0 lg:px-0 pt-6 pb-3 ${className}`}>
      <div className="mb-4">
        <div className="relative items-center justify-center m-auto">
          <Fa.FaSearch className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
            isDarkTheme ? 'text-slate-400' : 'text-slate-400'
          }`} />
          <input
            type="text"
            placeholder="Search system..."
            value={currentSearchQuery}
            onChange={handleSearchChange}
            className={`w-90 pl-10 pr-4 py-2 rounded-lg text-sm transition-all duration-300 ${
              isDarkTheme
                ? 'bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-rose-500 focus:ring-rose-500/20'
                : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-rose-400 focus:ring-rose-400/20'
            } border focus:outline-none focus:ring-2`}
          />
        </div>
      </div>

      <div className={`overflow-y-auto pr-2 pt-1 pe-2 scrollbar-thin ${maxHeight}`}>
        {filteredLinks.length === 0 ? (
          <div className={`text-center py-8 rounded-lg border ${
            isDarkTheme ? 'bg-slate-900/50 border-slate-800' : 'bg-white/50 border-slate-200'
          }`}>
            <Fa.FaSearch className={`w-8 h-8 mx-auto mb-2 ${
              isDarkTheme ? 'text-slate-500' : 'text-slate-400'
            }`} />
            <p className={`text-sm ${isDarkTheme ? 'text-slate-400' : 'text-slate-600'}`}>
              No links found matching your search
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {filteredLinks.map((link) => {
              const isInternal = isInternalLink(link.url);
              const href = link.url;
              const key = link.id || link.slug || `${link.name}-${link.categoryId}`;

              const cardContent = (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: '#ea580c15' }}>
                    {renderIcon(link.iconName, 'w-5 h-5', '#ea580c')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-sm font-semibold truncate ${
                        isDarkTheme 
                          ? 'text-slate-200 group-hover:text-rose-400' 
                          : 'text-slate-800 group-hover:text-rose-600'
                      }`}>
                        {link.name}
                      </span>
                      <div className={`w-2 h-2 rounded-full shrink-0 ${
                        link.status === 'online' ? 'bg-emerald-500' : 'bg-amber-500'
                      } animate-pulse-subtle`} 
                      title={link.status} />
                    </div>
                    <p className={`text-xs truncate mt-0.5 ${
                      isDarkTheme 
                        ? 'text-slate-500 group-hover:text-slate-400' 
                        : 'text-slate-500 group-hover:text-slate-700'
                    }`}>
                      {link.desc}
                    </p>
                  </div>
                  {isInternal ? (
                    <Fa.FaArrowRight className={`w-3 h-3 transition-all shrink-0 mt-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${
                      isDarkTheme 
                        ? 'text-slate-400 group-hover:text-rose-400' 
                        : 'text-slate-400 group-hover:text-rose-500'
                    }`} />
                  ) : (
                    <Fa.FaExternalLinkAlt className={`w-3 h-3 transition-all shrink-0 mt-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${
                      isDarkTheme 
                        ? 'text-slate-400 group-hover:text-rose-400' 
                        : 'text-slate-400 group-hover:text-rose-500'
                    }`} />
                  )}
                </div>
              );

              const commonClasses = `group block rounded-lg py-2 px-4 border transition-all duration-300 hover:-translate-y-1 ${
                isDarkTheme
                  ? 'bg-slate-900 border-slate-800 hover:border-rose-500 hover:shadow-xl hover:shadow-rose-500/10'
                  : 'bg-white border-slate-300 hover:border-rose-400 hover:shadow-xl hover:shadow-rose-500/10'
              }`;

              return isInternal ? (
                <Link
                  key={key}
                  href={href}
                  className={commonClasses}
                >
                  {cardContent}
                </Link>
              ) : (
                <a
                  key={key}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={commonClasses}
                >
                  {cardContent}
                </a>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}