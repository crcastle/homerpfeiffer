/**
 * TODO:
 * - [x] skip spreadsheet rows without a URL
 * - [x] click to view large version
 * - [x] add header that says Homer Pfeiffer
 * - [x] deploy to github pages
 * - [x] try out other lightbox library - https://dimboxjs.com
 * - [x] create fragment # link for each zoomed in image
 * - [x] purchase homerpfeiffer.com
 * - [x] add spinner while loading spreadsheet data?
 */


import lozad from 'lozad';

import './style.css';
import { getSheetData } from './getSheetData.ts';
import { addToLightbox, initLightbox } from './lightbox.ts';
// import './header.ts'

let start: number;
let end: number;

const sheetUrl = spreadsheetUrl;

start = performance.now();

// TODO: convert to async/await
getSheetData(sheetUrl, (results: any) => {
  end = performance.now();
  console.log('Parsing complete: ', results);
  console.log(`Execution time: ${end - start} ms`)

  const section = document.querySelector<HTMLElement>('#app')?.appendChild(document.createElement('section'));
  section?.classList.add('grid');
  section!.id = 'grid'

  const observer = lozad('.item');
  observer.observe();

  for (const row of results.data) {
    let imgSrc;
    let fileId;
    try {
      const fileUrl = new URL(row['Download link']);
      fileId = fileUrl.searchParams.get('id');

      if (fileId) {
        // c_limit,w_420 limits the width to 420px while maintaining aspect ratio. keeping this slightly larger than the 320px size displayed seemed to be best.
        // q_90 is quality 90%
        // f_auto allows cloudinary to automatically choose file type
        imgSrc = `https://res.cloudinary.com/dhak0xfzi/image/upload/c_limit,w_420/q_90/f_auto/siggie/${fileId}`
      } else {
        continue
      }
    } catch (e) {
      console.info('Invalid fileId value:', fileId, e);
      continue;
    }

    const img = document.createElement('img');
    img.setAttribute('data-src', imgSrc!);
    img.setAttribute('width', '320px');
    img.setAttribute('alt', 'A photograph of artwork by Homer Pfeiffer');
    img.classList.add('item');

    const a = document.createElement('a');
    a.setAttribute('href', `https://res.cloudinary.com/dhak0xfzi/image/upload/siggie/${fileId}`);
    a.setAttribute('id', fileId);
    a.setAttribute('data-type', 'image');
    a.setAttribute('aria-label', 'View a larger version of this artwork');
    a.appendChild(img);
    addToLightbox(a);

    section?.appendChild(a);

    observer.observe();
  }

  const spinner: HTMLElement | null = document.querySelector('.loadingio-spinner-fluid-2mshlzrmjpk');
  if (spinner) {
    spinner.style.visibility = 'hidden';
    spinner.style.display = 'none';
  }

  initLightbox();
});
