/**
 * Export data to CSV format
 */
export function exportToCSV<T extends Record<string, any>>(
  data: T[],
  filename: string,
  headers?: Record<keyof T, string>
) {
  if (data.length === 0) {
    alert('Δεν υπάρχουν δεδομένα για export');
    return;
  }

  // Get headers
  const csvHeaders = headers
    ? Object.values(headers)
    : Object.keys(data[0]);

  // Create CSV content
  const csvRows = [
    csvHeaders.join(','),
    ...data.map((row) =>
      Object.values(row)
        .map((val) => {
          // Escape commas and quotes
          const stringVal = String(val || '');
          if (stringVal.includes(',') || stringVal.includes('"') || stringVal.includes('\n')) {
            return `"${stringVal.replace(/"/g, '""')}"`;
          }
          return stringVal;
        })
        .join(',')
    ),
  ];

  const csvContent = csvRows.join('\n');
  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Export data to Excel format (using CSV with .xlsx extension)
 * Note: For true Excel format, you'd need a library like xlsx
 */
export function exportToExcel<T extends Record<string, any>>(
  data: T[],
  filename: string,
  headers?: Record<keyof T, string>
) {
  // For now, we'll use CSV format but with .xlsx extension
  // In production, consider using a library like 'xlsx'
  exportToCSV(data, filename, headers);
}

/**
 * Format date for export
 */
export function formatDateForExport(date: string | null): string {
  if (!date) return '';
  return new Date(date).toLocaleDateString('el-GR');
}
