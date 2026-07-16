// app/causelist/components/ResultsModal.tsx
'use client';
import * as Fa from 'react-icons/fa';
import { Case } from '@/types';
import { useState } from 'react';

interface ResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  cases: Case[];
  loading: boolean;
  isDarkTheme: boolean;
  onExcelExport: () => void;
  onPDFExport: () => void;
  onSort: (field: keyof Case) => void;
  sortField: keyof Case;
  sortDirection: 'asc' | 'desc';
  getSortIcon: (field: keyof Case) => React.ReactNode;
  formatDate: (date: string) => string;
  formatTime: (date: string) => string;
  formatYear: (date: string) => string;
}

export default function ResultsModal({
  isOpen,
  onClose,
  cases,
  loading,
  isDarkTheme,
  onExcelExport,
  onPDFExport,
  onSort,
  sortField,
  sortDirection,
  getSortIcon,
  formatDate,
  formatTime,
  formatYear,
}: ResultsModalProps) {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const uniqueCourts = [...new Set(cases.map(c => c.court))];
  const courtName = uniqueCourts.length === 1 ? uniqueCourts[0] : '';

  const getCaseTitle = (caseItem: Case) => {
    return caseItem.caseTitle || `${caseItem.caseNumber}/${caseItem.caseYear}`;
  };

  const getStageColor = (stage: string) => {
    const stageLower = stage?.toLowerCase() || '';
    if (stageLower.includes('mediation')) return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
    if (stageLower.includes('mention')) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
    if (stageLower.includes('hearing')) return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
    if (stageLower.includes('judgment')) return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
    if (stageLower.includes('appeal')) return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
    return 'bg-gray-100 text-gray-800 dark:bg-gray-700/30 dark:text-gray-300';
  };

  // Filter cases based on search term
  const filteredCases = (() => {
    if (!searchTerm.trim()) return cases;
    
    const searchLower = searchTerm.toLowerCase().trim();
    return cases.filter((caseItem) => {
      const caseTitle = getCaseTitle(caseItem).toLowerCase();
      const caseParties = (caseItem.caseParties || '').toLowerCase();
      const judgeName = (caseItem.judgeName || '').toLowerCase();
      const caseStage = (caseItem.nextStage || '').toLowerCase();
      const courtRoom = (caseItem.courtRoomName || '').toLowerCase();
      const caseReference = (caseItem.caseReference || '').toLowerCase();
      const caseNumber = (caseItem.caseNumber || '').toLowerCase();
      
      return (
        caseTitle.includes(searchLower) ||
        caseParties.includes(searchLower) ||
        judgeName.includes(searchLower) ||
        caseStage.includes(searchLower) ||
        courtRoom.includes(searchLower) ||
        caseReference.includes(searchLower) ||
        caseNumber.includes(searchLower)
      );
    });
  })();

  const hasResults = cases.length > 0 && !loading;
  const hasFilteredResults = filteredCases.length > 0 && !loading;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className={`relative w-full max-w-11/12 rounded-lg overflow-hidden ${
        isDarkTheme ? 'bg-slate-900' : 'bg-white'
      } shadow-2xl animate-scale-up`} style={{ height: '70vh' }}>
        {/* Header */}
        <div className={`flex items-center justify-between p-4 border-b ${
          isDarkTheme ? 'border-slate-700' : 'border-gray-200'
        }`}>
          <div className="flex items-center gap-3">
            <Fa.FaClipboardList className={`w-5 h-5 ${isDarkTheme ? 'text-rose-400' : 'text-rose-600'}`} />
            <h2 className={`text-lg font-semibold ${isDarkTheme ? 'text-white' : 'text-slate-900'}`}>
              {courtName ? (
                <span className="text-md uppercase font-bold">
                  {courtName} Cause Lists
                </span>
              ) : (
                <span className="text-md uppercase font-bold">
                  Cause Lists
                </span>
              )}
            </h2>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-all duration-300 ${
              isDarkTheme
                ? 'hover:bg-slate-800 text-slate-400 hover:text-white'
                : 'hover:bg-gray-100 text-slate-600 hover:text-slate-900'
            }`}
          >
            <Fa.FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar & Export Buttons */}
        {!loading && cases.length > 0 && (
          <div className={`p-4 border-b ${isDarkTheme ? 'border-slate-700' : 'border-gray-200'}`}>
            <div className="flex items-center gap-3">
              {/* Search Input */}
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Fa.FaSearch className={`w-4 h-4 ${isDarkTheme ? 'text-slate-400' : 'text-gray-400'}`} />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by case title, parties, judge, stage, court room, or reference..."
                  className={`w-3/5 pl-10 pr-4 py-2 rounded-lg text-sm transition-all duration-300 ${
                  isDarkTheme
                    ? 'bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-rose-500 focus:ring-rose-500/20'
                    : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-rose-400 focus:ring-rose-400/20'
                } border focus:outline-none focus:ring-2`}
                    />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className={`absolute inset-y-0 right-0 pr-3 flex items-center ${
                      isDarkTheme ? 'text-slate-400 hover:text-white' : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    <Fa.FaTimes className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Export Buttons */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={onExcelExport}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                    isDarkTheme
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-green-500 hover:bg-green-600 text-white'
                  }`}
                >
                  <Fa.FaFileExcel className="w-4 h-4" />
                  Export to Excel
                </button>
                <button
                  onClick={onPDFExport}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                    isDarkTheme
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-red-500 hover:bg-red-600 text-white'
                  }`}
                >
                  <Fa.FaFilePdf className="w-4 h-4" />
                  Export to PDF
                </button>
              </div>
            </div>

            {/* Search Results Count */}
            {searchTerm && (
              <div className={`mt-2 text-sm ${isDarkTheme ? 'text-slate-400' : 'text-slate-500'}`}>
                Found {filteredCases.length} case(s) matching "{searchTerm}"
              </div>
            )}
          </div>
        )}

        {/* Modal Body - Fixed Height with Scroll */}
        <div className="p-4 overflow-y-auto" style={{ height: 'calc(70vh - 180px)' }}>
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
            </div>
          ) : cases.length === 0 ? (
            <div className={`text-center py-16 rounded-xl ${isDarkTheme ? 'bg-slate-800/50' : 'bg-gray-50'}`}>
              <Fa.FaTimesCircle className="w-12 h-12 text-rose-400 mx-auto mb-4" />
              <h3 className={`text-lg font-semibold mb-1 ${isDarkTheme ? 'text-slate-300' : 'text-slate-700'}`}>
                No cases found
              </h3>
              <p className={`text-sm ${isDarkTheme ? 'text-slate-500' : 'text-slate-500'}`}>
                Try adjusting your filters and search again
              </p>
            </div>
          ) : filteredCases.length === 0 ? (
            <div className={`text-center py-16 rounded-xl ${isDarkTheme ? 'bg-slate-800/50' : 'bg-gray-50'}`}>
              <Fa.FaSearch className={`w-12 h-12 mx-auto mb-4 ${isDarkTheme ? 'text-slate-500' : 'text-gray-400'}`} />
              <h3 className={`text-lg font-semibold mb-1 ${isDarkTheme ? 'text-slate-300' : 'text-slate-700'}`}>
                No matching cases
              </h3>
              <p className={`text-sm ${isDarkTheme ? 'text-slate-500' : 'text-slate-500'}`}>
                No cases found matching "{searchTerm}"
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className={`w-full rounded-lg overflow-hidden ${isDarkTheme ? 'bg-slate-800/50' : 'bg-white'} border ${isDarkTheme ? 'border-slate-700' : 'border-slate-200'}`}>
              <thead className={`${isDarkTheme ? 'bg-slate-800 text-white' : 'bg-gray-50 text-slate-800'}`}>
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-semibold uppercase cursor-pointer w-[25%] " onClick={() => onSort('caseNumber')}>
                    <div className="flex items-center gap-2">
                      Case Title {getSortIcon('caseNumber')}
                    </div>
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer w-[20%] " onClick={() => onSort('caseParties')}>
                    <div className="flex items-center gap-2">
                      Parties {getSortIcon('caseParties')}
                    </div>
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-semibold uppercase cursor-pointer w-[15%] " onClick={() => onSort('judgeName')}>
                    <div className="flex items-center gap-2">
                      Judge {getSortIcon('judgeName')}
                    </div>
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-semibold uppercase cursor-pointer w-[10%] " onClick={() => onSort('nextStage')}>
                    <div className="flex items-center gap-2">
                      Stage {getSortIcon('nextStage')}
                    </div>
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-semibold uppercase cursor-pointer w-[10%] " onClick={() => onSort('nextStageDate')}>
                    <div className="flex items-center gap-2">
                      Date {getSortIcon('nextStageDate')}
                    </div>
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-semibold uppercase "onClick={() => onSort('nextStageTime')}>
                    Time
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-semibold uppercase cursor-pointer w-[12%] " onClick={() => onSort('courtRoomName')}>
                    <div className="flex items-center gap-2">
                      Court Room {getSortIcon('courtRoomName')}
                    </div>
                  </th>
                </tr>
              </thead>
               <tbody className={`divide-y ${isDarkTheme ? 'divide-slate-700' : 'divide-slate-200'}`}>
                  {filteredCases.map((caseItem) => (
                    <tr key={caseItem.id} className={`transition-all duration-300 ${
                      isDarkTheme ? 'hover:bg-slate-800/50' : 'hover:bg-gray-50'
                    }`}>
                      {/* Case Title - Wider */}
                      <td className="px-2 py-3 w-[8%]">
                        <div>
                          <span className={`text-sm font-medium ${isDarkTheme ? 'text-white' : 'text-slate-900'}`}>
                            {getCaseTitle(caseItem)}
                          </span>
                          {caseItem.caseReference && (
                            <div className={`text-sm ${isDarkTheme ? 'text-slate-400' : 'text-slate-500'}`}>
                              Ref: {caseItem.caseReference}
                            </div>
                          )}
                        </div>
                      </td>
                      
                      {/* Parties - Medium */}
                      <td className="px-2 py-3 w-[23%]">
                        <span className={`text-sm ${isDarkTheme ? 'text-slate-300' : 'text-slate-700'}`}>
                          {caseItem.caseParties || 'N/A'}
                        </span>
                      </td>
                      
                      {/* Judge - Medium */}
                      <td className="px-2 py-3 w-[15%]">
                        <span className={`text-sm ${isDarkTheme ? 'text-slate-300' : 'text-slate-700'}`}>
                          {caseItem.judgeName || 'N/A'}
                        </span>
                      </td>
                      
                      {/* Stage - Small */}
                      <td className="px-2 py-3 w-[5%]">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStageColor(caseItem.nextStage)}`}>
                          {caseItem.nextStage || 'N/A'}
                        </span>
                      </td>
                      
                      {/* Date - Small */}
                      <td className="px-2 py-3 w-[5%]">
                        <span className={`text-sm ${isDarkTheme ? 'text-slate-300' : 'text-slate-700'}`}>
                          {formatDate(caseItem.nextStageDate)}
                        </span>
                      </td>
                      
                      {/* Time - Smallest */}
                      <td className="px-2 py-3 w-[6%]">
                        <span className={`text-sm ${isDarkTheme ? 'text-slate-300' : 'text-slate-700'}`}>
                          {caseItem.nextStageTime ? formatTime(caseItem.nextStageTime) : 'N/A'}
                        </span>
                      </td>
                      
                      {/* Court Room - Small */}
                      <td className="px-2 py-3 w-[20%]">
                        <span className={`text-sm ${isDarkTheme ? 'text-slate-300' : 'text-slate-700'}`}>
                          {caseItem.courtRoomName || 'N/A'}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer - Sticky */}
        <div className={`absolute bottom-0 left-0 right-0 flex flex-wrap items-center justify-between gap-3 p-4 border-t ${
          isDarkTheme ? 'border-slate-700 bg-slate-900' : 'border-gray-200 bg-white'
        }`}>
          <div className={`text-sm ${isDarkTheme ? 'text-slate-400' : 'text-slate-500'}`}>
            {loading ? (
              'Loading...'
            ) : searchTerm ? (
              `Showing ${filteredCases.length} of ${cases.length} case(s)`
            ) : (
              `Showing ${cases.length} case(s)`
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                isDarkTheme
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  : 'bg-gray-200 hover:bg-gray-300 text-slate-700'
              }`}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}