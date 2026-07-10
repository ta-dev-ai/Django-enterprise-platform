import { useEffect, useMemo } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';
import LegacyControllerBridge from '../LegacyControllerBridge';
import ParityStatus from '../components/ParityStatus';
import ReferencePanel from '../components/ReferencePanel';

export default function DashboardShell() {
  const location = useLocation();
  const pageKey = useMemo(() => {
    const cleanPath = location.pathname.replace(/^\/+/, '') || 'dashboard';
    if (['dashboard', 'batiment', 'types', 'dpe'].includes(cleanPath)) return cleanPath;
    return 'dashboard';
  }, [location.pathname]);

  useEffect(() => {
    document.body.setAttribute('data-page', 'dashboard');
    document.body.setAttribute('data-react-page', pageKey);
  }, [pageKey]);

  return (
    <DashboardLayout>
      <Outlet />
      <LegacyControllerBridge pageKey={pageKey} />
      <div className="dashboard-dev-panel main-content pt-0">
        <ReferencePanel />
        <div className="mt-4">
          <ParityStatus />
        </div>
      </div>
    </DashboardLayout>
  );
}
