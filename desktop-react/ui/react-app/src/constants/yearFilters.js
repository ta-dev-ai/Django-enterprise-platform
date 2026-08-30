export const YEAR_FILTER_OPTIONS = [
  { value: 'all', label: 'Toutes les années' },
  { value: '2026', label: '2026' },
  { value: '2025', label: '2025' },
  { value: '2024', label: '2024' },
  { value: '2023', label: '2023' },
  { value: '2022', label: '2022' },
  { value: '2021', label: '2021' },
];

export function getYearPeriodLabel(year) {
  if (!year || year === 'all') return 'Toutes les périodes';
  return `1 Jan – 31 Déc ${year}`;
}
