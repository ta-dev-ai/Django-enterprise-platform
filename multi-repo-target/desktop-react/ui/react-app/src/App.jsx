import { HashRouter, Route, Routes } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import DashboardShell from './layout/DashboardShell';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import CvPage from './pages/CvPage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import AdminLoginPage from './pages/AdminLoginPage';
import LegalMentionsPage from './pages/LegalMentionsPage';
import LegalPrivacyPage from './pages/LegalPrivacyPage';
import LegalImpressumPage from './pages/LegalImpressumPage';
import NotFoundPage from './pages/NotFoundPage';
import DashboardPage from './pages/DashboardPage';
import BatimentPage from './pages/BatimentPage';
import TypesPage from './pages/TypesPage';
import DpePage from './pages/DpePage';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        {/* Pages vitrine — portées depuis templates/pages/ */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin_login" element={<AdminLoginPage />} />
        <Route path="/admin_page" element={<AdminPage />} />
        <Route path="/cv" element={<CvPage />} />
        <Route path="/mentions-legales" element={<LegalMentionsPage />} />
        <Route path="/confidentialite" element={<LegalPrivacyPage />} />
        <Route path="/impressum" element={<LegalImpressumPage />} />

        <Route element={<MainLayout />}>
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Route>

        {/* Dashboard — layout + bridge legacy */}
        <Route element={<DashboardShell />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/batiment" element={<BatimentPage />} />
          <Route path="/types" element={<TypesPage />} />
          <Route path="/dpe" element={<DpePage />} />
        </Route>

        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </HashRouter>
  );
}
