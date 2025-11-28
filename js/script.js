// === Slider for "Popular Produce" ===
  const track = document.querySelector('.slider-track');
  const leftBtn = document.querySelector('.slider-btn.left');
  const rightBtn = document.querySelector('.slider-btn.right');

  if (track && leftBtn && rightBtn) {
    leftBtn.addEventListener('click', () => {
      track.scrollBy({ left: -300, behavior: 'smooth' });
    });

    rightBtn.addEventListener('click', () => {
      track.scrollBy({ left: 300, behavior: 'smooth' });
    });
  }
