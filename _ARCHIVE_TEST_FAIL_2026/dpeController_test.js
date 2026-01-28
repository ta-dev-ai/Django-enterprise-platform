/* 
Syntax: JavaScript ES6.
Role: Contrôleur de TEST pour le DPE (Clone avec nettoyage DOM).
*/

import { getBarOptions, getDonutOptions } from '../configChart.js';
import { renderList, updatePageTitle, setActiveMenu } from '../utils/ui.js';

export const DpeController = {
  init(data, config = {}) {
    console.log('📊 [DpeController-TEST] Initializing...');

    if (!config.isOverview) {
      updatePageTitle('Classe DPE');
      setActiveMenu(2);
      this.adjustLayout();
    }

    this.renderStats(data.dpe, config);
  },

  adjustLayout() {
    const socialChart = document.getElementById('socialChart');
    if (socialChart) socialChart.parentElement.style.display = 'none';

    const socialDonut = document.getElementById('socialDonut');
    if (socialDonut) socialDonut.parentElement.parentElement.parentElement.style.display = 'none';
  },

  renderStats(data, config = {}) {
    const ids = {
      bar: config.bar || 'dpeBar',
      donut: config.donut || 'dpeDonut',
      list: config.list || 'dpeList',
    };

    // Nettoyage
    [ids.bar, ids.donut, ids.list].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = '';
    });

    if (!data || data.length === 0) {
      console.warn('⚠️ [DpeController] No data to render.');
      return;
    }

    // DPE Colors Mapping
    const dpeColorsMap = {
      A: '#009036',
      B: '#53af31',
      C: '#c6d802',
      D: '#f5e700',
      E: '#fbad18',
      F: '#ec661e',
      G: '#e31d2b',
    };

    const dpeItems = data.map((d) => ({
      name: `Classe ${d.className}`,
      value: d.count,
      percent: -1,
      color: dpeColorsMap[d.className] || '#ccc',
    }));

    const total = dpeItems.reduce((acc, curr) => acc + curr.value, 0);
    dpeItems.forEach((item) => {
      item.percent = Math.round((item.value / total) * 100 * 10) / 10;
    });

    // Render Bar
    const barData = dpeItems.map((d) => ({
      name: d.name,
      total: d.value,
      renovated: d.value,
    }));

    if (document.querySelector(`#${ids.bar}`)) {
      new ApexCharts(
        document.querySelector(`#${ids.bar}`),
        getBarOptions(barData, 'Répartition DPE', ['Total', 'Total']),
      ).render();
    }

    // Render Donut
    const dpeDonutOptions = getDonutOptions(dpeItems, 'DPE');
    dpeDonutOptions.colors = dpeItems.map((d) => d.color);

    if (document.querySelector(`#${ids.donut}`)) {
      new ApexCharts(document.querySelector(`#${ids.donut}`), dpeDonutOptions).render();
    }

    renderList(ids.list, dpeItems);
  },
};
