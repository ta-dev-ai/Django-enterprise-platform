import DashboardLayout from '../layouts/DashboardLayout';
import TypesSection from '../sections/dashboard/TypesSection';
import { useDashboardData } from '../hooks/useDashboardData';

/**
 * Page Types de Travaux Dédiée (Niveau 4)
 * Assemble DashboardLayout avec TypesSection
 */
export default function TypesPage() {
  const { data, loading } = useDashboardData();

  return (
    <DashboardLayout
      title="Types de Travaux de Rénovation"
      subtitle="Isolation, Menuiserie, Chauffage &amp; Ventilation"
    >
      <TypesSection data={data} loading={loading} />
    </DashboardLayout>
  );
}
