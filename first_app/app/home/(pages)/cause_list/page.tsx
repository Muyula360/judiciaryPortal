// app/causelist/page.tsx
'use client';

import { useState, useMemo } from 'react';
import * as Fa from 'react-icons/fa';
import { useTheme } from '@/app/context/ThemeContext';
import { useCaseDetails } from '@/hooks/useCauseList';
import { Case } from '@/types';
import SideLinks from '../../components/SideLink';
import ResultsModal from './components/ResultsModal';
import { generateExcel } from './components/ExcelGenerator';
import { generatePDF } from './components/PDFGenerator';
import FormButtons from '@/app/components/FormButtons';
import SearchableDropdown from '@/app/components/SearchableDropdown';
import DateInput from '@/app/components/DateInput';

export default function CauseList() {
  const { isDarkTheme } = useTheme();
  
  const {
    filteredCases,
    loading,
    error,
    fetchCases,
    uniqueCourts,  // This already has fallback courts from the hook
    fetchingCourts,
    clearCases,
  } = useCaseDetails();

  const [selectedCourt, setSelectedCourt] = useState('');
  const [courtSearchTerm, setCourtSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortField, setSortField] = useState<keyof Case>('nextStageDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [errors, setErrors] = useState({ court: '', startDate: '', endDate: '' });

  // Filter courts based on search term - use uniqueCourts directly from hook
  const filteredCourts = useMemo(() => {
    if (!courtSearchTerm) return uniqueCourts;
    return uniqueCourts.filter(court =>
      court.toLowerCase().includes(courtSearchTerm.toLowerCase())
    );
  }, [uniqueCourts, courtSearchTerm]);

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
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
    if (!timeString) return 'N/A';
    try {
      if (timeString.match(/^\d{2}:\d{2}:\d{2}$/)) {
        const [hours, minutes] = timeString.split(':');
        const date = new Date();
        date.setHours(parseInt(hours), parseInt(minutes));
        return date.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        });
      }
      const date = new Date(timeString);
      if (isNaN(date.getTime())) return 'N/A';
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    } catch {
      return 'N/A';
    }
  };

  const formatYear = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'N/A';
      return date.getFullYear().toString();
    } catch {
      return 'N/A';
    }
  };

  const validateForm = () => {
    const newErrors = { court: '', startDate: '', endDate: '' };
    let isValid = true;

    if (!selectedCourt || selectedCourt === 'all') {
      newErrors.court = 'Please select a valid court';
      isValid = false;
    }
    if (!startDate) {
      newErrors.startDate = 'Please select a start date';
      isValid = false;
    }
    if (!endDate) {
      newErrors.endDate = 'Please select an end date';
      isValid = false;
    }
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      newErrors.endDate = 'End date must be after start date';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    await fetchCases({
      court: selectedCourt,
      fromDate: startDate,
      toDate: endDate,
    });

    setShowResultsModal(true);
  };

  const handleReset = () => {
    setSelectedCourt('');
    setCourtSearchTerm('');
    setStartDate('');
    setEndDate('');
    clearCases();
    setShowResultsModal(false);
    setErrors({ court: '', startDate: '', endDate: '' });
  };

  const sortedCases = [...filteredCases].sort((a, b) => {
    let aValue: any = a[sortField];
    let bValue: any = b[sortField];
    
    if (sortField === 'nextStageDate' || sortField === 'filingDate') {
      aValue = a[sortField] ? new Date(a[sortField] as string).getTime() : 0;
      bValue = b[sortField] ? new Date(b[sortField] as string).getTime() : 0;
    }
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue) 
        : bValue.localeCompare(aValue);
    }
    
    return sortDirection === 'asc' ? (aValue > bValue ? 1 : -1) : (aValue < bValue ? 1 : -1);
  });

  const handleSort = (field: keyof Case) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: keyof Case) => {
    if (sortField !== field) return <Fa.FaSort className="w-3 h-3 ml-1" />;
    return sortDirection === 'asc' ? 
      <Fa.FaSortUp className="w-3 h-3 ml-1" /> : 
      <Fa.FaSortDown className="w-3 h-3 ml-1" />;
  };

  const handleExcelExport = () => {
    generateExcel({
      cases: sortedCases,
      selectedCourt,
      formatDate,
      formatTime,
      formatYear,
      startDate,
      endDate,
    });
  };

  const handlePDFExport = () => {
    generatePDF({
      cases: sortedCases,
      selectedCourt,
      startDate,
      endDate,
      formatDate,
      formatTime,
      formatYear,
    });
  };

  const closeResultsModal = () => {
    setShowResultsModal(false);
  };

  // Debug: Log what courts are available
  console.log('Courts from hook:', uniqueCourts);

  return (
    <div className="flex-grow px-5 sm:px-20 md:px-30 lg:px-40 xl:px-50 2xl:px-60 pt-6 sm:pt-8 md:pt-10 lg:pt-12 pb-3">
      <div className="flex flex-col lg:flex-row gap-6 md:gap-8 lg:gap-10 xl:gap-12">
        
        {/* Left Column - Form */}
        <div className="w-full lg:w-[50%] xl:w-[50%] 2xl:w-[40%]">
          <div className="sticky pt-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className={`text-2xl font-bold flex items-center gap-2 ${isDarkTheme ? 'text-white' : 'text-white'}`}>
                  <span className="text-3xl">⚖️</span>
                  Court Cause List
                </h2>
                <p className={`text-sm ${isDarkTheme ? 'text-slate-400' : 'text-gray-200'}`}>
                  Schedule of court cases showing when and where each case will be heard
                </p>
              </div>
            </div>

            {error && (
              <div className={`mb-4 p-3 rounded-lg text-sm ${
                isDarkTheme 
                  ? 'bg-red-900/30 text-red-300 border border-red-800' 
                  : 'bg-red-50 text-red-600 border border-red-200'
              }`}>
                <Fa.FaExclamationCircle className="inline mr-2" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div className={`rounded-xl p-10 backdrop-blur-sm border transition-all duration-300 ${
                isDarkTheme 
                  ? 'bg-slate-900/50 border-slate-700/50 hover:border-slate-600' 
                  : 'bg-white/80 border-slate-200/80 hover:border-slate-300'
              }`}>
                <div className="flex flex-col gap-4">
                  {/* Court Name */}
                  <SearchableDropdown
                    value={selectedCourt}
                    searchTerm={courtSearchTerm}
                    options={filteredCourts}
                    label="Court Name"
                    placeholder={fetchingCourts ? "Loading courts..." : "Search or select a court..."}
                    required
                    error={errors.court}
                    isDarkTheme={isDarkTheme}
                    onSelect={setSelectedCourt}
                    onSearchChange={setCourtSearchTerm}
                    icon={<Fa.FaBuilding className="w-4 h-4" />}
                    disabled={fetchingCourts}
                  />

                  {/* Start Date */}
                  <DateInput
                    value={startDate}
                    label="Start Date"
                    required
                    error={errors.startDate}
                    isDarkTheme={isDarkTheme}
                    onChange={setStartDate}
                    icon={<Fa.FaCalendarAlt className="w-4 h-4" />}
                  />

                  {/* End Date */}
                  <DateInput
                    value={endDate}
                    label="End Date"
                    required
                    error={errors.endDate}
                    isDarkTheme={isDarkTheme}
                    onChange={setEndDate}
                    icon={<Fa.FaCalendarCheck className="w-4 h-4" />}
                  />

                  {/* Buttons */}
                  <FormButtons
                    isDarkTheme={isDarkTheme}
                    searchLabel="Apply Filter"
                    resetLabel="Reset"
                    onSearch={() => {}}
                    onReset={handleReset}
                    isLoading={loading}
                  />
                </div>
              </div>
            </form>
          </div>
        </div>

        <div className="w-full lg:w-[50%] xl:w-[50%] 2xl:w-[60%]">
          <SideLinks 
            isDarkTheme={isDarkTheme} 
          />
        </div>
      </div>

      {/* Results Modal */}
      <ResultsModal
        isOpen={showResultsModal}
        onClose={closeResultsModal}
        cases={sortedCases}
        loading={loading}
        isDarkTheme={isDarkTheme}
        onExcelExport={handleExcelExport}
        onPDFExport={handlePDFExport}
        onSort={handleSort}
        sortField={sortField}
        sortDirection={sortDirection}
        getSortIcon={getSortIcon}
        formatDate={formatDate}
        formatTime={formatTime}
        formatYear={formatYear}
      />
    </div>
  );
}