

'use client';

import { useState, useMemo } from 'react';
import { useTheme } from '@/app/context/ThemeContext';
import SideLinks from '../../components/SideLink';
import ResultsModal from './components/ResultsModal';
import CaseNumberForm from './components/CaseNumberForm';
import ReferenceNumberForm from './components/ReferenceNumberForm';
import FormTabs from './components/FormTabs';
import { useCaseFetch } from '@/hooks/useCaseDetails';
import { useCaseDetails } from '@/hooks/useCauseList';
import NewsSection from '../../components/NewsSection';

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
}

interface FormErrors {
  court: string;
  caseNumber?: string;
  referenceNumber?: string;
  caseType?: string;
  filingYear?: string;
}

export default function CauseList() {
  const { isDarkTheme } = useTheme();
  const { 
    fetchCaseByLevel, 
    fetchCaseByNumber, 
    loading: apiLoading, 
    error: apiError, 
    clearError 
  } = useCaseFetch();
  
  // State for Case Number tab
  const [courtLevel, setCourtLevel] = useState('');
  const [courtLevelSearchTerm, setCourtLevelSearchTerm] = useState('');
  const [courtName, setCourtName] = useState('');
  const [courtNameSearchTerm, setCourtNameSearchTerm] = useState('');
  const [caseType, setCaseType] = useState('');
  const [caseTypeSearchTerm, setCaseTypeSearchTerm] = useState('');
  const [filingYear, setFilingYear] = useState('');
  const [caseNumber, setCaseNumber] = useState('');

  // State for Reference Number tab
  const [selectedCourt, setSelectedCourt] = useState('');
  const [courtSearchTerm, setCourtSearchTerm] = useState('');
  const [referenceNumber, setReferenceNumber] = useState('');

  const [filteredCases, setFilteredCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({ 
    court: '' 
  });

  // TABS STATE
  const [activeTab, setActiveTab] = useState('caseNumber');

  const courtLevels = [
    'Primary Court',
    'Other Level Court'
  ];

  const { uniqueCourts, fetchingCourts } = useCaseDetails();

  const filteredCourts = useMemo(() => {
    if (!courtNameSearchTerm) return uniqueCourts;
    return uniqueCourts.filter(court =>
      court.toLowerCase().includes(courtNameSearchTerm.toLowerCase())
    );
  }, [uniqueCourts, courtNameSearchTerm]);

  const getYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear; i >= currentYear - 20; i--) {
      years.push(i);
    }
    return years;
  };

  //  Validate form with proper typing
  const validateForm = (): boolean => {
    const newErrors: FormErrors = { court: '' };
    let isValid = true;

    if (activeTab === 'caseNumber') {
      if (!caseNumber.trim()) {
        newErrors.caseNumber = 'Case Number is required';
        isValid = false;
      }
      if (!courtLevel) {
        newErrors.court = 'Please select a court level';
        isValid = false;
      }
      if (!courtName) {
        newErrors.court = 'Please select a court name';
        isValid = false;
      }
      if (!filingYear) {
        newErrors.filingYear = 'Please select a filing year';
        isValid = false;
      }
      if (!caseType) {
        newErrors.caseType = 'Please select a case type';
        isValid = false;
      }
    } else {
      if (!referenceNumber.trim()) {
        newErrors.referenceNumber = 'Reference Number is required';
        isValid = false;
      }
      if (!selectedCourt) {
        newErrors.court = 'Please select a court level';
        isValid = false;
      }
    }
    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    clearError?.();
    setErrors({ court: '' });
    
    if (!validateForm()) {
      console.log('Validation failed:', errors);
      return;
    }

    setLoading(true);
    
    try {
      if (activeTab === 'referenceNumber') {
        const fetchedCase = await fetchCaseByLevel(referenceNumber, selectedCourt);
        
        if (fetchedCase) {
          setFilteredCases([fetchedCase]);
          setShowResultsModal(true);
        } else {
          setFilteredCases([]);
          setErrors(prev => ({ ...prev, referenceNumber: apiError || 'No case found' }));
          setShowResultsModal(true);
        }
      } else {
        const fetchedCase = await fetchCaseByNumber(
          caseNumber,
          courtLevel,
          courtName,
          filingYear,
          caseType
        );
        
        if (fetchedCase) {
          setFilteredCases([fetchedCase]);
          setShowResultsModal(true);
        } else {
          setFilteredCases([]);
          setErrors(prev => ({ ...prev, caseNumber: apiError || 'No case found with the provided details' }));
          setShowResultsModal(true);
        }
      }
    } catch {
      setErrors(prev => ({ ...prev, caseNumber: 'Failed to fetch case details. Please try again.' }));
      setShowResultsModal(true);
    } finally {
      setLoading(false);
    }
  };

  // Reset filters for Case Number tab
  const handleResetCaseNumber = () => {
    setCourtLevel('');
    setCourtLevelSearchTerm('');
    setCourtName('');
    setCourtNameSearchTerm('');
    setCaseType('');
    setCaseTypeSearchTerm('');
    setFilingYear('');
    setCaseNumber('');
    setFilteredCases([]);
    setShowResultsModal(false);
    setErrors({ court: '' });
    clearError?.();
  };

  // Reset filters for Reference Number tab
  const handleResetReferenceNumber = () => {
    setSelectedCourt('');
    setCourtSearchTerm('');
    setReferenceNumber('');
    setFilteredCases([]);
    setShowResultsModal(false);
    setErrors({ court: '' });
    clearError?.();
  };

  const handleTabChange = () => {
    setErrors({ court: '' });
    clearError?.();
  };

  const closeResultsModal = () => {
    setShowResultsModal(false);
  };

  return (
    <div className="flex-grow px-5 sm:px-20 md:px-30 lg:px-40 xl:px-50 2xl:px-60 pt-4 sm:pt-4 md:pt-4 lg:pt-5 pb-3">
      <div className="flex flex-col lg:flex-row gap-6 md:gap-8 lg:gap-10 xl:gap-12">
        {/* Left Column */}
        <div className="w-full lg:w-[50%] xl:w-[50%] 2xl:w-[40%]">
          <div className="sticky pt-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className={`text-2xl font-bold flex items-center gap-2 ${isDarkTheme ? 'text-white' : 'text-gray-400'}`}>
                  <span className="text-3xl">⚖️</span>
                  Case Details
                </h2>
                <p className={`text-sm ${isDarkTheme ? 'text-white' : 'text-white'}`}>
                  Find Details of the case on your own by searching below.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              <div className={`rounded-xl backdrop-blur-sm border transition-all duration-300 flex flex-col ${
                isDarkTheme 
                  ? 'bg-slate-900/50 border-slate-700/50 hover:border-slate-600' 
                  : 'bg-white/80 border-slate-200/80 hover:border-slate-300'
              }`} style={{ maxHeight: '400px' }}>
                
                <div className="flex-shrink-0 px-6 pt-4 pb-2 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10 bg-inherit backdrop-blur-sm rounded-t-xl">
                  <FormTabs
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    isDarkTheme={isDarkTheme}
                    onTabChange={handleTabChange}
                  />
                </div>

                <div className="flex-1 overflow-y-auto px-10 py-4">
                  <div className="flex flex-col gap-3">
                    {activeTab === 'caseNumber' ? (
                      <CaseNumberForm
                        caseNumber={caseNumber}
                        setCaseNumber={setCaseNumber}
                        courtLevel={courtLevel}
                        setCourtLevel={setCourtLevel}
                        courtLevelSearchTerm={courtLevelSearchTerm}
                        setCourtLevelSearchTerm={setCourtLevelSearchTerm}
                        courtLevels={courtLevels}
                        courtName={courtName}
                        setCourtName={setCourtName}
                        courtNameSearchTerm={courtNameSearchTerm}
                        setCourtNameSearchTerm={setCourtNameSearchTerm}
                        filteredCourts={filteredCourts}
                        filingYear={filingYear}
                        setFilingYear={setFilingYear}
                        caseType={caseType}
                        setCaseType={setCaseType}
                        caseTypeSearchTerm={caseTypeSearchTerm}
                        setCaseTypeSearchTerm={setCaseTypeSearchTerm}
                        getYears={getYears}
                        errors={errors}
                        loading={loading}
                        isDarkTheme={isDarkTheme}
                        onReset={handleResetCaseNumber}
                        fetchingCourts={fetchingCourts}
                      />
                    ) : (
                      <ReferenceNumberForm
                        selectedCourt={selectedCourt}
                        setSelectedCourt={setSelectedCourt}
                        courtSearchTerm={courtSearchTerm}
                        setCourtSearchTerm={setCourtSearchTerm}
                        courtLevels={courtLevels}
                        referenceNumber={referenceNumber}
                        setReferenceNumber={setReferenceNumber}
                        errors={errors}
                        loading={loading}
                        apiLoading={apiLoading}
                        isDarkTheme={isDarkTheme}
                        onReset={handleResetReferenceNumber}
                      />
                    )}
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column */}
        <div className="w-full lg:w-[50%] xl:w-[50%] 2xl:w-[60%]">
          <SideLinks 
            isDarkTheme={isDarkTheme}
            maxHeight="h-[400px]" 
          />
        </div>
      </div>
      <div className="mt-8">
        <NewsSection 
          limit={4} 
          isDarkTheme={isDarkTheme} 
        />
      </div>

      <ResultsModal
        isOpen={showResultsModal}
        onClose={closeResultsModal}
        cases={filteredCases}
        loading={loading || apiLoading}
        isDarkTheme={isDarkTheme}
      />
    </div>
  );
}