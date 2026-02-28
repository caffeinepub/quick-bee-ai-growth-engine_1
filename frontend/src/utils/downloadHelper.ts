/**
 * Utility functions to trigger client-side file downloads in the browser.
 * Supports JSON, CSV, Excel (.xls via SpreadsheetML), and PDF (via print dialog).
 */

/** Serialize a value, converting BigInt to string */
function serializeValue(value: unknown): string {
  if (value === null || value === undefined) return '';
  if (typeof value === 'bigint') return value.toString();
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  if (typeof value === 'object') return JSON.stringify(value, (_k, v) => (typeof v === 'bigint' ? v.toString() : v));
  return String(value);
}

/** Flatten a nested object into a single-level record with dot-notation keys */
function flattenObject(obj: unknown, prefix = ''): Record<string, string> {
  if (obj === null || obj === undefined) return {};
  if (typeof obj !== 'object' || Array.isArray(obj)) {
    return { [prefix || 'value']: serializeValue(obj) };
  }
  const result: Record<string, string> = {};
  for (const [key, val] of Object.entries(obj as Record<string, unknown>)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (val !== null && typeof val === 'object' && !Array.isArray(val)) {
      Object.assign(result, flattenObject(val, fullKey));
    } else {
      result[fullKey] = serializeValue(val);
    }
  }
  return result;
}

/** Trigger a browser download with the given blob and filename */
function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

/** Download data as a JSON file */
export function downloadJSON(data: unknown, filename: string): void {
  const json = JSON.stringify(
    data,
    (_key, value) => (typeof value === 'bigint' ? value.toString() : value),
    2
  );
  const blob = new Blob([json], { type: 'application/json' });
  triggerDownload(blob, filename);
}

/** Download an array of objects as a CSV file */
export function downloadAsCSV(data: unknown[], filename: string): void {
  if (data.length === 0) {
    const blob = new Blob([''], { type: 'text/csv;charset=utf-8;' });
    triggerDownload(blob, filename);
    return;
  }

  // Flatten all rows and collect all headers
  const flatRows = data.map(row => flattenObject(row));
  const allHeaders = Array.from(new Set(flatRows.flatMap(row => Object.keys(row))));

  const escapeCSV = (val: string): string => {
    if (val.includes(',') || val.includes('"') || val.includes('\n') || val.includes('\r')) {
      return `"${val.replace(/"/g, '""')}"`;
    }
    return val;
  };

  const headerRow = allHeaders.map(escapeCSV).join(',');
  const dataRows = flatRows.map(row =>
    allHeaders.map(h => escapeCSV(row[h] ?? '')).join(',')
  );

  const csvContent = [headerRow, ...dataRows].join('\r\n');
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  triggerDownload(blob, filename);
}

/** Download an array of objects as an Excel file (.xls via SpreadsheetML) */
export function downloadAsExcel(data: unknown[], filename: string): void {
  if (data.length === 0) {
    const blob = new Blob([''], { type: 'application/vnd.ms-excel' });
    triggerDownload(blob, filename);
    return;
  }

  const flatRows = data.map(row => flattenObject(row));
  const allHeaders = Array.from(new Set(flatRows.flatMap(row => Object.keys(row))));

  const escapeXml = (val: string): string =>
    val
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');

  const headerCells = allHeaders.map(h => `<th style="background:#00d4c8;color:#fff;font-weight:bold;padding:6px 10px;border:1px solid #ccc;">${escapeXml(h)}</th>`).join('');
  const dataRowsHtml = flatRows.map(row => {
    const cells = allHeaders.map(h => `<td style="padding:5px 10px;border:1px solid #ddd;">${escapeXml(row[h] ?? '')}</td>`).join('');
    return `<tr>${cells}</tr>`;
  }).join('');

  const sheetName = filename.replace(/\.[^.]+$/, '').substring(0, 31);

  const template = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
<head>
<!--[if gte mso 9]><xml>
<x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>
<x:Name>${escapeXml(sheetName)}</x:Name>
<x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions>
</x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook>
</xml><![endif]-->
<meta charset="UTF-8">
</head>
<body>
<table border="1" cellspacing="0" cellpadding="0" style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:12px;">
<thead><tr>${headerCells}</tr></thead>
<tbody>${dataRowsHtml}</tbody>
</table>
</body></html>`;

  const blob = new Blob([template], { type: 'application/vnd.ms-excel;charset=utf-8;' });
  triggerDownload(blob, filename);
}

/** Download an array of objects as a PDF by opening a styled print window */
export function downloadAsPDF(data: unknown[], filename: string, title: string): void {
  const flatRows = data.map(row => flattenObject(row));
  const allHeaders = data.length > 0
    ? Array.from(new Set(flatRows.flatMap(row => Object.keys(row))))
    : [];

  const escapeHtml = (val: string): string =>
    val
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

  const headerCells = allHeaders.map(h => `<th>${escapeHtml(h)}</th>`).join('');
  const dataRowsHtml = flatRows.map((row, i) => {
    const cells = allHeaders.map(h => `<td>${escapeHtml(row[h] ?? '')}</td>`).join('');
    return `<tr class="${i % 2 === 0 ? 'even' : 'odd'}">${cells}</tr>`;
  }).join('');

  const emptyMsg = data.length === 0 ? '<p class="empty">No data available to export.</p>' : '';

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>${escapeHtml(title)}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: Arial, Helvetica, sans-serif; font-size: 11px; color: #1a1a1a; padding: 20px; }
  h1 { font-size: 18px; color: #007a74; margin-bottom: 4px; }
  .meta { font-size: 10px; color: #666; margin-bottom: 16px; }
  table { width: 100%; border-collapse: collapse; margin-top: 8px; }
  th { background: #007a74; color: #fff; padding: 7px 8px; text-align: left; font-size: 10px; font-weight: bold; border: 1px solid #005f5a; }
  td { padding: 5px 8px; border: 1px solid #ddd; font-size: 10px; word-break: break-word; max-width: 200px; }
  tr.even td { background: #f5fffe; }
  tr.odd td { background: #ffffff; }
  .empty { color: #888; font-style: italic; margin-top: 12px; }
  @media print {
    body { padding: 10px; }
    @page { margin: 1cm; size: landscape; }
  }
</style>
</head>
<body>
<h1>${escapeHtml(title)}</h1>
<div class="meta">Exported on ${new Date().toLocaleString()} &nbsp;|&nbsp; ${data.length} record(s)</div>
${emptyMsg}
${data.length > 0 ? `<table><thead><tr>${headerCells}</tr></thead><tbody>${dataRowsHtml}</tbody></table>` : ''}
</body>
</html>`;

  const printWindow = window.open('', '_blank', 'width=1000,height=700');
  if (!printWindow) {
    // Fallback: download as HTML if popup blocked
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
    triggerDownload(blob, filename.replace(/\.pdf$/, '.html'));
    return;
  }
  printWindow.document.write(htmlContent);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
  }, 500);
}
