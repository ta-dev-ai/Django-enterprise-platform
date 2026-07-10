import { useEffect, useMemo, useState } from 'react';
import DashboardLayout from './layout/DashboardLayout';
import DashboardPage from './pages/DashboardPage';
import BatimentPage from './pages/BatimentPage';
import TypesPage from './pages/TypesPage';
import DpePage from './pages/DpePage';
import ParityStatus from './components/ParityStatus';
import ReferencePanel from './components/ReferencePanel';
import LegacyControllerBridge from './LegacyControllerBridge';

const VALID_PAGES = ['dashboard', 'batiment', 'types', 'dpe'];

function pageFromHash() {
  const hash = window.location.hash.replace('#', '').trim();
  return VALID_PAGES.includes(hash) ? hash : 'dashboard';
}

function App() {
  const [pageKey, setPageKey] = useState(pageFromHash());

  useEffect(() => {
    const onHash = () => setPageKey(pageFromHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  useEffect(() => {
    document.body.setAttribute('data-page', pageKey);
  }, [pageKey]);

  const pageNode = useMemo(() => {
    if (pageKey === 'batiment') return <BatimentPage />;
    if (pageKey === 'types') return <TypesPage />;
    if (pageKey === 'dpe') return <DpePage />;
    return <DashboardPage />;
  }, [pageKey]);

  return (
    <DashboardLayout>
      <LegacyControllerBridge pageKey={pageKey} />
      {pageNode}
      <div className="main-content pt-0">
        <ReferencePanel />
        <div className="mt-4">
          <ParityStatus />
        </div>
      </div>
    </DashboardLayout>
  );
}

export default App;
