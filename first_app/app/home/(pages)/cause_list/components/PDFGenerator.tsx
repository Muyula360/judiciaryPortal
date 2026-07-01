// app/components/PDFGenerator.tsx
'use client';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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

interface PDFGeneratorProps {
  cases: Case[];
  selectedCourt: string;
  startDate: string;
  endDate: string;
  formatDate: (date: string) => string;
  formatTime: (time: string) => string;
}

export const generatePDF = ({
  cases,
  selectedCourt,
  startDate,
  endDate,
  formatDate,
  formatTime,
}: PDFGeneratorProps) => {
  try {
    // Create new PDF document
    const doc = new jsPDF('landscape', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Header - Judiciary
    doc.setFontSize(16);
    doc.setTextColor(80, 80, 80);
    doc.text('The Judiciary of Tanzania', pageWidth / 2, 20, { align: 'center' });

    // Court name
    doc.setFontSize(13);
    doc.setTextColor(220, 38, 38);
    doc.text(selectedCourt || 'All Courts', pageWidth / 2, 27, { align: 'center' });

    // Date range
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    let dateInfo = ``;
    if (startDate && endDate) {
      dateInfo = `Cause List From ${formatDate(startDate)} to ${formatDate(endDate)}`;
    }
    doc.text(dateInfo, pageWidth / 2, 34, { align: 'center' });

    // Table data
    const tableData = cases.map((caseItem, index) => [
      (index + 1).toString(),
      caseItem.caseTitle,
      caseItem.caseParties,
      caseItem.judgeName,
      caseItem.caseStage,
      formatDate(caseItem.date),
      formatTime(caseItem.time),
      `Court Room ${caseItem.courtRoom}`
    ]);
    
    // Generate table
    autoTable(doc, {
      head: [[
        'SN',
        'Case Title',
        'Case Parties',
        'Judge/Magistrate',
        'Case Stage',
        'Date',
        'Time',
        'Court Room'
      ]],
      body: tableData,
      startY: 40,
      margin: { left: 12, right: 12 },
      tableWidth: 'auto',
      theme: 'grid',
      styles: {
        fontSize: 10,
        cellPadding: 2,
      },
      headStyles: {
        fillColor: [243, 244, 246],
        textColor: [40, 40, 40],
        fontStyle: 'bold',
        fontSize: 11,
      },
      columnStyles: {
        0: { cellWidth: 12, halign: 'center' },  
        1: { cellWidth: 55, halign: 'left' },  
        2: { cellWidth: 55, halign: 'left' },  
        3: { cellWidth: 50, halign: 'left' },  
        4: { cellWidth: 25, halign: 'center' },  
        5: { cellWidth: 28, halign: 'center' },  
        6: { cellWidth: 22, halign: 'center' }, 
        7: { cellWidth: 28, halign: 'center' },  
      },
      didDrawPage: (data) => {
        const pageCount = doc.internal.getNumberOfPages();
        doc.setFontSize(9);
        doc.setTextColor(150, 150, 150);
        doc.text(
          `Page ${data.pageNumber} of ${pageCount}`,
          pageWidth - 20,
          doc.internal.pageSize.getHeight() - 10,
          { align: 'right' }
        );
        doc.text(
          `Printed on: ${new Date().toLocaleString()}`,
          20,
          doc.internal.pageSize.getHeight() - 10
        );
        doc.text(
          `Total Cases: ${cases.length}`,
          pageWidth / 2,
          doc.internal.pageSize.getHeight() - 10,
          { align: 'center' }
        );
      },
    });

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