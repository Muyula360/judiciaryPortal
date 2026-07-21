'use client';

import { useTheme } from '@/app/context/ThemeContext';
import Heading from '../staff_portal/components/Header';
import StaffSection from '../staff_portal/components/HeroSection';
import Footer from '../staff_portal/components/Footer';

export default function StaffWrapper({ children }: { children: React.ReactNode }) {
  const { 
    isDarkTheme, 
    searchQuery, 
    setSearchQuery, 
    isGridView, 
    setIsGridView, 
    toggleTheme 
  } = useTheme();

  return (
    <div className={`relative min-h-screen transition-colors duration-300 ${isDarkTheme ? 'bg-gradient-to-br from-slate-950 to-slate-900' : 'bg-gradient-to-br from-slate-50 to-white'}`}>
      {/* Background decorative elements - these stay fixed in background */}
      
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className={`absolute w-[550px] h-[550px] rounded-full blur-[100px] -top-20 -left-20 animate-float ${isDarkTheme ? 'bg-rose-500/5' : 'bg-rose-200/30'}`} />
        <div className={`absolute w-[380px] h-[380px] rounded-full blur-[100px] bottom-10 -right-20 animate-float-delayed ${isDarkTheme ? 'bg-orange-500/5' : 'bg-orange-200/30'}`} />
        <div className={`absolute w-[280px] h-[280px] rounded-full blur-[100px] top-1/3 left-1/2 animate-float-slow ${isDarkTheme ? 'bg-amber-500/5' : 'bg-amber-200/30'}`} />
      </div>
      
      <div className={`fixed inset-0 pointer-events-none bg-grid-pattern ${isDarkTheme ? 'opacity-10' : 'opacity-30'}`} />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Heading
          isDarkTheme={isDarkTheme}
          toggleTheme={toggleTheme}
        />
        
        <StaffSection isDarkTheme={isDarkTheme} />
        <main className="flex-grow pb-0">
          {children}
        </main>
        
        <Footer />
      </div>
    </div>
  );
}