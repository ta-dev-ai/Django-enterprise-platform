/* 
Syntax: JavaScript ES6 (objets de configuration, fonctions fléchées).
Role: Centralise la configuration visuelle et structurelle des graphiques ApexCharts utilisés dans le dashboard.
Workflow: Exporte des palettes de couleurs et des générateurs d'options (Barres, Donuts) pour garantir une apparence uniforme sur toutes le pages.
*/

// Configuration for ApexCharts and Visual Styles
export const donutColors = [
  '#3B82F6',
  '#10B981',
  '#F59E0B',
  '#EF4444',
  '#8B5CF6',
  '#EC4899',
  '#6366F1',
  '#14B8A6',
  '#F97316',
  '#06B6D4',
  '#84CC16',
  '#D946EF',
  '#4F46E5',
  '#0EA5E9',
  '#2563EB',
  '#065F46',
  '#991B1B',
  '#7C3AED',
  '#BE185D',
  '#4338CA',
];

/**
 * Generates options for Bar Charts with theme support.
 * @param {Array} data - The dataset.
 * @param {String} title - Chart title.
 * @param {Array} seriesNames - Names for the series.
 */
export const getBarOptions = (data, title, seriesNames = ["L'ensemble", 'Rénovés']) => {
  const isDark = document.body.classList.contains('theme-midnight');

  // High-contrast colors for Dark Mode (Neon)
  const barColors = isDark ? ['#00f2ff', '#7000ff'] : ['#87CEEB', '#C4B5FD'];
  const labelColor = isDark ? '#cbd5e1' : '#94A3B8';
  const gridColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
  const titleColor = isDark ? '#ffffff' : '#64748B';

  return {
    series: [
      { name: seriesNames[0], data: data.map((d) => d.total) },
      { name: seriesNames[1], data: data.map((d) => d.renovated) },
    ],
    chart: {
      type: 'bar',
      height: 380,
      toolbar: { show: false },
      background: 'transparent',
      fontFamily: 'Inter, sans-serif',
      animations: { enabled: true, easing: 'easeinout', speed: 800 },
    },
    colors: barColors,
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '12px',
        borderRadius: 4,
        dataLabels: { position: 'top' },
      },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: data.map((d) => d.name),
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { colors: labelColor, fontSize: '10px', fontWeight: 600 } },
    },
    yaxis: {
      labels: { style: { colors: labelColor, fontSize: '10px' } },
    },
    grid: { borderColor: gridColor, strokeDashArray: 4 },
    legend: {
      position: 'bottom',
      horizontalAlign: 'center',
      fontSize: '12px',
      fontWeight: 500,
      labels: { colors: isDark ? '#ffffff' : '#64748B' },
      markers: { radius: 12, offsetX: -4 },
      itemMargin: { horizontal: 20, vertical: 10 },
    },
    title: {
      text: title,
      align: 'left',
      style: { fontSize: '14px', color: titleColor, fontWeight: 700 },
    },
    tooltip: { theme: isDark ? 'dark' : 'light' },
  };
};

/**
 * Generates options for Donut Charts with theme support.
 */
export const getDonutOptions = (data, centerLabel) => {
  const isDark = document.body.classList.contains('theme-midnight');

  return {
    series: data.map((d) => d.value),
    chart: {
      type: 'donut',
      height: 350,
      background: 'transparent',
      fontFamily: 'Inter, sans-serif',
    },
    labels: data.map((d) => d.name),
    colors: donutColors,
    dataLabels: { enabled: false },
    legend: { show: false },
    stroke: {
      show: true,
      width: 2,
      colors: [isDark ? 'rgba(15, 23, 42, 0.5)' : '#fff'],
    },
    plotOptions: {
      pie: {
        donut: {
          size: '65%',
          background: 'transparent',
          labels: {
            show: true,
            name: { show: true, color: isDark ? '#cbd5e1' : '#64748B' },
            value: { show: true, color: isDark ? '#ffffff' : '#334155' },
            total: {
              show: true,
              label: centerLabel || 'TOTAL',
              color: isDark ? '#38bdf8' : '#2b6cee',
            },
          },
        },
      },
    },
    tooltip: { theme: isDark ? 'dark' : 'light' },
  };
};
