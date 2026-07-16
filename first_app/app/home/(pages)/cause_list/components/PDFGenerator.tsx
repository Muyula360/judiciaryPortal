'use client';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Case } from '@/types';

interface PDFGeneratorProps {
  cases: Case[];
  selectedCourt: string;
  startDate: string;
  endDate: string;
  formatDate: (date: string) => string;
  formatTime: (date: string) => string;
  formatYear: (date: string) => string;
}

export const generatePDF = ({
  cases,
  selectedCourt,
  startDate,
  endDate,
  formatDate,
  formatTime,
  formatYear,
}: PDFGeneratorProps) => {
  try {
    // Create new PDF document
    const doc = new jsPDF('landscape', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    // Helper to get case title
  const getCaseTitle = (caseItem: Case) => {
  return caseItem.caseReference
    ? `${caseItem.caseTitle}\n(${caseItem.caseReference})`
    : caseItem.caseTitle;
};
    
    // Header - Judiciary
    doc.setFontSize(18);
    doc.setTextColor(40, 40, 40);
    doc.text('THE JUDICIARY OF TANZANIA', pageWidth / 2, 20, { align: 'center' });

    // Court name
    doc.setFontSize(14);
    doc.setTextColor(220, 38, 38);
    doc.text(selectedCourt || 'Cause List', pageWidth / 2, 28, { align: 'center' });

    // Date range and title
    doc.setFontSize(11);
    doc.setTextColor(80, 80, 80);
    let dateInfo = 'Cause List';
    if (startDate && endDate) {
      dateInfo = `Cause List From ${formatDate(startDate)} to ${formatDate(endDate)}`;
    }
    doc.text(dateInfo, pageWidth / 2, 35, { align: 'center' });

    // Table data
    const tableData = cases.map((caseItem, index) => [
      (index + 1).toString(),
      getCaseTitle(caseItem),
      caseItem.caseParties,
      caseItem.judgeName,
      caseItem.nextStage,
      formatDate(caseItem.nextStageDate),
      caseItem.nextStageTime ? formatTime(caseItem.nextStageTime) : 'N/A',
      caseItem.courtRoomName,
    ]);
    
    // Generate table without page numbers first
    autoTable(doc, {
      head: [[
        'SN',
        'Case Title',
        'Case Parties',
        'Judge/Magistrate',
        'Case Stage',
        'Date',
        'Time',
        'Court Room',
      ]],
      body: tableData,
      startY: 40,
      margin: { left: 10, right: 10},
      tableWidth: 'auto',
      theme: 'grid',
      styles: {
        fontSize: 10,
        cellPadding: 2,
        overflow: 'linebreak',
        lineColor: [200, 200, 200],
        lineWidth: 0.1,
      },
      headStyles: {
        fillColor: [220, 38, 38],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 10,
        halign: 'center',
        valign: 'middle',
        lineColor: [180, 30, 30],
      },
      alternateRowStyles: {
        fillColor: [248, 248, 248],
      },
      columnStyles: {
        0: { cellWidth: 12, halign: 'center' },
        1: { cellWidth: 45, halign: 'left' },
        2: { cellWidth: 70, halign: 'left' },
        3: { cellWidth: 50, halign: 'left' },
        4: { cellWidth: 28, halign: 'center' },
        5: { cellWidth: 28, halign: 'center' },
        6: { cellWidth: 20, halign: 'center' },
        7: { cellWidth: 25, halign: 'left' },
      },
    });

    // Now get the actual total pages
    // The internal pages array contains all pages
    const totalPages = doc.internal.pages.length - 1;
    
    // Add page numbers to each page
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(150, 150, 150);
      
      doc.text(
        `Page ${i} of ${totalPages}`,
        pageWidth - 15,
        pageHeight - 8,
        { align: 'right' }
      );
      
      doc.text(
        `Printed on: ${new Date().toLocaleString()}`,
        15,
        pageHeight - 8
      );
    }

    // Generate filename
    const courtName = selectedCourt || 'All_Courts';
    const dateStr = new Date().toISOString().split('T')[0];
    const fileName = `Cause_List_${courtName.replace(/\s+/g, '_')}_${dateStr}.pdf`;
    
    // Save with custom filename
    doc.save(fileName);
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Failed to generate PDF. Please try again.');
  }
};