'use client';

import { useState, useMemo } from 'react';
import * as Fa from 'react-icons/fa';
import { useCategories } from '@/hooks/useCategories';
import { useTheme } from '@/app/context/ThemeContext';
import HomeLink from './HomeLink';

export default function SystemsHubContent() {
  const { isDarkTheme } = useTheme();
  const [currentFilter, setCurrentFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isGridView, setIsGridView] = useState(true);

  const { data: categories, isLoading, error } = useCategories();

  // Client‑side filtering
  const filteredCategories = useMemo(() => {
    if (!categories) return [];

    let filtered = [...categories];

    if (currentFilter !== 'all') {
      filtered = filtered.filter((cat) => cat.slug === currentFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered
        .map((cat) => ({
          ...cat,
          links: cat.links.filter(
            (link) =>
              link.name.toLowerCase().includes(q) ||
              (link.desc && link.desc.toLowerCase().includes(q))
          ),
        }))
        .filter((cat) => cat.links.length > 0);
    }

    return filtered;
  }, [categories, currentFilter, searchQuery]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-rose-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <Fa.FaExclamationTriangle className="w-12 h-12 text-rose-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">
          Failed to load systems
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Please try again later.
        </p>
      </div>
    );
  }

  return (
    <HomeLink
      categoriesData={filteredCategories}
      currentFilter={currentFilter}
      setCurrentFilter={setCurrentFilter}
      isDarkTheme={isDarkTheme}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      isGridView={isGridView}
      setIsGridView={setIsGridView}
    />
  );
}