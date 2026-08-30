import { memo, useEffect, useMemo, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';
import 'echarts-gl';
import { donutColors } from '../../utils/configChart';

const SELECTED_GLOW = '#ffffff';

const THEME = {
  light: {
    axisLabel: '#64748b',
    axisLine: '#94a3b8',
    splitLine: '#e2e8f0',
    background: 'transparent',
    ambientIntensity: 0.5,
  },
  dark: {
    axisLabel: '#cbd5e1',
    axisLine: 'rgba(56, 189, 248, 0.3)',
    splitLine: 'rgba(56, 189, 248, 0.12)',
    background: 'transparent',
    ambientIntensity: 0.65,
  },
};

const MODELS_3D = [
  { id: 'bar3D', label: '📊 Histogramme 3D (Bento Bars)', icon: 'bar_chart' },
  { id: 'scatter3D', label: '🌌 Nuage de Points 3D (Cluster Sphères)', icon: 'bubble_chart' },
  { id: 'surface', label: '🌊 Surface Topologique 3D (Mesh Énergie)', icon: 'waves' },
  { id: 'radial', label: '🗼 Spirale Circulaire 3D (Escargot Paris)', icon: 'cyclone' },
];

function colorForArrondissement(arrondissement, index) {
  const n = Number(arrondissement);
  if (Number.isFinite(n) && n >= 1) {
    return donutColors[(n - 1) % donutColors.length];
  }
  return donutColors[index % donutColors.length];
}

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
  const [modelType, setModelType] = useState('bar3D');
  const [autoRotate, setAutoRotate] = useState(false);
  const [selected, setSelected] = useState(null);
  const isDark = useIsDarkTheme();
  const total = data.reduce((sum, d) => sum + d.count, 0);
  const selectedItem = data.find((d) => d.arrondissement === selected);

  const option = useMemo(() => {
    const t = isDark ? THEME.dark : THEME.light;

    let seriesConfig = [];
    let xAxisConfig = {};
    let yAxisConfig = {};
    let gridConfig = {
      boxWidth: 220,
      boxDepth: 70,
      boxHeight: 95,
      viewControl: {
        projection: 'perspective',
        autoRotate: autoRotate,
        autoRotateSpeed: 8,
        distance: 140,
        alpha: 24,
        beta: 28,
        center: [0, 0, 0],
      },
      light: {
        main: { intensity: 1.2, shadow: false },
        ambient: { intensity: t.ambientIntensity },
      },
    };

    if (modelType === 'bar3D') {
      // 1. Histogramme 3D classique
      const seriesData = data.map((item, index) => {
        const baseColor = colorForArrondissement(item.arrondissement, index);
        const isSelected = selected === item.arrondissement;
        return {
          value: [item.arrondissement, 0, item.count],
          itemStyle: {
            color: baseColor,
            opacity: selected == null || isSelected ? 0.95 : 0.4,
            borderWidth: isSelected ? 2 : 0,
            borderColor: isSelected ? SELECTED_GLOW : undefined,
          },
        };
      });

      xAxisConfig = {
        name: 'Arrondissement',
        type: 'category',
        data: data.map((d) => d.label),
        axisLabel: { textStyle: { color: t.axisLabel, fontSize: 10 } },
        axisLine: { lineStyle: { color: t.axisLine } },
      };
      yAxisConfig = { type: 'category', data: [''], show: false };

      seriesConfig = [
        {
          type: 'bar3D',
          data: seriesData,
          shading: 'lambert',
          bevelSize: 0.35,
          barSize: 7.5,
          emphasis: {
            itemStyle: { opacity: 1 },
            label: {
              show: true,
              formatter: (p) => `${data[p.dataIndex]?.label || ''} — ${data[p.dataIndex]?.count?.toLocaleString('fr-FR') || ''}`,
            },
          },
        },
      ];
    } else if (modelType === 'scatter3D') {
      // 2. Nuage de points 3D (Cluster Sphères)
      const seriesData = data.map((item, index) => {
        const baseColor = colorForArrondissement(item.arrondissement, index);
        const isSelected = selected === item.arrondissement;
        const sphereSize = Math.max(16, Math.min(42, Math.sqrt(item.count) * 0.22));
        return {
          value: [item.arrondissement, (index % 4) * 2, item.count],
          symbolSize: sphereSize,
          itemStyle: {
            color: baseColor,
            opacity: selected == null || isSelected ? 0.9 : 0.35,
            borderWidth: isSelected ? 3 : 1.5,
            borderColor: isSelected ? '#ffffff' : 'rgba(255,255,255,0.6)',
          },
        };
      });

      xAxisConfig = {
        name: 'Arrondissement',
        type: 'category',
        data: data.map((d) => d.label),
        axisLabel: { textStyle: { color: t.axisLabel, fontSize: 10 } },
        axisLine: { lineStyle: { color: t.axisLine } },
      };
      yAxisConfig = {
        name: 'Cluster',
        type: 'value',
        axisLabel: { textStyle: { color: t.axisLabel, fontSize: 9 } },
        axisLine: { lineStyle: { color: t.axisLine } },
        splitLine: { lineStyle: { color: t.splitLine } },
      };

      seriesConfig = [
        {
          type: 'scatter3D',
          data: seriesData,
          shading: 'realistic',
          emphasis: {
            itemStyle: { opacity: 1 },
            label: {
              show: true,
              formatter: (p) => `${data[p.dataIndex]?.label || ''} : ${data[p.dataIndex]?.count?.toLocaleString('fr-FR') || ''} DPE`,
            },
          },
        },
      ];
    } else if (modelType === 'surface') {
      // 3. Surface topologique 3D (Mesh)
      const surfaceData = [];
      data.forEach((item) => {
        const arrNum = Number(item.arrondissement) || 1;
        for (let y = 0; y <= 6; y++) {
          const factor = Math.cos((y - 3) * 0.45);
          const zVal = Math.round(item.count * factor);
          surfaceData.push([arrNum, y, Math.max(0, zVal)]);
        }
      });

      xAxisConfig = {
        name: 'Arr.',
        type: 'value',
        min: 1,
        max: 20,
        axisLabel: { textStyle: { color: t.axisLabel, fontSize: 10 } },
        axisLine: { lineStyle: { color: t.axisLine } },
      };
      yAxisConfig = {
        name: 'Densité',
        type: 'value',
        axisLabel: { textStyle: { color: t.axisLabel, fontSize: 9 } },
        axisLine: { lineStyle: { color: t.axisLine } },
        splitLine: { lineStyle: { color: t.splitLine } },
      };

      seriesConfig = [
        {
          type: 'surface',
          data: surfaceData,
          wireframe: {
            show: true,
            lineStyle: { width: 1, color: isDark ? 'rgba(56, 189, 248, 0.4)' : 'rgba(37, 99, 235, 0.25)' },
          },
          shading: 'lambert',
          itemStyle: {
            color: isDark ? '#38bdf8' : '#2563eb',
            opacity: 0.85,
          },
        },
      ];
    } else if (modelType === 'radial') {
      // 4. Spirale Circulaire (Escargot de Paris)
      const radialData = data.map((item, index) => {
        const baseColor = colorForArrondissement(item.arrondissement, index);
        const theta = (index / 20) * Math.PI * 3.4;
        const r = 3 + index * 1.3;
        const x = r * Math.cos(theta);
        const y = r * Math.sin(theta);
        const isSelected = selected === item.arrondissement;

        return {
          value: [Number(x.toFixed(1)), Number(y.toFixed(1)), item.count],
          itemStyle: {
            color: baseColor,
            opacity: selected == null || isSelected ? 0.95 : 0.4,
            borderWidth: isSelected ? 2 : 0,
            borderColor: isSelected ? SELECTED_GLOW : undefined,
          },
        };
      });

      xAxisConfig = {
        name: 'X (Radial)',
        type: 'value',
        axisLabel: { textStyle: { color: t.axisLabel, fontSize: 9 } },
        axisLine: { lineStyle: { color: t.axisLine } },
      };
      yAxisConfig = {
        name: 'Y (Radial)',
        type: 'value',
        axisLabel: { textStyle: { color: t.axisLabel, fontSize: 9 } },
        axisLine: { lineStyle: { color: t.axisLine } },
      };

      gridConfig.boxWidth = 160;
      gridConfig.boxDepth = 160;

      seriesConfig = [
        {
          type: 'bar3D',
          data: radialData,
          shading: 'lambert',
          bevelSize: 0.35,
          barSize: 5.5,
          emphasis: {
            itemStyle: { opacity: 1 },
            label: {
              show: true,
              formatter: (p) => `${data[p.dataIndex]?.label || ''} : ${data[p.dataIndex]?.count?.toLocaleString('fr-FR') || ''}`,
            },
          },
        },
      ];
    }

    return {
      backgroundColor: t.background,
      tooltip: {
        formatter: (params) => {
          const item = data[params.dataIndex];
          if (!item) return '';
          return `<strong>${item.label} arrondissement</strong><br/>${item.count.toLocaleString('fr-FR')} DPE réalisés`;
        },
      },
      xAxis3D: xAxisConfig,
      yAxis3D: yAxisConfig,
      zAxis3D: {
        name: 'DPE',
        type: 'value',
        axisLabel: { textStyle: { color: t.axisLabel, fontSize: 10 } },
        axisLine: { lineStyle: { color: t.axisLine } },
        splitLine: { lineStyle: { color: t.splitLine } },
      },
      grid3D: gridConfig,
      series: seriesConfig,
    };
  }, [data, selected, modelType, autoRotate, isDark]);

  const onEvents = useMemo(
    () => ({
      click: (params) => {
        if (typeof params.dataIndex === 'number') {
          const next = data[params.dataIndex]?.arrondissement ?? null;
          setSelected((prev) => (prev === next ? null : next));
        }
      },
    }),
    [data],
  );

  return (
    <div className="re-3d-card">
      <div className="re-data-card__header flex flex-wrap items-center justify-between gap-4">
        <div className="re-data-card__brand flex items-center gap-3">
          <div className="re-data-card__logo" aria-hidden>
            <span className="material-symbols-outlined text-primary text-2xl">view_in_ar</span>
          </div>
          <div>
            <h3 className="re-data-card__title text-lg font-bold text-slate-800 dark:text-white">
              Visualisation 3D — Data Analytics Paris
            </h3>
            <p className="re-data-card__subtitle text-xs text-slate-500 dark:text-slate-400">
              Modèles scientifiques 3D de répartition énergétique · {total.toLocaleString('fr-FR')} DPE
            </p>
          </div>
        </div>

        {/* 3D Model Selector & Rotation Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Select Model 3D */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase">Modèle 3D :</span>
            <select
              value={modelType}
              onChange={(e) => setModelType(e.target.value)}
              className="toolbar-pill-btn font-semibold text-xs py-1.5 px-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer shadow-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              {MODELS_3D.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          {/* Auto-Rotation Button */}
          <button
            type="button"
            onClick={() => setAutoRotate((v) => !v)}
            className={`toolbar-pill-btn text-xs py-1.5 px-3 rounded-xl font-semibold flex items-center gap-1.5 border transition-all ${
              autoRotate
                ? 'bg-cyan-500 text-white border-cyan-400 shadow-md'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            <span className={`material-symbols-outlined text-[16px] ${autoRotate ? 'animate-spin' : ''}`}>
              sync
            </span>
            <span>{autoRotate ? 'Rotation Active' : 'Rotation Auto'}</span>
          </button>

          {/* Selected Badge */}
          {selectedItem && (
            <span
              className="re-badge re-badge--accent"
              style={{
                borderColor: colorForArrondissement(
                  selectedItem.arrondissement,
                  data.findIndex((d) => d.arrondissement === selectedItem.arrondissement),
                ),
              }}
            >
              {selectedItem.label} arr. — {selectedItem.count.toLocaleString('fr-FR')} DPE
            </span>
          )}
        </div>
      </div>

      <div className="re-3d-canvas" style={{ minHeight: '440px', width: '100%' }}>
        <ReactECharts
          echarts={echarts}
          option={option}
          onEvents={onEvents}
          style={{ width: '100%', height: '440px' }}
          opts={{ renderer: 'canvas' }}
        />
      </div>
    </div>
  );
}

export default memo(ParisArrondissement3D);
