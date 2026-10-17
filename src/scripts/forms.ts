// Enquiry and application forms: type switching, inline validation, submission
// to /api/enquiry.php, and an email fallback when the endpoint is unavailable.

type Control = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const GSTIN = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/i;
const SITE_EMAIL = 'info@devrizgroup.com';

const pretty = (slug: string) =>
  slug
    .replace(/[^a-z0-9-]/g, '')
    .slice(0, 60)
    .split('-')
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(' ');

const labelOf = (control: Control) => {
  const label = control.closest('[data-field]')?.querySelector('label');
  const text = [...(label?.childNodes ?? [])]
    .filter((n) => n.nodeType === Node.TEXT_NODE)
    .map((n) => n.textContent)
    .join('')
    .trim();
  return text || control.name;
};

function messageFor(control: Control): string {
  const value = control.value.trim();
  if (control instanceof HTMLInputElement && control.type === 'checkbox') {
    return control.required && !control.checked ? 'Please tick this box so we can reply to you.' : '';
  }
  if (control.required && !value) {
    if (control instanceof HTMLSelectElement) return 'Choose an option.';
    return `Enter your ${labelOf(control).toLowerCase()}.`;
  }
  if (!value) return '';
  if (control.type === 'email' && !EMAIL.test(value)) return 'Enter an email address in the format name@example.com.';
  if (control.type === 'tel') {
    const digits = value.replace(/\D/g, '');
    if (!/^[+\d\s()-]+$/.test(value) || digits.length < 7 || digits.length > 15) return 'Enter a phone number with 7 to 15 digits.';
  }
  if (control.type === 'url' && !/^https?:\/\/[^\s.]+\.[^\s]{2,}$/i.test(value)) return 'Enter a full link starting with https://';
  if (control.name === 'gstin' && !GSTIN.test(value)) return 'A GSTIN has 15 characters, for example 09AAAAA0000A1Z5.';
  return '';
}

function showError(control: Control, message: string) {
  const field = control.closest<HTMLElement>('[data-field]');
  const error = field?.querySelector<HTMLElement>('.error');
  if (!field || !error) return;
  field.dataset.invalid = message ? 'true' : 'false';
  control.setAttribute('aria-invalid', message ? 'true' : 'false');
  error.textContent = message;
  error.hidden = !message;
}

document.querySelectorAll<HTMLFormElement>('[data-enquiry-form]').forEach((form) => {
  const started = Date.now();
  const kind = form.dataset.formKind ?? 'contact';
  const success = form.parentElement?.querySelector<HTMLElement>('[data-form-success]');
  const failure = form.querySelector<HTMLElement>('[data-form-error]');
  const submit = form.querySelector<HTMLButtonElement>('[data-submit]')!;
  const submitLabel = form.querySelector<HTMLElement>('[data-submit-label]')!;
  const idleLabel = submitLabel.textContent ?? 'Send';
  const params = new URLSearchParams(location.search);

  const controls = () =>
    [...form.querySelectorAll<Control>('input, select, textarea')].filter(
      (c) => !c.disabled && c.type !== 'hidden' && c.type !== 'radio' && c.name !== 'website',
    );

  /* Enquiry type ----------------------------------------------------------- */
  const radios = [...form.querySelectorAll<HTMLInputElement>('input[name="enquiry"]')];
  const intro = form.querySelector<HTMLElement>('[data-enquiry-intro]');
  const organisation = form.querySelector<HTMLInputElement>('input[name="organisation"]');

  const setRequired = (control: Control | null, required: boolean) => {
    if (!control) return;
    control.required = required;
    const field = control.closest('[data-field]');
    field?.querySelector<HTMLElement>('[data-req]')?.toggleAttribute('hidden', !required);
    field?.querySelector<HTMLElement>('[data-opt]')?.toggleAttribute('hidden', required);
    if (!required) showError(control, '');
  };

  const applyType = () => {
    const current = radios.find((r) => r.checked);
    if (!current) return;
    form.querySelectorAll<HTMLElement>('[data-show-for]').forEach((block) => {
      const show = (block.dataset.showFor ?? '').split(' ').includes(current.value);
      block.hidden = !show;
      block.querySelectorAll<Control>('input, select, textarea').forEach((c) => (c.disabled = !show));
    });
    if (intro) intro.textContent = current.dataset.intro ?? '';
    setRequired(organisation, ['partnership', 'vendor'].includes(current.value));
  };

  if (radios.length) {
    const wanted = params.get('enquiry');
    const match = radios.find((r) => r.value === wanted);
    if (match) match.checked = true;
    radios.forEach((r) => r.addEventListener('change', applyType));
    applyType();
  }

  /* Context passed in the link (company, sector, role) ---------------------- */
  const regarding = form.querySelector<HTMLElement>('[data-regarding]');
  const regardingInput = form.querySelector<HTMLInputElement>('input[name="regarding"]');
  const subject = pretty(params.get('company') ?? '') || pretty(params.get('sector') ?? '');
  if (subject && regarding && regardingInput) {
    regarding.textContent = `Regarding: ${subject}`;
    regarding.hidden = false;
    regardingInput.value = subject;
  }
  const role = params.get('role');
  const roleSelect = form.querySelector<HTMLSelectElement>('select[name="role"]');
  if (role && roleSelect) {
    const slug = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const option = [...roleSelect.options].find((o) => o.dataset.slug === role || slug(o.value) === role);
    if (option) roleSelect.value = option.value;
  }

  /* Validation -------------------------------------------------------------- */
  form.addEventListener(
    'blur',
    (event) => {
      const control = event.target as Control;
      if (!control.name || control.type === 'radio') return;
      if (control.type === 'url' && control.value.trim() && !/^https?:\/\//i.test(control.value.trim())) {
        control.value = 'https://' + control.value.trim();
      }
      showError(control, messageFor(control));
    },
    true,
  );
  form.addEventListener('input', (event) => {
    const control = event.target as Control;
    if (control.closest<HTMLElement>('[data-field]')?.dataset.invalid === 'true') showError(control, messageFor(control));
  });

  const mailto = () => {
    const lines = controls()
      .filter((c) => c.name !== 'consent' && c.value.trim())
      .map((c) => `${labelOf(c)}: ${c.value.trim()}`);
    const type = radios.find((r) => r.checked)?.dataset.label;
    const title = kind === 'careers' ? 'Career application' : `${type ?? 'Website'} enquiry`;
    const body = lines.join('\n').slice(0, 1800);
    return `mailto:${SITE_EMAIL}?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`;
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (failure) failure.hidden = true;

    let firstInvalid: Control | null = null;
    for (const control of controls()) {
      const message = messageFor(control);
      showError(control, message);
      if (message && !firstInvalid) firstInvalid = control;
    }
    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }

    const data = new FormData(form);
    data.set('form', kind);
    data.set('elapsed', String(Math.round((Date.now() - started) / 1000)));
    data.set('page', location.pathname);

    submit.disabled = true;
    submitLabel.textContent = 'Sending';
    try {
      const response = await fetch(form.action, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
      const isJson = (response.headers.get('content-type') ?? '').includes('application/json');
      if (!isJson) throw new Error('endpoint unavailable');
      const result = (await response.json()) as { ok: boolean; errors?: Record<string, string> };

      if (!result.ok && result.errors) {
        let first: Control | null = null;
        for (const [name, message] of Object.entries(result.errors)) {
          const control = form.elements.namedItem(name) as Control | null;
          if (!control || !('value' in control)) continue;
          showError(control, message);
          first ??= control;
        }
        first?.focus();
        return;
      }
      if (!response.ok || !result.ok) throw new Error('send failed');

      form.hidden = true;
      if (success) {
        success.hidden = false;
        success.focus();
        success.scrollIntoView({ block: 'center' });
      }
    } catch {
      if (failure) {
        failure.querySelector<HTMLAnchorElement>('[data-mailto]')?.setAttribute('href', mailto());
        failure.hidden = false;
        failure.scrollIntoView({ block: 'nearest' });
      }
    } finally {
      submit.disabled = false;
      submitLabel.textContent = idleLabel;
    }
  });
});
