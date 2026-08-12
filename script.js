/* ══════════════════════════════════════════════════════════
   THE BLUEPRINT — script.js
   Cursor · reveals · chapter index · clock · hover previews ·
   nav · theme · contact · scroll-top
   ══════════════════════════════════════════════════════════ */

'use strict';

(() => {
  /* ─── helpers ─────────────────────────────────────────── */
  const prefersReduced = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouchDevice = () => window.matchMedia('(hover: none)').matches;

  /* ─── custom cursor ───────────────────────────────────── */
  if (!isTouchDevice()) {
    const dot = document.querySelector('.cursor-dot');
    const ring = document.querySelector('.cursor-ring');
    let rafId = null;

    const moveCursor = (clientX, clientY) => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        dot.style.left = `${clientX}px`;
        dot.style.top = `${clientY}px`;
        ring.style.left = `${clientX}px`;
        ring.style.top = `${clientY}px`;
      });
    };

    window.addEventListener('mousemove', (e) => moveCursor(e.clientX, e.clientY), { passive: true });

    document.querySelectorAll('a, button, .work-row').forEach((el) => {
      el.addEventListener('mouseenter', () => ring.classList.add('is-hovering'));
      el.addEventListener('mouseleave', () => ring.classList.remove('is-hovering'));
    });
  }

  /* ─── scroll reveal ───────────────────────────────────── */
  const revealTargets = document.querySelectorAll('.reveal-up');
  if (!prefersReduced() && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    revealTargets.forEach((el, i) => {
      el.style.setProperty('--reveal-delay', `${(i % 4) * 70}ms`);
      revealObserver.observe(el);
    });
  } else {
    revealTargets.forEach((el) => el.classList.add('is-visible'));
  }

  /* ─── chapter index active state ──────────────────────── */
  const indexSpans = document.querySelectorAll('.chapter-index span');
  if (indexSpans.length && !prefersReduced() && 'IntersectionObserver' in window) {
    const indexObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            indexSpans.forEach((s) => s.classList.toggle('is-active', s.dataset.target === entry.target.id));
          }
        });
      },
      { threshold: 0.35, rootMargin: '-60px 0px -50% 0px' }
    );
    document.querySelectorAll('section.chapter').forEach((sec) => {
      if (sec.id && sec.id !== 'intro') indexObserver.observe(sec);
    });
  }

  /* ─── header, scroll-top, active nav link ─────────────── */
  const header = document.getElementById('site-header');
  const scrollTopBtn = document.getElementById('scrollTop');

  const onScroll = () => {
    const y = window.scrollY;
    if (header) header.classList.toggle('is-scrolled', y > 24);
    if (scrollTopBtn) scrollTopBtn.toggleAttribute('hidden', y < 500);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  scrollTopBtn?.addEventListener('click', () =>
    window.scrollTo({ top: 0, behavior: prefersReduced() ? 'auto' : 'smooth' })
  );

  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
  if (navAnchors.length && 'IntersectionObserver' in window) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            navAnchors.forEach((a) =>
              a.classList.toggle('is-active', a.getAttribute('href') === `#${entry.target.id}`)
            );
          }
        });
      },
      { threshold: 0.3, rootMargin: '-80px 0px -60% 0px' }
    );
    document.querySelectorAll('section.chapter').forEach((ch) => {
      if (ch.id) navObserver.observe(ch);
    });
  }

  /* ─── mobile nav ──────────────────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const navList = document.getElementById('navLinks');
  if (hamburger && navList) {
    hamburger.addEventListener('click', () => {
      const isOpen = navList.classList.toggle('is-open');
      hamburger.classList.toggle('is-open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    navList.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeMenu));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navList.classList.contains('is-open')) closeMenu();
    });
  }
  function closeMenu() {
    navList?.classList.remove('is-open');
    hamburger?.classList.remove('is-open');
    hamburger?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  /* ─── theme toggle (soft crossfade) ───────────────────── */
  const themeToggle = document.getElementById('themeToggle');
  const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    document.body.classList.remove('theme-switch');
    void document.body.offsetWidth; // restart animation
    document.body.classList.add('theme-switch');
  };
  const stored = localStorage.getItem('theme');
  applyTheme(
    stored === 'dark' || stored === 'light'
      ? stored
      : window.matchMedia('(prefers-color-scheme: light)').matches
        ? 'light'
        : 'dark'
  );
  themeToggle?.addEventListener('click', () =>
    applyTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark')
  );

  /* ─── live clock (hero meta, Lagos time) ──────────────── */
  const heroClock = document.getElementById('hero-clock');
  if (heroClock) {
    const fmt = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Africa/Lagos',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    const updateClock = () => {
      heroClock.textContent = fmt.format(new Date());
    };
    updateClock();
    setInterval(updateClock, 1000);
  }

  /* ─── footer year ─────────────────────────────────────── */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ─── hover-reveal previews on work rows ──────────────── */
  const preview = document.querySelector('.work-preview');
  if (preview && !isTouchDevice() && !prefersReduced()) {
    const img = preview.querySelector('img');
    let raf = null;
    let x = 0;
    let y = 0;

    const tick = () => {
      raf = null;
      preview.style.left = `${x}px`;
      preview.style.top = `${y}px`;
    };

    document.querySelectorAll('.work-row[data-preview]').forEach((row) => {
      row.addEventListener('mouseenter', () => {
        img.src = row.dataset.preview;
        img.alt = `${row.querySelector('.work-title').textContent} preview`;
        preview.classList.add('is-visible');
      });
      row.addEventListener('mousemove', (e) => {
        x = e.clientX;
        y = e.clientY - 24;
        if (!raf) raf = requestAnimationFrame(tick);
      });
      row.addEventListener('mouseleave', () => preview.classList.remove('is-visible'));
    });

    window.matchMedia('(max-width: 900px)').addEventListener('change', (e) => {
      if (e.matches) preview.classList.remove('is-visible');
    });
  }

  /* ─── contact form (Formspree, accessible feedback) ──── */
  const form = document.getElementById('contactForm');
  const successEl = document.getElementById('contactSuccess');
  const resetBtn = document.getElementById('resetContact');

  if (form && successEl) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      try {
        const res = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' }
        });
        if (res.ok) {
          form.style.display = 'none';
          successEl.classList.add('is-shown');
          resetBtn.focus();
        } else {
          throw new Error('submit failed');
        }
      } catch {
        window.open('mailto:timileyinogunderekingmex@gmail.com', '_self');
      }
    });

    resetBtn.addEventListener('click', () => {
      form.reset();
      successEl.classList.remove('is-shown');
      form.style.display = 'grid';
      document.getElementById('name').focus();
    });
  }
})();
