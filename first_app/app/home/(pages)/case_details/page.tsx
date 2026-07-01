// app/case-details/page.tsx
'use client';
import { useState } from 'react';
import * as Fa from 'react-icons/fa';
import { useTheme } from '@/app/context/ThemeContext';
import Link from 'next/link';
import PrimaryCourtSection from './Component/primaryCourtSection';
import OtherCourtSection from './Component/otherCourtSection';
import ByRefNoSection from './Component/byRefNoSection';

export default function CaseDetailsPage() {
    const { isDarkTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('primary');

  const renderPrimaryCourt = () => (
    <PrimaryCourtSection />
  );
  const renderOtherCourts = () => (
    <OtherCourtSection />
  );
  const renderByReferenceNumber = () => (
    <ByRefNoSection />
  );
  return (
    <div className="flex-grow px-4 sm:px-6 lg:px-28 pt-6 pb-2">
      <div className="max-w-full mx-auto">
        <div className="mb-0">
          <div className="flex items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-3">
              <Fa.FaGavel className={`w-5 h-5 ${isDarkTheme ? 'text-rose-400' : 'text-rose-600'}`} />
              <h1 className={`text-xl md:text-xl font-bold ${isDarkTheme ? 'text-white' : 'text-slate-900'}`}>
                Case Details
              </h1>
            </div>
            <Link 
              href='/' 
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                isDarkTheme
                  ? 'bg-slate-700 hover:bg-rose-200 text-white hover:text-slate-900'
                  : 'bg-slate-200 hover:bg-rose-200 text-slate-700 hover:text-slate-900'
              }`}
            >
              <Fa.FaArrowLeft />Back to Portal
            </Link>
          </div>
        </div>
        
        <div className="mb-5">
          <div className={`flex gap-2 justify-center border-b ${isDarkTheme ? 'border-slate-700' : 'border-slate-200'} flex-wrap`}>
            <button
              onClick={() => setActiveTab('primary')}
              className={`px-6 py-3 text-md font-medium transition-all duration-300 flex items-center gap-2 ${
                activeTab === 'primary'
                  ? `border-b-2 border-rose-500 ${isDarkTheme ? 'text-rose-400' : 'text-rose-600'}`
                  : `${isDarkTheme ? 'text-slate-400 hover:text-slate-300' : 'text-slate-600 hover:text-slate-900'}`
              }`}
            >
              <Fa.FaBalanceScale />
              Case From Primary Court
            </button>
            <button
              onClick={() => setActiveTab('other')}
              className={`px-6 py-3 text-md font-medium transition-all duration-300 flex items-center gap-2 ${
                activeTab === 'other'
                  ? `border-b-2 border-rose-500 ${isDarkTheme ? 'text-rose-400' : 'text-rose-600'}`
                  : `${isDarkTheme ? 'text-slate-400 hover:text-slate-300' : 'text-slate-600 hover:text-slate-900'}`
              }`}
            >
              <Fa.FaBalanceScale />
              Case From Other Courts
            </button>
            <button
              onClick={() => setActiveTab('ref_no')}
              className={`px-6 py-3 text-md font-medium transition-all duration-300 flex items-center gap-2 ${
                activeTab === 'ref_no'
                  ? `border-b-2 border-rose-500 ${isDarkTheme ? 'text-rose-400' : 'text-rose-600'}`
                  : `${isDarkTheme ? 'text-slate-400 hover:text-slate-300' : 'text-slate-600 hover:text-slate-900'}`
              }`}
            >
              <Fa.FaBalanceScale />
              Search Case by Reference Number
            </button>
          </div>
        </div>
        
        <div className={`rounded-xl p-6 backdrop-blur-sm border transition-colors duration-300 ${isDarkTheme ? 'bg-slate-900/50 border-slate-800' : 'bg-white/50 border-slate-200' }`}>
          {activeTab === 'primary' && renderPrimaryCourt()}
          {activeTab === 'other' && renderOtherCourts()}
          {activeTab === 'ref_no' && renderByReferenceNumber()}
        </div>
      </div>
    </div>
  );
}