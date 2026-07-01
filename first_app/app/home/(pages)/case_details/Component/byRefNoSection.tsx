import React from 'react'
import { useState, useMemo } from 'react';
import * as Fa from 'react-icons/fa';
import { useTheme } from '@/app/context/ThemeContext';
// Import the JSON data
import otherCaseData from '../other-case-data.json';
import primaryCaseData from '../primary-case-data.json';
const ByRefNoSection = () => {
    // Define the case data type based on your JSON structure
type CaseRecord = {
  case_reference: string;
  case_no: string;
  next_stage_date: string;
  next_stage: string;
  filing_date: string;
  parties_array: string;
  judge: string;
  confirm_assignment: string;
  court: string;
  case_subtype: string;
  proceeding_outcome_status: string;
  decided_by: string;
  decision_date: string;
  case_age_view: string;
  filed_by: string;
  hearing_mode: string;
  case_year : string;
};
  const { isDarkTheme } = useTheme();

  

  const [searchCaseReference, setSearchCaseReference] = useState('');
  const [searchCourtLevel, setSearchCourtLevel] = useState('');
  
  const [searchResult, setSearchResult] = useState<CaseRecord | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [searchError, setSearchError] = useState('');
  
  const searchCourtLevels = ['Primary Courts', 'Other Court'];

  // Select dataset based on court level
  const searchCases = useMemo(() => {
    if (searchCourtLevel === 'Primary Courts') {
      return (primaryCaseData as unknown as CaseRecord[]);
    }
    return (otherCaseData as unknown as CaseRecord[]);
  }, [searchCourtLevel]);
  
  // Handle search from Other Court tab
  const handleSearch = () => {
    // Validate all inputs are filled
    if (!searchCaseReference.trim()) {
      setSearchError('Case Reference is required');
      return;
    }
    if (!searchCourtLevel.trim()) {
      setSearchError('Court Level is required');
      return;
    }
    
    setSearchError('');
    setSearchLoading(true);
    setSearchPerformed(true);
    
    setTimeout(() => {
      const caseMatch = searchCases.find(c => {
        const matchesReference = c.case_reference.toLowerCase().includes(searchCaseReference.toLowerCase());
        return matchesReference;
      }) || null;

      setSearchResult(caseMatch);
      setSearchLoading(false);
    }, 500);
  };
  
  const resetSearch = () => {
    setSearchCaseReference('');
    setSearchCourtLevel('');
    setSearchResult(null);
    setSearchPerformed(false);
    setSearchError('');
  };
  
  return (
    <div>
        <div className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
      <div className={`rounded-xl p-1.5 ${isDarkTheme ? '' : 'bg-white/90'}`}>
        <h2 className={`text-lg text-center font-semibold mb-4 ${isDarkTheme ? 'text-white' : 'text-slate-900'}`}>
          Case Reference Lookup
        </h2>

        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkTheme ? 'text-slate-300' : 'text-slate-700'}`}>
              Case Reference
            </label>
            <input
              type="text"
              value={searchCaseReference}
              onChange={(e) => setSearchCaseReference(e.target.value)}
              placeholder="e.g., FAM/202/2026"
              className={`w-full px-4 py-1.5 rounded-md border focus:outline-none focus:ring-2 focus:ring-red-500 ${
                isDarkTheme ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
              }`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkTheme ? 'text-slate-300' : 'text-slate-700'}`}>
              Court Level
            </label>
            <select
              value={searchCourtLevel}
              onChange={(e) => setSearchCourtLevel(e.target.value)}
              className={`w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-red-500 ${
                isDarkTheme ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
              }`}
            >
              <option value="">Select Court Level</option>
              {searchCourtLevels.map(level => <option key={level} value={level}>{level}</option>)}
            </select>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSearch}
              disabled={searchLoading}
              className={`flex-1 px-4 py-2 rounded-md font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                isDarkTheme ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-red-500 hover:bg-red-600 text-white'
              }`}
            >
              {searchLoading ? (
                <div className="animate-spin rounded-xl h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Fa.FaSearch />
              )}
              Search
            </button>
            <button
              onClick={resetSearch}
              className={`flex-1 px-4 py-2 rounded-md font-medium transition-all duration-300 ${
                isDarkTheme ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
              }`}
            >
              Clear
            </button>
          </div>

          {searchError && !searchLoading && (
            <div className={`bg-red-100 py-2 text-center ${isDarkTheme ? 'bg-red-900/20 border-red-600 text-red-400' : 'bg-red-100 border-red-200 text-red-700'}`}>
              {searchError}
            </div>
          )}
        </div>
      </div>

        {searchPerformed && !searchLoading ? (
          searchResult ? (
            <div className="space-y-6">
              <div className={`rounded-xl border ${isDarkTheme ? 'border-slate-500' : 'border-slate-50 bg-slate-600/10'}`}>
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between p-6">
                  <div>
                    <p className="text-md uppercase font-semibold text-red-500">{searchCourtLevel || 'Case'} Case</p>
                    <h3 className={`mt-2 text-2xl font-semibold ${isDarkTheme ? 'text-white' : 'text-slate-900'}`}>
                      {searchResult.case_no}
                    </h3>
                    <p className={`mt-2 max-w-xl text-sm leading-6 ${isDarkTheme ? 'text-slate-400' : 'text-slate-600'}`}>
                      {searchResult.court} · {searchResult.case_subtype}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <span className={`inline-flex items-center rounded-xl px-3 py-1 text-xs font-semibold ${
                      searchResult.proceeding_outcome_status === 'Decided' ? 'bg-emerald-100 text-emerald-800' :
                      searchResult.proceeding_outcome_status === 'Pending' ? 'bg-amber-100 text-amber-800' :
                      'bg-sky-100 text-sky-800'
                    }`}>
                      {searchResult.proceeding_outcome_status}
                    </span>
                  </div>
                </div>

                <div className={`border-t  px-6 py-4 ${isDarkTheme ? 'border-slate-200' : 'border-slate-900'}`}>
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-xl bg-white/10 p-4">
                      <p className="text-md uppercase font-semibold text-red-500">Case Reference</p>
                      <p className={`mt-2 font-semibold ${isDarkTheme ? 'text-white' : 'text-slate-900'}`}>{searchResult.case_reference}</p>
                    </div>
                    <div className="rounded-xl bg-white/10 p-4">
                      <p className="text-md uppercase font-semibold text-red-500">Judge</p>
                      <p className={`mt-2 ${isDarkTheme ? 'text-slate-200' : 'text-slate-700'}`}>{searchResult.judge}</p>
                    </div>
                    <div className="rounded-xl bg-white/10 p-4">
                      <p className="text-md uppercase font-semibold text-red-500">Filing Date</p>
                      <p className={`mt-2 ${isDarkTheme ? 'text-slate-200' : 'text-slate-700'}`}>{new Date(searchResult.filing_date).toLocaleDateString()}</p>
                    </div>
                    <div className="rounded-xl bg-white/10 p-4">
                      <p className="text-md uppercase font-semibold text-red-500">Decision Date</p>
                      <p className={`mt-2 ${isDarkTheme ? 'text-slate-200' : 'text-slate-700'}`}>{searchResult.decision_date ? new Date(searchResult.decision_date).toLocaleDateString() : 'N/A'}</p>
                    </div>
                  </div>
                </div>

                 <div className={`border-t  px-6 py-4 ${isDarkTheme ? 'border-slate-200' : 'border-slate-900'}`}>
                  <div className="grid gap-4 lg:grid-cols-2">
                    <div className="rounded-xl  bg-white/10 p-5">
                      <p className="text-md uppercase font-semibold text-red-500">Case details</p>
                      <div className="mt-3 space-y-1 text-sm leading-6 ">
                        <p className={`${isDarkTheme ? 'text-white' : 'text-slate-700'}`}><span className={`font-semibold`}>Court:</span> {searchResult.court}</p>
                        <p className={`${isDarkTheme ? 'text-white' : 'text-slate-700'}`}><span className={`font-semibold`}>Type:</span> {searchResult.case_subtype}</p>
                        <p className={`${isDarkTheme ? 'text-white' : 'text-slate-700'}`}><span className={`font-semibold`}>Status:</span> {searchResult.proceeding_outcome_status}</p>
                      </div>
                    </div>
                    <div className="rounded-xl p-5 bg-white/10">
                      <p className="text-md uppercase font-semibold text-red-500">Case Parties</p>
                      <div className="mt-3 space-y-3">
                        <p className={`text-lg font-semibold ${isDarkTheme ? 'text-white' : 'text-slate-700'}`}>{searchResult.parties_array}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center min-h-96 text-center">
              <div>
                <Fa.FaSearch className="w-12 h-12 mx-auto mb-3 text-red-500" />
                <p className=" text-xl text-slate-500">No case found. Please try different search criteria.</p>
              </div>
            </div>
          )
        ) : (
          <div className="flex items-center justify-center min-h-96 text-center">
            <p className="text-xl text-slate-500">Use the form on the left to fetch case details.</p>
          </div>
        )}
      
    </div>
    </div>
  )
}
export default ByRefNoSection
