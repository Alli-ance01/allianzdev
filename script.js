/* ─── THE LEDGER · script ────────────────────────────────
   Restrained interactions: header scroll state, mobile nav,
   theme toggle, scroll-reveal, active chapter index,
   contact form handling. No decoration-only motion. */

/* ─── Header scroll state & back-to-top ─────────────── */
const header = document.getElementById('site-header');
const scrollTopBtn = document.getElementById('scrollTop');

const onScroll = () => {
  header.classList.toggle('is-scrolled', window.scrollY > 16);
  scrollTopBtn.hidden = window.scrollY < 500;
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ─── Mobile nav ─────────────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

const closeMenu = () => {
  hamburger.classList.remove('is-open');
  navLinks.classList.remove('is-open');
  hamburger.setAttribute('aria-expanded', 'false');
};
const openMenu = () => {
  hamburger.classList.add('is-open');
  navLinks.classList.add('is-open');
  hamburger.setAttribute('aria-expanded', 'true');
};

hamburger.addEventListener('click', () => {
  if (navLinks.classList.contains('is-open')) closeMenu();
  else openMenu();
});

navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));

/* Close on Escape */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && navLinks.classList.contains('is-open')) closeMenu();
});

/* ─── Theme toggle (simple crossfade) ────────────────── */
const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  document.body.classList.remove('theme-switch');
  // re-trigger crossfade animation
  requestAnimationFrame(() => document.body.classList.add('theme-switch'));
});

/* ─── Scroll reveal (section-level, subtle) ──────────── */
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reducedMotion) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
} else {
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
}

/* ─── Active chapter index (desktop running numbers) ── */
const indexSpans = document.querySelectorAll('.chapter-index span');
const chapters = document.querySelectorAll('.chapter');

const indexObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      indexSpans.forEach(s => {
        s.classList.toggle('is-active', s.dataset.target === id);
      });
    }
  });
}, { threshold: 0.35, rootMargin: '-60px 0px -50% 0px' });

chapters.forEach(ch => {
  if (ch.id && ch.id !== 'intro') indexObserver.observe(ch);
});

/* ─── Active nav link on scroll ──────────────────────── */
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navAnchors.forEach(a => {
        a.classList.toggle('is-active', a.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { threshold: 0.3, rootMargin: '-80px 0px -60% 0px' });

chapters.forEach(ch => { if (ch.id) navObserver.observe(ch); });

/* ─── Contact form (Formspree, accessible feedback) ──── */
const contactForm = document.getElementById('contactForm');
const contactSuccess = document.getElementById('contactSuccess');
const resetBtn = document.getElementById('resetContact');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(contactForm);

    try {
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        contactForm.style.display = 'none';
        contactSuccess.classList.add('is-shown');
        resetBtn.focus();
      } else {
        alert('There was a problem submitting the form. Please email me directly instead.');
      }
    } catch (err) {
      alert('There was a problem submitting the form. Please email me directly instead.');
    }
  });

  resetBtn.addEventListener('click', () => {
    contactForm.reset();
    contactForm.style.display = 'grid';
    contactSuccess.classList.remove('is-shown');
    document.getElementById('name').focus();
  });
}

/* ─── Footer year ────────────────────────────────────── */
document.getElementById('year').textContent = new Date().getFullYear();
