
'use client';

import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
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

export const generateExcel = async ({
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

  // Create workbook and worksheet
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Cause List');

  worksheet.getColumn(1).width = 6;   
  worksheet.getColumn(2).width = 50;  
  worksheet.getColumn(3).width = 60;  
  worksheet.getColumn(4).width = 35;  
  worksheet.getColumn(5).width = 25; 
  worksheet.getColumn(6).width = 15; 
  worksheet.getColumn(7).width = 14;  
  worksheet.getColumn(8).width = 22;  

  // Helper to get case title
  const getCaseTitle = (caseItem: Case) => {
    return `${caseItem.caseTitle} (${caseItem.caseReference})`.trim();
  };

  // Helper to safely get value
  const safeString = (value: string | undefined | null): string => {
    return value || 'N/A';
  };


  const titleRow = worksheet.addRow(['THE JUDICIARY OF TANZANIA']);
  worksheet.mergeCells(`A${titleRow.number}:H${titleRow.number}`);
  titleRow.getCell(1).font = {
    name: 'Helvetica',
    size: 18,
    bold: true,
  };
  titleRow.getCell(1).alignment = {
    horizontal: 'center',
    vertical: 'middle',
  };


  const courtRow = worksheet.addRow([selectedCourt]);
  worksheet.mergeCells(`A${courtRow.number}:H${courtRow.number}`);
  courtRow.getCell(1).font = {
    name: 'Helvetica',
    size: 16,
    bold: true,
    color: { argb: 'FFC00000' },
  };
  courtRow.getCell(1).alignment = {
    horizontal: 'center',
    vertical: 'middle', 
  };


  const dateRow = worksheet.addRow([
    `Cause List From: ${startDate || 'N/A'}  To  ${endDate || 'N/A'}`
  ]);
  worksheet.mergeCells(`A${dateRow.number}:H${dateRow.number}`);
  dateRow.getCell(1).font = {
    name: 'Helvetica',
    size: 12,
    bold: true,
  };
  dateRow.getCell(1).alignment = {
    horizontal: 'center',
    vertical: 'middle', 
  };


  const headerRow = worksheet.addRow([
    'SN',
    'Case Title',
    'Case Parties',
    'Judge/Magistrate',
    'Case Stage',
    'Date',
    'Time',
    'Court Room',
  ]);

  headerRow.eachCell((cell) => {
    cell.font = {
      name: 'Helvetica',
      size: 12,
      bold: true,
      color: { argb: 'FFFFFFFF' },
    };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFC00000' },
    };
    cell.alignment = {
      horizontal: 'center',
      vertical: 'middle', 
      wrapText: true,
    };
    cell.border = {
      top: { style: 'thin', color: { argb: 'FFFFFFFF' } },
      bottom: { style: 'thin', color: { argb: 'FFFFFFFF' } },
      left: { style: 'thin', color: { argb: 'FFFFFFFF' } },
      right: { style: 'thin', color: { argb: 'FFFFFFFF' } },
    };
  });

  // ============ DATA ROWS ============
  cases.forEach((caseItem, index) => {
    const row = worksheet.addRow([
      index + 1,
      getCaseTitle(caseItem),
      safeString(caseItem.caseParties),
      safeString(caseItem.judgeName),
      safeString(caseItem.nextStage),
      formatDate(safeString(caseItem.nextStageDate)),
      formatTime(safeString(caseItem.nextStageTime)),
      safeString(caseItem.courtRoomName),
    ]);

    // Style each cell in the data row
    row.eachCell((cell, colNumber) => {
      cell.font = {
        name: 'Helvetica',
        size: 12,
      };
      cell.alignment = {
        vertical: 'top',
        wrapText: true,
        horizontal: colNumber === 1 ? 'center' : 'left',
      };
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFD9D9D9' } },
        bottom: { style: 'thin', color: { argb: 'FFD9D9D9' } },
        left: { style: 'thin', color: { argb: 'FFD9D9D9' } },
        right: { style: 'thin', color: { argb: 'FFD9D9D9' } },
      };
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { 
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
  });

  const courtName = selectedCourt || 'All_Courts';
  const dateStr = new Date().toISOString().split('T')[0];
  const fileName = `Cause_List_${courtName.replace(/\s+/g, '_')}_${dateStr}.xlsx`;

  saveAs(blob, fileName);
};