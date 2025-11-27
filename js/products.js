document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.hamburger');
  const popoverMenu = document.getElementById('popover-menu');
  const closeMenu = document.querySelector('.close-menu');

  // Funksjon for å lukke meny
  function closePopover() {
    popoverMenu.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
  }

  // Åpne meny
  hamburger.addEventListener('click', () => {
    popoverMenu.classList.add('active');
    hamburger.setAttribute('aria-expanded', 'true');
  });

  // Lukk meny via X-knapp
  closeMenu.addEventListener('click', () => {
    closePopover();
  });

  // Lukk meny når man klikker på en lenke
  document.querySelectorAll('.menu-list a').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
        closePopover();
      }
    });
  });

  // === Klient-side validering for nyhetsbrevskjema ===
  const form = document.querySelector('.newsletter-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      const first = document.getElementById('first-name');
      const email = document.getElementById('email');

      const errors = [];
      if (!first.value.trim()) errors.push('Fornavn er påkrevd.');
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.value.trim())) {
        errors.push('Skriv inn en gyldig e-postadresse.');
      }

      if (errors.length) {
        e.preventDefault(); // stopper innsending
        alert(errors.join('\n')); // enkel feedback
        email.setAttribute('aria-invalid', 'true');
      } else {
        email.removeAttribute('aria-invalid');
      }
    });
  }
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
});


