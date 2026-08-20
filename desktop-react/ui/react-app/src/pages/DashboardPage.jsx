import DashboardLayout from '../layouts/DashboardLayout';
import BatimentSection from '../sections/dashboard/BatimentSection';
import TypesSection from '../sections/dashboard/TypesSection';
import DpeSection from '../sections/dashboard/DpeSection';
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
