// Site-wide behaviour: display preferences, navigation, scroll reveal and count-up.
// No scroll listeners anywhere; visibility is handled by IntersectionObserver.

const root = document.documentElement;
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

const store = {
  get(key: string) {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key: string, value: string) {
    try {
      localStorage.setItem(key, value);
    } catch {
      /* private mode: the preference still applies for this page */
    }
  },
};

/* Display preferences ---------------------------------------------------- */

function syncPrefs() {
  const size = root.dataset.text ?? 'md';
  document.querySelectorAll<HTMLButtonElement>('[data-text-size]').forEach((b) => {
    b.setAttribute('aria-pressed', String(b.dataset.textSize === size));
  });
  const high = root.dataset.contrast === 'high';
  document.querySelectorAll<HTMLButtonElement>('[data-contrast-toggle]').forEach((b) => {
    b.setAttribute('aria-pressed', String(high));
  });
  const dark = root.dataset.theme === 'dark';
  document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]').forEach((b) => {
    b.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
  });
}

document.addEventListener('click', (event) => {
  const target = event.target as HTMLElement;

  const sizeBtn = target.closest<HTMLElement>('[data-text-size]');
  if (sizeBtn) {
    const size = sizeBtn.dataset.textSize!;
    if (size === 'md') delete root.dataset.text;
    else root.dataset.text = size;
    store.set('dg-text-size', size);
    syncPrefs();
    return;
  }

  if (target.closest('[data-contrast-toggle]')) {
    const high = root.dataset.contrast !== 'high';
    if (high) root.dataset.contrast = 'high';
    else delete root.dataset.contrast;
    store.set('dg-contrast', high ? 'high' : 'normal');
    syncPrefs();
    return;
  }

  if (target.closest('[data-theme-toggle]')) {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    store.set('dg-theme', next);
    syncPrefs();
  }
});

syncPrefs();

/* Mega menu -------------------------------------------------------------- */

const megaRoot = document.querySelector<HTMLElement>('[data-mega-root]');
if (megaRoot) {
  const trigger = megaRoot.querySelector<HTMLButtonElement>('[data-mega-trigger]')!;
  const panel = megaRoot.querySelector<HTMLElement>('[data-mega-panel]')!;
  const header = document.querySelector<HTMLElement>('[data-header]')!;
  let closeTimer = 0;

  const setOpen = (open: boolean) => {
    window.clearTimeout(closeTimer);
    panel.hidden = !open;
    trigger.setAttribute('aria-expanded', String(open));
    megaRoot.toggleAttribute('data-open', open);
  };
  const closeSoon = () => {
    window.clearTimeout(closeTimer);
    closeTimer = window.setTimeout(() => setOpen(false), 160);
  };

  trigger.addEventListener('click', () => setOpen(panel.hidden));

  // Hover intent for mouse users only; touch and keyboard use the button.
  if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
    megaRoot.addEventListener('pointerenter', () => setOpen(true));
    megaRoot.addEventListener('pointerleave', closeSoon);
    panel.addEventListener('pointerenter', () => window.clearTimeout(closeTimer));
    panel.addEventListener('pointerleave', closeSoon);
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !panel.hidden) {
      setOpen(false);
      trigger.focus();
    }
  });
  document.addEventListener('click', (event) => {
    if (!panel.hidden && !header.contains(event.target as Node)) setOpen(false);
  });
  megaRoot.addEventListener('focusout', (event) => {
    const next = (event as FocusEvent).relatedTarget as Node | null;
    if (next && !megaRoot.contains(next)) setOpen(false);
  });
}

/* Mobile drawer ---------------------------------------------------------- */

const drawer = document.querySelector<HTMLElement>('[data-drawer]');
const drawerOpen = document.querySelector<HTMLButtonElement>('[data-drawer-open]');
if (drawer && drawerOpen) {
  const focusable = () => [...drawer.querySelectorAll<HTMLElement>('a[href], button, summary')].filter((el) => el.offsetParent !== null);

  const setDrawer = (open: boolean) => {
    drawer.hidden = !open;
    drawerOpen.setAttribute('aria-expanded', String(open));
    root.style.overflow = open ? 'hidden' : '';
    if (open) drawer.querySelector<HTMLElement>('[data-drawer-close]')?.focus();
    else drawerOpen.focus();
  };

  drawerOpen.addEventListener('click', () => setDrawer(true));
  drawer.querySelector('[data-drawer-close]')?.addEventListener('click', () => setDrawer(false));
  drawer.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setDrawer(false);
    if (event.key !== 'Tab') return;
    const items = focusable();
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
  // Leaving the mobile layout closes the drawer so the page is never left locked.
  matchMedia('(min-width: 1024px)').addEventListener('change', (e) => {
    if (e.matches && !drawer.hidden) {
      drawer.hidden = true;
      drawerOpen.setAttribute('aria-expanded', 'false');
      root.style.overflow = '';
    }
  });
}

/* Scroll reveal and count-up --------------------------------------------- */

const revealItems = document.querySelectorAll<HTMLElement>('[data-reveal]');
if (reduceMotion || !('IntersectionObserver' in window)) {
  revealItems.forEach((el) => el.classList.add('is-in'));
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-in');
        observer.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
  );
  revealItems.forEach((el) => observer.observe(el));
}

const counters = document.querySelectorAll<HTMLElement>('[data-count]');
if (counters.length && !reduceMotion && 'IntersectionObserver' in window) {
  const format = new Intl.NumberFormat('en-IN');
  const run = (el: HTMLElement) => {
    const target = Number(el.dataset.count);
    const suffix = el.dataset.suffix ?? '';
    const duration = 1400;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 4);
      el.textContent = format.format(Math.round(target * eased)) + suffix;
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        run(entry.target as HTMLElement);
        observer.unobserve(entry.target);
      }
    },
    { threshold: 0.6 },
  );
  counters.forEach((el) => observer.observe(el));
}

/* Preview panels: a list on the left swaps the picture on the right -------- */

document.querySelectorAll<HTMLElement>('[data-preview-group]').forEach((group) => {
  const rows = group.querySelectorAll<HTMLElement>('[data-preview-row]');
  const panes = group.querySelectorAll<HTMLElement>('[data-preview-pane]');
  const activate = (id: string) => {
    rows.forEach((r) => r.toggleAttribute('data-active', r.dataset.previewRow === id));
    panes.forEach((p) => p.toggleAttribute('data-active', p.dataset.previewPane === id));
  };
  rows.forEach((row) => {
    const id = row.dataset.previewRow!;
    row.addEventListener('pointerenter', () => activate(id));
    row.addEventListener('focusin', () => activate(id));
  });
});
