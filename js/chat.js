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
});