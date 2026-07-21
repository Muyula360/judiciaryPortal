// hooks/useCaseDetails.ts

import { useState, useCallback, useEffect, useRef } from 'react';
import { API_CONFIG } from '@/config/api';

// ✅ Define proper types for API responses
interface PrimaryCaseResponse {
  data: {
    success: boolean;
    esbBody: {
      case_reference: string;
      filing_date: string;
      case_number: string;
      case_year: string;
      court: string;
      district: string;
      zone: string;
      case_title: string;
      case_parties: string;
      magistrate_name: string;
      case_outcome: string;
      decided_date: string;
    };
    message?: string;
  };
  signature: string;
}

interface OtherLevelCaseResponse {
  data: {
    success: boolean;
    esbBody: {
      id: number;
      filing_date: string;
      case_number: string;
      case_year: string;
      court: string;
      case_title: string;
      case_parties: string;
      assigned: boolean;
      assigned_date: string;
      judge_name: string;
      case_reference: string;
      decidedDate: string;
      next_stage_date: string;
      next_stage_time: string;
      next_stage: string;
      court_room_name: string;
      proceeding_outcome_status: string;
      last_order: string;
      case_outcome: string;
      is_decided: boolean;
    };
    message?: string;
  };
  signature: string;
}

// ✅ Define types for case type responses
interface CaseTypeItem {
  id: number;
  name: string;
  status?: boolean;
}

interface CaseTypeResponse {
  case_subtype?: CaseTypeItem[];
  data?: CaseTypeItem[] | { case_subtype?: CaseTypeItem[] };
}

export interface FetchedCase {
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

// ✅ Define court type
interface CourtData {
  id: number;
  name: string;
}

export const useCaseFetch = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [caseTypesLoading, setCaseTypesLoading] = useState(false);
  const [caseTypesError, setCaseTypesError] = useState<string | null>(null);

  // ✅ Use refs to prevent multiple fetches
  const hasFetchedCourts = useRef(false);
  const hasFetchedCaseTypes = useRef(false);

  // --- fetchPrimaryCase (Reference Number - Primary) ---
  const fetchPrimaryCase = useCallback(async (referenceNumber: string): Promise<FetchedCase | null> => {
    try {
      const requestBody = JSON.stringify({ 
        case_reference: referenceNumber
      });
      
      const response = await fetch(
        API_CONFIG.PRIMARY_CASE_BY_REFERENCE,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: requestBody
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: PrimaryCaseResponse = await response.json();
      
      if (!data.data || !data.data.success) {
        throw new Error(data.data?.message || 'Case not found');
      }
      
      if (!data.data.esbBody) {
        throw new Error('No case data received');
      }

      const caseData = data.data.esbBody;
      
      return {
        id: caseData.case_reference,
        caseTitle: caseData.case_title || `Case No. ${caseData.case_number}/${caseData.case_year}`,
        judgeName: caseData.magistrate_name || 'N/A',
        caseParties: caseData.case_parties || 'N/A',
        refNo: caseData.case_reference,
        courtRoom: 'N/A',
        courtName: caseData.court || 'Primary Court',
        time: 'N/A',
        date: caseData.filing_date || new Date().toISOString().split('T')[0],
        caseStage: caseData.case_outcome || 'Pending',
        caseOutcome: caseData.case_outcome || 'N/A',
        filingDate: caseData.filing_date,
        courtLevel: 'Primary Court',
        reference: caseData.case_reference,
        caseNumber: caseData.case_number,
        caseYear: caseData.case_year,
        decidedDate: caseData.decided_date,
      };
    } catch (err) {
      console.error('Primary Case Fetch Error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    }
  }, []);

  // --- fetchOtherLevelCase (Reference Number - Other Level) ---
  const fetchOtherLevelCase = useCallback(async (referenceNumber: string): Promise<FetchedCase | null> => {
    try {
      const requestBody = JSON.stringify({ 
        reference_number: referenceNumber
      });
      
      const response = await fetch(
        API_CONFIG.OTHER_LEVEL_CASE_BY_REFERENCE,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: requestBody
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: OtherLevelCaseResponse = await response.json();
      
      if (!data.data || !data.data.success) {
        throw new Error(data.data?.message || 'Case not found');
      }
      
      if (!data.data.esbBody) {
        throw new Error('No case data received');
      }

      const caseData = data.data.esbBody;
      
      let courtRoom = 'N/A';
      if (caseData.court_room_name && caseData.court_room_name !== 'Any Other') {
        const roomMatch = caseData.court_room_name.match(/\d+/);
        courtRoom = roomMatch ? roomMatch[0] : caseData.court_room_name;
      }

      let caseStage = 'Pending';
      if (caseData.is_decided) {
        caseStage = 'Decided';
      } else if (caseData.next_stage) {
        caseStage = caseData.next_stage;
      } else if (caseData.proceeding_outcome_status) {
        caseStage = caseData.proceeding_outcome_status;
      }

      return {
        id: caseData.id?.toString() || caseData.case_reference,
        caseTitle: caseData.case_title || `Case No. ${caseData.case_number}/${caseData.case_year}`,
        judgeName: caseData.judge_name || 'N/A',
        caseParties: caseData.case_parties || 'N/A',
        refNo: caseData.case_reference,
        courtRoom: courtRoom,
        courtName: caseData.court || 'Court',
        time: caseData.next_stage_time ? caseData.next_stage_time.substring(0, 5) : 'N/A',
        date: caseData.filing_date || new Date().toISOString().split('T')[0],
        caseStage: caseStage,
        caseOutcome: caseData.proceeding_outcome_status || 'N/A',
        filingDate: caseData.filing_date,
        courtLevel: 'Other Level Court',
        reference: caseData.case_reference,
        caseNumber: caseData.case_number,
        caseYear: caseData.case_year,
        decidedDate: caseData.next_stage_date,
        nextStageDate: caseData.next_stage_date
      };
    } catch (err) {
      console.error('Other Level Case Fetch Error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    }
  }, []);

  // --- fetchCaseByLevel (Reference Number - Routes to correct endpoint) ---
  const fetchCaseByLevel = useCallback(async (referenceNumber: string, courtLevel: string): Promise<FetchedCase | null> => {
    setLoading(true);
    setError(null);
    
    try {
      if (!referenceNumber || !referenceNumber.trim()) {
        throw new Error('Reference number is required');
      }

      const cleanedReference = referenceNumber.trim();
      const isPrimaryCourt = courtLevel.toLowerCase().includes('primary');
      
      let result: FetchedCase | null = null;
      
      if (isPrimaryCourt) {
        result = await fetchPrimaryCase(cleanedReference);
      } else {
        result = await fetchOtherLevelCase(cleanedReference);
      }
      
      if (!result) {
        throw new Error('Case not found for the selected court level. Please verify the reference number.');
      }
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while fetching case details';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchPrimaryCase, fetchOtherLevelCase]);

  // --- ID mappings and fetch by case number ---
  const [courtsMap, setCourtsMap] = useState<Map<string, number>>(new Map());
  const [primaryCaseTypesMap, setPrimaryCaseTypesMap] = useState<Map<string, number>>(new Map());
  const [otherCaseTypesMap, setOtherCaseTypesMap] = useState<Map<string, number>>(new Map());
  const [loadingMappings, setLoadingMappings] = useState(false);

  // --- fetchCourtsWithIds ---
  const fetchCourtsWithIds = useCallback(async (): Promise<Map<string, number>> => {
    setLoadingMappings(true);
    
    try {
      const response = await fetch(API_CONFIG.COURTS);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch courts: ${response.status}`);
      }
      
      const data = await response.json();
      let courts: CourtData[] = [];
      
      if (data && data.court && Array.isArray(data.court)) {
        courts = data.court;
      } else if (data?.data?.courts && Array.isArray(data.data.courts)) {
        courts = data.data.courts;
      } else if (Array.isArray(data)) {
        courts = data;
      }
      
      const map = new Map<string, number>();
      courts.forEach((court) => {
        if (court.id && court.name) {
          map.set(court.name, court.id);
        }
      });
      
      setCourtsMap(map);
      return map;
    } catch (error) {
      console.error('Error fetching courts:', error);
      setError('Failed to load courts. Please refresh and try again.');
      return new Map();
    } finally {
      setLoadingMappings(false);
    }
  }, []);

  // --- fetchCaseTypesWithIds ---
  const fetchCaseTypesWithIds = useCallback(async (courtLevel: string): Promise<Map<string, number>> => {
    setCaseTypesLoading(true);
    setCaseTypesError(null);
    
    try {
      const isPrimary = courtLevel.toLowerCase().includes('primary');
      const endpoint = isPrimary
        ? API_CONFIG.PRIMARY_CASE_TYPES
        : API_CONFIG.OTHER_CASE_TYPES;

      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error('Failed to fetch case types');
      }
      const data: CaseTypeResponse = await response.json();
      
      let types: CaseTypeItem[] = [];
      
      if (isPrimary) {
        if (Array.isArray(data)) {
          types = data
            .filter((item: CaseTypeItem) => item.status !== false)
            .map((item: CaseTypeItem) => ({ id: item.id, name: item.name }));
        }
      } else {
        if (data?.case_subtype && Array.isArray(data.case_subtype)) {
          types = data.case_subtype.map((item: CaseTypeItem) => ({ id: item.id, name: item.name }));
        } else if (Array.isArray(data)) {
          types = data.map((item: CaseTypeItem) => ({ id: item.id, name: item.name }));
        }
      }
      
      const map = new Map<string, number>();
      types.forEach((type) => {
        if (type.id && type.name) {
          map.set(type.name, type.id);
        }
      });
      
      if (isPrimary) {
        setPrimaryCaseTypesMap(map);
      } else {
        setOtherCaseTypesMap(map);
      }
      return map;
    } catch (error) {
      console.error('Error fetching case types:', error);
      setCaseTypesError('Failed to load case types');
      return new Map();
    } finally {
      setCaseTypesLoading(false);
    }
  }, []);

  // --- fetchCaseTypes (returns only names) ---
  const fetchCaseTypes = useCallback(async (courtLevel: string): Promise<string[]> => {
    const map = await fetchCaseTypesWithIds(courtLevel);
    return Array.from(map.keys());
  }, [fetchCaseTypesWithIds]);

  // --- fetchCaseByNumber (Case Number Search) ---
  const fetchCaseByNumber = useCallback(async (
    caseNumber: string,
    courtLevel: string,
    courtName: string,
    filingYear: string,
    caseType: string
  ): Promise<FetchedCase | null> => {
    setLoading(true);
    setError(null);

    try {
      if (!caseNumber.trim()) throw new Error('Case number is required');
      if (!courtLevel) throw new Error('Court level is required');
      if (!courtName) throw new Error('Court name is required');
      if (!filingYear) throw new Error('Filing year is required');
      if (!caseType) throw new Error('Case type is required');

      // Get court ID
      let courtId: number | undefined;
      if (courtsMap.size === 0) {
        await fetchCourtsWithIds();
      }
      
      courtId = courtsMap.get(courtName);
      
      if (!courtId) {
        const lowerCourtName = courtName.toLowerCase();
        for (const [key, value] of courtsMap) {
          if (key.toLowerCase() === lowerCourtName) {
            courtId = value;
            break;
          }
        }
      }
      
      if (!courtId) {
        const lowerCourtName = courtName.toLowerCase();
        for (const [key, value] of courtsMap) {
          if (key.toLowerCase().includes(lowerCourtName) || lowerCourtName.includes(key.toLowerCase())) {
            courtId = value;
            break;
          }
        }
      }
      
      if (!courtId) {
        throw new Error(`Court "${courtName}" not found in the system`);
      }

      // Get case type ID
      const isPrimary = courtLevel.toLowerCase().includes('primary');
      const typeMap = isPrimary ? primaryCaseTypesMap : otherCaseTypesMap;
      
      if (typeMap.size === 0) {
        await fetchCaseTypesWithIds(courtLevel);
      }
      
      let caseTypeId = typeMap.get(caseType);
      
      if (!caseTypeId) {
        const lowerCaseType = caseType.toLowerCase();
        for (const [key, value] of typeMap) {
          if (key.toLowerCase() === lowerCaseType) {
            caseTypeId = value;
            break;
          }
        }
      }
      
      if (!caseTypeId) {
        const lowerCaseType = caseType.toLowerCase();
        for (const [key, value] of typeMap) {
          if (key.toLowerCase().includes(lowerCaseType) || lowerCaseType.includes(key.toLowerCase())) {
            caseTypeId = value;
            break;
          }
        }
      }
      
      if (!caseTypeId) {
        throw new Error(`Case type "${caseType}" not found for ${courtLevel}`);
      }

      // Build payload
      const payload = {
        case_number: caseNumber.trim(),
        courtId: courtId,
        case_year: filingYear,
        case_subtypeId: caseTypeId
      };

      const endpoint = isPrimary
        ? API_CONFIG.PRIMARY_CASE_DETAILS
        : API_CONFIG.OTHER_LEVEL_CASE_DETAILS;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!data.data || !data.data.success) {
        throw new Error(data.data?.message || 'Case not found');
      }

      const caseData = data.data.esbBody;

      if (isPrimary) {
        return {
          id: caseData.case_reference,
          caseTitle: caseData.case_title || `Case No. ${caseData.case_number}/${caseData.case_year}`,
          judgeName: caseData.magistrate_name || 'N/A',
          caseParties: caseData.case_parties || 'N/A',
          refNo: caseData.case_reference,
          courtRoom: 'N/A',
          courtName: caseData.court || 'Primary Court',
          time: 'N/A',
          date: caseData.filing_date || new Date().toISOString().split('T')[0],
          caseStage: caseData.case_outcome || 'Pending',
          caseOutcome: caseData.case_outcome || 'N/A',
          filingDate: caseData.filing_date,
          courtLevel: 'Primary Court',
          reference: caseData.case_reference,
          caseNumber: caseData.case_number,
          caseYear: caseData.case_year,
          decidedDate: caseData.decided_date,
        };
      } else {
        let courtRoom = 'N/A';
        if (caseData.court_room_name && caseData.court_room_name !== 'Any Other') {
          const roomMatch = caseData.court_room_name.match(/\d+/);
          courtRoom = roomMatch ? roomMatch[0] : caseData.court_room_name;
        }
        let caseStage = 'Pending';
        if (caseData.is_decided) {
          caseStage = 'Decided';
        } else if (caseData.next_stage) {
          caseStage = caseData.next_stage;
        } else if (caseData.proceeding_outcome_status) {
          caseStage = caseData.proceeding_outcome_status;
        }
        return {
          id: caseData.id?.toString() || caseData.case_reference,
          caseTitle: caseData.case_title || `Case No. ${caseData.case_number}/${caseData.case_year}`,
          judgeName: caseData.judge_name || 'N/A',
          caseParties: caseData.case_parties || 'N/A',
          refNo: caseData.case_reference,
          courtRoom: courtRoom,
          courtName: caseData.court || 'Court',
          time: caseData.next_stage_time ? caseData.next_stage_time.substring(0, 5) : 'N/A',
          date: caseData.filing_date || new Date().toISOString().split('T')[0],
          caseStage: caseStage,
          caseOutcome: caseData.proceeding_outcome_status || 'N/A',
          filingDate: caseData.filing_date,
          courtLevel: 'Other Level Court',
          reference: caseData.case_reference,
          caseNumber: caseData.case_number,
          caseYear: caseData.case_year,
          decidedDate: caseData.next_stage_date,
          nextStageDate: caseData.next_stage_date
        };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while fetching case details';
      console.error('Error in fetchCaseByNumber:', err);
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [courtsMap, primaryCaseTypesMap, otherCaseTypesMap, fetchCourtsWithIds, fetchCaseTypesWithIds]);

  // ✅ Pre-fetch with refs to prevent multiple calls
  useEffect(() => {
    if (!hasFetchedCourts.current) {
      hasFetchedCourts.current = true;
      fetchCourtsWithIds();
    }
  }, [fetchCourtsWithIds]);

  useEffect(() => {
    if (!hasFetchedCaseTypes.current) {
      hasFetchedCaseTypes.current = true;
      fetchCaseTypesWithIds('Primary Court');
      fetchCaseTypesWithIds('Other Level Court');
    }
  }, [fetchCaseTypesWithIds]);

  return {
    fetchPrimaryCase,
    fetchOtherLevelCase,
    fetchCaseByLevel,
    fetchCaseByNumber,
    fetchCaseTypes,
    fetchCourtsWithIds,
    fetchCaseTypesWithIds,
    loading,
    error,
    caseTypesLoading,
    caseTypesError,
    loadingMappings,
    setError,
    clearError: () => setError(null),
    courtsMap,
    primaryCaseTypesMap,
    otherCaseTypesMap,
  };
};