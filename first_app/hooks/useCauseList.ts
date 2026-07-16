// hooks/useCauseList.ts
import { useState, useEffect, useCallback } from 'react';
import { Case, Court } from '@/types';
import { API_CONFIG } from '@/config/api';

export function useCaseDetails() {
  const [cases, setCases] = useState<Case[]>([]);
  const [filteredCases, setFilteredCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingCourts, setFetchingCourts] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [courts, setCourts] = useState<Court[]>([]);
  const [uniqueCourts, setUniqueCourts] = useState<string[]>([]);

  const fetchCourts = useCallback(async () => {
    setFetchingCourts(true);
    setError(null);
    
    try {
      const response = await fetch(API_CONFIG.COURTS);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch courts: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      let courtData = [];
      
      if (data?.court && Array.isArray(data.court)) {
        courtData = data.court;
      } else if (data?.data?.esbBody) {
        courtData = data.data.esbBody;
      } else if (data?.data) {
        courtData = data.data;
      } else if (Array.isArray(data)) {
        courtData = data;
      }
      
      const mappedCourts = courtData
        .map((court: any) => ({
          id: court.id || court.court_id,
          name: court.name || court.court_name || court.courtName,
        }))
        .filter((court: Court) => court.id && court.name);
      
      if (mappedCourts.length > 0) {
        setCourts(mappedCourts);
        const courtNames = mappedCourts.map((court: Court) => court.name);
        setUniqueCourts([...new Set(courtNames)]);
      } else {
        useFallbackCourts();
      }
      
    } catch (err) {
      useFallbackCourts();
    } finally {
      setFetchingCourts(false);
    }
  }, []);

  const useFallbackCourts = useCallback(() => {
    const fallbackCourts: Court[] = [
      { id: 2, name: 'Arusha High Court' },
      { id: 1, name: 'Dar es Salaam High Court' },
      { id: 3, name: 'Mbeya High Court' },
      { id: 4, name: 'Mwanza High Court' },
      { id: 5, name: 'Tanga High Court' },
      { id: 6, name: 'Dodoma High Court' },
    ];
    
    setCourts(fallbackCourts);
    const courtNames = fallbackCourts.map(c => c.name);
    setUniqueCourts(courtNames);
  }, []);

  const fetchCases = useCallback(async (params: {
    court: string;
    fromDate: string;
    toDate: string;
  }) => {
    setLoading(true);
    setError(null);

    try {
      if (courts.length === 0 && !fetchingCourts) {
        await fetchCourts();
      }

      let selectedCourt = courts.find(c => 
        c.name?.toLowerCase() === params.court.toLowerCase()
      );
      
      if (!selectedCourt) {
        selectedCourt = courts.find(c => 
          c.name?.toLowerCase().includes(params.court.toLowerCase()) ||
          params.court.toLowerCase().includes(c.name?.toLowerCase() || '')
        );
      }

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
      
      const result = await response.json();
      
      let casesData = [];
      if (result.data?.esbBody) {
        casesData = result.data.esbBody;
      } else if (result.data) {
        casesData = result.data;
      } else if (Array.isArray(result)) {
        casesData = result;
      }
      
      if (!Array.isArray(casesData)) {
        casesData = [];
      }
      
      const transformedCases = casesData.map((caseItem: any) => ({
        id: caseItem.id,
        filingDate: caseItem.filing_date,
        caseNumber: caseItem.case_number,
        caseYear: caseItem.case_year,
        court: caseItem.court,
        caseTitle: caseItem.case_title,
        caseParties: caseItem.case_parties,
        assigned: caseItem.assigned,
        assignedDate: caseItem.assigned_date,
        judgeName: caseItem.judge_name,
        caseReference: caseItem.case_reference,
        nextStageDate: caseItem.next_stage_date,
        nextStageTime: caseItem.next_stage_time,
        nextStage: caseItem.next_stage,
        courtRoomName: caseItem.court_room_name,
        proceedingOutcomeStatus: caseItem.proceeding_outcome_status,
        lastOrder: caseItem.last_order,
        caseOutcome: caseItem.case_outcome,
        isDecided: caseItem.is_decided,
      }));
      
      setCases(transformedCases);
      setFilteredCases(transformedCases);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch cases');
      setCases([]);
      setFilteredCases([]);
    } finally {
      setLoading(false);
    }
  }, [courts, fetchingCourts, fetchCourts]);

  const clearCases = useCallback(() => {
    setCases([]);
    setFilteredCases([]);
    setError(null);
  }, []);

  useEffect(() => {
    fetchCourts();
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