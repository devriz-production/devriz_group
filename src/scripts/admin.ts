// Site admin: talks to /api/admin.php. All checks that matter (password, session,
// CSRF token, file type) happen on the server. This file only draws the screens.
// Data is always written with textContent, never as HTML.

type Job = {
  id: string;
  title: string;
  department: string;
  type: string;
  experience: string;
  location: string;
  summary: string;
  points: string[];
  fit: string;
  status: 'published' | 'draft' | 'closed';
  posted: string;
};

type Issue = {
  id: string;
  title: string;
  date: string;
  summary: string;
  size: number;
  status: 'published' | 'draft';
};

type Reply = {
  ok: boolean;
  error?: string;
  message?: string;
  errors?: Record<string, string>;
  [key: string]: unknown;
};

type Control = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

const API = '/api/admin.php';
const $ = <T extends HTMLElement>(selector: string, scope: ParentNode = document) => scope.querySelector<T>(selector)!;
const $$ = <T extends HTMLElement>(selector: string, scope: ParentNode = document) => [...scope.querySelectorAll<T>(selector)];

let csrf = '';
let maxUpload = 20 * 1024 * 1024;
let minPassword = 10;
let jobs: Job[] = [];
let issues: Issue[] = [];

const statusLabel: Record<string, string> = { published: 'Published', draft: 'Draft', closed: 'Closed' };
const dateLabel = (iso: string) => {
  const date = new Date(iso + 'T00:00:00');
  return Number.isNaN(date.getTime()) ? iso : new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(date);
};
// Today in the visitor's own time zone, as YYYY-MM-DD.
const today = () => {
  const now = new Date();
  return [now.getFullYear(), String(now.getMonth() + 1).padStart(2, '0'), String(now.getDate()).padStart(2, '0')].join('-');
};
const sizeLabel = (bytes: number) => (bytes >= 1048576 ? `${(bytes / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`);

/* Views and messages ------------------------------------------------------- */

function show(view: 'loading' | 'offline' | 'setup' | 'login' | 'app') {
  $$('[data-view]').forEach((section) => (section.hidden = section.dataset.view !== view));
  $('[data-session-actions]').hidden = view !== 'app';
  const first = $$<HTMLInputElement>(`[data-view="${view}"] input:not([type="hidden"])`)[0];
  first?.focus();
}

let toastTimer = 0;
function toast(message: string) {
  const el = $('[data-toast]');
  el.textContent = message;
  el.hidden = false;
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => (el.hidden = true), 4200);
}

/* Talking to the server ---------------------------------------------------- */

class Offline extends Error {}

async function call(action: string, body?: FormData): Promise<{ status: number; data: Reply }> {
  let response: Response;
  try {
    response = await fetch(`${API}?action=${encodeURIComponent(action)}`, {
      method: body ? 'POST' : 'GET',
      body,
      credentials: 'same-origin',
      headers: { Accept: 'application/json', ...(body ? { 'X-CSRF-Token': csrf } : {}) },
    });
  } catch {
    throw new Offline();
  }
  if (!(response.headers.get('content-type') ?? '').includes('application/json')) throw new Offline();
  const data = (await response.json()) as Reply;
  if (response.status === 401 && data.error === 'auth') {
    csrf = '';
    show('login');
    toast('Your session has ended. Sign in again.');
  }
  return { status: response.status, data };
}

/* Form helpers ------------------------------------------------------------- */

function setError(form: HTMLFormElement, name: string, message: string) {
  const control = form.elements.namedItem(name) as Control | null;
  const field = control?.closest<HTMLElement>('[data-field]');
  const error = field?.querySelector<HTMLElement>('.error');
  if (!control || !field || !error) return false;
  field.dataset.invalid = message ? 'true' : 'false';
  control.setAttribute('aria-invalid', message ? 'true' : 'false');
  error.textContent = message;
  error.hidden = !message;
  return true;
}

function clearErrors(form: HTMLFormElement) {
  $$<HTMLElement>('[data-field]', form).forEach((field) => {
    field.dataset.invalid = 'false';
    const error = field.querySelector<HTMLElement>('.error');
    if (error) {
      error.textContent = '';
      error.hidden = true;
    }
    field.querySelector('[aria-invalid]')?.setAttribute('aria-invalid', 'false');
  });
  const alert = form.querySelector<HTMLElement>('[data-form-alert]');
  if (alert) alert.hidden = true;
}

function showErrors(form: HTMLFormElement, errors: Record<string, string>) {
  let first: Control | null = null;
  const leftover: string[] = [];
  for (const [name, message] of Object.entries(errors)) {
    if (setError(form, name, message)) first ??= form.elements.namedItem(name) as Control;
    else leftover.push(message);
  }
  if (leftover.length) formAlert(form, leftover.join(' '));
  first?.focus();
}

function formAlert(form: HTMLFormElement, message: string) {
  const alert = form.querySelector<HTMLElement>('[data-form-alert]');
  if (!alert) return;
  alert.textContent = message;
  alert.hidden = false;
}

/** Runs the request with the button disabled, and routes errors to the form. */
async function submit(form: HTMLFormElement, action: string, local: Record<string, string>, body: FormData): Promise<Reply | null> {
  clearErrors(form);
  if (Object.keys(local).length) {
    showErrors(form, local);
    return null;
  }
  const button = $<HTMLButtonElement>('[data-submit]', form);
  const label = $('[data-submit-label]', form);
  const idle = label.textContent ?? '';
  button.disabled = true;
  label.textContent = 'Saving';
  try {
    const { data } = await call(action, body);
    if (data.ok) return data;
    if (data.errors) showErrors(form, data.errors);
    else if (data.error !== 'auth') formAlert(form, data.message ?? 'That did not work. Try again.');
    return null;
  } catch {
    formAlert(form, 'The server could not be reached. Check your connection and try again.');
    return null;
  } finally {
    button.disabled = false;
    label.textContent = idle;
  }
}

const value = (form: HTMLFormElement, name: string) => ((form.elements.namedItem(name) as Control | null)?.value ?? '').trim();

function passwordChecks(next: string, confirm: string, nameNext: string): Record<string, string> {
  const errors: Record<string, string> = {};
  if (next.length < minPassword) errors[nameNext] = `Use at least ${minPassword} characters.`;
  else if (next !== confirm) errors.confirm = 'The two passwords do not match.';
  return errors;
}

/* Lists -------------------------------------------------------------------- */

function setText(row: ParentNode, key: string, text: string) {
  const el = row.querySelector<HTMLElement>(`[data-f="${key}"]`);
  if (el) el.textContent = text;
}

function renderJobs() {
  const list = $('[data-list="jobs"]');
  const template = $<HTMLTemplateElement>('template[data-row="jobs"]');
  list.replaceChildren();
  for (const job of jobs) {
    const row = template.content.cloneNode(true) as DocumentFragment;
    setText(row, 'title', job.title);
    setText(row, 'department', job.department);
    setText(row, 'meta', [job.type, job.experience, job.location].filter(Boolean).join(', '));
    setText(row, 'status', statusLabel[job.status] ?? job.status);
    row.querySelector<HTMLElement>('[data-f="status"]')!.dataset.status = job.status;
    setText(row, 'posted', `Posted ${dateLabel(job.posted)}`);
    row.querySelector('[data-edit]')!.addEventListener('click', () => openJob(job));
    const remove = row.querySelector<HTMLButtonElement>('[data-delete]')!;
    remove.setAttribute('aria-label', `Delete ${job.title}`);
    remove.addEventListener('click', () =>
      confirmDelete(`Delete “${job.title}”?`, 'The opening is removed from the careers page and from this list. This cannot be undone. To keep a record, set it to Closed instead.', async () => {
        const body = new FormData();
        body.set('id', job.id);
        const { data } = await call('job-delete', body);
        if (!data.ok) return toast(data.message ?? 'That could not be deleted.');
        jobs = data.jobs as Job[];
        renderJobs();
        toast('Opening deleted.');
      }),
    );
    list.append(row);
  }
  $('[data-empty="jobs"]').hidden = jobs.length > 0;
  list.hidden = jobs.length === 0;
  $('[data-count="jobs"]').textContent = String(jobs.filter((j) => j.status === 'published').length);
}

function renderIssues() {
  const list = $('[data-list="newsletters"]');
  const template = $<HTMLTemplateElement>('template[data-row="newsletters"]');
  list.replaceChildren();
  for (const issue of issues) {
    const row = template.content.cloneNode(true) as DocumentFragment;
    setText(row, 'title', issue.title);
    setText(row, 'summary', issue.summary);
    setText(row, 'meta', `${dateLabel(issue.date)}, ${sizeLabel(issue.size)}`);
    setText(row, 'status', statusLabel[issue.status] ?? issue.status);
    row.querySelector<HTMLElement>('[data-f="status"]')!.dataset.status = issue.status;
    row.querySelector('[data-edit]')!.addEventListener('click', () => openIssue(issue));
    const remove = row.querySelector<HTMLButtonElement>('[data-delete]')!;
    remove.setAttribute('aria-label', `Delete ${issue.title}`);
    remove.addEventListener('click', () =>
      confirmDelete(`Delete “${issue.title}”?`, 'The PDF is removed from the server and the issue disappears from the site. This cannot be undone.', async () => {
        const body = new FormData();
        body.set('id', issue.id);
        const { data } = await call('newsletter-delete', body);
        if (!data.ok) return toast(data.message ?? 'That could not be deleted.');
        issues = data.issues as Issue[];
        renderIssues();
        toast('Newsletter deleted.');
      }),
    );
    list.append(row);
  }
  $('[data-empty="newsletters"]').hidden = issues.length > 0;
  list.hidden = issues.length === 0;
  $('[data-count="newsletters"]').textContent = String(issues.filter((i) => i.status === 'published').length);
}

/* Dialogs ------------------------------------------------------------------ */

const dialog = (name: string) => $<HTMLDialogElement>(`dialog[data-dialog="${name}"]`);

function fill(form: HTMLFormElement, values: Record<string, string>) {
  form.reset();
  clearErrors(form);
  for (const [name, v] of Object.entries(values)) {
    const control = form.elements.namedItem(name) as Control | null;
    if (control && control.type !== 'file') control.value = v;
  }
}

function openJob(job?: Job) {
  const d = dialog('job');
  const form = $<HTMLFormElement>('form', d);
  fill(form, {
    id: job?.id ?? '',
    title: job?.title ?? '',
    department: job?.department ?? '',
    type: job?.type ?? 'Full-time',
    experience: job?.experience ?? '',
    location: job?.location ?? '',
    summary: job?.summary ?? '',
    points: (job?.points ?? []).join('\n'),
    fit: job?.fit ?? '',
    status: job?.status ?? 'published',
    posted: job?.posted ?? '',
  });
  $('[data-dialog-title]', d).textContent = job ? 'Edit opening' : 'New opening';
  d.showModal();
}

function openIssue(issue?: Issue) {
  const d = dialog('newsletter');
  const form = $<HTMLFormElement>('form', d);
  fill(form, {
    id: issue?.id ?? '',
    title: issue?.title ?? '',
    date: issue?.date ?? today(),
    summary: issue?.summary ?? '',
    status: issue?.status ?? 'published',
  });
  $('[data-dialog-title]', d).textContent = issue ? 'Edit newsletter' : 'Upload newsletter';
  // A new issue needs a file. An existing one keeps its PDF unless a new one is chosen.
  const file = form.elements.namedItem('file') as HTMLInputElement;
  const field = file.closest<HTMLElement>('[data-field]')!;
  file.required = !issue;
  field.querySelector<HTMLElement>('[data-req]')?.toggleAttribute('hidden', Boolean(issue));
  field.querySelector<HTMLElement>('[data-opt]')?.toggleAttribute('hidden', !issue);
  const hint = field.querySelector<HTMLElement>('.hint');
  if (hint) hint.textContent = issue ? `PDF only, up to ${sizeLabel(maxUpload)}. Leave empty to keep the current file.` : `PDF only, up to ${sizeLabel(maxUpload)}.`;
  d.showModal();
}

let pendingDelete: (() => Promise<unknown>) | null = null;
function confirmDelete(title: string, text: string, run: () => Promise<unknown>) {
  const d = dialog('confirm');
  $('[data-confirm-title]', d).textContent = title;
  $('[data-confirm-text]', d).textContent = text;
  pendingDelete = run;
  d.showModal();
}

/* Start -------------------------------------------------------------------- */

async function loadApp() {
  show('app');
  try {
    const [j, n] = await Promise.all([call('jobs'), call('newsletters')]);
    if (j.data.ok) jobs = j.data.jobs as Job[];
    if (n.data.ok) issues = n.data.issues as Issue[];
    renderJobs();
    renderIssues();
  } catch {
    toast('The lists could not be loaded. Reload the page.');
  }
}

async function start() {
  show('loading');
  try {
    const { data } = await call('status');
    maxUpload = Number(data.maxUpload) || maxUpload;
    minPassword = Number(data.minPassword) || minPassword;
    if (data.authed) {
      csrf = String(data.csrf ?? '');
      await loadApp();
    } else if (!data.configured) {
      $('[data-setup-missing]').hidden = Boolean(data.setupReady);
      show('setup');
    } else {
      show('login');
    }
  } catch {
    show('offline');
  }
}

$('[data-retry]').addEventListener('click', start);

$<HTMLFormElement>('[data-form="setup"]').addEventListener('submit', async (event) => {
  event.preventDefault();
  const form = event.currentTarget as HTMLFormElement;
  const key = value(form, 'key');
  const password = (form.elements.namedItem('password') as HTMLInputElement).value;
  const confirm = (form.elements.namedItem('confirm') as HTMLInputElement).value;
  const errors: Record<string, string> = key ? {} : { key: 'Enter the setup key.' };
  Object.assign(errors, passwordChecks(password, confirm, 'password'));
  const body = new FormData();
  body.set('key', key);
  body.set('password', password);
  const reply = await submit(form, 'setup', errors, body);
  if (!reply) return;
  csrf = String(reply.csrf ?? '');
  form.reset();
  await loadApp();
  toast('Password created. You are signed in.');
});

$<HTMLFormElement>('[data-form="login"]').addEventListener('submit', async (event) => {
  event.preventDefault();
  const form = event.currentTarget as HTMLFormElement;
  const password = (form.elements.namedItem('password') as HTMLInputElement).value;
  const body = new FormData();
  body.set('password', password);
  const reply = await submit(form, 'login', password ? {} : { password: 'Enter the password.' }, body);
  if (!reply) return;
  csrf = String(reply.csrf ?? '');
  form.reset();
  await loadApp();
});

$('[data-logout]').addEventListener('click', async () => {
  try {
    await call('logout', new FormData());
  } catch {
    /* signed out locally either way */
  }
  csrf = '';
  jobs = [];
  issues = [];
  show('login');
});

$<HTMLFormElement>('[data-form="job"]').addEventListener('submit', async (event) => {
  event.preventDefault();
  const form = event.currentTarget as HTMLFormElement;
  const errors: Record<string, string> = {};
  if (!value(form, 'title')) errors.title = 'Enter the job title.';
  if (!value(form, 'department')) errors.department = 'Enter the department.';
  if (!value(form, 'type')) errors.type = 'Choose an employment type.';
  if (!value(form, 'location')) errors.location = 'Enter the location.';
  if (!value(form, 'summary')) errors.summary = 'Describe the role in a sentence or two.';
  const reply = await submit(form, 'job-save', errors, new FormData(form));
  if (!reply) return;
  jobs = reply.jobs as Job[];
  renderJobs();
  dialog('job').close();
  toast((reply.job as Job).status === 'published' ? 'Saved. It is live on the careers page.' : 'Saved. It is not shown on the site.');
});

$<HTMLFormElement>('[data-form="newsletter"]').addEventListener('submit', async (event) => {
  event.preventDefault();
  const form = event.currentTarget as HTMLFormElement;
  const file = (form.elements.namedItem('file') as HTMLInputElement).files?.[0];
  const errors: Record<string, string> = {};
  if (!value(form, 'title')) errors.title = 'Enter a title.';
  if (!value(form, 'date')) errors.date = 'Enter the issue date.';
  if (!file && !value(form, 'id')) errors.file = 'Choose the PDF to upload.';
  else if (file && !/\.pdf$/i.test(file.name)) errors.file = 'Upload the newsletter as a PDF.';
  else if (file && file.size > maxUpload) errors.file = `That file is ${sizeLabel(file.size)}. The limit is ${sizeLabel(maxUpload)}.`;
  const reply = await submit(form, 'newsletter-save', errors, new FormData(form));
  if (!reply) return;
  issues = reply.issues as Issue[];
  renderIssues();
  dialog('newsletter').close();
  toast((reply.issue as Issue).status === 'published' ? 'Saved. It is live on the newsletter page.' : 'Saved as a draft.');
});

$<HTMLFormElement>('[data-form="password"]').addEventListener('submit', async (event) => {
  event.preventDefault();
  const form = event.currentTarget as HTMLFormElement;
  const current = (form.elements.namedItem('current') as HTMLInputElement).value;
  const next = (form.elements.namedItem('next') as HTMLInputElement).value;
  const confirm = (form.elements.namedItem('confirm') as HTMLInputElement).value;
  const errors: Record<string, string> = current ? {} : { current: 'Enter the current password.' };
  Object.assign(errors, passwordChecks(next, confirm, 'next'));
  const body = new FormData();
  body.set('current', current);
  body.set('next', next);
  const reply = await submit(form, 'password', errors, body);
  if (!reply) return;
  csrf = String(reply.csrf ?? '');
  form.reset();
  dialog('password').close();
  toast('Password changed.');
});

$('[data-open-password]').addEventListener('click', () => {
  const d = dialog('password');
  fill($<HTMLFormElement>('form', d), {});
  d.showModal();
});
$('[data-new="job"]').addEventListener('click', () => openJob());
$('[data-new="newsletter"]').addEventListener('click', () => openIssue());

$('[data-confirm-yes]').addEventListener('click', async () => {
  const run = pendingDelete;
  pendingDelete = null;
  dialog('confirm').close();
  try {
    await run?.();
  } catch {
    toast('The server could not be reached.');
  }
});

$$<HTMLDialogElement>('dialog').forEach((d) => {
  $$('[data-close]', d).forEach((button) => button.addEventListener('click', () => d.close()));
});

// Tabs: click, or left and right arrow keys.
const tabs = $$<HTMLButtonElement>('[data-tab]');
function selectTab(name: string, focus = false) {
  tabs.forEach((tab) => {
    const on = tab.dataset.tab === name;
    tab.setAttribute('aria-selected', String(on));
    tab.tabIndex = on ? 0 : -1;
    if (on && focus) tab.focus();
  });
  $$('[data-panel]').forEach((panel) => (panel.hidden = panel.dataset.panel !== name));
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectTab(tab.dataset.tab!));
  tab.addEventListener('keydown', (event) => {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
    const next = tabs[(index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length];
    selectTab(next.dataset.tab!, true);
  });
});

start();
