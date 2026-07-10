import DashboardLayout from './layout/DashboardLayout';
import DashboardPage from './pages/DashboardPage';
import ParityStatus from './components/ParityStatus';
import ReferencePanel from './components/ReferencePanel';
import LegacyControllerBridge from './LegacyControllerBridge';

function App() {
  return (
    <DashboardLayout>
      <LegacyControllerBridge />
      <DashboardPage />
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
