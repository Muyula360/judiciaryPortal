
'use client';

import * as XLSX from 'xlsx';

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

interface ExcelGeneratorProps {
  cases: Case[];
  selectedCourt: string;
  formatDate: (date: string) => string;
  formatTime: (time: string) => string;
}

export const generateExcel = ({
  cases,
  selectedCourt,
  formatDate,
  formatTime,
}: ExcelGeneratorProps) => {
  if (cases.length === 0) {
    alert('No cases to export.');
    return;
  }

  const excelData = cases.map((caseItem, index) => ({
    'SN': index + 1,
    'Case Title': caseItem.caseTitle,
    'Case Parties': caseItem.caseParties,
    'Judge/Magistrate': caseItem.judgeName,
    'Case Stage': caseItem.caseStage,
    'Date': formatDate(caseItem.date),
    'Time': formatTime(caseItem.time),
    'Court Room': `Court Room ${caseItem.courtRoom}`
  }));

  const ws = XLSX.utils.json_to_sheet(excelData);
  ws['!cols'] = [
    { wch: 6 },   // SN
    { wch: 35 },  // Case Title
    { wch: 40 },  // Case Parties
    { wch: 30 },  // Judge/Magistrate
    { wch: 18 },  // Case Stage
    { wch: 25 },  // Date
    { wch: 15 },  // Time
    { wch: 20 },  // Court Room
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Cause List');

  const courtName = selectedCourt || 'All_Courts';
  const dateStr = new Date().toISOString().split('T')[0];
  const fileName = `Cause_List_${courtName.replace(/\s+/g, '_')}_${dateStr}.xlsx`;

  XLSX.writeFile(wb, fileName);
};