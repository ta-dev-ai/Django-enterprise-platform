import { useMemo, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, Grid } from '@react-three/drei';

const BRAND_CYAN = '#0ea5e9';
const BRAND_DARK = '#0f172a';

function ArrondissementBar({ item, maxCount, selected, onSelect }) {
  const height = maxCount > 0 ? (item.count / maxCount) * 4 + 0.15 : 0.15;
  const x = (item.arrondissement - 10.5) * 1.1;

  return (
    <group position={[x, height / 2, 0]}>
      <mesh
        onClick={(e) => {
          e.stopPropagation();
          onSelect(item.arrondissement);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'default';
        }}
      >
        <boxGeometry args={[0.85, height, 0.85]} />
        <meshStandardMaterial
          color={selected === item.arrondissement ? '#f97316' : BRAND_CYAN}
          emissive={selected === item.arrondissement ? '#7c2d12' : '#0c4a6e'}
          emissiveIntensity={selected === item.arrondissement ? 0.35 : 0.12}
          metalness={0.2}
          roughness={0.45}
        />
      </mesh>
      <Text
        position={[0, height + 0.35, 0]}
        fontSize={0.22}
        color={BRAND_DARK}
        anchorX="center"
        anchorY="middle"
      >
        {item.count}
      </Text>
      <Text
        position={[0, -0.35, 0]}
        fontSize={0.18}
        color="#64748b"
        anchorX="center"
        anchorY="middle"
      >
        {item.label}
      </Text>
    </group>
  );
}

function Scene({ data, selected, onSelect }) {
  const maxCount = useMemo(() => Math.max(...data.map((d) => d.count), 1), [data]);

  return (
    <>
      <ambientLight intensity={0.65} />
      <directionalLight position={[8, 12, 6]} intensity={1.1} />
      <directionalLight position={[-6, 4, -4]} intensity={0.35} />
      <Grid
        position={[0, 0, 0]}
        args={[24, 24]}
        cellSize={0.5}
        cellThickness={0.4}
        cellColor="#cbd5e1"
        sectionSize={2}
        sectionThickness={0.8}
        sectionColor="#94a3b8"
        fadeDistance={28}
        infiniteGrid
      />
      {data.map((item) => (
        <ArrondissementBar
          key={item.arrondissement}
          item={item}
          maxCount={maxCount}
          selected={selected}
          onSelect={onSelect}
        />
      ))}
      <OrbitControls
        enablePan={false}
        minPolarAngle={0.3}
        maxPolarAngle={Math.PI / 2.1}
        minDistance={8}
        maxDistance={22}
      />
    </>
  );
}

export default function ParisArrondissement3D({ data }) {
  const [selected, setSelected] = useState(null);
  const total = data.reduce((sum, d) => sum + d.count, 0);
  const selectedItem = data.find((d) => d.arrondissement === selected);

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
              Hauteur = volume de bâtiments par arrondissement · Glisser pour tourner
            </p>
          </div>
        </div>
        <div className="re-data-card__meta">
          <span className="re-badge">{total} bâtiments</span>
          {selectedItem && (
            <span className="re-badge re-badge--accent">
              {selectedItem.label} arr. — {selectedItem.count}
            </span>
          )}
        </div>
      </div>
      <div className="re-3d-canvas">
        <Canvas camera={{ position: [0, 6, 14], fov: 42 }}>
          <color attach="background" args={['#f1f5f9']} />
          <Scene data={data} selected={selected} onSelect={setSelected} />
        </Canvas>
      </div>
    </div>
  );
}
