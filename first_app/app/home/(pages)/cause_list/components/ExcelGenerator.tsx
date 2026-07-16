'use client';
import * as XLSX from 'xlsx-js-style';
import { Case } from '@/types';

interface ExcelGeneratorProps {
  cases: Case[];
  selectedCourt: string;
  formatDate: (date: string) => string;
  formatTime: (date: string) => string;
  formatYear: (date: string) => string;
  startDate?: string;
  endDate?: string;
}

export const generateExcel = ({
  cases,
  selectedCourt,
  formatDate,
  formatTime,
  formatYear,
  startDate,
  endDate,
}: ExcelGeneratorProps) => {
  if (cases.length === 0) {
    alert('No cases to export.');
    return;
  }

  const getCaseTitle = (caseItem: Case) => {
    return `${caseItem.caseTitle} (${caseItem.caseReference})`.trim();
  };

  // Prepare data for Excel
  const excelData = cases.map((caseItem, index) => ({
    'SN': index + 1,
    'Case Title': getCaseTitle(caseItem),
    'Case Parties': caseItem.caseParties,
    'Judge/Magistrate': caseItem.judgeName,
    'Case Stage': caseItem.nextStage,
    'Date': formatDate(caseItem.nextStageDate),
    'Time': formatTime(caseItem.nextStageTime),
    'Court Room': caseItem.courtRoomName,
  }));

  // Create workbook and worksheet
  const wb = XLSX.utils.book_new();
  
  // Create a new worksheet with all data including headers
  const ws = XLSX.utils.aoa_to_sheet([]);

  // Prepare all rows including title, headers and data
  const headers = ['SN', 'Case Title', 'Case Parties', 'Judge/Magistrate', 'Case Stage', 'Date', 'Time', 'Court Room'];
  
  // Build the complete data array
  const allData = [
    ['THE JUDICIARY OF TANZANIA'],  
    [`${selectedCourt}`], 
    [`Cause List From: ${startDate || 'N/A'}  To  ${endDate || 'N/A'}`],
    headers,
    ...excelData.map(item => [
      item['SN'],
      item['Case Title'],
      item['Case Parties'],
      item['Judge/Magistrate'],
      item['Case Stage'],
      item['Date'],
      item['Time'],
      item['Court Room']
    ])
  ];

  // Add all data to sheet
  XLSX.utils.sheet_add_aoa(ws, allData, { origin: 'A1' });

  ws['!cols'] = [
    { wch: 6 },   
    { wch: 55 }, 
    { wch: 60 }, 
    { wch: 35 },  
    { wch: 25 }, 
    { wch: 15 }, 
    { wch: 10 }, 
    { wch: 18 }, 
  ];

 // Merge title rows
ws["!merges"] = [
  { s: { r: 0, c: 0 }, e: { r: 0, c: 7 } },
  { s: { r: 1, c: 0 }, e: { r: 1, c: 7 } },
  { s: { r: 2, c: 0 }, e: { r: 2, c: 7 } },
];


// A1 - Judiciary
ws["A1"].s = {
  font: {
    bold: true,
    sz: 18,
    name: "Helvetica",
  },
  alignment: {
    horizontal: "center",
    vertical: "center",
  },
};

// A2 - Court
ws["A2"].s = {
  font: {
    bold: true,
    sz: 16,
    color: { rgb: "C00000" },
    name: "Helvetica",
  },
  alignment: {
    horizontal: "center",
    vertical: "center",
  },
};

// A3 - Date Range
ws["A3"].s = {
  font: {
    bold: true,
    sz: 12,
    name: "Helvetica",
  },
  alignment: {
    horizontal: "center",
    vertical: "center",
  },
};

// Header row (A4:H4)
for (let c = 0; c < 8; c++) {
  const cell = XLSX.utils.encode_cell({ r: 3, c });

  ws[cell].s = {
    font: {
      bold: true,
      sz: 12,
      color: { rgb: "FFFFFF" },
      name: "Helvetica",
    },
    fill: {
      patternType: "solid",
      fgColor: { rgb: "C00000" },
    },
    alignment: {
      horizontal: "center",
      vertical: "center",
      wrapText: true,
    },
    border: {
      top: { style: "thin", color: { rgb: "FFFFFF" } },
      bottom: { style: "thin", color: { rgb: "FFFFFF" } },
      left: { style: "thin", color: { rgb: "FFFFFF" } },
      right: { style: "thin", color: { rgb: "FFFFFF" } },
    },
  };
}

// Style data rows
const range = XLSX.utils.decode_range(ws["!ref"]!);

for (let r = 4; r <= range.e.r; r++) {
  for (let c = 0; c <= range.e.c; c++) {
    const cell = XLSX.utils.encode_cell({ r, c });

    if (!ws[cell]) continue;

    ws[cell].s = {
      font: {
        sz: 12,
        name: "Helvetica",
      },
      alignment: {
        vertical: "top",
        wrapText: true,
        horizontal: c === 0 ? "center" : "left",
      },
      border: {
        top: { style: "thin", color: { rgb: "D9D9D9" } },
        bottom: { style: "thin", color: { rgb: "D9D9D9" } },
        left: { style: "thin", color: { rgb: "D9D9D9" } },
        right: { style: "thin", color: { rgb: "D9D9D9" } },
      },
    };
  }
}

  XLSX.utils.book_append_sheet(wb, ws, 'Cause List');

  const courtName = selectedCourt;
  const dateStr = new Date().toISOString().split('T')[0];
  const fileName = `Cause_List_${courtName.replace(/\s+/g, '_')}_${dateStr}.xlsx`;

  XLSX.writeFile(wb, fileName);
};