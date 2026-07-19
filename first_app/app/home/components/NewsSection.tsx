// app/home/components/NewsSection.tsx
'use client';

import * as Fa from 'react-icons/fa';
import Link from 'next/link';
import { useNews } from '@/hooks/useNews';

interface NewsSectionProps {
  isDarkTheme?: boolean;
  limit?: number;
}

export default function NewsSection({ isDarkTheme = false, limit = 5 }: NewsSectionProps) {
  const { news, loading, error, fetchNews } = useNews({ limit });

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'N/A';
      return date.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return 'N/A';
    }
  };

  const stripHtml = (html: string) => {
    if (!html) return '';
    try {
      const tmp = document.createElement('div');
      tmp.innerHTML = html;
      return tmp.textContent || tmp.innerText || '';
    } catch {
      return html;
    }
  };

  const truncateText = (text: string, maxLength: number = 100) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <div className="w-full rounded-lg py-6">
        {/* Section Title Skeleton */}
        <div className="mb-6 text-center">
          <div className={`h-8 w-48 rounded animate-pulse mx-auto ${isDarkTheme ? 'bg-slate-700' : 'bg-gray-200'}`}></div>
          <div className={`h-4 w-64 rounded animate-pulse mt-2 mx-auto ${isDarkTheme ? 'bg-slate-700' : 'bg-gray-200'}`}></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={`rounded-xl overflow-hidden border ${isDarkTheme ? 'border-slate-700' : 'border-slate-200'}`}>
              <div className={`h-48 w-full animate-pulse ${isDarkTheme ? 'bg-slate-700' : 'bg-gray-200'}`} />
              <div className="p-4 space-y-3">
                <div className={`h-4 w-3/4 rounded animate-pulse ${isDarkTheme ? 'bg-slate-700' : 'bg-gray-200'}`} />
                <div className={`h-3 w-full rounded animate-pulse ${isDarkTheme ? 'bg-slate-700' : 'bg-gray-200'}`} />
                <div className={`h-3 w-2/3 rounded animate-pulse ${isDarkTheme ? 'bg-slate-700' : 'bg-gray-200'}`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`w-full rounded-xl p-8 text-center ${isDarkTheme ? 'bg-slate-900/50 border-slate-700' : 'bg-white/80 border-slate-200'} border`}>
        <Fa.FaExclamationTriangle className="w-10 h-10 text-amber-400 mx-auto mb-3" />
        <p className={`text-sm ${isDarkTheme ? 'text-slate-400' : 'text-slate-600'}`}>
          {error}
        </p>
        <button
          onClick={() => fetchNews()}
          className="mt-3 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm transition-all"
        >
          Retry
        </button>
      </div>
    );
  }

  if (news.length === 0) {
    return (
      <div className={`w-full rounded-xl p-8 text-center ${isDarkTheme ? 'bg-slate-900/50 border-slate-700' : 'bg-white/80 border-slate-200'} border`}>
        <Fa.FaNewspaper className="w-10 h-10 text-slate-400 mx-auto mb-3" />
        <p className={`text-sm ${isDarkTheme ? 'text-slate-400' : 'text-slate-600'}`}>
          No news available at the moment
        </p>
        <button
          onClick={() => fetchNews()}
          className="mt-3 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm transition-all"
        >
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div className="w-full rounded-md py-6 mb-10">
      {/* Section Title */}
      <div className="mb-6 text-center">
        <h2 className={`text-2xl md:text-3xl font-bold flex items-center justify-center gap-2 ${isDarkTheme ? 'text-white' : 'text-white'}`}>
          <Fa.FaNewspaper className="text-red-500" />
          Latest News & Updates
        </h2>
        <p className={`text-sm md:text-base ${isDarkTheme ? 'text-slate-400' : 'text-gray-500'} mt-1`}>
          Stay informed with the latest news and announcements from the Judiciary
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6">
        {news.map((item) => {
          const imageUrl = item.coverPhotoPath
            ? `https://www.judiciary.go.tz/${item.coverPhotoPath}`
            : null;
          const cleanDesc = stripHtml(item.newsDesc);
          const truncatedDesc = truncateText(cleanDesc, 100);

          return (
            <div
              key={item.newsupdatesID}
              className={`group rounded-md overflow-hidden border transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${
                isDarkTheme
                  ? 'bg-slate-800/50 border-slate-700 hover:border-red-500 hover:shadow-red-500/10'
                  : 'bg-white border-slate-200 hover:border-red-400 hover:shadow-red-500/10'
              }`}
            >
              <Link
                href={{
                  pathname: 'https://www.judiciary.go.tz/newsupdates',
                }}
                target="_blank"
                className="block"
              >
                <div className="relative h-48 w-full overflow-hidden bg-slate-200 dark:bg-slate-700">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={item.newsTitle}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Fa.FaImage className="w-12 h-12 text-slate-400 dark:text-slate-500" />
                    </div>
                  )}
                  {/* Date Badge */}
                  <div className={`absolute bottom-3 right-3 px-3 py-1.5 rounded-md text-xs font-medium backdrop-blur-sm ${
                    isDarkTheme
                      ? 'bg-slate-900/80 text-slate-200'
                      : 'bg-white/80 text-slate-700'
                  }`}>
                    <Fa.FaCalendarAlt className="inline mr-1.5 w-3 h-3" />
                    {formatDate(item.postedAt)}
                  </div>
                  {/* Read More Badge */}
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md text-xs font-medium bg-red-500 text-white">
                    <Fa.FaExternalLinkAlt className="inline mr-1 w-3 h-3" />
                    Read More
                  </div>
                </div>

                <div className="p-4">
                  <h4 className={`text-sm font-semibold line-clamp-2 mb-2 transition-colors ${
                    isDarkTheme
                      ? 'text-slate-200 group-hover:text-red-400'
                      : 'text-slate-800 group-hover:text-red-600'
                  }`}>
                    {item.newsTitle}
                  </h4>
                  <p className={`text-xs line-clamp-2 transition-colors ${
                    isDarkTheme
                      ? 'text-slate-400 group-hover:text-slate-300'
                      : 'text-slate-600 group-hover:text-slate-800'
                  }`}>
                    {truncatedDesc}
                  </p>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}