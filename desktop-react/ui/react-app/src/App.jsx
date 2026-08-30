import { HashRouter, Route, Routes, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import CvPage from './pages/CvPage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import DashboardPage from './pages/DashboardPage';
import LegalPage from './pages/LegalPage';
import NotFoundPage from './pages/NotFoundPage';
import { HOME_SCROLL_ROUTES } from './config/homeNavigation';

/**
 * Routeur Principal — Seules les 6 Pages Canoniques + Legal & 404
 */
export default function App() {
  return (
    <HashRouter>
      <Routes>
        {/* 1. Page Vitrine Principale */}
        <Route path="/" element={<HomePage />} />

        {/* Page À propos dédiée */}
        <Route path="/about" element={<AboutPage />} />
        <Route path="/solutions" element={<HomePage scrollTo={HOME_SCROLL_ROUTES.solutions} />} />
        <Route path="/mission" element={<HomePage scrollTo={HOME_SCROLL_ROUTES.mission} />} />
        <Route path="/team" element={<HomePage scrollTo={HOME_SCROLL_ROUTES.team} />} />

        {/* 2. Page Contact & Équipe */}
        <Route path="/contact" element={<ContactPage />} />

        {/* 3. Page CV Tayier NIMAIT */}
        <Route path="/cv" element={<CvPage />} />

        {/* 4. Page Authentification (Unique) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin_login" element={<Navigate to="/login" replace />} />

        {/* 5. Page Administration */}
        <Route path="/admin_page" element={<AdminPage />} />

        {/* 6. Page Dashboard Central Unique (et ses vues sous-routes) */}
        <Route path="/dashboard" element={<DashboardPage view="all" />} />
        <Route path="/batiment" element={<DashboardPage view="batiment" />} />
        <Route path="/types" element={<DashboardPage view="types" />} />
        <Route path="/dpe" element={<DashboardPage view="dpe" />} />

        {/* Pages Légales Centralisées */}
        <Route path="/mentions-legales" element={<LegalPage docType="mentions" />} />
        <Route path="/confidentialite" element={<LegalPage docType="privacy" />} />
        <Route path="/impressum" element={<LegalPage docType="impressum" />} />

        {/* 404 */}
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </HashRouter>
  );
}
