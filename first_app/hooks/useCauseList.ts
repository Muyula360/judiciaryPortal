import { useState, useEffect, useCallback, useRef } from 'react';
import { Case, Court } from '@/types';
import { API_CONFIG } from '@/config/api';

interface CourtApiResponse {
  court?: Array<{ id: number; name: string }>;
  data?: {
    esbBody?: Array<{ id: number; name: string }>;
    courts?: Array<{ id: number; name: string }>;
  };
}

interface CaseItem {
  id?: string | number;
  case_id?: string | number;
  filing_date?: string;
  case_number?: string;
  case_year?: string;
  court?: string;
  case_title?: string;
  case_parties?: string;
  assigned?: boolean;
  assigned_date?: string;
  judge_name?: string;
  case_reference?: string;
  next_stage_date?: string;
  next_stage_time?: string;
  next_stage?: string;
  court_room_name?: string;
  proceeding_outcome_status?: string;
  last_order?: string;
  case_outcome?: string;
  is_decided?: boolean;
}

interface CaseApiResponse {
  data?: {
    esbBody?: CaseItem[];
    success?: boolean;
    message?: string;
  };
}

const FALLBACK_COURTS: Court[] = [
  { id: 2, name: 'Arusha High Court' },
  { id: 1, name: 'Dar es Salaam High Court' },
  { id: 3, name: 'Mbeya High Court' },
  { id: 4, name: 'Mwanza High Court' },
  { id: 5, name: 'Tanga High Court' },
  { id: 6, name: 'Dodoma High Court' },
];


export function useCaseDetails() {
  const [cases, setCases] = useState<Case[]>([]);
  const [filteredCases, setFilteredCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingCourts, setFetchingCourts] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [courts, setCourts] = useState<Court[]>([]);
  const [uniqueCourts, setUniqueCourts] = useState<string[]>([]);

  const hasFetchedCourts = useRef(false);

  const setFallbackCourts = useCallback(() => {
    setCourts(FALLBACK_COURTS);
    const courtNames = FALLBACK_COURTS.map((c) => c.name);
    setUniqueCourts(courtNames);
  }, []);
  const transformCaseItem = (item: CaseItem): Case => {
    let id: number | undefined;
    if (item.id !== undefined && item.id !== null) {
      id = typeof item.id === 'string' ? parseInt(item.id, 10) : item.id;
    } else if (item.case_id !== undefined && item.case_id !== null) {
      id = typeof item.case_id === 'string' ? parseInt(item.case_id, 10) : item.case_id;
    }

    return {
      id: id || 0,
      filingDate: item.filing_date || '',
      caseNumber: item.case_number || '',
      caseYear: item.case_year || '',
      court: item.court || '',
      caseTitle: item.case_title || '',
      caseParties: item.case_parties || '',
      assigned: item.assigned || false,
      assignedDate: item.assigned_date || '',
      judgeName: item.judge_name || '',
      caseReference: item.case_reference || '',
      nextStageDate: item.next_stage_date || '',
      nextStageTime: item.next_stage_time || '',
      nextStage: item.next_stage || '',
      courtRoomName: item.court_room_name || '',
      proceedingOutcomeStatus: item.proceeding_outcome_status || '',
      lastOrder: item.last_order || null,
      caseOutcome: item.case_outcome || null,
      isDecided: item.is_decided || false,
    };
  };

  const fetchCourts = useCallback(async () => {
    setFetchingCourts(true);
    setError(null);

    try {
      const response = await fetch(API_CONFIG.COURTS);

      if (!response.ok) {
        throw new Error(`Failed to fetch courts: ${response.status} ${response.statusText}`);
      }

      const data: CourtApiResponse = await response.json();

      let courtData: Array<{ id: number; name: string }> = [];

      if (data?.court && Array.isArray(data.court)) {
        courtData = data.court;
      } else if (data?.data?.esbBody && Array.isArray(data.data.esbBody)) {
        courtData = data.data.esbBody;
      } else if (data?.data?.courts && Array.isArray(data.data.courts)) {
        courtData = data.data.courts;
      }

      const mappedCourts: Court[] = courtData
        .map((court: { id: number; name: string }) => ({
          id: court.id,
          name: court.name || '',
        }))
        .filter((court) => court.id !== undefined && court.id !== null && court.name && court.name.trim() !== '');

      if (mappedCourts.length > 0) {
        setCourts(mappedCourts);
        const courtNames = mappedCourts
          .map((court: Court) => court.name)
          .filter((name): name is string => name !== null && name !== undefined && name.trim() !== '');
        setUniqueCourts([...new Set(courtNames)]);
      } else {
        setFallbackCourts();
      }
    } catch (err) {
      console.error('Error fetching courts:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch courts');
      setFallbackCourts();
    } finally {
      setFetchingCourts(false);
    }
  }, [setFallbackCourts]);

  const fetchCases = useCallback(
    async (params: { court: string; fromDate: string; toDate: string }) => {
      setLoading(true);
      setError(null);

      try {
        // Ensure courts are loaded
        if (courts.length === 0 && !fetchingCourts) {
          await fetchCourts();
        }

        // Find selected court
        let selectedCourt = courts.find(
          (c) => c.name?.toLowerCase() === params.court.toLowerCase()
        );

        if (!selectedCourt) {
          selectedCourt = courts.find(
            (c) =>
              c.name?.toLowerCase().includes(params.court.toLowerCase()) ||
              params.court.toLowerCase().includes(c.name?.toLowerCase() || '')
          );
        }

        // Fallback to first court or create one
        if (!selectedCourt) {
          if (courts.length > 0) {
            selectedCourt = courts[0];
          } else {
            selectedCourt = { id: 2, name: params.court };
            setCourts([selectedCourt]);
            setUniqueCourts([params.court]);
          }
        }

        const courtId = selectedCourt.id;
        const url = `${API_CONFIG.CAUSE_LIST}/${courtId}/${params.fromDate}/${params.toDate}`;

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`Failed to fetch cases: ${response.statusText}`);
        }

        const result: CaseApiResponse = await response.json();

        let casesData: CaseItem[] = [];
        if (result.data?.esbBody) {
          casesData = Array.isArray(result.data.esbBody) ? result.data.esbBody : [];
        } else if (result.data) {
          casesData = Array.isArray(result.data) ? (result.data as unknown as CaseItem[]) : [];
        }

        const transformedCases: Case[] = casesData.map(transformCaseItem);

        setCases(transformedCases);
        setFilteredCases(transformedCases);
      } catch (err) {
        console.error('Error fetching cases:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch cases');
        setCases([]);
        setFilteredCases([]);
      } finally {
        setLoading(false);
      }
    },
    [courts, fetchingCourts, fetchCourts]
  );

  const clearCases = useCallback(() => {
    setCases([]);
    setFilteredCases([]);
    setError(null);
  }, []);


  useEffect(() => {
    if (!hasFetchedCourts.current) {
      hasFetchedCourts.current = true;
      fetchCourts();
    }
  }, [fetchCourts]);


  return {
    cases,
    filteredCases,
    loading,
    fetchingCourts,
    error,
    fetchCases,
    fetchCourts,
    courts,
    uniqueCourts,
    clearCases,
  };
}