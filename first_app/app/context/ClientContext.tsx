'use client';

import { useTheme } from '@/app/context/ThemeContext';
import Heading from '../home/components/Header';
import HeroSection from '../home/components/HeroSection';
import Footer from '../home/components/Footer';

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const { 
    isDarkTheme,  
    toggleTheme 
  } = useTheme();

  return (
    <div className="relative min-h-screen">
      {/* Fixed Background - Stays in place */}
      <div className="fixed inset-0 z-0">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/jot_building.jpeg')" }}
        />
        {/* Overlay */}
        <div className={`absolute inset-0 transition-opacity duration-300 ${
          isDarkTheme 
            ? 'bg-sky-900/90' 
            : 'bg-slate-800/80'
        }`} />
        {/* Grid Pattern */}
        <div className={`absolute inset-0 pointer-events-none bg-grid-pattern ${isDarkTheme ? 'opacity-10' : 'opacity-30'}`} />
      </div>

      {/* Scrollable Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header - Sticky */}
        <div className="sticky top-0 z-20">
          <Heading
            isDarkTheme={isDarkTheme}
            toggleTheme={toggleTheme}
          />
        </div>

        {/* Main Content - Scrollable */}
        <div className="flex-grow">
          <HeroSection isDarkTheme={isDarkTheme} />
          <main className="pb-0">
            {children}
          </main>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}