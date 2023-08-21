import Papa from 'papaparse';

export function getSheetData(url: string, complete: Function): void {
  Papa.parse(url as any, {
    download: true,
    header: true,
    complete: complete,
  } as any)
}
