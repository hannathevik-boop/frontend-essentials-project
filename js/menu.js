// === HAMBURGER MENU ===
  const hamburger = document.querySelector('.hamburger');
  const popoverMenu = document.getElementById('popover-menu');
  const closeMenu = document.querySelector('.close-menu');

  function closePopover() {
    popoverMenu.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
  }

  if (hamburger && popoverMenu && closeMenu) {
    hamburger.addEventListener('click', () => {
      popoverMenu.classList.add('active');
      hamburger.setAttribute('aria-expanded', 'true');
    });

    closeMenu.addEventListener('click', () => {
      closePopover();
    });

    document.querySelectorAll('.menu-list a').forEach(link => {
      link.addEventListener('click', () => {
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
          closePopover();
        }
      });
    });
  }
    // === validering for nyhetsbrevskjema ===
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