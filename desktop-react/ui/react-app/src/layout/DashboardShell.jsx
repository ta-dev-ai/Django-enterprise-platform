import { useEffect, useMemo } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';

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
    </DashboardLayout>
  );
}
