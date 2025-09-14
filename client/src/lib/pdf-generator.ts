import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Registration } from '@shared/schema';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export const generateRegistrationPDF = (registration: Registration) => {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  // Header
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Registration Management System', 148.5, 20, { align: 'center' });
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text('Student Registration Details', 148.5, 30, { align: 'center' });

  // Student Information
  const studentData = [
    ['Full Name', registration.fullName],
    ['Aadhar Number', registration.aadharNumber],
    ['Place', registration.place],
    ['Phone Number', registration.phoneNumber],
    ['Category', registration.category.toUpperCase()],
    ['Dars Name', registration.darsName],
    ['Dars Place', registration.darsPlace],
    ['Usthaad Name', registration.usthaadName],
    ['Programs', registration.programs.join(', ')],
    ['Registration Date', new Date(registration.createdAt).toLocaleDateString()]
  ];

  doc.autoTable({
    startY: 50,
    head: [['Field', 'Value']],
    body: studentData,
    styles: {
      fontSize: 10,
      cellPadding: 3
    },
    headStyles: {
      fillColor: [59, 130, 246],
      textColor: [255, 255, 255]
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252]
    },
    margin: { left: 20, right: 20 }
  });

  return doc;
};

export const generateCategoryReport = (registrations: Registration[], category: 'junior' | 'senior') => {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  // Header
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Registration Management System', 148.5, 20, { align: 'center' });
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text(`${category.toUpperCase()} Student Registration Report`, 148.5, 30, { align: 'center' });

  // Summary
  doc.setFontSize(12);
  doc.text(`Total ${category} Students: ${registrations.length}`, 20, 45);
  doc.text(`Report Generated: ${new Date().toLocaleDateString()}`, 20, 55);

  // Table data
  const tableData = registrations.map(reg => [
    reg.fullName,
    reg.aadharNumber,
    reg.phoneNumber,
    reg.place,
    reg.darsName,
    reg.usthaadName,
    reg.programs.join(', '),
    new Date(reg.createdAt).toLocaleDateString()
  ]);

  doc.autoTable({
    startY: 70,
    head: [['Name', 'Aadhar', 'Phone', 'Place', 'Dars', 'Usthaad', 'Programs', 'Date']],
    body: tableData,
    styles: {
      fontSize: 8,
      cellPadding: 2
    },
    headStyles: {
      fillColor: [59, 130, 246],
      textColor: [255, 255, 255]
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252]
    },
    margin: { left: 10, right: 10 },
    columnStyles: {
      0: { cellWidth: 35 },
      1: { cellWidth: 30 },
      2: { cellWidth: 25 },
      3: { cellWidth: 30 },
      4: { cellWidth: 35 },
      5: { cellWidth: 35 },
      6: { cellWidth: 50 },
      7: { cellWidth: 25 }
    }
  });

  return doc;
};

export const downloadPDF = (doc: jsPDF, filename: string) => {
  doc.save(filename);
};
