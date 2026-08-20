import { memo, useEffect, useMemo, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';
import 'echarts-gl';

const BRAND_CYAN = '#0ea5e9';
const BRAND_ACCENT = '#f97316';

const THEME = {
  light: {
    axisLabel: '#64748b',
    axisLine: '#94a3b8',
    splitLine: '#e2e8f0',
    background: 'transparent',
    ambientIntensity: 0.4,
  },
  dark: {
    axisLabel: '#cbd5e1',
    axisLine: 'rgba(56, 189, 248, 0.3)',
    splitLine: 'rgba(56, 189, 248, 0.12)',
    background: 'transparent',
    ambientIntensity: 0.55,
  },
};

function useIsDarkTheme() {
  const [isDark, setIsDark] = useState(() => document.body.classList.contains('theme-midnight'));

  useEffect(() => {
    const handler = (e) => setIsDark(e.detail?.theme === 'midnight');
    document.addEventListener('themeChanged', handler);
    return () => document.removeEventListener('themeChanged', handler);
  }, []);

  return isDark;
}

function ParisArrondissement3D({ data }) {
  const [selected, setSelected] = useState(null);
  const isDark = useIsDarkTheme();
  const total = data.reduce((sum, d) => sum + d.count, 0);
  const selectedItem = data.find((d) => d.arrondissement === selected);

  const option = useMemo(() => {
    const t = isDark ? THEME.dark : THEME.light;
    const seriesData = data.map((item) => ({
      value: [item.arrondissement, 0, item.count],
      itemStyle: {
        color: selected === item.arrondissement ? BRAND_ACCENT : BRAND_CYAN,
      },
    }));

    return {
      backgroundColor: t.background,
      tooltip: {
        formatter: (params) => {
          const item = data[params.dataIndex];
          if (!item) return '';
          return `<strong>${item.label} arrondissement</strong><br/>${item.count.toLocaleString('fr-FR')} DPE réalisés`;
        },
      },
      xAxis3D: {
        name: 'Arrondissement',
        type: 'category',
        data: data.map((d) => d.label),
        axisLabel: { textStyle: { color: t.axisLabel, fontSize: 10 } },
        axisLine: { lineStyle: { color: t.axisLine } },
      },
      yAxis3D: { type: 'category', data: [''], show: false },
      zAxis3D: {
        name: 'DPE',
        type: 'value',
        axisLabel: { textStyle: { color: t.axisLabel, fontSize: 10 } },
        axisLine: { lineStyle: { color: t.axisLine } },
        splitLine: { lineStyle: { color: t.splitLine } },
      },
      grid3D: {
        boxWidth: 220,
        boxDepth: 60,
        boxHeight: 90,
        viewControl: {
          projection: 'perspective',
          autoRotate: false,
          distance: 140,
          alpha: 22,
          beta: 25,
          center: [0, 0, 0],
        },
        light: {
          main: { intensity: 1.1, shadow: false },
          ambient: { intensity: t.ambientIntensity },
        },
      },
      series: [
        {
          type: 'bar3D',
          data: seriesData,
          shading: 'lambert',
          bevelSize: 0.3,
          barSize: 7,
          emphasis: {
            itemStyle: { color: BRAND_ACCENT },
            label: { show: true, formatter: (p) => `${data[p.dataIndex].label} — ${data[p.dataIndex].count}` },
          },
        },
      ],
    };
  }, [data, selected, isDark]);

  const onEvents = useMemo(
    () => ({
      click: (params) => {
        if (typeof params.dataIndex === 'number') {
          setSelected(data[params.dataIndex]?.arrondissement ?? null);
        }
      },
    }),
    [data],
  );

  return (
    <div className="re-3d-card">
      <div className="re-data-card__header">
        <div className="re-data-card__brand">
          <div className="re-data-card__logo" aria-hidden>
            <span className="material-symbols-outlined">view_in_ar</span>
          </div>
          <div>
            <h3 className="re-data-card__title">Carte 3D — Paris 1-20</h3>
            <p className="re-data-card__subtitle">
              Hauteur = volume de DPE réalisés par arrondissement · Glisser pour tourner
            </p>
          </div>
        </div>
        <div className="re-data-card__meta">
          <span className="re-badge">{total.toLocaleString('fr-FR')} DPE</span>
          {selectedItem && (
            <span className="re-badge re-badge--accent">
              {selectedItem.label} arr. — {selectedItem.count.toLocaleString('fr-FR')} DPE
            </span>
          )}
        </div>
      </div>
      <div className="re-3d-canvas">
        <ReactECharts
          echarts={echarts}
          option={option}
          onEvents={onEvents}
          style={{ width: '100%', height: '100%' }}
          opts={{ renderer: 'canvas' }}
        />
      </div>
    </div>
  );
}

export default memo(ParisArrondissement3D);
