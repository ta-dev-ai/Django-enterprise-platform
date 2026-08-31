import { useEffect } from 'react';
import PublicLayout from '../layouts/PublicLayout';
import HeroSection from '../sections/home/HeroSection';
import FeaturesSection from '../sections/home/FeaturesSection';
import MissionSection from '../sections/home/MissionSection';
import AboutSection from '../sections/home/AboutSection';
import TeamSection from '../sections/home/TeamSection';
import { ensureCsrfCookie } from '../utils/csrf';
import { fetchDashboardData } from '../api/dashboardApi';
import { clearPageBodyClasses, setPageBodyClasses } from '../utils/bodyClass';
import { brandPageTitle } from '../components/ui/BrandTitle';
import { SITE_BRAND } from '../constants/siteBrand';
import { scrollToHomeSection } from '../utils/homeNav';
import { HOME_SCROLL_ROUTES } from '../config/homeNavigation';

/**
 * Page d'Accueil — maquette vitrine (sections modulaires + navbar reliée)
 */
export default function HomePage({ scrollTo = null }) {
  useEffect(() => {
    setPageBodyClasses('home-body');
    document.title = brandPageTitle(SITE_BRAND.tagline);
    fetchDashboardData().catch(() => {});
    ensureCsrfCookie();
    return () => {
      clearPageBodyClasses();
    };
  }, []);

  useEffect(() => {
    if (!scrollTo) return undefined;
    const timer = window.setTimeout(() => scrollToHomeSection(scrollTo), 120);
    return () => window.clearTimeout(timer);
  }, [scrollTo]);

  return (
    <PublicLayout>
      <HeroSection />
      <FeaturesSection />
      <MissionSection />
      <AboutSection />
      <TeamSection />
    </PublicLayout>
  );
}
