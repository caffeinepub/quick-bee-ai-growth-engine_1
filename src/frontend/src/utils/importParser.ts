/**
 * Universal import parser for Excel (.xlsx, .xls), CSV, Google Sheets (CSV export),
 * and PDF files. Returns rows as arrays of key-value objects.
 *
 * Uses dynamic CDN imports for xlsx and pdfjs-dist to avoid build-time dependency issues.
 */

export type ParsedRow = Record<string, string>;

/** Normalize a CSV/TSV/plain text string into rows */
function parseCSVText(text: string): ParsedRow[] {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length === 0) return [];

  // Detect delimiter
  const firstLine = lines[0];
  let delimiter = ",";
  if (firstLine.includes("\t")) delimiter = "\t";
  else if (firstLine.includes(";")) delimiter = ";";

  const headers = firstLine.split(delimiter).map((h) =>
    h
      .replace(/^["']|["']$/g, "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "_"),
  );

  const rows: ParsedRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = splitCSVLine(lines[i], delimiter);
    if (cols.every((c) => c === "")) continue;
    const row: ParsedRow = {};
    headers.forEach((h, idx) => {
      row[h] = cols[idx] ?? "";
    });
    rows.push(row);
  }
  return rows;
}

/** Split a single CSV line respecting quoted values */
function splitCSVLine(line: string, delimiter: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === delimiter && !inQuotes) {
      result.push(current.trim().replace(/^["']|["']$/g, ""));
      current = "";
    } else {
      current += ch;
    }
  }
  result.push(current.trim().replace(/^["']|["']$/g, ""));
  return result;
}

/** Parse Excel (.xlsx / .xls) or CSV file → array of row objects */
export async function parseExcelOrCSV(file: File): Promise<ParsedRow[]> {
  const name = file.name.toLowerCase();
  const isCSV =
    name.endsWith(".csv") || name.endsWith(".tsv") || name.endsWith(".txt");

  if (isCSV) {
    // CSV: read as text and parse manually
    const text = await file.text();
    return parseCSVText(text);
  }

  // Excel: try to use XLSX from CDN via dynamic window script injection
  return new Promise((resolve, reject) => {
    // Check if xlsx is available globally
    const tryParse = () => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const XLSX = (window as any).XLSX;
        if (!XLSX) {
          reject(
            new Error(
              "Excel parsing library not available. Please save as CSV and re-import.",
            ),
          );
          return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = e.target?.result;
            const workbook = XLSX.read(data, { type: "binary" });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const jsonRows: Record<string, unknown>[] =
              XLSX.utils.sheet_to_json(worksheet, { defval: "" });
            const normalized: ParsedRow[] = jsonRows.map(
              (row: Record<string, unknown>) => {
                const out: ParsedRow = {};
                for (const [k, v] of Object.entries(row)) {
                  const key = k.toLowerCase().replace(/\s+/g, "_");
                  out[key] = String(v ?? "").trim();
                }
                return out;
              },
            );
            resolve(normalized);
          } catch (err) {
            reject(err);
          }
        };
        reader.onerror = () => reject(new Error("Failed to read file"));
        reader.readAsBinaryString(file);
      } catch (err) {
        reject(err);
      }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((window as any).XLSX) {
      tryParse();
    } else {
      // Dynamically load xlsx from CDN
      const script = document.createElement("script");
      script.src =
        "https://cdn.sheetjs.com/xlsx-latest/package/dist/xlsx.full.min.js";
      script.onload = tryParse;
      script.onerror = () => {
        // Try fallback: read as text (might work for simple .xls saved as text)
        file
          .text()
          .then((text) => {
            try {
              resolve(parseCSVText(text));
            } catch {
              reject(
                new Error(
                  "Could not parse Excel file. Please save as CSV and re-import.",
                ),
              );
            }
          })
          .catch(() =>
            reject(
              new Error("Could not load Excel parser. Please save as CSV."),
            ),
          );
      };
      document.head.appendChild(script);
    }
  });
}

/** Parse a PDF file — extract text and attempt structured table parsing */
export async function parsePDF(file: File): Promise<ParsedRow[]> {
  const arrayBuffer = await file.arrayBuffer();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tryParsePDF = async (pdfjs: any): Promise<ParsedRow[]> => {
    if (!pdfjs.GlobalWorkerOptions.workerSrc) {
      pdfjs.GlobalWorkerOptions.workerSrc =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
    }
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
    const allLines: string[] = [];

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = (textContent.items as Array<{ str?: string }>)
        .map((item) => item.str ?? "")
        .join(" ");
      const lines = pageText
        .split(/\n|\r\n/)
        .map((l: string) => l.trim())
        .filter(Boolean);
      allLines.push(...lines);
    }

    if (allLines.length === 0) return [];

    const firstLine = allLines[0];
    let delimiter = "";
    if (firstLine.includes("\t")) delimiter = "\t";
    else if (firstLine.includes(",")) delimiter = ",";
    else if (firstLine.includes(";")) delimiter = ";";

    if (!delimiter) {
      return allLines.map((line, idx) => ({
        line_number: String(idx + 1),
        text: line,
      }));
    }

    const headers = firstLine
      .split(delimiter)
      .map((h: string) => h.trim().toLowerCase().replace(/\s+/g, "_"));

    const rows: ParsedRow[] = [];
    for (let i = 1; i < allLines.length; i++) {
      const cols = allLines[i].split(delimiter).map((c: string) => c.trim());
      if (cols.every((c: string) => c === "")) continue;
      const row: ParsedRow = {};
      headers.forEach((h: string, idx: number) => {
        row[h] = cols[idx] ?? "";
      });
      rows.push(row);
    }
    return rows;
  };

  // Use CDN-only approach for pdfjs to avoid build-time dependency
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((window as any).pdfjsLib) {
      tryParsePDF((window as any).pdfjsLib)
        .then(resolve)
        .catch(reject);
      return;
    }
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
    script.onload = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      tryParsePDF((window as any).pdfjsLib)
        .then(resolve)
        .catch(reject);
    };
    script.onerror = () =>
      reject(new Error("Could not load PDF parser. Please convert to CSV."));
    document.head.appendChild(script);
  });
}

/** Detect file type and dispatch to correct parser */
export async function parseImportFile(file: File): Promise<ParsedRow[]> {
  const name = file.name.toLowerCase();
  if (
    name.endsWith(".xlsx") ||
    name.endsWith(".xls") ||
    name.endsWith(".ods")
  ) {
    return parseExcelOrCSV(file);
  }
  if (name.endsWith(".csv") || name.endsWith(".tsv") || name.endsWith(".txt")) {
    return parseExcelOrCSV(file);
  }
  if (name.endsWith(".pdf")) {
    return parsePDF(file);
  }
  // Fallback: try as CSV text
  const text = await file.text();
  return parseCSVText(text);
}

/** Get accepted file types string for <input accept="..."> */
export const IMPORT_ACCEPT =
  ".xlsx,.xls,.csv,.tsv,.ods,.pdf,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv,application/pdf";

/** Human-readable list of accepted formats */
export const IMPORT_FORMATS =
  "Excel (.xlsx, .xls), CSV, Google Sheets (CSV export), PDF";
