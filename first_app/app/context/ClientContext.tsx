'use client';

import { useTheme } from '@/app/context/ThemeContext';
import Heading from '../home/components/Header';
import HeroSection from '../home/components/HeroSection';
import Footer from '../home/components/Footer';

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const { 
    isDarkTheme, 
    searchQuery, 
    setSearchQuery, 
    isGridView, 
    setIsGridView, 
    toggleTheme 
  } = useTheme();

  return (
    <div className="relative min-h-screen transition-colors duration-300">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className={`absolute w-[550px] h-[550px] rounded-full blur-[100px] -top-20 -left-20 animate-float ${isDarkTheme ? 'bg-rose-500/5' : 'bg-rose-200/30'}`} />
        <div className={`absolute w-[380px] h-[380px] rounded-full blur-[100px] bottom-10 -right-20 animate-float-delayed ${isDarkTheme ? 'bg-organge-500/5' : 'bg-orange-200/30'}`} />
        <div className={`absolute w-[280px] h-[280px] rounded-full blur-[100px] top-1/3 left-1/2 animate-float-slow ${isDarkTheme ? 'bg-amber-500/5' : 'bg-amber-200/30'}`} />
      </div>
      <div className={`fixed inset-0 pointer-events-none bg-grid-pattern ${isDarkTheme ? 'opacity-10' : 'opacity-30'}`} />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Heading
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          isDarkTheme={isDarkTheme}
          toggleTheme={toggleTheme}
        />
        <div className="relative flex-grow">
          <div 
            className="absolute inset-0 bg-cover bg-top bg-no-repeat pointer-events-none"
            style={{ backgroundImage: "url('/jot_building.jpeg')" }}
          />
          <div className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${
            isDarkTheme 
              ? 'bg-sky-900/90' 
              : 'bg-slate-800/80'
          }`} />
          <div className="relative z-10">
            <HeroSection isDarkTheme={isDarkTheme} />
            <main className="pb-0">
              {children}
            </main>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}