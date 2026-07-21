'use client';

import { useState, useEffect } from 'react';
import * as Fa from 'react-icons/fa';
import TextInput from '@/app/components/TextInput';
import SearchableDropdown from '@/app/components/SearchableDropdown';
import SelectInput from '@/app/components/SelectInput';
import FormButtons from '@/app/components/FormButtons';
import { useCaseFetch } from '@/hooks/useCaseDetails';

interface CaseNumberFormProps {
  caseNumber: string;
  setCaseNumber: (value: string) => void;
  courtLevel: string;
  setCourtLevel: (value: string) => void;
  courtLevelSearchTerm: string;
  setCourtLevelSearchTerm: (value: string) => void;
  courtLevels: string[];
  courtName: string;
  setCourtName: (value: string) => void;
  courtNameSearchTerm: string;
  setCourtNameSearchTerm: (value: string) => void;
  filteredCourts: string[];
  filingYear: string;
  setFilingYear: (value: string) => void;
  caseType: string;
  setCaseType: (value: string) => void;
  caseTypeSearchTerm: string;
  setCaseTypeSearchTerm: (value: string) => void;
  getYears: () => number[];
  errors: {
    court: string;
    caseNumber?: string;
    filingYear?: string;
    caseType?: string;
  };
  loading: boolean;
  isDarkTheme: boolean;
  onReset: () => void;
  fetchingCourts?: boolean;
}

export default function CaseNumberForm({
  caseNumber,
  setCaseNumber,
  courtLevel,
  setCourtLevel,
  courtLevelSearchTerm,
  setCourtLevelSearchTerm,
  courtLevels = [],
  courtName,
  setCourtName,
  courtNameSearchTerm,
  setCourtNameSearchTerm,
  filteredCourts = [],
  filingYear,
  setFilingYear,
  caseType,
  setCaseType,
  caseTypeSearchTerm,
  setCaseTypeSearchTerm,
  getYears,
  errors,
  loading,
  isDarkTheme,
  onReset,
  fetchingCourts = false,
}: CaseNumberFormProps) {

  const { fetchCaseTypes, loading: caseTypesLoading, error: caseTypesError } = useCaseFetch();
  const [caseTypes, setCaseTypes] = useState<string[]>([]);

  // Fetch case types when court level changes
  useEffect(() => {
    const loadCaseTypes = async () => {
      if (!courtLevel) {
        setCaseTypes([]);
        return;
      }
      const types = await fetchCaseTypes(courtLevel);
      setCaseTypes(types);
      if (caseType && !types.includes(caseType)) {
        setCaseType('');
      }
    };
    loadCaseTypes();
  }, [courtLevel, fetchCaseTypes, caseType, setCaseType]);

  const filteredCaseTypes = caseTypes.filter(type =>
    type.toLowerCase().includes(caseTypeSearchTerm.toLowerCase())
  );

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <TextInput
          value={caseNumber}
          label="Case Number"
          placeholder="Enter case number..."
          required
          error={errors.caseNumber}
          isDarkTheme={isDarkTheme}
          onChange={setCaseNumber}
          icon={<Fa.FaSearch className="w-4 h-4" />}
        />
        <SelectInput
          value={filingYear}
          options={getYears().map(year => ({ value: year.toString(), label: year.toString() }))}
          label="Filing Year"
          placeholder="Select filing year..."
          required
          error={errors.filingYear}
          isDarkTheme={isDarkTheme}
          onChange={setFilingYear}
          icon={<Fa.FaCalendarAlt className="w-4 h-4" />}
        />
      </div>

      <SearchableDropdown
        value={courtLevel}
        searchTerm={courtLevelSearchTerm}
        options={courtLevels}
        label="Court Level"
        placeholder="Select Primary Court or Other Level Court..."
        required
        error={errors.court}
        isDarkTheme={isDarkTheme}
        onSelect={setCourtLevel}
        onSearchChange={setCourtLevelSearchTerm}
        icon={<Fa.FaBalanceScale className="w-4 h-4" />}
      />

      <SearchableDropdown
        value={courtName}
        searchTerm={courtNameSearchTerm}
        options={filteredCourts}
        label="Court Name"
        placeholder={fetchingCourts ? "Loading courts..." : "Search or select a court..."}
        required
        error={errors.court}
        isDarkTheme={isDarkTheme}
        onSelect={setCourtName}
        onSearchChange={setCourtNameSearchTerm}
        icon={<Fa.FaBuilding className="w-4 h-4" />}
        disabled={fetchingCourts}
      />

      <SearchableDropdown
        value={caseType}
        searchTerm={caseTypeSearchTerm}
        options={filteredCaseTypes}
        label="Case Type"
        placeholder={
          !courtLevel ? "Please select a court level first..." :
          caseTypesLoading ? "Loading case types..." :
          caseTypesError ? "Error loading case types" :
          "Search or select a case type..."
        }
        required
        error={errors.caseType || caseTypesError || undefined}
        isDarkTheme={isDarkTheme}
        onSelect={setCaseType}
        onSearchChange={setCaseTypeSearchTerm}
        icon={<Fa.FaGavel className="w-4 h-4" />}
        disabled={!courtLevel || caseTypesLoading || !!caseTypesError}
      />

      <FormButtons
        isDarkTheme={isDarkTheme}
        searchLabel="Apply filters"
        resetLabel="Reset"
        onSearch={() => {}}
        onReset={onReset}
        isLoading={loading}
      />
    </>
  );
}