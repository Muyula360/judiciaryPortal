'use client';

import Link from 'next/link';
import * as Fa from 'react-icons/fa';
import { Category } from '@/types';
import Searching from './Searching';

interface HomeLinkProps {
  categoriesData: Category[];      
  currentFilter: string;
  setCurrentFilter: (filter: string) => void;
  isDarkTheme: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isGridView: boolean;
  setIsGridView: (view: boolean) => void;
}

export default function HomeLink({
  categoriesData,
  currentFilter,
  setCurrentFilter,
  isDarkTheme,
  searchQuery,
  setSearchQuery,
  isGridView,
  setIsGridView,
}: HomeLinkProps) {
  // Render FontAwesome icon
  const renderIcon = (iconName: string, className: string, color?: string) => {
    const IconComponent = Fa[iconName as keyof typeof Fa];
    if (!IconComponent) return <Fa.FaQuestion className={className} />;
    return <IconComponent className={className} style={color ? { color } : undefined} />;
  };

  // No internal filtering – data already filtered by parent

  return (
    <section className="px-4 sm:px-6 lg:px-28 pt-6 pb-3">
      {/* Search & view toggle */}
      <Searching
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isGridView={isGridView}
        setIsGridView={setIsGridView}
        isDarkTheme={isDarkTheme}
      />

      {/* Category filter buttons */}
      <div className="flex flex-wrap gap-2.5 pb-8 justify-center max-w-full mx-auto">
        <button
          onClick={() => setCurrentFilter('all')}
          className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-all duration-300 ${
            currentFilter === 'all'
              ? 'bg-rose-500 text-white shadow-md shadow-rose-500/25'
              : isDarkTheme
                ? 'bg-slate-900 border-slate-700 text-slate-400 hover:bg-rose-950/30 hover:border-rose-300'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-rose-50 hover:border-rose-300'
          } border`}
        >
          ✨ All Systems
        </button>
        {categoriesData.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCurrentFilter(cat.slug)}
            className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-all duration-300 ${
              currentFilter === cat.slug
                ? 'bg-rose-500 text-white shadow-md shadow-rose-500/25'
                : isDarkTheme
                  ? 'bg-slate-900 border-slate-700 text-slate-400 hover:bg-rose-950/30 hover:border-rose-300'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-rose-50 hover:border-rose-300'
            } border`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Main content */}
      {categoriesData.length === 0 ? (
        <div className={`text-center py-16 rounded-2xl backdrop-blur-sm border transition-colors duration-300 ${
          isDarkTheme
            ? 'bg-slate-900/50 border-slate-800'
            : 'bg-white/50 border-slate-200'
        }`}>
          <Fa.FaTimesCircle className="w-12 h-12 text-rose-400 mx-auto mb-4" aria-hidden="true" />
          <h3 className={`text-lg font-semibold mb-1 transition-colors duration-300 ${
            isDarkTheme ? 'text-slate-300' : 'text-slate-700'
          }`}>
            No systems found
          </h3>
          <p className={`text-sm transition-colors duration-300 ${
            isDarkTheme ? 'text-slate-500' : 'text-slate-500'
          }`}>
            Adjust your search or clear filters to explore the hub
          </p>
        </div>
      ) : (
        categoriesData.map((cat, catIdx) => (
          <div key={cat.id} className="mb-10 animate-fade-in-up" style={{ animationDelay: `${catIdx * 0.07}s` }}>
            {/* Category header */}
            <div className="flex items-center gap-3 mb-2">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shadow-sm"
                style={{ background: `${cat.colorHex}20` }}
              >
                {renderIcon(cat.iconName, 'w-7 h-7', cat.colorHex)}
              </div>
              <div>
                <h2 className={`text-lg font-bold tracking-tight transition-colors duration-300 ${
                  isDarkTheme ? 'text-white' : 'text-slate-800'
                }`}>
                  {cat.name}
                </h2>
              </div>
            </div>

            {isGridView ? (
              // GRID LAYOUT
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {cat.links.map((link) => {
                  const isInternal = link.name === 'Cause List' || link.name === 'Case Details';
                  const href = isInternal ? (link.name === 'Cause List' ? '../home/cause_list' : '../home/case_details') : link.url;
                  
                  // Use link.id or slug as key
                  const key = link.id || link.slug || `${link.name}-${cat.id}`;

                  const cardContent = (
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${cat.colorHex}15` }}>
                        {renderIcon(link.iconName, 'w-5 h-5', cat.colorHex)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3">
                          <span className={`text-sm font-semibold truncate ${isDarkTheme ? 'text-slate-200 group-hover:text-rose-400' : 'text-slate-800 group-hover:text-rose-600'}`}>
                            {link.name}
                          </span>
                          <div className={`w-2 h-2 rounded-full shrink-0 ${link.status === 'online' ? 'bg-emerald-500' : 'bg-amber-500'} animate-pulse-subtle`} title={link.status} />
                        </div>
                        <p className={`text-xs truncate mt-0.5 ${isDarkTheme ? 'text-slate-500 group-hover:text-slate-400' : 'text-slate-500 group-hover:text-slate-700'}`}>
                          {link.desc}
                        </p>
                      </div>
                      <Fa.FaArrowRight className={`w-3 h-3 transition-all shrink-0 mt-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${isDarkTheme ? 'text-slate-400 group-hover:text-rose-400' : 'text-slate-400 group-hover:text-rose-500'}`} />
                    </div>
                  );

                  return isInternal ? (
                    <Link
                      key={key}
                      href={href}
                      className={`group block rounded-lg py-4 px-4 border transition-all duration-300 hover:-translate-y-1 ${
                        isDarkTheme
                          ? 'bg-slate-900 border-slate-800 hover:border-rose-500 hover:shadow-xl hover:shadow-rose-500/10'
                          : 'bg-white border-slate-300 hover:border-rose-400 hover:shadow-xl hover:shadow-rose-500/10'
                      }`}
                    >
                      {cardContent}
                    </Link>
                  ) : (
                    <a
                      key={key}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`group block rounded-lg py-4 px-4 border transition-all duration-300 hover:-translate-y-1 ${
                        isDarkTheme
                          ? 'bg-slate-900 border-slate-800 hover:border-rose-500 hover:shadow-xl hover:shadow-rose-500/10'
                          : 'bg-white border-slate-300 hover:border-rose-400 hover:shadow-xl hover:shadow-rose-500/10'
                      }`}
                    >
                      {cardContent}
                    </a>
                  );
                })}
              </div>
            ) : (
              // LIST LAYOUT
              <div className={`rounded-2xl overflow-hidden backdrop-blur-sm border transition-colors duration-300 ${
                isDarkTheme ? 'bg-slate-900/70 border-slate-800' : 'bg-white/70 border-slate-200'
              }`}>
                {cat.links.map((link, idx) => {
                  const isInternal = link.name === 'Cause List' || link.name === 'Case Details';
                  const href = isInternal ? (link.name === 'Cause List' ? '../home/cause_list' : '../home/case_details') : link.url;
                  
                  // Use link.id or slug as key
                  const key = link.id || link.slug || `${link.name}-${cat.id}-${idx}`;

                  const listContent = (
                    <>
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${cat.colorHex}15` }}>
                        {renderIcon(link.iconName, 'w-4 h-4', cat.colorHex)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-sm font-semibold ${isDarkTheme ? 'text-slate-200 group-hover:text-rose-400' : 'text-slate-800 group-hover:text-rose-600'}`}>
                            {link.name}
                          </span>
                          <div className={`w-2 h-2 rounded-full ${link.status === 'online' ? 'bg-emerald-500' : 'bg-amber-500'} animate-pulse-subtle`} />
                        </div>
                        <p className={`text-xs truncate ${isDarkTheme ? 'text-slate-500 group-hover:text-slate-400' : 'text-slate-500 group-hover:text-slate-700'}`}>
                          {link.desc}
                        </p>
                      </div>
                      <Fa.FaArrowRight className={`w-3 h-3 transition-all shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${isDarkTheme ? 'text-slate-400 group-hover:text-rose-400' : 'text-slate-400 group-hover:text-rose-500'}`} />
                    </>
                  );

                  return isInternal ? (
                    <Link
                      key={key}
                      href={href}
                      className={`group flex items-center gap-4 px-5 py-3.5 transition-all duration-300 ${
                        isDarkTheme ? 'hover:bg-rose-950/20' : 'hover:bg-rose-50'
                      } ${idx !== cat.links.length - 1 ? (isDarkTheme ? 'border-b border-slate-800' : 'border-b border-slate-200') : ''}`}
                    >
                      {listContent}
                    </Link>
                  ) : (
                    <a
                      key={key}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`group flex items-center gap-4 px-5 py-3.5 transition-all duration-300 ${
                        isDarkTheme ? 'hover:bg-rose-950/20' : 'hover:bg-rose-50'
                      } ${idx !== cat.links.length - 1 ? (isDarkTheme ? 'border-b border-slate-800' : 'border-b border-slate-200') : ''}`}
                    >
                      {listContent}
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        ))
      )}
    </section>
  );
}