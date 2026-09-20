import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

interface ExportData {
  [key: string]: string | number | null;
}

export const exportToExcel = async (data: ExportData[], filename: string): Promise<void> => {
  try {
    // Convert null values to empty strings and format numbers
    const formattedData = data.map(item => 
      Object.fromEntries(
        Object.entries(item).map(([key, value]) => [
          key,
          value === null ? '' : 
          typeof value === 'number' ? value.toLocaleString() : 
          value
        ])
      )
    );

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    
    // Set column widths
    const columnWidths = Object.keys(formattedData[0]).map(key => ({
      wch: Math.max(key.length, 15) // Minimum width of 15 characters
    }));
    worksheet['!cols'] = columnWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Assets');
    
    // Generate Excel file
    XLSX.writeFile(workbook, `${filename}.xlsx`);
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    throw new Error('Failed to export to Excel');
  }
};

export const exportToPDF = async (data: ExportData[], filename: string): Promise<void> => {
  try {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(16);
    doc.text('Assets Report', 14, 15);
    
    // Add date
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 22);
    
    // Get headers from the first data object
    const headers = Object.keys(data[0]);
    
    // Prepare table data and convert null values to empty strings
    const tableData = data.map(item => 
      headers.map(header => {
        const value = item[header];
        if (value === null) return '';
        if (typeof value === 'number') return value.toLocaleString();
        return value;
      })
    );

    // Add table
    (doc as any).autoTable({
      head: [headers],
      body: tableData,
      startY: 30,
      styles: { 
        fontSize: 8,
        cellPadding: 2
      },
      headStyles: { 
        fillColor: [66, 139, 202],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      columnStyles: {
        0: { cellWidth: 30 },
        1: { cellWidth: 25 },
        2: { cellWidth: 20 },
        3: { cellWidth: 20 },
        4: { cellWidth: 20 },
        5: { cellWidth: 25 },
        6: { cellWidth: 25 },
        7: { cellWidth: 25 },
        8: { cellWidth: 25 },
        9: { cellWidth: 20 },
        10: { cellWidth: 40 }
      },
      margin: { top: 30 }
    });

    // Save the PDF
    doc.save(`${filename}.pdf`);
  } catch (error) {
    console.error('Error exporting to PDF:', error);
    throw new Error('Failed to export to PDF');
  }
}; 