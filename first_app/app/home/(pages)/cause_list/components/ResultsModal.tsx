// app/home/(pages)/cause_list/components/ResultsModal.tsx

'use client';
import * as Fa from 'react-icons/fa';

interface Case {
  id: string;
  caseTitle: string;
  judgeName: string;
  caseParties: string;
  refNo: string;
  courtRoom: string;
  courtName: string;
  time: string;
  date: string;
  caseStage: string;
}

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
  formatTime: (time: string) => string;
  getCaseStageColor: (stage: string) => string;
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
  getCaseStageColor,
}: ResultsModalProps) {
  if (!isOpen) return null;

  const uniqueCourts = [...new Set(cases.map(c => c.courtName))];
  const courtName = uniqueCourts.length === 1 ? uniqueCourts[0] : '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className={`relative w-full max-w-fit max-h-[90vh] rounded-lg overflow-hidden ${
        isDarkTheme ? 'bg-slate-900' : 'bg-white'
      } shadow-2xl animate-scale-up`}>
          <div className={`flex items-center justify-between p-4 border-b ${
            isDarkTheme ? 'border-slate-700' : 'border-gray-200'
          }`}>
            <div className="flex items-center gap-3">
              <Fa.FaClipboardList className={`w-5 h-5 ${isDarkTheme ? 'text-red-400' : 'text-red-600'}`} />
              <h2 className={`text-lg font-semibold ${isDarkTheme ? 'text-white' : 'text-slate-900'}`}>
                {courtName && (
                  <span className="text-md uppercase font-bold">
                    {courtName} Cause Lists
                  </span>
                )}
                {!courtName && (
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

        {/* Modal Body */}
        <div className="p-4 overflow-y-auto max-h-[60vh]">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
            </div>
          ) : cases.length === 0 ? (
            <div className={`text-center py-16 rounded-xl ${isDarkTheme ? 'bg-slate-800/50' : 'bg-gray-50'}`}>
              <Fa.FaTimesCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <h3 className={`text-lg font-semibold mb-1 ${isDarkTheme ? 'text-slate-300' : 'text-slate-700'}`}>
                No cases found
              </h3>
              <p className={`text-sm ${isDarkTheme ? 'text-slate-500' : 'text-slate-500'}`}>
                Try adjusting your filters and search again
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className={`w-full rounded-xl overflow-hidden ${isDarkTheme ? 'bg-slate-800/50' : 'bg-white'} border ${isDarkTheme ? 'border-slate-700' : 'border-slate-200'}`}>
                <thead className={`${isDarkTheme ? 'bg-slate-800 text-white' : 'bg-gray-50 text-slate-800'}`}>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer" onClick={() => onSort('caseTitle')}>
                      <div className="flex items-center gap-2">
                        Case Title {getSortIcon('caseTitle')}
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer" onClick={() => onSort('caseParties')}>
                      <div className="flex items-center gap-2">
                        Case Parties {getSortIcon('caseParties')}
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer" onClick={() => onSort('judgeName')}>
                      <div className="flex items-center gap-2">
                        Judge/Magistrate {getSortIcon('judgeName')}
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer" onClick={() => onSort('caseStage')}>
                      <div className="flex items-center gap-2">
                        Case Stage {getSortIcon('caseStage')}
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer" onClick={() => onSort('date')}>
                      <div className="flex items-center gap-2">
                        Date {getSortIcon('date')}
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer" onClick={() => onSort('time')}>
                      <div className="flex items-center gap-2">
                        Time {getSortIcon('time')}
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                      Court Room
                    </th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDarkTheme ? 'divide-slate-700' : 'divide-slate-200'}`}>
                  {cases.map((caseItem) => (
                    <tr key={caseItem.id} className={`transition-all duration-300 ${
                      isDarkTheme ? 'hover:bg-slate-800/50' : 'hover:bg-gray-50'
                    }`}>
                      <td className="px-4 py-3">
                        <span className={`text-sm font-medium ${isDarkTheme ? 'text-white' : 'text-slate-900'}`}>
                          {caseItem.caseTitle}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-sm ${isDarkTheme ? 'text-slate-300' : 'text-slate-700'}`}>
                          {caseItem.caseParties}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-sm ${isDarkTheme ? 'text-slate-300' : 'text-slate-700'}`}>
                          {caseItem.judgeName}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getCaseStageColor(caseItem.caseStage)}`}>
                          {caseItem.caseStage}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-sm ${isDarkTheme ? 'text-slate-300' : 'text-slate-700'}`}>
                          {formatDate(caseItem.date)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-sm ${isDarkTheme ? 'text-slate-300' : 'text-slate-700'}`}>
                          {formatTime(caseItem.time)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-sm ${isDarkTheme ? 'text-slate-300' : 'text-slate-700'}`}>
                          Court Room {caseItem.courtRoom}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className={`flex flex-wrap items-center justify-between gap-3 p-4 border-t ${
          isDarkTheme ? 'border-slate-700' : 'border-gray-200'
        }`}>
          <div className={`text-sm ${isDarkTheme ? 'text-slate-400' : 'text-slate-500'}`}>
            Showing {cases.length} case(s)
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={onExcelExport}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                isDarkTheme
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            >
              <Fa.FaFileExcel className="w-4 h-4" />
              Export Excel
            </button>
            <button
              onClick={onPDFExport}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                isDarkTheme
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-red-500 hover:bg-red-600 text-white'
              }`}
            >
              <Fa.FaFilePdf className="w-4 h-4" />
              Export PDF
            </button>
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                isDarkTheme
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  : 'bg-gray-100 hover:bg-gray-200 text-slate-700'
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