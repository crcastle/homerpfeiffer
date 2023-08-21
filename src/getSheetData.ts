import Papa from 'papaparse';

export function getSheetData(url: string, complete: Function): void {
  Papa.parse(url, {
    download: true,
    header: true,
    complete: complete
  })
}
