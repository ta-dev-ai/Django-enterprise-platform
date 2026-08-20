/**
 * SidebarController — dynamic filters from DKM sidebar API.
 */

const datasetId = window.DATASET_ID;
let activeFilters = {};
let debounceTimer = null;

async function loadSidebar() {
  const res = await fetch(`/api/datasets/${datasetId}/sidebar`);
  const spec = await res.json();
  const root = document.getElementById('sidebar-filters');
  root.innerHTML = '';
  for (const f of spec.filters || []) {
    const block = document.createElement('div');
    block.className = 'mb-4';
    block.innerHTML = `<label class="block text-sm mb-1">${f.label_fr}</label>`;
    if (f.widget === 'multi_select' || f.widget === 'chips') {
      const select = document.createElement('select');
      select.multiple = true;
      select.dataset.column = f.column;
      for (const opt of f.options || []) {
        const o = document.createElement('option');
        o.value = opt.value;
        o.textContent = `${opt.value} (${opt.count})`;
        select.appendChild(o);
      }
      select.addEventListener('change', () => onFilterChange());
      block.appendChild(select);
    } else if (f.widget === 'numeric_range' || f.widget === 'date_range') {
      const min = document.createElement('input');
      min.type = f.widget === 'date_range' ? 'date' : 'number';
      min.placeholder = 'min';
      min.dataset.column = f.column;
      min.dataset.bound = 'min';
      const max = document.createElement('input');
      max.type = f.widget === 'date_range' ? 'date' : 'number';
      max.placeholder = 'max';
      max.dataset.column = f.column;
      max.dataset.bound = 'max';
      min.addEventListener('input', onFilterChange);
      max.addEventListener('input', onFilterChange);
      block.appendChild(min);
      block.appendChild(max);
    } else {
      const input = document.createElement('input');
      input.dataset.column = f.column;
      input.placeholder = 'Rechercher...';
      input.addEventListener('input', onFilterChange);
      block.appendChild(input);
    }
    root.appendChild(block);
  }
}

function collectFilters() {
  const filters = {};
  document.querySelectorAll('#sidebar-filters select[data-column]').forEach((sel) => {
    const values = Array.from(sel.selectedOptions).map((o) => o.value);
    if (values.length) filters[sel.dataset.column] = { op: 'in', values };
  });
  document.querySelectorAll('#sidebar-filters input[data-bound]').forEach((input) => {
    const col = input.dataset.column;
    if (!filters[col]) filters[col] = { op: 'between' };
    filters[col][input.dataset.bound] = input.value;
  });
  document.querySelectorAll('#sidebar-filters input:not([data-bound])').forEach((input) => {
    if (input.value) filters[input.dataset.column] = { op: 'contains', value: input.value };
  });
  return filters;
}

function onFilterChange() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(applyFilters, 300);
}

async function applyFilters() {
  activeFilters = collectFilters();
  const res = await fetch(`/api/datasets/${datasetId}/filter`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ filters: activeFilters }),
  });
  const data = await res.json();
  document.getElementById('row-indicator').textContent =
    `${data.filtered_row_count.toLocaleString('fr-FR')} / ${data.total_row_count.toLocaleString('fr-FR')} lignes`;
  window.dispatchEvent(new CustomEvent('dataset:filtered', { detail: data }));
}

document.getElementById('reset-filters')?.addEventListener('click', () => {
  document
    .getElementById('sidebar-filters')
    .querySelectorAll('input, select')
    .forEach((el) => {
      if (el.tagName === 'SELECT') el.selectedIndex = -1;
      else el.value = '';
    });
  onFilterChange();
});

loadSidebar().then(applyFilters);
