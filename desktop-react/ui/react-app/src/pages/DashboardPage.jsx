import DashboardLayout from '../layouts/DashboardLayout';
import BatimentSection from '../components/sections/BatimentSection';
import TypesSection from '../components/sections/TypesSection';
import DpeSection from '../components/sections/DpeSection';
import { useDashboardData } from '../hooks/useDashboardData';

/**
 * Page Dashboard Global — Ultra légère (Niveau 4 de la Hiérarchie)
 * Assemble DashboardLayout (Niveau 3) et ses 3 Sections modulaires (Niveau 2)
 */
export default function DashboardPage() {
  const { data, loading } = useDashboardData();

  return (
    <DashboardLayout
      title="Tableau de Bord &amp; Visualisation 3D / 2D"
      subtitle="Synthèse Interactive Multi-Dimensions"
    >
      <BatimentSection data={data} loading={loading} />
      <TypesSection data={data} loading={loading} />
      <DpeSection data={data} loading={loading} />
    </DashboardLayout>
  );
}
