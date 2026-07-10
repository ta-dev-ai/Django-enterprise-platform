import Sidebar from '../components/Sidebar';

/** Copié depuis templates/layouts/dashboard_layout.html */
export default function DashboardLayout({ children }) {
  return (
    <>
      <Sidebar />
      {children}
    </>
  );
}
