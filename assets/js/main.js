/* Cleaning Cheats — site behavior (no dependencies) */
(() => {
  'use strict';

  const CONFIG = {
    // Paste a form endpoint here to receive quote requests directly
    // (e.g. Formspree: 'https://formspree.io/f/xxxxxxxx'). When empty, the quote
    // form falls back to opening the visitor's email app with the request filled in.
    formEndpoint: '',
    email: 'cleanercoach@outlook.com',
    phoneDisplay: '(208) 709-1908',
    phoneHref: 'tel:+12087091908'
  };

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ---------- Footer year ---------- */
  document.querySelectorAll('[data-year]').forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });

  /* ---------- Header + mobile CTA on scroll ---------- */
  const header = document.querySelector('[data-header]');
  const mobileCta = document.querySelector('[data-mobile-cta]');
  const ctaAlways = mobileCta && mobileCta.hasAttribute('data-always');
  let ticking = false;

  const onScroll = () => {
    const y = window.scrollY;
    if (header) header.classList.toggle('is-scrolled', y > 8);
    if (mobileCta) mobileCta.classList.toggle('is-shown', ctaAlways || y > 360);
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(onScroll);
    }
  }, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  const toggle = document.querySelector('[data-nav-toggle]');
  const menu = document.getElementById('mobile-menu');

  if (toggle && menu) {
    let closeTimer;
    const isOpen = () => toggle.getAttribute('aria-expanded') === 'true';

    const openMenu = () => {
      clearTimeout(closeTimer);
      menu.hidden = false;
      requestAnimationFrame(() => menu.classList.add('is-open'));
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Close menu');
      document.body.classList.add('menu-open');
    };

    const closeMenu = (returnFocus = true) => {
      menu.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open menu');
      document.body.classList.remove('menu-open');
      closeTimer = setTimeout(() => { menu.hidden = true; }, 280);
      if (returnFocus) toggle.focus();
    };

    toggle.addEventListener('click', () => (isOpen() ? closeMenu() : openMenu()));
    menu.addEventListener('click', (e) => { if (e.target.closest('a')) closeMenu(false); });

    document.addEventListener('keydown', (e) => {
      if (!isOpen()) return;
      if (e.key === 'Escape') {
        closeMenu();
        return;
      }
      if (e.key === 'Tab') {
        // Keep focus cycling between the toggle and the menu while it is open.
        const focusables = [toggle, ...menu.querySelectorAll('a, button')];
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        } else if (!focusables.includes(document.activeElement)) {
          e.preventDefault();
          first.focus();
        }
      }
    });

    window.matchMedia('(min-width: 960px)').addEventListener('change', (e) => {
      if (e.matches && isOpen()) closeMenu(false);
    });
  }

  /* ---------- Reveal on scroll ---------- */
  const revealEls = document.querySelectorAll('.reveal, [data-animate]');
  const counters = document.querySelectorAll('[data-count]');
  const canObserve = 'IntersectionObserver' in window;

  if (canObserve && !reduceMotion.matches) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0 });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  /* ---------- Pause looping decoration while off-screen (saves battery) ---------- */
  if (canObserve) {
    const mio = new IntersectionObserver((entries) => {
      entries.forEach((entry) => entry.target.classList.toggle('is-offscreen', !entry.isIntersecting));
    });
    document.querySelectorAll('.hero, .page-hero, .detail-art, .owner-photo, .cta-band, .map-card, .section--sky, .site-footer')
      .forEach((el) => mio.observe(el));
  }

  /* ---------- Counters ---------- */
  const animateCount = (el) => {
    const target = parseFloat(el.dataset.count);
    const duration = 1400;
    const start = performance.now();
    const step = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = String(Math.round(target * eased));
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  if (canObserve && !reduceMotion.matches && counters.length) {
    const cio = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCount(entry.target);
        cio.unobserve(entry.target);
      });
    }, { threshold: 0.6 });
    counters.forEach((el) => {
      el.textContent = '0';
      cio.observe(el);
    });
  }

  /* ---------- Tabs ---------- */
  document.querySelectorAll('[data-tabs]').forEach((tabsRoot) => {
    const tabs = Array.from(tabsRoot.querySelectorAll('[role="tab"]'));

    const select = (tab, focus) => {
      tabs.forEach((t) => {
        const on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        const panel = document.getElementById(t.getAttribute('aria-controls'));
        if (panel) {
          panel.hidden = !on;
          panel.classList.toggle('is-active', on);
        }
      });
      if (focus) tab.focus();
    };

    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => select(tab, false));
      tab.addEventListener('keydown', (e) => {
        let next = null;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (i + 1) % tabs.length;
        else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (i - 1 + tabs.length) % tabs.length;
        else if (e.key === 'Home') next = 0;
        else if (e.key === 'End') next = tabs.length - 1;
        if (next !== null) {
          e.preventDefault();
          select(tabs[next], true);
        }
      });
    });
  });

  /* ---------- Quote form ---------- */
  const form = document.querySelector('[data-quote-form]');
  if (form) initQuoteForm(form);

  function initQuoteForm(form) {
    const steps = Array.from(form.querySelectorAll('[data-step]'));
    const progress = document.querySelector('[data-progress]');
    const progressWrap = document.querySelector('[data-progress-wrap]');
    const stepLabel = document.querySelector('[data-step-label]');
    const live = document.querySelector('[data-live]');
    const alertBox = form.querySelector('[data-form-alert]');
    const success = document.querySelector('[data-success]');
    const SERVICES = ['residential', 'commercial', 'rental'];

    const TOWNS = { 'idaho-falls': 'Idaho Falls', rigby: 'Rigby', rexburg: 'Rexburg', 'island-park': 'Island Park' };
    let current = 0;

    // Pre-fill from links like quote.html?service=rental&town=island-park
    const params = new URLSearchParams(window.location.search);
    const pre = params.get('service');
    if (pre && SERVICES.includes(pre)) {
      const radio = form.querySelector(`input[name="service"][value="${pre}"]`);
      if (radio) radio.checked = true;
    }
    const town = params.get('town');
    const townSelect = form.querySelector('select[name="town"]');
    if (town && TOWNS[town] && townSelect) townSelect.value = TOWNS[town];

    const selectedService = () => {
      const checked = form.querySelector('input[name="service"]:checked');
      return checked ? checked.value : null;
    };

    // Show only the detail fields that match the chosen service.
    const syncConditional = () => {
      const service = selectedService();
      form.querySelectorAll('[data-for-service]').forEach((group) => {
        const show = group.dataset.forService.split(' ').includes(service);
        group.hidden = !show;
        group.querySelectorAll('input, select, textarea').forEach((f) => { f.disabled = !show; });
      });
    };
    syncConditional();

    const fieldsIn = (scope) => Array.from(scope.querySelectorAll('input, select, textarea'))
      .filter((f) => !f.disabled && f.type !== 'hidden' && !f.closest('.hp'));

    const getError = (field) => {
      if (field.type === 'radio') {
        if (!field.required) return '';
        const anyChecked = Array.from(form.querySelectorAll(`input[name="${field.name}"]`)).some((r) => r.checked);
        return anyChecked ? '' : (field.dataset.error || 'Please choose an option.');
      }
      const value = field.value.trim();
      if (field.required && !value) return field.dataset.error || 'This field is required.';
      if (value && field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
        return 'Please enter a valid email address, like name@example.com.';
      }
      if (value && field.type === 'tel' && value.replace(/\D/g, '').length < 10) {
        return 'Please enter a 10-digit phone number, like (208) 555-0123.';
      }
      return '';
    };

    const setError = (field, message) => {
      const wrap = field.closest('[data-field]');
      if (!wrap) return;
      const out = wrap.querySelector('.field-error span');
      wrap.classList.toggle('has-error', Boolean(message));
      if (out) out.textContent = message;
      const targets = field.type === 'radio' ? wrap.querySelectorAll(`input[name="${field.name}"]`) : [field];
      targets.forEach((t) => {
        if (message) t.setAttribute('aria-invalid', 'true');
        else t.removeAttribute('aria-invalid');
      });
    };

    const validateStep = (index) => {
      const seen = new Set();
      const invalid = [];
      fieldsIn(steps[index]).forEach((field) => {
        if (field.type === 'radio') {
          if (seen.has(field.name)) return;
          seen.add(field.name);
        }
        const message = getError(field);
        setError(field, message);
        if (message) invalid.push(field);
      });
      if (invalid.length) {
        const first = invalid[0];
        const focusTarget = first.type === 'radio'
          ? (steps[index].querySelector(`input[name="${first.name}"]:checked`) || first)
          : first;
        focusTarget.focus();
        if (live) {
          live.textContent = invalid.length === 1
            ? 'One field needs your attention.'
            : `${invalid.length} fields need your attention.`;
        }
        return false;
      }
      return true;
    };

    // Validate after the visitor leaves a field (never on every keystroke).
    form.addEventListener('focusout', (e) => {
      const field = e.target;
      if (!field.matches('input:not([type="radio"]), select, textarea') || field.closest('.hp')) return;
      const wrap = field.closest('[data-field]');
      if (!wrap) return;
      if (field.value.trim() || wrap.classList.contains('has-error')) setError(field, getError(field));
    });

    form.addEventListener('change', (e) => {
      const field = e.target;
      if (field.name === 'service') syncConditional();
      const wrap = field.closest('[data-field]');
      if (wrap && wrap.classList.contains('has-error')) setError(field, getError(field));
    });

    const scrollToForm = () => {
      const top = form.getBoundingClientRect().top;
      const offset = (header ? header.offsetHeight : 0) + 24;
      if (top < offset || top > window.innerHeight * 0.6) {
        window.scrollTo({ top: window.scrollY + top - offset, behavior: reduceMotion.matches ? 'auto' : 'smooth' });
      }
    };

    const showStep = (index, dir, focus) => {
      steps.forEach((s, i) => {
        const on = i === index;
        s.hidden = !on;
        s.classList.toggle('is-active', on);
      });
      steps[index].dataset.dir = dir;
      current = index;
      if (progress) progress.style.transform = `scaleX(${(index + 1) / steps.length})`;
      if (stepLabel) stepLabel.textContent = `Step ${index + 1} of ${steps.length}`;
      if (alertBox) alertBox.hidden = true;
      if (focus) {
        scrollToForm();
        const heading = steps[index].querySelector('[data-step-heading]');
        if (heading) heading.focus({ preventScroll: true });
      }
    };

    form.addEventListener('click', (e) => {
      if (e.target.closest('[data-next]')) {
        e.preventDefault();
        if (validateStep(current) && current < steps.length - 1) showStep(current + 1, 'forward', true);
      } else if (e.target.closest('[data-back]')) {
        e.preventDefault();
        if (current > 0) showStep(current - 1, 'back', true);
      }
    });

    // Enter in a text field advances instead of submitting early.
    form.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter' || e.target.tagName === 'TEXTAREA' || e.target.type === 'submit') return;
      if (current < steps.length - 1) {
        e.preventDefault();
        if (validateStep(current)) showStep(current + 1, 'forward', true);
      }
    });

    const labelFor = (name) => {
      const field = form.querySelector(`[name="${name}"]`);
      return (field && field.dataset.label) || name;
    };

    const buildMailto = (data) => {
      const lines = [];
      data.forEach((value, key) => {
        if (key.startsWith('_') || key === 'company_website' || !String(value).trim()) return;
        const field = form.querySelector(`[name="${key}"]`);
        let display = value;
        if (field && field.type === 'radio') {
          const chosen = form.querySelector(`input[name="${key}"]:checked`);
          const text = chosen && chosen.closest('label') && chosen.closest('label').querySelector('strong');
          if (text) display = text.textContent.trim();
        }
        lines.push(`${labelFor(key)}: ${display}`);
      });
      const name = data.get('name') || 'Website visitor';
      const subject = `Quote request from ${name}`;
      return `mailto:${CONFIG.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`;
    };

    const showSuccess = (viaEmail, name) => {
      form.hidden = true;
      if (progressWrap) progressWrap.hidden = true;
      if (!success) return;
      const firstName = String(name || '').trim().split(/\s+/)[0];
      success.querySelector('[data-success-name]').textContent = firstName ? `Thanks, ${firstName}!` : 'Thank you!';
      success.querySelector('[data-success-email]').hidden = !viaEmail;
      success.querySelector('[data-success-sent]').hidden = viaEmail;
      success.hidden = false;
      scrollToForm();
      const heading = success.querySelector('h2');
      if (heading) heading.focus({ preventScroll: true });
    };

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!validateStep(current)) return;

      const data = new FormData(form);
      const name = data.get('name');

      // Honeypot filled in → quietly pretend it worked.
      if (String(data.get('company_website') || '').trim()) {
        showSuccess(false, name);
        return;
      }

      const submit = form.querySelector('[type="submit"]');
      submit.disabled = true;
      submit.classList.add('is-loading');
      submit.setAttribute('aria-busy', 'true');
      if (alertBox) alertBox.hidden = true;

      try {
        if (CONFIG.formEndpoint) {
          const res = await fetch(CONFIG.formEndpoint, {
            method: 'POST',
            body: data,
            headers: { Accept: 'application/json' }
          });
          if (!res.ok) throw new Error(`Request failed: ${res.status}`);
          showSuccess(false, name);
        } else {
          window.location.href = buildMailto(data);
          showSuccess(true, name);
        }
      } catch (err) {
        if (alertBox) {
          alertBox.hidden = false;
          alertBox.focus();
        }
      } finally {
        submit.disabled = false;
        submit.classList.remove('is-loading');
        submit.removeAttribute('aria-busy');
      }
    });

    showStep(0, 'forward', false);
  }
})();
