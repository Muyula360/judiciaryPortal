// app/home/(pages)/cause_list/page.tsx

'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import * as Fa from 'react-icons/fa';
import { useTheme } from '@/app/context/ThemeContext';
import SideLinks from '../../components/SideLink';
import ResultsModal from './components/ResultsModal';
import { generateExcel } from './components/ExcelGenerator';
import { generatePDF } from './components/PDFGenerator';

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

export default function CauseList() {
  const { isDarkTheme } = useTheme();
  
  // State
  const [selectedCourt, setSelectedCourt] = useState('');
  const [courtSearchTerm, setCourtSearchTerm] = useState('');
  const [isCourtDropdownOpen, setIsCourtDropdownOpen] = useState(false);
  const courtDropdownRef = useRef<HTMLDivElement>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [cases, setCases] = useState<Case[]>([]);
  const [filteredCases, setFilteredCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(false);
  const [sortField, setSortField] = useState<keyof Case>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [uniqueCourts, setUniqueCourts] = useState<string[]>([]);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [errors, setErrors] = useState({ court: '', startDate: '', endDate: '' });

  // Filter courts based on search term
  const filteredCourts = useMemo(() => {
    if (!courtSearchTerm) return uniqueCourts;
    return uniqueCourts.filter(court =>
      court.toLowerCase().includes(courtSearchTerm.toLowerCase())
    );
  }, [uniqueCourts, courtSearchTerm]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (courtDropdownRef.current && !courtDropdownRef.current.contains(event.target as Node)) {
        setIsCourtDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Load sample data
  useEffect(() => {
    const sampleCases: Case[] = [
      {
        id: '24',
        caseTitle: 'Family Appeal No. 202/2026',
        judgeName: 'Hon. Joseph Mapunda, J',
        caseParties: 'Salome John vs Ezekiel John',
        refNo: 'FAM/202/2026',
        courtRoom: '9',
        courtName: 'High Court - Mbeya',
        time: '14:00',
        date: '2026-06-23',
        caseStage: 'Mediation'
      },
      {
        id: '25',
        caseTitle: 'Criminal Case No. 303/2026',
        judgeName: 'Magistrate Lilian Mushi',
        caseParties: 'Republic vs Happy Gasper',
        refNo: 'CRIM/303/2026',
        courtRoom: '13',
        courtName: 'Resident Magistrate Court - Temeke',
        time: '10:00',
        date: '2026-06-24',
        caseStage: 'Hearing'
      },
      {
        id: '26',
        caseTitle: 'Civil Case No. 404/2026',
        judgeName: 'Magistrate Victor Temu',
        caseParties: 'Dar es Salaam Water Authority vs Industrial Users',
        refNo: 'CIV/404/2026',
        courtRoom: '14',
        courtName: 'District Court - Kigamboni',
        time: '15:00',
        date: '2026-06-25',
        caseStage: 'Mention'
      },
      {
        id: '27',
        caseTitle: 'Constitutional Petition No. 505/2026',
        judgeName: 'Hon. Grace Mwingira, J',
        caseParties: 'Human Rights Watch vs Minister of Home Affairs',
        refNo: 'CONST/505/2026',
        courtRoom: '1',
        courtName: 'High Court - Dar es Salaam',
        time: '09:30',
        date: '2026-06-26',
        caseStage: 'Judgement'
      },
      {
        id: '28',
        caseTitle: 'Commercial Case No. 606/2026',
        judgeName: 'Hon. William Nziku, J',
        caseParties: 'Tigo Tanzania vs Airtel Tanzania',
        refNo: 'COM/606/2026',
        courtRoom: '6',
        courtName: 'Commercial Court - Dar es Salaam',
        time: '12:00',
        date: '2026-06-27',
        caseStage: 'Adjourned'
      },
      {
        id: '29',
        caseTitle: 'Land Case No. 707/2026',
        judgeName: 'Hon. Evelyn Mcharo, J',
        caseParties: 'Ngorongoro Conservation Authority vs Maasai Community',
        refNo: 'LAND/707/2026',
        courtRoom: '2',
        courtName: 'High Court - Arusha',
        time: '14:30',
        date: '2026-06-29',
        caseStage: 'Hearing'
      },
      {
        id: '30',
        caseTitle: 'Criminal Appeal No. 808/2026',
        judgeName: 'Hon. Michael Mwita, J',
        caseParties: 'Joseph Chacha vs Republic',
        refNo: 'CRIM/808/2026',
        courtRoom: '3',
        courtName: 'High Court - Mwanza',
        time: '10:00',
        date: '2026-06-30',
        caseStage: 'Ruling'
      }
    ];
    
    setCases(sampleCases);
    setUniqueCourts(['all', ...new Set(sampleCases.map(c => c.courtName))]);
  }, []);

  // Format helpers
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  // Validate form
  const validateForm = () => {
    const newErrors = { court: '', startDate: '', endDate: '' };
    let isValid = true;

    if (!selectedCourt) {
      newErrors.court = 'Please select a court';
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

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setTimeout(() => {
      const filtered = cases.filter(caseItem => {
        const matchesCourt = caseItem.courtName === selectedCourt;
        const caseDate = new Date(caseItem.date);
        const start = new Date(startDate);
        const end = new Date(endDate);
        const matchesDateRange = caseDate >= start && caseDate <= end;
        return matchesCourt && matchesDateRange;
      });
      
      setFilteredCases(filtered);
      setLoading(false);
      setShowResultsModal(true);
    }, 500);
  };

  // Reset filters
  const handleReset = () => {
    setSelectedCourt('');
    setCourtSearchTerm('');
    setStartDate('');
    setEndDate('');
    setFilteredCases([]);
    setShowResultsModal(false);
    setErrors({ court: '', startDate: '', endDate: '' });
  };

  // Sort cases
  const sortedCases = [...filteredCases].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];
    
    if (sortField === 'date') {
      aValue = new Date(a.date).getTime();
      bValue = new Date(b.date).getTime();
    } else if (sortField === 'time') {
      aValue = a.time.replace(':', '');
      bValue = b.time.replace(':', '');
    }
    
    return sortDirection === 'asc' ? (aValue > bValue ? 1 : -1) : (aValue < bValue ? 1 : -1);
  });

  // Handle sort
  const handleSort = (field: keyof Case) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Get sort icon
  const getSortIcon = (field: keyof Case) => {
    if (sortField !== field) return <Fa.FaSort className="w-3 h-3 ml-1" />;
    return sortDirection === 'asc' ? 
      <Fa.FaSortUp className="w-3 h-3 ml-1" /> : 
      <Fa.FaSortDown className="w-3 h-3 ml-1" />;
  };

  // Get case stage color
  const getCaseStageColor = (stage: string) => {
    const stageColors: Record<string, string> = {
      'Judgement': 'bg-purple-500/20 text-purple-600 dark:text-purple-400',
      'Ruling': 'bg-blue-500/20 text-blue-600 dark:text-blue-400',
      'Hearing': 'bg-green-500/20 text-green-600 dark:text-green-400',
      'Mention': 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400',
      'Directions': 'bg-indigo-500/20 text-indigo-600 dark:text-indigo-400',
      'Adjourned': 'bg-orange-500/20 text-orange-600 dark:text-orange-400',
      'Mediation': 'bg-teal-500/20 text-teal-600 dark:text-teal-400'
    };
    return stageColors[stage] || 'bg-gray-500/20 text-gray-600 dark:text-gray-400';
  };

  // Export handlers
  const handleExcelExport = () => {
    generateExcel({
      cases: sortedCases,
      selectedCourt,
      formatDate,
      formatTime,
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
    });
  };

  // Close modal
  const closeResultsModal = () => {
    setShowResultsModal(false);
  };

  return (

        <div className="flex-grow px-5 sm:px-20 md:px-30 lg:px-40 xl:px-50 2xl:px-60 pt-6 sm:pt-8 md:pt-10 lg:pt-12 pb-3">
          {/* Stack on small screens, side-by-side on large */}
          <div className="flex flex-col lg:flex-row gap-6 md:gap-8 lg:gap-10 xl:gap-12">
            
            {/* Left Column - SideLinks */}
          
            <div className="w-full lg:w-[50%] xl:w-[50%] 2xl:w-[40%]">
              <div className="sticky pt-4">
              <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className={`text-2xl font-bold flex items-center gap-2 ${isDarkTheme ? 'text-white' : 'text-gray-400'}`}>
                  <span className="text-3xl">⚖️</span>
                  Court Cause List
                </h2>
                <p className={`text-sm ${isDarkTheme ? 'text-white' : 'text-white'}`}>
                  Schedule of court cases showing when and where each case will be heard
                </p>
              </div>
            </div>

              <form onSubmit={handleSubmit} noValidate>
                <div className={`rounded-xl p-10 backdrop-blur-sm border transition-all duration-300 ${
                  isDarkTheme 
                    ? 'bg-slate-900/50 border-slate-700/50 hover:border-slate-600' 
                    : 'bg-white/80 border-slate-200/80 hover:border-slate-300'
                }`}>
                  <div className="flex flex-col gap-4">
                    {/* Court Name */}
                    <div>
                      <label className={`block text-sm font-medium mb-1.5 ${isDarkTheme ? 'text-slate-400' : 'text-gray-600'}`}>
                        Court Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative" ref={courtDropdownRef}>
                        <Fa.FaBuilding className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${isDarkTheme ? 'text-slate-500' : 'text-gray-400'} z-10`} />
                        <input
                          type="text"
                          value={selectedCourt || courtSearchTerm}
                          onChange={(e) => {
                            const value = e.target.value;
                            setCourtSearchTerm(value);
                            setIsCourtDropdownOpen(true);
                            const exactMatch = uniqueCourts.find(c => c.toLowerCase() === value.toLowerCase());
                            if (exactMatch) {
                              setSelectedCourt(exactMatch);
                              setErrors(prev => ({ ...prev, court: '' }));
                            } else {
                              setSelectedCourt('');
                            }
                          }}
                          onFocus={() => {
                            setIsCourtDropdownOpen(true);
                            setCourtSearchTerm('');
                          }}
                          placeholder="Search or select a court..."
                          className={`w-full pl-10 pr-10 py-2.5 rounded-lg text-sm transition-all duration-300 ${
                            errors.court 
                              ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                              : isDarkTheme
                                ? 'bg-slate-800/80 border-slate-700 text-slate-100 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 hover:bg-slate-800'
                                : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-red-400 focus:ring-2 focus:ring-red-400/20 hover:bg-gray-100'
                          } border focus:outline-none`}
                        />
                        {(selectedCourt || courtSearchTerm) && (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedCourt('');
                              setCourtSearchTerm('');
                              setErrors(prev => ({ ...prev, court: '' }));
                            }}
                            className="absolute right-10 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 z-10"
                          >
                            <Fa.FaTimes className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <Fa.FaChevronDown 
                          className={`absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none transition-transform duration-200 ${
                            isCourtDropdownOpen ? 'rotate-180' : ''
                          } ${isDarkTheme ? 'text-slate-500' : 'text-gray-400'}`}
                        />
                        {isCourtDropdownOpen && filteredCourts.length > 0 && (
                          <div className={`absolute z-50 w-full mt-1 rounded-lg border shadow-lg max-h-60 overflow-y-auto ${
                            isDarkTheme ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
                          }`}>
                            {filteredCourts.map((court) => (
                              <div
                                key={court}
                                onClick={() => {
                                  setSelectedCourt(court);
                                  setCourtSearchTerm(court);
                                  setIsCourtDropdownOpen(false);
                                  setErrors(prev => ({ ...prev, court: '' }));
                                }}
                                className={`px-4 py-2.5 text-sm cursor-pointer transition-colors flex items-center gap-2 ${
                                  selectedCourt === court
                                    ? isDarkTheme ? 'bg-red-500/20 text-red-400' : 'bg-red-50 text-red-600'
                                    : isDarkTheme ? 'hover:bg-slate-700 text-slate-200' : 'hover:bg-gray-50 text-gray-700'
                                }`}
                              >
                                {selectedCourt === court && <Fa.FaCheck className="w-3 h-3 flex-shrink-0" />}
                                <span className={selectedCourt === court ? 'ml-5' : 'ml-8'}>{court}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        {isCourtDropdownOpen && courtSearchTerm && filteredCourts.length === 0 && (
                          <div className={`absolute z-50 w-full mt-1 rounded-lg border shadow-lg ${
                            isDarkTheme ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
                          }`}>
                            <div className={`px-4 py-3 text-sm text-center ${
                              isDarkTheme ? 'text-slate-400' : 'text-gray-500'
                            }`}>
                              No courts found matching "{courtSearchTerm}"
                            </div>
                          </div>
                        )}
                      </div>
                      {errors.court && <p className="text-red-500 text-xs mt-1">{errors.court}</p>}
                    </div>

                    {/* Start Date */}
                    <div>
                      <label className={`block text-xs font-medium mb-1.5 ${isDarkTheme ? 'text-slate-400' : 'text-gray-600'}`}>
                        Start Date <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Fa.FaCalendarAlt className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${isDarkTheme ? 'text-slate-500' : 'text-gray-400'}`} />
                        <input
                          type="date"
                          value={startDate}
                          onChange={(e) => {
                            setStartDate(e.target.value);
                            if (e.target.value) setErrors(prev => ({ ...prev, startDate: '' }));
                          }}
                          className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm transition-all duration-300 ${
                            errors.startDate 
                              ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                              : isDarkTheme
                                ? 'bg-slate-800/80 border-slate-700 text-slate-100 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 hover:bg-slate-800'
                                : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-red-400 focus:ring-2 focus:ring-red-400/20 hover:bg-gray-100'
                          } border focus:outline-none`}
                        />
                      </div>
                      {errors.startDate && <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>}
                    </div>

                    {/* End Date */}
                    <div>
                      <label className={`block text-xs font-medium mb-1.5 ${isDarkTheme ? 'text-slate-400' : 'text-gray-600'}`}>
                        End Date <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Fa.FaCalendarCheck className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${isDarkTheme ? 'text-slate-500' : 'text-gray-400'}`} />
                        <input
                          type="date"
                          value={endDate}
                          onChange={(e) => {
                            setEndDate(e.target.value);
                            if (e.target.value) setErrors(prev => ({ ...prev, endDate: '' }));
                          }}
                          className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm transition-all duration-300 ${
                            errors.endDate 
                              ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                              : isDarkTheme
                                ? 'bg-slate-800/80 border-slate-700 text-slate-100 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 hover:bg-slate-800'
                                : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-red-400 focus:ring-2 focus:ring-red-400/20 hover:bg-gray-100'
                          } border focus:outline-none`}
                        />
                      </div>
                      {errors.endDate && <p className="text-red-500 text-xs mt-1">{errors.endDate}</p>}
                    </div>

                    <div className={`border-t ${isDarkTheme ? 'border-slate-700/50' : 'border-gray-200'} my-1`} />

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        type="submit"
                        className={`flex-1 px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                          isDarkTheme
                            ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/25 hover:shadow-red-500/40'
                            : 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/25 hover:shadow-red-500/40'
                        }`}
                      >
                        <Fa.FaSearch className="w-4 h-4" />
                        Apply Filter
                      </button>
                      <button
                        type="button"
                        onClick={handleReset}
                        className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                          isDarkTheme
                            ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200'
                        }`}
                      >
                        <Fa.FaRedoAlt className="w-4 h-4" />
                        Reset
                      </button>
                    </div>
                  </div>
                </div>
              </form>
              </div>
            </div>
    
            {/* Right Column - JudiciaryTips */}
            <div className="w-full lg:w-[50%] xl:w-[50%] 2xl:w-[60%]">
             <SideLinks 
                isDarkTheme={isDarkTheme} 
              />
            </div>
          </div>

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
              getCaseStageColor={getCaseStageColor}
            />
        </div>

  );
}