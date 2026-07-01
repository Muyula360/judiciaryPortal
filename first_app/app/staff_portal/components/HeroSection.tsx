'use client';

interface StaffSectionProps {
  isDarkTheme: boolean;
}

export default function StaffSection({ isDarkTheme }: StaffSectionProps) {
  return (
    <section className="relative px-4 sm:px-6 lg:px-8 py-6 bg-cover bg-center bg-no-repeat overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-bottom bg-no-repeat opacity-40" style={{backgroundImage: "url('/jot_building.jpeg')",}}/>
      <div className="absolute inset-0 bg-gradient-to-r from-sky-500/50 via-transparent to-sky-500/50" />
      <div className="relative flex items-center justify-center gap-4 md:gap-8 lg:gap-20 z-10">
        <div className="hidden sm:block w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 relative">
          <img src="/emblem.png" alt="Court Symbol" className="w-full h-full object-contain drop-shadow-lg"/>
        </div>
        <div className="text-center">
          <h1 className={`text-2xl sm:text-2xl md:text-3xl font-extrabold transition-colors duration-300 pt-3 ${isDarkTheme ? 'text-white' : 'text-slate-900'}`}> THE JUDICIARY OF TANZANIA </h1>
          <h1 className={`text-xl sm:text-2xl md:text-2xl font-extrabold transition-colors duration-300 mt-0 ${isDarkTheme ? 'text-white' : 'text-slate-900'}`}>
            <span className="bg-gradient-to-r from-rose-500 to-orange-500 bg-clip-text text-transparent"> e-SERVICE PORTAL</span>
          </h1>
        </div>
        <div className="hidden sm:block w-13 h-13 md:w-17 md:h-17 lg:w-21 lg:h-21 relative">
          <img src="/judiciary_logo.png" alt="Justice Symbol" className="w-full h-full object-contain drop-shadow-lg" />
        </div>
      </div>
    </section>
  );
}