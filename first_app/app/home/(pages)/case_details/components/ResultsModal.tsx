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
  caseOutcome?: string;
  courtLevel?: string;
  reference?: string;
  caseNumber?: string;
  caseYear?: string;
  filingDate?: string;
  decidedDate?: string;
  nextStageDate?: string;
}

interface ResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  cases?: Case[];
  loading: boolean;
  isDarkTheme: boolean;
}

export default function ResultsModal({
  isOpen,
  onClose,
  cases = [],
  loading,
  isDarkTheme,
}: ResultsModalProps) {
  if (!isOpen) return null;

  // Ensure cases is an array before using it
  const casesArray = Array.isArray(cases) ? cases : [];
  const caseItem = casesArray.length > 0 ? casesArray[0] : null;

  // Format helpers
  const formatDate = (dateString: string) => {
    if (!dateString || dateString === 'N/A' || dateString === 'undefined' || dateString === 'null') return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'N/A';
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'N/A';
    }
  };

  const formatTime = (timeString: string) => {
    if (!timeString || timeString === 'N/A' || timeString === 'undefined' || timeString === 'null') return 'N/A';
    try {
      const [hours, minutes] = timeString.split(':');
      const hour = parseInt(hours);
      if (isNaN(hour)) return 'N/A';
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const hour12 = hour % 12 || 12;
      return `${hour12}:${minutes} ${ampm}`;
    } catch {
      return 'N/A';
    }
  };

  //Capitalization helper
  const capitalizeFirstLetter = (str: string) => {
    if (!str) return 'N/A';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  // Get status color
  const getStatusColor = (status: string) => {
    if (!status) return '';
    const statusLower = status.toLowerCase();
    if (statusLower.includes('decided') || statusLower.includes('allowed') || statusLower.includes('dismissed')) {
      return isDarkTheme ? 'text-green-400' : 'text-green-600';
    } else if (statusLower.includes('pending')) {
      return isDarkTheme ? 'text-yellow-400' : 'text-yellow-600';
    } else if (statusLower.includes('hearing')) {
      return isDarkTheme ? 'text-blue-400' : 'text-blue-600';
    } else if (statusLower.includes('adjourned')) {
      return isDarkTheme ? 'text-orange-400' : 'text-orange-600';
    } else {
      return isDarkTheme ? 'text-slate-300' : 'text-slate-700';
    }
  };

  // Get status badge color
  const getStatusBadgeColor = (status: string) => {
    if (!status) return '';
    const statusLower = status.toLowerCase();
    if (statusLower.includes('decided') || statusLower.includes('allowed') || statusLower.includes('dismissed')) {
      return isDarkTheme ? 'bg-green-900/30 text-green-400 border-green-800' : 'bg-green-100 text-green-700 border-green-200';
    } else if (statusLower.includes('pending')) {
      return isDarkTheme ? 'bg-yellow-900/30 text-yellow-400 border-yellow-800' : 'bg-yellow-100 text-yellow-700 border-yellow-200';
    } else if (statusLower.includes('hearing')) {
      return isDarkTheme ? 'bg-blue-900/30 text-blue-400 border-blue-800' : 'bg-blue-100 text-blue-700 border-blue-200';
    } else if (statusLower.includes('adjourned')) {
      return isDarkTheme ? 'bg-orange-900/30 text-orange-400 border-orange-800' : 'bg-orange-100 text-orange-700 border-orange-200';
    } else {
      return isDarkTheme ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  // Check if case is decided
  const isCaseDecided = (): boolean => {
    if (!caseItem?.caseOutcome) return false;
    const outcome = caseItem.caseOutcome.toLowerCase();
    return outcome.includes('decided') || 
           outcome.includes('allowed') || 
           outcome.includes('dismissed') || 
           outcome.includes('granted') ||
           outcome.includes('rejected');
  };

  // Detail row component
  const DetailRow = ({ icon, label, value, valueColor }: { icon: React.ReactNode; label: string; value: string | React.ReactNode; valueColor?: string }) => (
    <div className={`flex items-start gap-3 p-3 rounded-lg ${isDarkTheme ? 'hover:bg-slate-800/50' : 'hover:bg-gray-50'} transition-colors`}>
      <div className={`mt-0.5 w-5 h-5 flex-shrink-0 ${isDarkTheme ? 'text-slate-400' : 'text-slate-500'}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className={`text-xs font-medium uppercase tracking-wider ${isDarkTheme ? 'text-slate-400' : 'text-slate-500'}`}>
          {label}
        </div>
        <div className={`text-base font-medium ${valueColor || (isDarkTheme ? 'text-white' : 'text-slate-900')} break-words`}>
          {value || 'N/A'}
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className={`relative w-full max-w-3xl max-h-[90vh] rounded-2xl overflow-hidden ${
        isDarkTheme ? 'bg-slate-900' : 'bg-white'
      } shadow-2xl`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-5 border-b ${
          isDarkTheme ? 'border-slate-700' : 'border-gray-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${isDarkTheme ? 'bg-red-500/10' : 'bg-red-50'}`}>
              <Fa.FaClipboardList className={`w-5 h-5 ${isDarkTheme ? 'text-red-400' : 'text-red-600'}`} />
            </div>
            <div>
              <h2 className={`text-xl font-bold ${isDarkTheme ? 'text-white' : 'text-slate-900'}`}>
                Case Details  -  {caseItem?.courtName && (
                <span className={`text-sm ${isDarkTheme ? 'text-slate-400' : 'text-slate-500'}`}>
                  {caseItem.courtName}
                </span>
              )}
              </h2>
              
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition-all duration-300 ${
              isDarkTheme
                ? 'hover:bg-slate-800 text-slate-400 hover:text-white'
                : 'hover:bg-gray-100 text-slate-600 hover:text-slate-900'
            }`}
          >
            <Fa.FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto max-h-[calc(90vh-180px)]">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mb-4"></div>
              <p className={`text-sm ${isDarkTheme ? 'text-slate-400' : 'text-slate-500'}`}>
                Loading case details...
              </p>
            </div>
          ) : !caseItem ? (
            <div className={`text-center py-16 rounded-2xl ${isDarkTheme ? 'bg-slate-800/50' : 'bg-gray-50'}`}>
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                isDarkTheme ? 'bg-slate-800' : 'bg-gray-100'
              }`}>
                <Fa.FaTimesCircle className="w-8 h-8 text-red-400" />
              </div>
              <h3 className={`text-lg font-semibold mb-1 ${isDarkTheme ? 'text-slate-300' : 'text-slate-700'}`}>
                No cases found
              </h3>
              <p className={`text-sm ${isDarkTheme ? 'text-slate-500' : 'text-slate-500'}`}>
                Try adjusting your filters and search again
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Reference Number - Highlighted */}
              <div className={`p-4 rounded-xl border ${
                isDarkTheme ? 'bg-slate-800/50 border-slate-700' : 'bg-gray-50 border-gray-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className={`text-xs font-medium uppercase tracking-wider ${isDarkTheme ? 'text-slate-400' : 'text-slate-500'}`}>
                      Reference Number
                    </div>
                    <div className={`text-lg font-mono font-bold mt-1 ${isDarkTheme ? 'text-white' : 'text-slate-900'}`}>
                      {caseItem.refNo || caseItem.reference || 'N/A'}
                    </div>
                  </div>
                  {caseItem.caseStage && (
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadgeColor(caseItem.caseStage)}`}>
                      {caseItem.caseStage}
                    </span>
                  )}
                </div>
              </div>
                  {/* case parties  */}
               <div className={`p-4 rounded-md`}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className={`text-xs font-medium uppercase tracking-wider ${isDarkTheme ? 'text-slate-400' : 'text-slate-500'}`}>
                      Case Parties
                    </div>
                    <div className={`text-md font-bold mt-1 ${isDarkTheme ? 'text-white' : 'text-slate-900'}`}>
                      {caseItem.caseParties || 'N/A'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Case Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <DetailRow
                  icon={<Fa.FaGavel className={`w-5 h-5 ${isDarkTheme ? 'text-red-400' : 'text-red-600'}`} />}
                  label="Case Title"
                  value={caseItem.caseTitle || 'N/A'}
                />
                
                <DetailRow
                  icon={<Fa.FaUserTie className={`w-5 h-5 ${isDarkTheme ? 'text-red-400' : 'text-red-600'}`} />}
                  label="Judge / Magistrate"
                  value={caseItem.judgeName || 'N/A'}
                />
                
                <DetailRow
                  icon={<Fa.FaCalendarAlt className={`w-5 h-5 ${isDarkTheme ? 'text-red-400' : 'text-red-600'}`} />}
                  label="Filing Date"
                  value={formatDate(caseItem.date || caseItem.filingDate)}
                />

                {caseItem.caseOutcome && (
                  <DetailRow
                    icon={<Fa.FaCheckCircle className={`w-5 h-5 ${isDarkTheme ? 'text-red-400' : 'text-red-600'}`} />}
                    label="Case Status"
                    value={capitalizeFirstLetter(caseItem.caseOutcome)}
                    valueColor={getStatusColor(caseItem.caseOutcome)}
                  />
                )}

                {isCaseDecided() ? (
                  caseItem.decidedDate && (
                    <DetailRow
                      icon={<Fa.FaCalendarCheck className={`w-5 h-5 ${isDarkTheme ? 'text-red-400' : 'text-red-600'}`} />}
                      label="Decision Date"
                      value={formatDate(caseItem.decidedDate)}
                    />
                  )
                ) : (
                  caseItem.nextStageDate && (
                    <DetailRow
                      icon={<Fa.FaClock className={`w-5 h-5 ${isDarkTheme ? 'text-red-400' : 'text-red-600'}`} />}
                      label="Next Stage"
                      value={`${caseItem.caseStage || 'Next Stage'} on ${formatDate(caseItem.nextStageDate)}`}
                    />
                  )
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`flex flex-wrap items-center justify-between gap-3 p-4 border-t ${
          isDarkTheme ? 'border-slate-700' : 'border-gray-200'
        }`}>
          <div className={`text-sm ${isDarkTheme ? 'text-slate-400' : 'text-slate-500'}`}>
            
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={onClose}
              className={`px-5 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
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