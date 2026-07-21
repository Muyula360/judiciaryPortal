'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';

interface ThemeContextType {
  isDarkTheme: boolean;
  toggleTheme: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isGridView: boolean;
  setIsGridView: (value: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isGridView, setIsGridView] = useState(true);
  const [mounted, setMounted] = useState(false);
  
  const isInitialized = useRef(false);

  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    // Check localStorage for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    
    // Check system preference if no saved preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Determine initial theme
    let initialTheme = false; // default to light
    if (savedTheme === 'dark') {
      initialTheme = true;
    } else if (savedTheme === 'light') {
      initialTheme = false;
    } else if (prefersDark) {
      initialTheme = true;
    }
    
    // Apply theme to document
    if (initialTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
    
    setIsDarkTheme(initialTheme);
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setIsDarkTheme(prev => {
      const newTheme = !prev;
      if (newTheme) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
      return newTheme;
    });
  };

  if (!mounted) return null;

  return (
    <ThemeContext.Provider value={{
      isDarkTheme,
      toggleTheme,
      searchQuery,
      setSearchQuery,
      isGridView,
      setIsGridView,
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}