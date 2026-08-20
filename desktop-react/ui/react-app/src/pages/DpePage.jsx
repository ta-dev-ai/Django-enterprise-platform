import DashboardLayout from '../layouts/DashboardLayout';
import DpeSection from '../sections/dashboard/DpeSection';
import { useDashboardData } from '../hooks/useDashboardData';

/**
 * Page Performance DPE Dédiée (Niveau 4)
 * Assemble DashboardLayout avec DpeSection
 */
export default function DpePage() {
  const { data, loading } = useDashboardData();

  return (
    <DashboardLayout
      title="Performance Énergétique DPE"
      subtitle="Classes A à G &amp; Réduction Carbone"
    >
      <DpeSection data={data} loading={loading} />
    </DashboardLayout>
  );
}
