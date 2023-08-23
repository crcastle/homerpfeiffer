import GLightbox from 'glightbox'; // https://github.com/biati-digital/glightbox

let lightbox: any;

export function initLightbox() {
  lightbox = GLightbox();

  // Handle initial page load with an `id=` query string param
  setState();

  // Append id= query string param for zoomed in images
  lightbox.on('slide_changed', ({ current }: { current: any }) => {
    const urlParts = current.slideConfig.href.split('/');
    const id = urlParts[urlParts.length - 1];

    const homeUrl = location.toString().replace(location.search, "")

    if (!location.search.includes(id)) {
      history.pushState({ id }, '', homeUrl + `?id=${id}`);
    }
  });

  // Remove query string when closing zoomed in image
  lightbox.on('close', () => {
    const homeUrl = location.toString().replace(location.search, "")

    if (location.search) {
      history.pushState({}, '', homeUrl);
    }
  });

  // Handle browser back and forward buttons
  window.addEventListener('popstate', (e) => {
    e.preventDefault();
    setState();
  });

  return lightbox;
}

export function addToLightbox(el: HTMLElement): void {
  el.classList.add('glightbox');
}

// Set state of the page based on current URL
function setState(): void {
  if (location.search) {
    const url = new URL(location.toString());

    if (url.searchParams.has('id')) {
      showImageId(url.searchParams.get('id') as string);
    }
  } else {
    lightbox.close();
  }
}

// Show zoomed in view of a specified image
function showImageId(id: string): void {
  const node = document.getElementById(id);

  if (lightbox.lightboxOpen) {
    lightbox.goToSlide(getIndexFromId(id));
  } else {
    lightbox.open(node);
  }
}

function getIndexFromId(id: string): number {
  for (let index = 0; index < lightbox.elements.length; index++) {
    if (lightbox.elements[index].node.id === id) {
      return index;
    }
  }

  console.error('Did not find element matching id ' + id);
  return NaN;
}
