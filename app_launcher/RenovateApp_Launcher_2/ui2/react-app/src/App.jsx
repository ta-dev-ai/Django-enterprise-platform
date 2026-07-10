import { useEffect, useMemo } from 'react';
import { HashRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import DashboardLayout from './layout/DashboardLayout';
import DashboardPage from './pages/DashboardPage';
import BatimentPage from './pages/BatimentPage';
import TypesPage from './pages/TypesPage';
import DpePage from './pages/DpePage';
import ParityStatus from './components/ParityStatus';
import ReferencePanel from './components/ReferencePanel';
import LegacyControllerBridge from './LegacyControllerBridge';

function RoutedApp() {
  const location = useLocation();
  const pageKey = useMemo(() => {
    const cleanPath = location.pathname.replace(/^\/+/, '') || 'dashboard';
    if (cleanPath === 'dashboard' || cleanPath === 'batiment' || cleanPath === 'types' || cleanPath === 'dpe') {
      return cleanPath;
    }
    return 'dashboard';
  }, [location.pathname]);

  useEffect(() => {
    // Keep legacy controller in "dashboard mode" so sidebar navigation
    // works from every React hash page (batiment/types/dpe included).
    document.body.setAttribute('data-page', 'dashboard');
    document.body.setAttribute('data-react-page', pageKey);
  }, [pageKey]);

  return (
    <DashboardLayout>
      <LegacyControllerBridge pageKey={pageKey} />
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/batiment" element={<BatimentPage />} />
        <Route path="/types" element={<TypesPage />} />
        <Route path="/dpe" element={<DpePage />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      <div className="main-content pt-0">
        <ReferencePanel />
        <div className="mt-4">
          <ParityStatus />
        </div>
      </div>
    </DashboardLayout>
  );
}

export default function App() {
  return (
    <HashRouter>
      <RoutedApp />
    </HashRouter>
  );
}
