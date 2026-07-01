'use client';

import { Link } from 'lucide-react';
import * as Fa from 'react-icons/fa';

interface HeaderProps {
  isDarkTheme: boolean;
  toggleTheme: () => void;
}

export default function Header({ 
  isDarkTheme, 
  toggleTheme 
}: HeaderProps) {
  return (
    <header className={`sticky top-0 z-20 backdrop-blur-xl border-b transition-colors duration-300 ${isDarkTheme ? 'bg-slate-950 border-slate-800' : 'bg-red-500 border-red-500'}`}>
      <div className="px-4 sm:px-6 lg:px-28 py-1.5">
        <div className="flex flex-wrap items-center gap-3">
        <div className="flex-1 flex-wrap justify-center items-center gap-4 text-sm text-white">
            <span className="inline-flex items-center gap-2 me-5">
              <Fa.FaPhone className="w-4 h-4 text-green-500" />
              Toll-Free: <strong>0800 750 247</strong>
            </span>
            <span className="inline-flex items-center gap-2 me-5">
              <Fa.FaEnvelope className="w-4 h-4 text-green-500" />
              Email: <strong>info@judiciary.go.tz</strong>
            </span>
            <span className="inline-flex items-center gap-2">
              <Fa.FaWhatsapp className="w-4 h-4 text-green-500" />
              WhatsApp: <strong>0752 500 400</strong>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <a className="text-white font-semibold me-5" href='/home/login'>Staff Portal</a>
            <button
              onClick={toggleTheme}
              className={`flex items-center justify-center w-8 h-8 rounded-md transition-all duration-300 shadow-sm ${
                isDarkTheme
                  ? 'bg-slate-900 border-slate-700 hover:border-red-500'
                  : 'bg-white border-slate-200 hover:border-red-400'
              } border`}
            >
              {isDarkTheme ? <Fa.FaSun className="w-3 h-3 text-white" /> : <Fa.FaMoon className="w-3 h-3 text-slate-600" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}