// app/hooks/useLinks.ts
import { useState, useEffect, useMemo } from 'react';
import api from '@/lib/api';

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
  },
  {
    id: 0,
    slug: 'home',
    name: 'Home',
    url: '/home',
    desc: 'Judicial Portal landing home',
    iconName: 'FaHome',
    status: 'online',
    permit: 'internal',
    categoryId: 0,
  },
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
  
  // Use external search query if provided, otherwise use internal
  const searchQuery = externalSearchQuery || internalSearchQuery;

  const fetchLinks = async () => {
    try {
      setLoading(true);
      setError(null);

      let response;
      
      if (categorySlug) {
        response = await api.get(`/links/category/${categorySlug}`);
      } else if (showExternalOnly) {
        response = await api.get('/links/permit/external');
      } else {
        response = await api.get('/links');
      }

      // Check if response is successful
      if (!response.data || !response.data.success) {
        throw new Error(response.data?.message || 'Failed to fetch links');
      }

      let linksData = Array.isArray(response.data.data) ? response.data.data : [];
      
      if (response.data.data && response.data.data.links) {
        linksData = response.data.data.links;
      }

      // Filter to only show external links if requested (additional safety)
      if (showExternalOnly) {
        linksData = linksData.filter(link => link.permit === 'external');
      }

      // Remove default links that might come from DB
      const defaultSlugs = DEFAULT_LINKS.map(l => l.slug);
      linksData = linksData.filter(link => !defaultSlugs.includes(link.slug));

      // Apply limit
      if (limit && linksData.length > limit) {
        linksData = linksData.slice(0, limit);
      }

      setDbLinks(linksData);
    } catch (err: any) {
      console.error('Error fetching links:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load links');
      setDbLinks([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch on mount and when dependencies change
  useEffect(() => {
    fetchLinks();
  }, [categorySlug, limit, showExternalOnly]);

  // Combine default links with DB links
  const allLinks = useMemo(() => [...DEFAULT_LINKS, ...dbLinks], [dbLinks]);

  // Filter links based on search query
  const filteredLinks = useMemo(() => {
    const search = searchQuery.toLowerCase().trim();
    if (!search) return allLinks;
    
    return allLinks.filter(link => 
      link.name.toLowerCase().includes(search) ||
      link.desc.toLowerCase().includes(search)
    );
  }, [allLinks, searchQuery]);

  // Refetch function
  const refetch = () => {
    fetchLinks();
  };

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