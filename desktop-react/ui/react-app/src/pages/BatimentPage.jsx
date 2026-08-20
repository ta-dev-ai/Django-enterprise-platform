import DashboardLayout from '../layouts/DashboardLayout';
import BatimentSection from '../sections/dashboard/BatimentSection';
import { useDashboardData } from '../hooks/useDashboardData';

/**
 * Page Bâtiments Dédiée (Niveau 4)
 * Assemble DashboardLayout avec la BatimentSection
 */
export default function BatimentPage() {
  const { data, loading } = useDashboardData();

  return (
    <DashboardLayout
      title="Bâtiments Rénovés"
      subtitle="Paris 1-20 · Visualisation 3D, Bulles 2D &amp; Registre"
    >
      <BatimentSection data={data} loading={loading} />
    </DashboardLayout>
  );
}
