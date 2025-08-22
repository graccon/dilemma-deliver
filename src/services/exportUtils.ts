import * as XLSX from "xlsx";

export function getTodayDateString() {
  const today = new Date();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  return `${mm}${dd}`;
}

export function convertToCSV(headers: string[], rows: Record<string, any>[]) {
  const headerLine = headers.join(",");
  const dataLines = rows.map((row) =>
    headers.map((h) => `"${row[h] ?? ""}"`).join(",")
  );
  return [headerLine, ...dataLines].join("\n");
}

export function downloadCSVFile(filename: string, csvContent: string) {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function downloadExcelFile(
  filename: string,
  headers: string[],
  rows: Record<string, any>[]
) {
  const worksheetData = [headers, ...rows.map(row => headers.map(h => row[h] ?? ""))];
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  XLSX.writeFile(workbook, filename);
}