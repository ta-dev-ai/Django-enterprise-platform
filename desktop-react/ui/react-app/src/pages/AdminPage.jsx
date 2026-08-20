import DashboardLayout from '../layouts/DashboardLayout';
import UsersSection from '../sections/admin/UsersSection';
import SettingsSection from '../sections/admin/SettingsSection';

/**
 * Page Administration - Refactorisée selon la Clean Architecture (Niveau 4)
 * Assemble DashboardLayout avec ses Sections modulaires (Users, Settings)
 */
export default function AdminPage() {
  return (
    <DashboardLayout
      title="Administration"
      subtitle="Gestion des utilisateurs et paramètres système"
    >
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <UsersSection />
        <SettingsSection />
      </div>
    </DashboardLayout>
  );
}
