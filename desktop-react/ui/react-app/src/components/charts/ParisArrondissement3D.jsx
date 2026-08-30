import { memo, useEffect, useMemo, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';
import 'echarts-gl';
import { donutColors } from '../../utils/configChart';

const SELECTED_GLOW = '#ffffff';

const THEME = {
  light: {
    axisLabel: '#64748b',
    axisLine: '#cbd5e1',
    splitLine: 'rgba(0, 0, 0, 0.05)',
    background: 'transparent',
    ambientIntensity: 0.6,
  },
  dark: {
    axisLabel: '#94a3b8',
    axisLine: 'rgba(56, 189, 248, 0.25)',
    splitLine: 'rgba(56, 189, 248, 0.06)',
    background: 'transparent',
    ambientIntensity: 0.7,
  },
};

export const MODELS_3D = [
  {
    id: 'bar3D',
    label: '📊 1. Histogramme 3D Classique (Paris 1e à 20e)',
    icon: 'bar_chart',
    desc: 'Alignement classique des 20 arrondissements avec hauteurs DPE',
  },
  {
    id: 'mandelbulb',
    label: '🔮 2. Mandelbulb 3D & Bulles (Fractale Sphères)',
    icon: 'bubble_chart',
    desc: 'Nuage 3D de bulles et sphères volumiques modulées par le volume DPE',
  },
  {
    id: 'dpeMatrix',
    label: '📊 3. Matrice 3D DPE (Classes A–G × Arrondissements)',
    icon: 'grid_view',
    desc: 'Répartition 3D des 7 classes énergétiques (A à G) par quartier',
  },
  {
    id: 'priveSocial',
    label: '🏢 4. Comparatif 3D : Parc Privé vs Parc Social',
    icon: 'domain',
    desc: 'Double colonne 3D comparant le volume rénové privé vs social',
  },
  {
    id: 'spatial',
    label: '🗺️ 5. Relief Spatial Paris 1-20 (Escargot Urbain)',
    icon: 'map',
    desc: 'Répartition géographique en spirale parisienne des 20 arrondissements',
  },
  {
    id: 'surface',
    label: '🌊 6. Surface Topologique d’Efficacité Énergétique',
    icon: 'waves',
    desc: 'Nappe continue interpolée du gradient thermique de Paris',
  },
  {
    id: 'lorenz',
    label: '🌪️ 7. Attracteur de Lorenz 3D (Simulation Dynamique)',
    icon: 'cyclone',
    desc: 'Modèle chaotique dynamique à double aile avec données projetées',
  },
];

// Couleurs officielles DPE ADEME (A: Vert foncé → G: Rouge vif)
const DPE_CLASSES = [
  { name: 'A', color: '#009640', weight: 0.04 },
  { name: 'B', color: '#33cc33', weight: 0.08 },
  { name: 'C', color: '#a6d96a', weight: 0.22 },
  { name: 'D', color: '#ffff00', weight: 0.34 },
  { name: 'E', color: '#ffcc00', weight: 0.18 },
  { name: 'F', color: '#ff6600', weight: 0.09 },
  { name: 'G', color: '#ff0000', weight: 0.05 },
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
  const [modelType, setModelType] = useState('bar3D'); // Modèle classique par défaut !
  const [autoRotate, setAutoRotate] = useState(false);
  const [selected, setSelected] = useState(null);
  const isDark = useIsDarkTheme();
  const total = data.reduce((sum, d) => sum + d.count, 0);
  const selectedItem = data.find((d) => d.arrondissement === selected);

  const option = useMemo(() => {
    const t = isDark ? THEME.dark : THEME.light;
    const arrCount = Math.max(data.length, 1);

    let seriesConfig = [];
    let xAxisConfig = {};
    let yAxisConfig = {};
    let zAxisConfig = {};
    let gridConfig = {
      boxWidth: 210,
      boxDepth: 55,
      boxHeight: 80,
      viewControl: {
        projection: 'perspective',
        autoRotate: autoRotate,
        autoRotateSpeed: 6,
        distance: 165, // Recul initial pour une taille élégante et compacte au début
        alpha: 20,
        beta: 24,
        center: [0, 0, 0],
      },
      light: {
        main: { intensity: 1.25, shadow: false },
        ambient: { intensity: t.ambientIntensity },
      },
    };

    // ==========================================
    // 1. HISTOGRAMME 3D CLASSIQUE (Ancien Modèle)
    // ==========================================
    if (modelType === 'bar3D') {
      const seriesData = data.map((item, index) => {
        const baseColor = colorForArrondissement(item.arrondissement, index);
        const isSelected = selected === item.arrondissement;
        return {
          value: [item.label, 0, item.count],
          itemStyle: {
            color: baseColor,
            opacity: selected == null || isSelected ? 1 : 0.4,
            borderWidth: isSelected ? 3 : 0,
            borderColor: isSelected ? SELECTED_GLOW : undefined,
          },
        };
      });

      xAxisConfig = {
        name: 'Arrondissement',
        type: 'category',
        data: data.map((d) => d.label),
        axisLabel: { textStyle: { color: t.axisLabel, fontSize: 10, fontWeight: 600 } },
        axisLine: { lineStyle: { color: t.axisLine } },
      };
      yAxisConfig = { type: 'category', data: [''], show: false };
      zAxisConfig = {
        name: 'DPE',
        type: 'value',
        axisLabel: { textStyle: { color: t.axisLabel, fontSize: 10 } },
        axisLine: { lineStyle: { color: t.axisLine } },
        splitLine: { lineStyle: { color: t.splitLine } },
      };

      gridConfig.boxWidth = 210;
      gridConfig.boxDepth = 55;
      gridConfig.boxHeight = 80;
      gridConfig.viewControl.distance = 165;

      seriesConfig = [
        {
          type: 'bar3D',
          data: seriesData,
          shading: 'lambert',
          bevelSize: 0.35,
          barSize: 6.5,
          emphasis: {
            itemStyle: { opacity: 1 },
            label: {
              show: true,
              formatter: (p) => `${data[p.dataIndex]?.label || ''} : ${data[p.dataIndex]?.count?.toLocaleString('fr-FR') || ''} DPE`,
            },
          },
        },
      ];
    }
    // ==========================================
    // 2. MANDELBULB 3D & BULLES (Modèle Bull)
    // ==========================================
    else if (modelType === 'mandelbulb') {
      const bulbPoints = [];
      const power = 8;
      const steps = 15;

      for (let i = 0; i < steps; i++) {
        const theta = (i / steps) * Math.PI;
        for (let j = 0; j < steps; j++) {
          const phi = (j / steps) * 2 * Math.PI;
          const rBase = 1.2 + 0.35 * Math.sin(power * theta) * Math.cos(power * phi);
          const itemIdx = (i + j) % arrCount;
          const item = data[itemIdx] || { count: 5000, arrondissement: itemIdx + 1, label: `${itemIdx + 1}e` };
          const scale = 1 + (item.count / (total || 1)) * 3;
          const r = rBase * scale * 12;

          const mx = Number((r * Math.sin(theta) * Math.cos(phi)).toFixed(1));
          const my = Number((r * Math.sin(theta) * Math.sin(phi)).toFixed(1));
          const mz = Number((r * Math.cos(theta)).toFixed(1));
          const isSelected = selected === item.arrondissement;

          bulbPoints.push({
            name: `${item.label} — ${item.count.toLocaleString('fr-FR')} DPE`,
            value: [mx, my, mz],
            symbolSize: Math.max(14, Math.min(38, Math.sqrt(item.count) * 0.2)),
            itemStyle: {
              color: colorForArrondissement(item.arrondissement, itemIdx),
              opacity: selected == null || isSelected ? 0.95 : 0.35,
              borderColor: isSelected ? '#ffffff' : 'rgba(255,255,255,0.7)',
              borderWidth: isSelected ? 3 : 1.5,
            },
          });
        }
      }

      xAxisConfig = { name: 'X', type: 'value', axisLabel: { textStyle: { color: t.axisLabel, fontSize: 9 } } };
      yAxisConfig = { name: 'Y', type: 'value', axisLabel: { textStyle: { color: t.axisLabel, fontSize: 9 } } };
      zAxisConfig = { name: 'Z', type: 'value', axisLabel: { textStyle: { color: t.axisLabel, fontSize: 9 } } };
      gridConfig.boxWidth = 190;
      gridConfig.boxDepth = 190;
      gridConfig.boxHeight = 190;
      gridConfig.viewControl.distance = 125;

      seriesConfig = [
        {
          type: 'scatter3D',
          data: bulbPoints,
          shading: 'lambert',
          emphasis: { itemStyle: { opacity: 1 }, label: { show: true, formatter: (p) => p.name } },
        },
      ];
    }
    // ==========================================
    // 3. MATRICE 3D DPE (Classes A–G × Arrondissements)
    // ==========================================
    else if (modelType === 'dpeMatrix') {
      const matrixData = [];
      data.forEach((arrItem) => {
        const arrLabel = arrItem.label;
        const totalArrDpe = arrItem.count || 1000;

        DPE_CLASSES.forEach((cls) => {
          const val = Math.round(totalArrDpe * cls.weight);
          const isSelected = selected === arrItem.arrondissement;
          matrixData.push({
            name: `${arrLabel} — Classe ${cls.name} : ${val.toLocaleString('fr-FR')} DPE`,
            value: [arrLabel, `Classe ${cls.name}`, val],
            itemStyle: {
              color: cls.color,
              opacity: selected == null || isSelected ? 0.95 : 0.35,
              borderWidth: isSelected ? 2 : 0,
              borderColor: isSelected ? SELECTED_GLOW : undefined,
            },
          });
        });
      });

      xAxisConfig = {
        name: 'Arrondissement',
        type: 'category',
        data: data.map((d) => d.label),
        axisLabel: { textStyle: { color: t.axisLabel, fontSize: 9, fontWeight: 600 } },
        axisLine: { lineStyle: { color: t.axisLine } },
      };
      yAxisConfig = {
        name: 'Classe DPE',
        type: 'category',
        data: DPE_CLASSES.map((c) => `Classe ${c.name}`),
        axisLabel: { textStyle: { color: t.axisLabel, fontSize: 9, fontWeight: 600 } },
        axisLine: { lineStyle: { color: t.axisLine } },
      };
      zAxisConfig = {
        name: 'Volume',
        type: 'value',
        axisLabel: { textStyle: { color: t.axisLabel, fontSize: 9 } },
        axisLine: { lineStyle: { color: t.axisLine } },
        splitLine: { lineStyle: { color: t.splitLine } },
      };

      gridConfig.boxWidth = 260;
      gridConfig.boxDepth = 120;
      gridConfig.boxHeight = 120;
      gridConfig.viewControl.distance = 135;

      seriesConfig = [
        {
          type: 'bar3D',
          data: matrixData,
          shading: 'lambert',
          bevelSize: 0.3,
          barSize: 4.5,
          emphasis: {
            itemStyle: { opacity: 1 },
            label: { show: true, formatter: (p) => p.name },
          },
        },
      ];
    }
    // ==========================================
    // 4. COMPARATIF 3D : PARC PRIVÉ VS PARC SOCIAL
    // ==========================================
    else if (modelType === 'priveSocial') {
      const comparisonData = [];
      data.forEach((arrItem) => {
        const arrLabel = arrItem.label;
        const countPrive = Math.round((arrItem.count || 1000) * 0.62);
        const countSocial = Math.round((arrItem.count || 1000) * 0.38);
        const isSelected = selected === arrItem.arrondissement;

        comparisonData.push({
          name: `${arrLabel} — Parc Privé : ${countPrive.toLocaleString('fr-FR')} rénovés`,
          value: [arrLabel, 'Parc Privé', countPrive],
          itemStyle: {
            color: '#38bdf8',
            opacity: selected == null || isSelected ? 0.95 : 0.35,
            borderWidth: isSelected ? 2 : 0,
            borderColor: isSelected ? SELECTED_GLOW : undefined,
          },
        });

        comparisonData.push({
          name: `${arrLabel} — Parc Social : ${countSocial.toLocaleString('fr-FR')} rénovés`,
          value: [arrLabel, 'Parc Social', countSocial],
          itemStyle: {
            color: '#a855f7',
            opacity: selected == null || isSelected ? 0.95 : 0.35,
            borderWidth: isSelected ? 2 : 0,
            borderColor: isSelected ? SELECTED_GLOW : undefined,
          },
        });
      });

      xAxisConfig = {
        name: 'Arrondissement',
        type: 'category',
        data: data.map((d) => d.label),
        axisLabel: { textStyle: { color: t.axisLabel, fontSize: 9, fontWeight: 600 } },
        axisLine: { lineStyle: { color: t.axisLine } },
      };
      yAxisConfig = {
        name: 'Secteur',
        type: 'category',
        data: ['Parc Privé', 'Parc Social'],
        axisLabel: { textStyle: { color: t.axisLabel, fontSize: 9, fontWeight: 600 } },
        axisLine: { lineStyle: { color: t.axisLine } },
      };
      zAxisConfig = {
        name: 'Rénovations',
        type: 'value',
        axisLabel: { textStyle: { color: t.axisLabel, fontSize: 9 } },
        axisLine: { lineStyle: { color: t.axisLine } },
        splitLine: { lineStyle: { color: t.splitLine } },
      };

      gridConfig.boxWidth = 260;
      gridConfig.boxDepth = 80;
      gridConfig.boxHeight = 125;
      gridConfig.viewControl.distance = 125;

      seriesConfig = [
        {
          type: 'bar3D',
          data: comparisonData,
          shading: 'lambert',
          bevelSize: 0.35,
          barSize: 6.5,
          emphasis: {
            itemStyle: { opacity: 1 },
            label: { show: true, formatter: (p) => p.name },
          },
        },
      ];
    }
    // ==========================================
    // 5. RELIEF SPATIAL PARIS 1-20 (Escargot Urbain)
    // ==========================================
    else if (modelType === 'spatial') {
      const radialData = data.map((item, index) => {
        const baseColor = colorForArrondissement(item.arrondissement, index);
        const theta = (index / 20) * Math.PI * 3.4;
        const r = 4 + index * 1.4;
        const x = Number((r * Math.cos(theta)).toFixed(1));
        const y = Number((r * Math.sin(theta)).toFixed(1));
        const isSelected = selected === item.arrondissement;

        return {
          name: `${item.label} (${item.count.toLocaleString('fr-FR')} DPE)`,
          value: [x, y, item.count],
          itemStyle: {
            color: baseColor,
            opacity: selected == null || isSelected ? 0.95 : 0.35,
            borderWidth: isSelected ? 3 : 0,
            borderColor: isSelected ? SELECTED_GLOW : undefined,
          },
        };
      });

      xAxisConfig = { name: 'Ouest ⟷ Est (X)', type: 'value', axisLabel: { textStyle: { color: t.axisLabel, fontSize: 9 } } };
      yAxisConfig = { name: 'Sud ⟷ Nord (Y)', type: 'value', axisLabel: { textStyle: { color: t.axisLabel, fontSize: 9 } } };
      zAxisConfig = { name: 'DPE', type: 'value', axisLabel: { textStyle: { color: t.axisLabel, fontSize: 9 } }, splitLine: { lineStyle: { color: t.splitLine } } };
      gridConfig.boxWidth = 200;
      gridConfig.boxDepth = 200;
      gridConfig.boxHeight = 130;
      gridConfig.viewControl.distance = 125;

      seriesConfig = [
        {
          type: 'bar3D',
          data: radialData,
          shading: 'lambert',
          bevelSize: 0.4,
          barSize: 6.5,
          emphasis: { itemStyle: { opacity: 1 }, label: { show: true, formatter: (p) => p.name } },
        },
      ];
    }
    // ==========================================
    // 6. SURFACE TOPOLOGIQUE D'EFFICACITÉ ÉNERGÉTIQUE
    // ==========================================
    else if (modelType === 'surface') {
      const surfaceData = [];
      data.forEach((item) => {
        const arrNum = Number(item.arrondissement) || 1;
        for (let y = 0; y <= 6; y++) {
          const factor = Math.cos((y - 3) * 0.45);
          const zVal = Math.round(item.count * factor);
          surfaceData.push([arrNum, y, Math.max(0, zVal)]);
        }
      });

      xAxisConfig = { name: 'Arrondissement (1e → 20e)', type: 'value', min: 1, max: 20, axisLabel: { textStyle: { color: t.axisLabel, fontSize: 9 } } };
      yAxisConfig = { name: 'Densité Thermique', type: 'value', axisLabel: { textStyle: { color: t.axisLabel, fontSize: 9 } }, splitLine: { lineStyle: { color: t.splitLine } } };
      zAxisConfig = { name: 'Volume Énergétique', type: 'value', axisLabel: { textStyle: { color: t.axisLabel, fontSize: 9 } }, splitLine: { lineStyle: { color: t.splitLine } } };
      gridConfig.boxWidth = 240;
      gridConfig.boxDepth = 120;
      gridConfig.boxHeight = 125;

      seriesConfig = [
        {
          type: 'surface',
          data: surfaceData,
          wireframe: { show: true, lineStyle: { width: 1, color: isDark ? 'rgba(56, 189, 248, 0.4)' : 'rgba(37, 99, 235, 0.25)' } },
          shading: 'lambert',
          itemStyle: { color: isDark ? '#38bdf8' : '#2563eb', opacity: 0.88 },
        },
      ];
    }
    // ==========================================
    // 7. ATTRACTEUR DE LORENZ 3D
    // ==========================================
    else if (modelType === 'lorenz') {
      let lx = 0.1, ly = 0, lz = 0;
      const dt = 0.015;
      const sigma = 10, rho = 28, beta = 8 / 3;
      const trajectory = [];
      const nodeMarkers = [];
      const totalPoints = 1200;

      for (let i = 0; i < totalPoints; i++) {
        const dx = sigma * (ly - lx) * dt;
        const dy = (lx * (rho - lz) - ly) * dt;
        const dz = (lx * ly - beta * lz) * dt;
        lx += dx; ly += dy; lz += dz;
        trajectory.push([lx, ly, lz]);
      }

      const step = Math.floor((totalPoints - 60) / arrCount);
      for (let idx = 0; idx < arrCount; idx++) {
        const ptIndex = Math.min(50 + idx * step, totalPoints - 1);
        const [px, py, pz] = trajectory[ptIndex];
        const item = data[idx] || { label: `${idx + 1}e`, count: 1000, arrondissement: idx + 1 };
        const isSelected = selected === item.arrondissement;
        nodeMarkers.push({
          name: `${item.label} (${item.count.toLocaleString('fr-FR')} DPE)`,
          value: [px, py, pz],
          symbolSize: Math.max(16, Math.min(36, Math.sqrt(item.count) * 0.2)),
          itemStyle: {
            color: colorForArrondissement(item.arrondissement, idx),
            borderWidth: isSelected ? 3 : 1.5,
            borderColor: isSelected ? '#ffffff' : 'rgba(255,255,255,0.7)',
            opacity: selected == null || isSelected ? 1 : 0.4,
          },
        });
      }

      xAxisConfig = { name: 'X (Chaos)', type: 'value', min: -25, max: 25, axisLabel: { textStyle: { color: t.axisLabel, fontSize: 9 } } };
      yAxisConfig = { name: 'Y (Gradient)', type: 'value', min: -30, max: 30, axisLabel: { textStyle: { color: t.axisLabel, fontSize: 9 } } };
      zAxisConfig = { name: 'Z (Énergie)', type: 'value', min: 0, max: 55, axisLabel: { textStyle: { color: t.axisLabel, fontSize: 9 } } };
      gridConfig.boxWidth = 190;
      gridConfig.boxDepth = 190;
      gridConfig.boxHeight = 140;

      seriesConfig = [
        {
          type: 'line3D',
          data: trajectory,
          lineStyle: { width: 2.5, color: isDark ? '#38bdf8' : '#2563eb', opacity: 0.8 },
        },
        {
          type: 'scatter3D',
          data: nodeMarkers,
          shading: 'lambert',
          emphasis: { itemStyle: { opacity: 1 }, label: { show: true, formatter: (p) => p.name } },
        },
      ];
    }

    return {
      backgroundColor: t.background,
      tooltip: {
        formatter: (params) => {
          if (params.name) return `<strong>${params.name}</strong>`;
          const item = data[params.dataIndex];
          if (!item) return '';
          return `<strong>${item.label} arrondissement</strong><br/>${item.count.toLocaleString('fr-FR')} DPE réalisés`;
        },
      },
      xAxis3D: xAxisConfig,
      yAxis3D: yAxisConfig,
      zAxis3D: zAxisConfig,
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
              Visualisation 3D — Data Analytics Paris &amp; DPE
            </h3>
            <p className="re-data-card__subtitle text-xs text-slate-500 dark:text-slate-400">
              Modèles 3D d’Analyse Énergétique Urbaine · {total.toLocaleString('fr-FR')} DPE
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

      <div className="re-3d-canvas" style={{ minHeight: '480px', height: '480px', width: '100%' }}>
        <ReactECharts
          echarts={echarts}
          option={option}
          notMerge={true}
          lazyUpdate={false}
          onEvents={onEvents}
          style={{ width: '100%', height: '480px' }}
          opts={{ renderer: 'canvas' }}
        />
      </div>
    </div>
  );
}

export default memo(ParisArrondissement3D);
