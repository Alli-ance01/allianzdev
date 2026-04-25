/* ─── NAVBAR: shrink on scroll ───────────────────────── */
const navbar = document.getElementById('navbar');
const scrollTopBtn = document.getElementById('scroll-top');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
  scrollTopBtn.classList.toggle('visible', window.scrollY > 500);
});

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ─── THEME TOGGLE ───────────────────────────────────── */
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

// Check for saved theme
const savedTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
});

/* ─── HAMBURGER MENU ─────────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

// Close menu when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

/* ─── TYPEWRITER EFFECT ──────────────────────────────── */
const phrases = [
  'Fullstack Dev in Training.',
  'Building for the Web.',
  'Firebase Enthusiast.',
  'Problem Solver.',
  'Open to Opportunities.',
];

let phraseIndex = 0;
let charIndex   = 0;
let deleting    = false;
const typeEl    = document.getElementById('typewriter');

function type() {
  const current = phrases[phraseIndex];

  if (!deleting) {
    typeEl.textContent = current.slice(0, charIndex + 1);
    charIndex++;
    if (charIndex === current.length) {
      deleting = true;
      setTimeout(type, 1800); // pause before deleting
      return;
    }
    setTimeout(type, 65);
  } else {
    typeEl.textContent = current.slice(0, charIndex - 1);
    charIndex--;
    if (charIndex === 0) {
      deleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      setTimeout(type, 300);
      return;
    }
    setTimeout(type, 35);
  }
}

type();

/* ─── SCROLL FADE-IN ANIMATIONS ──────────────────────── */
const fadeEls = document.querySelectorAll('.fade-in');

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger siblings inside the same section
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, i * 120);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

fadeEls.forEach(el => observer.observe(el));

/* ─── FOOTER YEAR ────────────────────────────────────── */
document.getElementById('year').textContent = new Date().getFullYear();

/* ─── ACTIVE NAV LINK ON SCROLL ──────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) {
      current = sec.getAttribute('id');
    }
  });
  navAnchors.forEach(a => {
    a.style.color = '';
    if (a.getAttribute('href') === `#${current}`) {
      a.style.color = 'var(--accent)';
    }
  });
});

/* ─── EASTER EGG ─────────────────────────────────────── */
console.log(
  "%c🕵️‍♂️ You found the secret console! %c\n\nI'm Timileyin, and I love building cool things for the web. Let's connect and build something awesome together! \n\n📫 timileyinogunderekingmex@gmail.com",
  "color: #00f5d4; font-size: 20px; font-weight: bold; font-family: 'JetBrains Mono', monospace;",
  "color: #e2e8f0; font-size: 14px; line-height: 1.5;"
);
