/* =========================================================
   script.js — Interactivité du CV
   Sommaire :
   1. Mode sombre / clair (localStorage)
   2. Menu hamburger (mobile) + smooth scroll
   3. Animation des barres de compétences (IntersectionObserver)
   4. Apparition des sections au scroll
   5. Formulaire de contact avec validation
   6. Bouton retour en haut
========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------------------------------------------
     1. MODE SOMBRE / CLAIR
  --------------------------------------------------- */
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = themeToggle.querySelector('i');
  const root = document.documentElement;

  // Récupère le thème sauvegardé, sinon utilise la préférence système
  const savedTheme = localStorage.getItem('cv-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');

  applyTheme(initialTheme);

  themeToggle.addEventListener('click', () => {
    const current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem('cv-theme', next);
  });

  function applyTheme(theme) {
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
      themeIcon.classList.remove('fa-moon');
      themeIcon.classList.add('fa-sun');
    } else {
      root.removeAttribute('data-theme');
      themeIcon.classList.remove('fa-sun');
      themeIcon.classList.add('fa-moon');
    }
    themeToggle.addEventListener('click', () => {
    console.log("Bouton cliqué");
});
  }

  /* ---------------------------------------------------
     2. MENU HAMBURGER + SMOOTH SCROLL
  --------------------------------------------------- */
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  hamburger.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  // Ferme le menu mobile après un clic sur un lien (smooth scroll géré nativement par CSS)
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------------------------------------------------
     3. ANIMATION DES BARRES DE COMPÉTENCES AU SCROLL
  --------------------------------------------------- */
  const skillElements = document.querySelectorAll('.skill');

  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target.querySelector('.skill-fill');
        const level = entry.target.getAttribute('data-level');
        fill.style.width = level + '%';
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  skillElements.forEach(skill => skillObserver.observe(skill));

  /* ---------------------------------------------------
     4. APPARITION DES SECTIONS AU SCROLL
  --------------------------------------------------- */
  const revealElements = document.querySelectorAll('.section, .hero-inner');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealElements.forEach(el => revealObserver.observe(el));

  /* ---------------------------------------------------
     5. FORMULAIRE DE CONTACT — VALIDATION CÔTÉ CLIENT
  --------------------------------------------------- */
  const form = document.getElementById('contact-form');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const messageInput = document.getElementById('message');
  const successMsg = document.getElementById('form-success');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    successMsg.textContent = '';

    let isValid = true;
    isValid = validateField(nameInput, 'name-error', nameInput.value.trim() !== '', 'Le nom est requis.') && isValid;
    isValid = validateField(emailInput, 'email-error', emailRegex.test(emailInput.value.trim()), 'Veuillez saisir un e-mail valide.') && isValid;
    isValid = validateField(messageInput, 'message-error', messageInput.value.trim() !== '', 'Le message ne peut pas être vide.') && isValid;

    if (isValid) {
      successMsg.textContent = 'Merci ! Votre message a bien été envoyé.';
      form.reset();
      setTimeout(() => { successMsg.textContent = ''; }, 5000);
    }
  });

  function validateField(input, errorId, condition, message) {
    const errorEl = document.getElementById(errorId);
    const group = input.closest('.form-group');

    if (!condition) {
      errorEl.textContent = message;
      group.classList.add('invalid');
      return false;
    } else {
      errorEl.textContent = '';
      group.classList.remove('invalid');
      return true;
    }
  }

  /* ---------------------------------------------------
     6. BOUTON RETOUR EN HAUT
  --------------------------------------------------- */
  const backToTop = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

});
