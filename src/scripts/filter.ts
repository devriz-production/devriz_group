// Filters a list by category chips and an optional text search.
// State lives in the URL (?sector=..., ?category=..., ?q=...) so a filtered view can be linked to.

document.querySelectorAll<HTMLElement>('[data-filter]').forEach((scope) => {
  const param = scope.dataset.filter || 'category';
  const chips = [...scope.querySelectorAll<HTMLButtonElement>('[data-filter-value]')];
  const search = scope.querySelector<HTMLInputElement>('[data-filter-search]');
  const items = [...scope.querySelectorAll<HTMLElement>('[data-filter-item]')];
  const groups = [...scope.querySelectorAll<HTMLElement>('[data-filter-group]')];
  const count = scope.querySelector<HTMLElement>('[data-filter-count]');
  const empty = scope.querySelector<HTMLElement>('[data-filter-empty]');
  const reset = scope.querySelector<HTMLButtonElement>('[data-filter-reset]');
  const noun = scope.dataset.noun || 'result';
  const plural = scope.dataset.nounPlural || noun + 's';

  const url = new URL(location.href);
  let value = url.searchParams.get(param) || '';
  if (value && !chips.some((c) => c.dataset.filterValue === value)) value = '';
  let query = (url.searchParams.get('q') || '').trim();
  if (search) search.value = query;

  const apply = (push: boolean) => {
    const q = query.toLowerCase();
    let shown = 0;
    for (const item of items) {
      const tags = (item.dataset.tags || '').split(' ');
      const matchTag = !value || tags.includes(value);
      const matchText = !q || (item.dataset.text || item.textContent || '').toLowerCase().includes(q);
      const visible = matchTag && matchText;
      item.hidden = !visible;
      if (visible) shown++;
    }
    for (const group of groups) {
      group.hidden = !group.querySelector('[data-filter-item]:not([hidden])');
    }
    chips.forEach((c) => c.setAttribute('aria-pressed', String((c.dataset.filterValue || '') === value)));
    if (count) count.textContent = `${shown} ${shown === 1 ? noun : plural}`;
    if (empty) empty.hidden = shown > 0;

    if (push) {
      const next = new URL(location.href);
      if (value) next.searchParams.set(param, value);
      else next.searchParams.delete(param);
      if (query) next.searchParams.set('q', query);
      else next.searchParams.delete('q');
      history.replaceState(null, '', next);
    }
  };

  chips.forEach((chip) =>
    chip.addEventListener('click', () => {
      value = chip.dataset.filterValue || '';
      apply(true);
    }),
  );
  search?.addEventListener('input', () => {
    query = search.value.trim();
    apply(true);
  });
  reset?.addEventListener('click', () => {
    value = '';
    query = '';
    if (search) search.value = '';
    apply(true);
    (search ?? chips[0])?.focus();
  });

  apply(false);
});
