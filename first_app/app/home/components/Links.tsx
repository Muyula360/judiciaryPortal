'use client';

import { useTheme } from '@/app/context/ThemeContext';
import SideLinks from './SideLink';
import JudiciaryTips from './JudiciaryTips';

export default function CardLinks() {
  const { isDarkTheme } = useTheme();

  return (
    <div className="flex-grow px-5 sm:px-20 md:px-30 lg:px-40 xl:px-50 2xl:px-60 pt-6 sm:pt-8 md:pt-10 lg:pt-12 pb-3">
      {/* Stack on small screens, side-by-side on large */}
      <div className="flex flex-col lg:flex-row gap-6 md:gap-8 lg:gap-10 xl:gap-12">
        
        {/* Left Column - SideLinks */}
        <div className="w-full lg:w-[50%] xl:w-[50%] 2xl:w-[60%]">
         <SideLinks 
            isDarkTheme={isDarkTheme} 
            maxHeight="h-[400px]" 
            />
        </div>

        {/* Right Column - JudiciaryTips */}
        <div className="w-full lg:w-[50%] xl:w-[50%] 2xl:w-[40%]">
          <JudiciaryTips 
            isDarkTheme={isDarkTheme} 
          />
        </div>
      </div>
    </div>
  );
}