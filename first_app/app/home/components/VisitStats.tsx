'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import * as Fa from 'react-icons/fa';
import { useTheme } from '@/app/context/ThemeContext';
import api from '@/lib/api';

// ✅ Define proper type for stats
interface VisitStatsData {
  daily: number;
  weekly: number;
  monthly: number;
  yearly: number;
  total: number;
  lastUpdated?: string;
}

interface SummaryStat {
  id: number;
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}

export default function VisitsAnalytics() {
  const { isDarkTheme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<VisitStatsData | null>(null); // ✅ Fixed any type
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // ✅ Use ref to prevent multiple initial fetches
  const hasFetched = useRef(false);

  // Fetch stats from API
  const fetchStats = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      setRefreshing(true);
      const response = await api.get('/visits/stats');
      if (response.data.success) {
        setStats(response.data.data);
        setError(null);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError('Failed to load statistics');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // ✅ Initial fetch with ref guard
  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchStats(true);
    }
  }, [fetchStats]);

  // Listen for visit tracking events
  useEffect(() => {
    const handleVisitTracked = () => {
      fetchStats(false);
    };

    window.addEventListener('visitTracked', handleVisitTracked);

    return () => {
      window.removeEventListener('visitTracked', handleVisitTracked);
    };
  }, [fetchStats]);

  const summaryStats: SummaryStat[] = useMemo(() => {
    if (!stats) {
      return [
        { id: 1, title: 'Today Visits', value: '0', icon: <Fa.FaSun className="w-4 h-4" />, color: 'yellow' },
        { id: 2, title: 'This Week', value: '0', icon: <Fa.FaCalendarWeek className="w-4 h-4" />, color: 'blue' },
        { id: 3, title: 'This Month', value: '0', icon: <Fa.FaCalendarAlt className="w-4 h-4" />, color: 'green' },
        { id: 4, title: 'This Year', value: '0', icon: <Fa.FaCalendar className="w-4 h-4" />, color: 'purple' },
      ];
    }

    return [
      { id: 1, title: 'Today Visits', value: stats.daily?.toLocaleString() || '0', icon: <Fa.FaSun className="w-4 h-4" />, color: 'yellow' },
      { id: 2, title: 'This Week', value: stats.weekly?.toLocaleString() || '0', icon: <Fa.FaCalendarWeek className="w-4 h-4" />, color: 'blue' },
      { id: 3, title: 'This Month', value: stats.monthly?.toLocaleString() || '0', icon: <Fa.FaCalendarAlt className="w-4 h-4" />, color: 'green' },
      { id: 4, title: 'This Year', value: stats.yearly?.toLocaleString() || '0', icon: <Fa.FaCalendar className="w-4 h-4" />, color: 'purple' },
    ];
  }, [stats]);

  const getColorClasses = (color: string) => {
    const colors: Record<string, string> = {
      yellow: isDarkTheme ? 'text-yellow-400' : 'text-yellow-500',
      blue: isDarkTheme ? 'text-blue-400' : 'text-blue-500',
      green: isDarkTheme ? 'text-green-400' : 'text-green-500',
      purple: isDarkTheme ? 'text-purple-400' : 'text-purple-500',
    };
    return colors[color] || colors.blue;
  };

  const handleRefresh = () => {
    fetchStats(false);
  };

  if (loading) {
    return (
      <div className="mb-10 py-8">
        <div className="mb-6 text-center">
          <div className={`h-8 w-48 rounded animate-pulse mx-auto ${isDarkTheme ? 'bg-slate-700' : 'bg-gray-300'}`}></div>
          <div className={`h-4 w-64 rounded animate-pulse mt-2 mx-auto ${isDarkTheme ? 'bg-slate-700' : 'bg-gray-300'}`}></div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 px-4 sm:px-6 md:px-10 lg:px-20 xl:px-32">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse text-center">
              <div className={`h-6 w-12 rounded mx-auto ${isDarkTheme ? 'bg-slate-700' : 'bg-gray-300'}`}></div>
              <div className={`h-10 w-16 rounded mx-auto mt-2 ${isDarkTheme ? 'bg-slate-700' : 'bg-gray-300'}`}></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-10 py-8">
        <div className="mb-6 text-center">
          <h2 className={`text-2xl md:text-3xl font-bold ${isDarkTheme ? 'text-white' : 'text-white'}`}>
            📊 Visits Statistics
          </h2>
          <p className={`text-sm md:text-base ${isDarkTheme ? 'text-slate-400' : 'text-gray-500'} mt-1`}>
            Real-time analytics and visitor insights
          </p>
        </div>
        <div className="text-center py-8">
          <Fa.FaExclamationTriangle className={`w-8 h-8 mx-auto mb-2 ${isDarkTheme ? 'text-yellow-500' : 'text-yellow-600'}`} />
          <p className={`text-sm ${isDarkTheme ? 'text-slate-400' : 'text-gray-600'}`}>
            {error}
          </p>
          <button
            onClick={handleRefresh}
            className="mt-3 px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg text-sm transition-all"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-10 py-8 relative">
      {refreshing && (
        <div className="absolute top-0 right-4">
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-rose-500 border-t-transparent"></div>
        </div>
      )}
      <div className="mb-8 text-center">
        <h2 className={`text-2xl md:text-3xl font-bold ${isDarkTheme ? 'text-white' : 'text-white'}`}>
          📊 Visits Statistics
        </h2>
        <p className={`text-sm md:text-base ${isDarkTheme ? 'text-slate-400' : 'text-gray-500'} mt-1`}>
          Real-time analytics and visitor insights
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 md:gap-8 px-4 sm:px-6 md:px-10 lg:px-20 xl:px-32 2xl:px-48">
        {summaryStats.map((stat) => {
          const color = getColorClasses(stat.color);
          return (
            <div 
              key={stat.id} 
              className="text-center transition-all duration-300 hover:scale-105"
            >
              <div className={`flex items-center justify-center gap-1.5 mb-2 ${color}`}>
                <span className="text-base sm:text-lg md:text-xl">{stat.icon}</span>
                <span className={`text-xs sm:text-md font-bold ${isDarkTheme ? 'text-slate-300' : 'text-white'}`}>
                  {stat.title}
                </span>
              </div>
              
              <div className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-mono ${isDarkTheme ? 'text-white' : 'text-white'}`}>
                {stat.value}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}