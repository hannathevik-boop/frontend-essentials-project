
  const mapFrame = document.querySelector('.map-frame');
  const fallback = document.querySelector('.map-fallback');

  // hvis kartet ikke har lastet innen 5 sekunder → vis fallback
  const timeout = setTimeout(() => {
    mapFrame.style.display = 'none';
    fallback.style.display = 'block';
  }, 5000);

  // Hvis kartet lastes, avbryt fallback
  mapFrame.addEventListener('load', () => {
    clearTimeout(timeout);
  });


