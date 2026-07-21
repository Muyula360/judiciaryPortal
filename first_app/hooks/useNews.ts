import { useState, useEffect, useCallback, useRef } from 'react';

export interface NewsItem {
  newsupdatesID: string;
  newsTitle: string;
  newsDesc: string;
  postedBy: string;
  worktStation: string;
  postedAt: string;
  coverPhotoPath: string;
  supportingPhotosPaths: string[];
}

interface UseNewsOptions {
  limit?: number;
  autoFetch?: boolean;
}

export function useNews(options: UseNewsOptions = {}) {
  const { limit = 10, autoFetch = true } = options;
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasFetched = useRef(false);

  const fetchNews = useCallback(async () => {
    if (hasFetched.current) return;
    
    setLoading(true);
    setError(null);
    hasFetched.current = true;
    
    try {
      const response = await fetch('/api/news');
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `Failed to fetch news: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data && Array.isArray(data)) {
        const slicedData = data.slice(0, limit);
        setNews(slicedData);
      } else if (data && data.error) {
        throw new Error(data.error);
      } else {
        setNews([]);
        setError('Invalid data format received');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load news');
      setNews([]);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  const getNewsById = useCallback(async (id: string): Promise<NewsItem | null> => {
    try {
      const response = await fetch('/api/news');
      if (!response.ok) {
        throw new Error(`Failed to fetch news: ${response.status}`);
      }
      const data = await response.json();
      return data.find((item: NewsItem) => item.newsupdatesID === id) || null;
    } catch (err) {
      console.error('Error fetching news by ID:', err);
      return null;
    }
  }, []);

  useEffect(() => {
    if (autoFetch && !hasFetched.current) {
      const doFetch = async () => {
        await fetchNews();
      };
      doFetch();
    }
  }, [autoFetch]);

  useEffect(() => {
    let isMounted = true;
    
    if (autoFetch && !hasFetched.current) {
      const fetchData = async () => {
        if (isMounted) {
          await fetchNews();
        }
      };
      fetchData();
    }
    
    return () => {
      isMounted = false;
    };
  }, [autoFetch, fetchNews]);

  return {
    news,
    loading,
    error,
    fetchNews,
    getNewsById,
  };
}