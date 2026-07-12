/**
 * ChartController — ApexCharts from /api/datasets/{id}/chart
 */

const datasetId = window.DATASET_ID;
let chart = null;

async function loadChart(chartSpec = null) {
  const res = await fetch(`/api/datasets/${datasetId}/chart`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chart_spec: chartSpec }),
  });
  const payload = await res.json();
  const spec = payload.chart_spec || {};
  const data = payload.data || {};

  if (spec.type === 'table') {
    renderTable(data.rows || []);
    return;
  }

  const options = {
    chart: { type: spec.type === 'line' ? 'line' : 'bar', height: 320 },
    series: data.series || [],
    xaxis: { categories: data.categories || [] },
    title: { text: spec.y ? `${spec.aggregation || 'sum'} ${spec.y}` : 'Chart' },
  };
  const el = document.querySelector('#chart-container');
  if (chart) chart.destroy();
  chart = new ApexCharts(el, options);
  chart.render();
}

function renderTable(rows) {
  const container = document.getElementById('table-container');
  if (!rows.length) {
    container.innerHTML = '<p>Aucune donnée</p>';
    return;
  }
  const cols = Object.keys(rows[0]);
  const head = cols.map((c) => `<th class="px-2 py-1 text-left">${c}</th>`).join('');
  const body = rows
    .slice(0, 20)
    .map((r) => `<tr>${cols.map((c) => `<td class="px-2 py-1">${r[c] ?? ''}</td>`).join('')}</tr>`)
    .join('');
  container.innerHTML = `<table class="w-full text-sm"><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table>`;
}

loadChart();
window.addEventListener('dataset:filtered', () => loadChart());
window.addEventListener('chat:chart', (e) => loadChart(e.detail));
