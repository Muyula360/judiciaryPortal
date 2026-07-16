// app/home/(pages)/cause_list/components/ReferenceNumberForm.tsx

'use client';

import * as Fa from 'react-icons/fa';
import TextInput from '@/app/components/TextInput';
import SearchableDropdown from '@/app/components/SearchableDropdown';
import FormButtons from '@/app/components/FormButtons';

interface ReferenceNumberFormProps {
  selectedCourt: string;
  setSelectedCourt: (value: string) => void;
  courtSearchTerm: string;
  setCourtSearchTerm: (value: string) => void;
  courtLevels: string[];
  referenceNumber: string;
  setReferenceNumber: (value: string) => void;
  errors: {
    court: string;
    referenceNumber?: string;
  };
  loading: boolean;
  apiLoading: boolean;
  isDarkTheme: boolean;
  onReset: () => void;
}

export default function ReferenceNumberForm({
  selectedCourt,
  setSelectedCourt,
  courtSearchTerm,
  setCourtSearchTerm,
  courtLevels,
  referenceNumber,
  setReferenceNumber,
  errors,
  loading,
  apiLoading,
  isDarkTheme,
  onReset,
}: ReferenceNumberFormProps) {
  return (
    <>
      <SearchableDropdown
        value={selectedCourt}
        searchTerm={courtSearchTerm}
        options={courtLevels}
        label="Court Level"
        placeholder="Select Primary Court or Other Level Court..."
        required
        error={errors.court}
        isDarkTheme={isDarkTheme}
        onSelect={setSelectedCourt}
        onSearchChange={setCourtSearchTerm}
        icon={<Fa.FaBuilding className="w-4 h-4" />}
      />

      <TextInput
        value={referenceNumber}
        label="Reference Number"
        placeholder="Enter reference number..."
        required
        error={errors.referenceNumber}
        isDarkTheme={isDarkTheme}
        onChange={setReferenceNumber}
        icon={<Fa.FaFileAlt className="w-4 h-4" />}
      />

      <FormButtons
        isDarkTheme={isDarkTheme}
        searchLabel="Search Case"
        resetLabel="Reset"
        onSearch={() => {}}
        onReset={onReset}
        isLoading={loading || apiLoading}
        showReset={true}
      />
    </>
  );
}