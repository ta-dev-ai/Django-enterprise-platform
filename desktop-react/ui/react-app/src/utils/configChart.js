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

export const getBarOptions = (data, title, seriesNames = ["L'ensemble", 'Rénovés']) => {
  const isDark = document.body.classList.contains('theme-midnight');

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
      labels: {
        style: { colors: labelColor, fontSize: '10px', fontWeight: 600 },
        formatter: (val) => (val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val),
      },
    },
    grid: { borderColor: gridColor, strokeDashArray: 4 },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
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

export const getDonutOptions = (data, centerLabel) => {
  const isDark = document.body.classList.contains('theme-midnight');

  return {
    series: data.map((d) => d.value),
    chart: {
      type: 'donut',
      height: 280,
      background: 'transparent',
      fontFamily: 'Inter, sans-serif',
    },
    labels: data.map((d) => d.name),
    colors: data.map((d, i) => d.color || donutColors[i % donutColors.length]),
    dataLabels: { enabled: false },
    legend: { show: false },
    stroke: {
      show: true,
      width: 3,
      colors: [isDark ? '#0f172a' : '#ffffff'],
    },
    plotOptions: {
      pie: {
        donut: {
          size: '72%',
          background: 'transparent',
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: '12px',
              fontWeight: 500,
              color: isDark ? '#94a3b8' : '#64748b',
              offsetY: 18,
            },
            value: {
              show: true,
              fontSize: '22px',
              fontWeight: 800,
              color: isDark ? '#ffffff' : '#0f172a',
              offsetY: -14,
              formatter: (val) => Number(val).toLocaleString('fr-FR'),
            },
            total: {
              show: true,
              label: centerLabel || 'Total rénovés',
              fontSize: '12px',
              fontWeight: 500,
              color: isDark ? '#94a3b8' : '#64748b',
              formatter: (w) => {
                const sum = w.globals.seriesTotals.reduce((a, b) => a + b, 0);
                return Number(sum).toLocaleString('fr-FR');
              },
            },
          },
        },
      },
    },
    tooltip: {
      theme: isDark ? 'dark' : 'light',
      y: {
        formatter: (val) => `${Number(val).toLocaleString('fr-FR')} (${((val / data.reduce((a, b) => a + b.value, 0)) * 100).toFixed(1)}%)`,
      },
    },
  };
};
