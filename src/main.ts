/**
 * TODO:
 * - skip spreadsheet rows without a URL
 * - click to view large version
 * - add header that says Homer Pfeiffer
 * - deploy to github pages
 * - purchase homerpfeiffer.com (homerpfeiffer.art, siggie.art, siggi.art)
 * - add spinner while loading spreadsheet data?
 * - add About modal?
 */


import lozad from 'lozad';

import './style.css'
import { getSheetData } from './getSheetData.ts'

let start: number;
let end: number;

const sheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRg2kDl78liNmZXI_GUqhWVCDfndPc6719uCwdI_S0wm3O4d9Vzs5peFd2bXbtmzxs6BX2c4F1Dz4qe/pub?gid=0&single=true&output=csv';

start = performance.now();

// TODO: convert to async/await
getSheetData(sheetUrl, (results: any) => {
  end = performance.now();
  console.log('Parsing complete: ', results);
  console.log(`Execution time: ${end - start} ms`)

  const section = document.querySelector<HTMLElement>('#app')?.appendChild(document.createElement('section'));
  section?.classList.add('grid');

  const observer = lozad('.item');
  observer.observe();

  for (const row of results.data) {
    let imgSrc;
    try {
      const fileUrl = new URL(row['Download link']);
      const fileId = fileUrl.searchParams.get('id');
      imgSrc = `https://drive.google.com/thumbnail?sz=w460&id=${fileId}`;
    } catch (e) {
      console.info(e);
    }

    const img = document.createElement('img');
    img.setAttribute('data-src', imgSrc!);
    img.setAttribute('width', '320px');
    img.setAttribute('data-placeholder-background', '#ccc');
    img.classList.add('item');

    const a = document.createElement('a');
    a.appendChild(img);

    section?.appendChild(a);

    observer.observe();
  }
});
