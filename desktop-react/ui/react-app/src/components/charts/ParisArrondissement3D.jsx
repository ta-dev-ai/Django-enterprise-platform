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
    splitLine: 'rgba(0, 0, 0, 0.04)',
    background: 'transparent',
    ambientIntensity: 0.6,
  },
  dark: {
    axisLabel: '#94a3b8',
    axisLine: 'rgba(56, 189, 248, 0.2)',
    splitLine: 'rgba(56, 189, 248, 0.06)',
    background: 'transparent',
    ambientIntensity: 0.7,
  },
};

export const MODELS_3D = [
  { id: 'lorenz', label: '⭐ 1. Attracteur de Lorenz 3D (Chaos & Météo)', icon: 'cyclone', desc: 'Système chaotique dynamique à double aile' },
  { id: 'mandelbulb', label: '⭐ 2. Mandelbulb 3D (Fractale 3D)', icon: 'auto_awesome', desc: 'Fractale volumique 3D d’ordre 8' },
  { id: 'mobius', label: '⭐ 3. Ruban de Möbius 3D (Topologie)', icon: 'all_inclusive', desc: 'Surface unilatérale non orientable' },
  { id: 'klein', label: '⭐ 4. Bouteille de Klein 3D (Immersion)', icon: 'wine_bar', desc: 'Surface fermée sans intérieur ni extérieur' },
  { id: 'menger', label: '⭐ 5. Éponge de Menger 3D (Cube Fractal)', icon: 'view_in_ar', desc: 'Solide fractal cubique récursif' },
  { id: 'torus', label: '6. Tore 3D (Donut Géométrique)', icon: 'donut_large', desc: 'Surface de révolution fondamentale' },
  { id: 'trefoil', label: '7. Nœud de Trèfle 3D (Théorie des Nœuds)', icon: 'grain', desc: 'Nœud torique continu le plus simple' },
  { id: 'sierpinski', label: '8. Tétraèdre de Sierpiński 3D (Pyramide Fractale)', icon: 'change_history', desc: 'Fractale pyramidale auto-similaire' },
  { id: 'helicoid', label: '9. Hélicoïde 3D (Surface Minimale)', icon: 'waves', desc: 'Surface réglée minimale en hélice infinie' },
  { id: 'gyroid', label: '10. Gyroïde 3D (Surface Triplement Périodique)', icon: 'blur_on', desc: 'Surface d’ingénierie et science des matériaux' },
  { id: 'bar3D', label: '📊 Histogramme 3D Classique (Bento Bars)', icon: 'bar_chart', desc: 'Colonnes orthogonales par arrondissement' },
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
  const [modelType, setModelType] = useState('lorenz');
  const [autoRotate, setAutoRotate] = useState(false); // Désactivé par défaut pour éliminer la surchauffe/bruit ventilateur
  const [selected, setSelected] = useState(null);
  const isDark = useIsDarkTheme();
  const total = data.reduce((sum, d) => sum + d.count, 0);
  const selectedItem = data.find((d) => d.arrondissement === selected);

  const option = useMemo(() => {
    const t = isDark ? THEME.dark : THEME.light;
    const arrCount = Math.max(data.length, 1);

    let seriesConfig = [];
    let xAxisConfig = { show: true, type: 'value', axisLabel: { textStyle: { color: t.axisLabel, fontSize: 9 } } };
    let yAxisConfig = { show: true, type: 'value', axisLabel: { textStyle: { color: t.axisLabel, fontSize: 9 } } };
    let zAxisConfig = { show: true, type: 'value', name: 'Z', axisLabel: { textStyle: { color: t.axisLabel, fontSize: 9 } } };
    let gridConfig = {
      boxWidth: 200,
      boxDepth: 200,
      boxHeight: 130,
      viewControl: {
        projection: 'perspective',
        autoRotate: autoRotate,
        autoRotateSpeed: 6,
        distance: 120,
        alpha: 22,
        beta: 32,
        center: [0, 0, 0],
      },
      light: {
        main: { intensity: 1.2, shadow: false },
        ambient: { intensity: t.ambientIntensity },
      },
    };

    // ==========================================
    // 1. ATTRACTEUR DE LORENZ 3D (Épuré & Fluide)
    // ==========================================
    if (modelType === 'lorenz') {
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

      // Distribue harmonieusement les 20 arrondissements sur les deux ailes du papillon
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
          lineStyle: {
            width: 2.5,
            color: isDark ? '#38bdf8' : '#2563eb',
            opacity: 0.8,
          },
        },
        {
          type: 'scatter3D',
          data: nodeMarkers,
          shading: 'lambert',
          emphasis: {
            itemStyle: { opacity: 1 },
            label: { show: true, formatter: (p) => p.name },
          },
        },
      ];
    }
    // ==========================================
    // 2. MANDELBULB 3D (Épuré)
    // ==========================================
    else if (modelType === 'mandelbulb') {
      const bulbPoints = [];
      const power = 8;
      const steps = 14;

      for (let i = 0; i < steps; i++) {
        const theta = (i / steps) * Math.PI;
        for (let j = 0; j < steps; j++) {
          const phi = (j / steps) * 2 * Math.PI;
          const rBase = 1.2 + 0.35 * Math.sin(power * theta) * Math.cos(power * phi);
          const itemIdx = (i + j) % arrCount;
          const item = data[itemIdx] || { count: 5000, arrondissement: itemIdx + 1, label: `${itemIdx + 1}e` };
          const scale = 1 + (item.count / (total || 1)) * 3;
          const r = rBase * scale * 12;

          const mx = r * Math.sin(theta) * Math.cos(phi);
          const my = r * Math.sin(theta) * Math.sin(phi);
          const mz = r * Math.cos(theta);

          bulbPoints.push({
            name: `${item.label} — ${item.count.toLocaleString('fr-FR')} DPE`,
            value: [mx, my, mz],
            symbolSize: Math.max(14, Math.min(32, Math.sqrt(item.count) * 0.18)),
            itemStyle: {
              color: colorForArrondissement(item.arrondissement, itemIdx),
              opacity: 0.9,
              borderColor: '#ffffff',
              borderWidth: 1,
            },
          });
        }
      }

      gridConfig.boxWidth = 190;
      gridConfig.boxDepth = 190;
      gridConfig.boxHeight = 190;
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
    // 3. RUBAN DE MÖBIUS 3D
    // ==========================================
    else if (modelType === 'mobius') {
      const mobiusData = [];
      const uSteps = 28;
      const vSteps = 6;

      for (let i = 0; i <= uSteps; i++) {
        const u = (i / uSteps) * 2 * Math.PI;
        const itemIdx = i % arrCount;
        const item = data[itemIdx] || { count: 1000, arrondissement: itemIdx + 1 };
        const heightMod = 1 + (item.count / (total || 1)) * 3.5;

        for (let j = 0; j <= vSteps; j++) {
          const v = -1 + (j / vSteps) * 2;
          const R = 18;
          const x = (R + v * 5 * Math.cos(u / 2)) * Math.cos(u);
          const y = (R + v * 5 * Math.cos(u / 2)) * Math.sin(u);
          const z = v * 5 * Math.sin(u / 2) * heightMod;
          mobiusData.push([x, y, z]);
        }
      }

      gridConfig.boxWidth = 200;
      gridConfig.boxDepth = 200;
      gridConfig.boxHeight = 120;
      seriesConfig = [
        {
          type: 'surface',
          data: mobiusData,
          wireframe: { show: true, lineStyle: { width: 1, color: isDark ? 'rgba(56, 189, 248, 0.35)' : 'rgba(37, 99, 235, 0.25)' } },
          shading: 'lambert',
          itemStyle: { color: isDark ? '#38bdf8' : '#2563eb', opacity: 0.9 },
        },
      ];
    }
    // ==========================================
    // 4. BOUTEILLE DE KLEIN 3D
    // ==========================================
    else if (modelType === 'klein') {
      const kleinData = [];
      const uSteps = 24;
      const vSteps = 10;

      for (let i = 0; i <= uSteps; i++) {
        const u = (i / uSteps) * Math.PI;
        for (let j = 0; j <= vSteps; j++) {
          const v = (j / vSteps) * 2 * Math.PI;
          const a = 12;
          let kx, ky, kz;
          if (u < Math.PI) {
            kx = a * (Math.cos(u) * (1 + Math.sin(u)) + Math.cos(u) * Math.cos(v));
            ky = a * (Math.sin(u) * (1 + Math.sin(u)) + Math.sin(u) * Math.cos(v));
            kz = a * Math.sin(v);
          } else {
            kx = a * (Math.cos(u) * (1 + Math.sin(u)) + 2 * (1 - Math.cos(u) / 2) * Math.cos(v));
            ky = a * Math.sin(u);
            kz = a * Math.sin(v);
          }
          kleinData.push([kx, ky, kz]);
        }
      }

      gridConfig.boxWidth = 200;
      gridConfig.boxDepth = 200;
      gridConfig.boxHeight = 140;
      seriesConfig = [
        {
          type: 'surface',
          data: kleinData,
          wireframe: { show: true, lineStyle: { width: 1, color: isDark ? 'rgba(168, 85, 247, 0.4)' : 'rgba(124, 58, 237, 0.25)' } },
          shading: 'lambert',
          itemStyle: { color: isDark ? '#a855f7' : '#7c3aed', opacity: 0.88 },
        },
      ];
    }
    // ==========================================
    // 5. ÉPONGE DE MENGER 3D
    // ==========================================
    else if (modelType === 'menger') {
      const mengerBlocks = [];
      let blockIdx = 0;

      for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
          for (let z = -1; z <= 1; z++) {
            const zeros = (x === 0 ? 1 : 0) + (y === 0 ? 1 : 0) + (z === 0 ? 1 : 0);
            if (zeros < 2) {
              const itemIdx = blockIdx % arrCount;
              const item = data[itemIdx] || { count: 1000, arrondissement: itemIdx + 1, label: `${itemIdx + 1}e` };
              const isSelected = selected === item.arrondissement;
              mengerBlocks.push({
                name: `${item.label} (${item.count.toLocaleString('fr-FR')} DPE)`,
                value: [x * 12, y * 12, (z + 1.5) * 12],
                itemStyle: {
                  color: colorForArrondissement(item.arrondissement, itemIdx),
                  opacity: selected == null || isSelected ? 0.95 : 0.35,
                },
              });
              blockIdx++;
            }
          }
        }
      }

      gridConfig.boxWidth = 170;
      gridConfig.boxDepth = 170;
      gridConfig.boxHeight = 170;
      seriesConfig = [
        {
          type: 'bar3D',
          data: mengerBlocks,
          shading: 'lambert',
          bevelSize: 0.35,
          barSize: 8.5,
          emphasis: { itemStyle: { opacity: 1 }, label: { show: true, formatter: (p) => p.name } },
        },
      ];
    }
    // ==========================================
    // 6. TORE 3D (Donut Géométrique)
    // ==========================================
    else if (modelType === 'torus') {
      const torusData = [];
      const uSteps = 24;
      const vSteps = 10;
      const R = 20, r = 7;

      for (let i = 0; i <= uSteps; i++) {
        const u = (i / uSteps) * 2 * Math.PI;
        for (let j = 0; j <= vSteps; j++) {
          const v = (j / vSteps) * 2 * Math.PI;
          const tx = (R + r * Math.cos(v)) * Math.cos(u);
          const ty = (R + r * Math.cos(v)) * Math.sin(u);
          const tz = r * Math.sin(v);
          torusData.push([tx, ty, tz]);
        }
      }

      gridConfig.boxWidth = 200;
      gridConfig.boxDepth = 200;
      gridConfig.boxHeight = 120;
      seriesConfig = [
        {
          type: 'surface',
          data: torusData,
          wireframe: { show: true, lineStyle: { width: 1, color: isDark ? 'rgba(56, 189, 248, 0.35)' : 'rgba(37, 99, 235, 0.25)' } },
          shading: 'lambert',
          itemStyle: { color: isDark ? '#06b6d4' : '#0284c7', opacity: 0.9 },
        },
      ];
    }
    // ==========================================
    // 7. NŒUD DE TRÈFLE 3D
    // ==========================================
    else if (modelType === 'trefoil') {
      const trefoilPath = [];
      const trefoilNodes = [];
      const steps = 180;

      for (let i = 0; i <= steps; i++) {
        const tVal = (i / steps) * 2 * Math.PI;
        const x = 14 * (Math.sin(tVal) + 2 * Math.sin(2 * tVal));
        const y = 14 * (Math.cos(tVal) - 2 * Math.cos(2 * tVal));
        const z = 14 * (-Math.sin(3 * tVal));
        trefoilPath.push([x, y, z]);

        if (i % 9 === 0 && trefoilNodes.length < arrCount) {
          const itemIdx = trefoilNodes.length;
          const item = data[itemIdx] || { count: 1000, arrondissement: itemIdx + 1, label: `${itemIdx + 1}e` };
          trefoilNodes.push({
            name: `${item.label} : ${item.count.toLocaleString('fr-FR')} DPE`,
            value: [x, y, z],
            symbolSize: Math.max(16, Math.min(36, Math.sqrt(item.count) * 0.2)),
            itemStyle: {
              color: colorForArrondissement(item.arrondissement, itemIdx),
              opacity: 0.95,
            },
          });
        }
      }

      gridConfig.boxWidth = 200;
      gridConfig.boxDepth = 200;
      gridConfig.boxHeight = 150;
      seriesConfig = [
        {
          type: 'line3D',
          data: trefoilPath,
          lineStyle: { width: 3.5, color: isDark ? '#ec4899' : '#db2777', opacity: 0.85 },
        },
        {
          type: 'scatter3D',
          data: trefoilNodes,
          shading: 'lambert',
          emphasis: { itemStyle: { opacity: 1 }, label: { show: true, formatter: (p) => p.name } },
        },
      ];
    }
    // ==========================================
    // 8. TÉTRAÈDRE DE SIERPIŃSKI 3D
    // ==========================================
    else if (modelType === 'sierpinski') {
      const pyramidPoints = [];
      const vertices = [
        [0, 0, 24],
        [20, 0, -8],
        [-10, 17, -8],
        [-10, -17, -8],
      ];
      let p = [0, 0, 0];

      for (let i = 0; i < 700; i++) {
        const target = vertices[Math.floor(Math.random() * 4)];
        p = [(p[0] + target[0]) / 2, (p[1] + target[1]) / 2, (p[2] + target[2]) / 2];
        const itemIdx = i % arrCount;
        const item = data[itemIdx] || { count: 1000, arrondissement: itemIdx + 1 };
        pyramidPoints.push({
          value: [p[0], p[1], p[2]],
          symbolSize: 8,
          itemStyle: {
            color: colorForArrondissement(item.arrondissement, itemIdx),
            opacity: 0.85,
          },
        });
      }

      gridConfig.boxWidth = 180;
      gridConfig.boxDepth = 180;
      gridConfig.boxHeight = 160;
      seriesConfig = [
        {
          type: 'scatter3D',
          data: pyramidPoints,
          shading: 'lambert',
        },
      ];
    }
    // ==========================================
    // 9. HÉLICOÏDE 3D
    // ==========================================
    else if (modelType === 'helicoid') {
      const helicoidData = [];
      const alphaSteps = 22;
      const rhoSteps = 8;

      for (let i = 0; i <= alphaSteps; i++) {
        const alpha = -Math.PI * 1.5 + (i / alphaSteps) * Math.PI * 3;
        for (let j = 0; j <= rhoSteps; j++) {
          const rho = -15 + (j / rhoSteps) * 30;
          const x = rho * Math.cos(alpha);
          const y = rho * Math.sin(alpha);
          const z = alpha * 7;
          helicoidData.push([x, y, z]);
        }
      }

      gridConfig.boxWidth = 200;
      gridConfig.boxDepth = 200;
      gridConfig.boxHeight = 150;
      seriesConfig = [
        {
          type: 'surface',
          data: helicoidData,
          wireframe: { show: true, lineStyle: { width: 1, color: isDark ? 'rgba(245, 158, 11, 0.35)' : 'rgba(217, 119, 6, 0.25)' } },
          shading: 'lambert',
          itemStyle: { color: isDark ? '#f59e0b' : '#d97706', opacity: 0.9 },
        },
      ];
    }
    // ==========================================
    // 10. GYROÏDE 3D
    // ==========================================
    else if (modelType === 'gyroid') {
      const gyroidPoints = [];
      const gridSize = 10;

      for (let gx = -gridSize; gx <= gridSize; gx += 2) {
        for (let gy = -gridSize; gy <= gridSize; gy += 2) {
          for (let gz = -gridSize; gz <= gridSize; gz += 2) {
            const x = (gx / gridSize) * Math.PI * 2;
            const y = (gy / gridSize) * Math.PI * 2;
            const z = (gz / gridSize) * Math.PI * 2;
            const val = Math.sin(x) * Math.cos(y) + Math.sin(y) * Math.cos(z) + Math.sin(z) * Math.cos(x);

            if (Math.abs(val) < 0.25) {
              const itemIdx = Math.abs(gx + gy + gz) % arrCount;
              const item = data[itemIdx] || { count: 1000, arrondissement: itemIdx + 1 };
              gyroidPoints.push({
                value: [gx * 2, gy * 2, gz * 2],
                symbolSize: 10,
                itemStyle: {
                  color: colorForArrondissement(item.arrondissement, itemIdx),
                  opacity: 0.85,
                },
              });
            }
          }
        }
      }

      gridConfig.boxWidth = 190;
      gridConfig.boxDepth = 190;
      gridConfig.boxHeight = 190;
      seriesConfig = [
        {
          type: 'scatter3D',
          data: gyroidPoints,
          shading: 'lambert',
        },
      ];
    }
    // ==========================================
    // HISTOGRAMME 3D CLASSIQUE (Bento Bars)
    // ==========================================
    else {
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
      zAxisConfig = { name: 'DPE', type: 'value', axisLabel: { textStyle: { color: t.axisLabel, fontSize: 10 } } };

      gridConfig.boxWidth = 260;
      gridConfig.boxDepth = 90;
      gridConfig.boxHeight = 125;

      seriesConfig = [
        {
          type: 'bar3D',
          data: seriesData,
          shading: 'lambert',
          bevelSize: 0.35,
          barSize: 8,
          emphasis: {
            itemStyle: { opacity: 1 },
            label: {
              show: true,
              formatter: (p) => `${data[p.dataIndex]?.label || ''} — ${data[p.dataIndex]?.count?.toLocaleString('fr-FR') || ''}`,
            },
          },
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
              Visualisation 3D — Data Analytics Scientifique
            </h3>
            <p className="re-data-card__subtitle text-xs text-slate-500 dark:text-slate-400">
              10 Modèles 3D Mathématiques Célèbres &amp; Répartition Énergétique · {total.toLocaleString('fr-FR')} DPE
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

      <div className="re-3d-canvas" style={{ minHeight: '620px', height: '620px', width: '100%' }}>
        <ReactECharts
          echarts={echarts}
          option={option}
          notMerge={true}
          lazyUpdate={false}
          onEvents={onEvents}
          style={{ width: '100%', height: '620px' }}
          opts={{ renderer: 'canvas' }}
        />
      </div>
    </div>
  );
}

export default memo(ParisArrondissement3D);
