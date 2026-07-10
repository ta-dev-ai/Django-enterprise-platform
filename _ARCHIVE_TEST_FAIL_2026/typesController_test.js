/* 
Syntax: JavaScript ES6.
Role: Contrôleur de TEST pour les types de travaux (Clone avec nettoyage DOM).
*/

import { getBarOptions, getDonutOptions, donutColors } from '../configChart.js';
import { renderList, updatePageTitle, setActiveMenu } from '../utils/ui.js';

export const TypesController = {
  init(data, config = {}) {
    console.log('🛠️ [TypesController-TEST] Initializing...');

    if (!config.isOverview) {
      updatePageTitle('Types de Rénovation');
      setActiveMenu(1);
      this.adjustLayout();
    }

    this.renderStats(data.types, config);
  },

  adjustLayout() {
    const socialChart = document.getElementById('socialChart');
    if (socialChart) socialChart.parentElement.style.display = 'none';

    const socialDonut = document.getElementById('socialDonut');
    if (socialDonut) socialDonut.parentElement.parentElement.parentElement.style.display = 'none';
  },

  renderStats(data, config = {}) {
    const ids = {
      bar: config.bar || 'typesBar', // Attention aux IDs par défaut du template test
      donut: config.donut || 'typesDonut',
      list: config.list || 'typesList',
    };

    // Nettoyage
    [ids.bar, ids.donut, ids.list].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = '';
    });

    if (!data || data.length === 0) {
      console.warn('⚠️ [TypesController] No data to render.');
      return;
    }

    // Process Data
    const typeItems = data.map((d, i) => ({
      name: d.type,
      value: d.count,
      percent: -1,
      color: donutColors[i % donutColors.length],
    }));

    const total = typeItems.reduce((acc, curr) => acc + curr.value, 0);
    typeItems.forEach((item) => (item.percent = Math.round((item.value / total) * 100 * 10) / 10));

    // Render Main Bar Chart
    const barData = typeItems.map((d) => ({ name: d.name, total: d.value, renovated: d.value })); // Simplified for bar

    if (document.querySelector(`#${ids.bar}`)) {
      new ApexCharts(
        document.querySelector(`#${ids.bar}`),
        getBarOptions(barData, 'Types de Rénovation (Volume)', ['Total', 'Total']),
      ).render();
    }

    // Render Donut
    if (document.querySelector(`#${ids.donut}`)) {
      new ApexCharts(
        document.querySelector(`#${ids.donut}`),
        getDonutOptions(typeItems, 'TYPES'),
      ).render();
    }

    // Render List
    renderList(ids.list, typeItems);
  },
};
