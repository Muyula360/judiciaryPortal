
import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import api from '@/lib/api';
import { AxiosResponse } from 'axios';

export interface LinkData {
  id: number;
  slug: string;
  name: string;
  url: string;
  desc: string;
  iconName: string;
  status: 'online' | 'degraded';
  permit: 'internal' | 'external';
  categoryId: number;
  category?: {
    id: number;
    slug: string;
    name: string;
    iconName: string;
    colorHex: string;
  };
}

export const DEFAULT_LINKS: LinkData[] = [
  {
    id: 0,
    slug: 'cause-list',
    name: 'Cause List',
    url: '/home/cause_list',
    desc: 'View all causes and their details',
    iconName: 'FaClipboardList',
    status: 'online',
    permit: 'internal',
    categoryId: 0,
  },
  {
    id: 0,
    slug: 'case-details',
    name: 'Case Details',
    url: '/home/case_details',
    desc: 'Find case details on your own',
    iconName: 'FaFolderOpen',
    status: 'online',
    permit: 'internal',
    categoryId: 0,
  }
];

interface UseLinksOptions {
  categorySlug?: string;
  limit?: number;
  showExternalOnly?: boolean;
  searchQuery?: string;
}

interface UseLinksReturn {
  links: LinkData[];
  allLinks: LinkData[];
  filteredLinks: LinkData[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  setSearchQuery: (query: string) => void;
  searchQuery: string;
}

interface ApiResponse {
  success: boolean;
  data: LinkData[] | { links: LinkData[] };
  message?: string;
}

export function useLinks({
  categorySlug,
  limit = 10,
  showExternalOnly = true,
  searchQuery: externalSearchQuery = '',
}: UseLinksOptions = {}): UseLinksReturn {
  const [dbLinks, setDbLinks] = useState<LinkData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [internalSearchQuery, setInternalSearchQuery] = useState('');
  
  const searchQuery = externalSearchQuery || internalSearchQuery;

  const fetchLinks = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let response: AxiosResponse<ApiResponse>;
      
      if (categorySlug) {
        response = await api.get<ApiResponse>(`/links/category/${categorySlug}`);
      } else if (showExternalOnly) {
        response = await api.get<ApiResponse>('/links/permit/external');
      } else {
        response = await api.get<ApiResponse>('/links');
      }

      if (!response.data || !response.data.success) {
        throw new Error(response.data?.message || 'Failed to fetch links');
      }

      let linksData: LinkData[] = Array.isArray(response.data.data) ? response.data.data : [];
      
      if (response.data.data && 'links' in response.data.data) {
        linksData = response.data.data.links;
      }

      if (showExternalOnly) {
        linksData = linksData.filter((link: LinkData) => link.permit === 'external');
      }

      const defaultSlugs = DEFAULT_LINKS.map(l => l.slug);
      linksData = linksData.filter((link: LinkData) => !defaultSlugs.includes(link.slug));

      if (limit && linksData.length > limit) {
        linksData = linksData.slice(0, limit);
      }

      setDbLinks(linksData);
    } catch (err: unknown) {
      console.error('Error fetching links:', err);
      const errorMessage = err && typeof err === 'object' && 'response' in err 
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message 
        : err instanceof Error ? err.message : 'Failed to load links';
      setError(errorMessage || 'Failed to load links');
      setDbLinks([]);
    } finally {
      setLoading(false);
    }
  }, [categorySlug, limit, showExternalOnly]);

  const hasFetched = useRef(false);

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchLinks();
    }
  }, [fetchLinks]);

  const allLinks = useMemo(() => [...DEFAULT_LINKS, ...dbLinks], [dbLinks]);

  const filteredLinks = useMemo(() => {
    const search = searchQuery.toLowerCase().trim();
    if (!search) return allLinks;
    
    return allLinks.filter((link: LinkData) => 
      link.name.toLowerCase().includes(search) ||
      link.desc.toLowerCase().includes(search)
    );
  }, [allLinks, searchQuery]);

  const refetch = useCallback(() => {
    hasFetched.current = false;
    fetchLinks();
  }, [fetchLinks]);

  return {
    links: dbLinks,
    allLinks,
    filteredLinks,
    loading,
    error,
    refetch,
    setSearchQuery: setInternalSearchQuery,
    searchQuery,
  };
}