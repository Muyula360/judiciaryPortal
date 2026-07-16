'use client';

import * as Fa from 'react-icons/fa';

interface FormTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isDarkTheme: boolean;
  onTabChange: () => void;
}

export default function FormTabs({
  activeTab,
  setActiveTab,
  isDarkTheme,
  onTabChange,
}: FormTabsProps) {
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    onTabChange();
  };

  return (
    <div className="flex gap-8 justify-center">
      <button
        type="button"
        onClick={() => handleTabChange('caseNumber')}
        className={`relative pb-2.5 text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
          activeTab === 'caseNumber'
            ? isDarkTheme
              ? 'text-red-500 border-b-2 border-red-500'
              : 'text-red-600 border-b-2 border-red-500'
            : isDarkTheme
              ? 'text-slate-400 hover:text-slate-200'
              : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        <Fa.FaHashtag className="w-4 h-4" />
        Find by Case Number
      </button>
      <button
        type="button"
        onClick={() => handleTabChange('referenceNumber')}
        className={`relative pb-2.5 text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
          activeTab === 'referenceNumber'
            ? isDarkTheme
              ? 'text-red-500 border-b-2 border-red-500'
              : 'text-red-600 border-b-2 border-red-500'
            : isDarkTheme
              ? 'text-slate-400 hover:text-slate-200'
              : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        <Fa.FaFileAlt className="w-4 h-4" />
        Find by Reference No
      </button>
    </div>
  );
}