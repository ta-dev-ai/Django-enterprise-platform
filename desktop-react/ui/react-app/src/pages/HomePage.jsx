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

/**
 * Page d'Accueil — Ultra légère (Niveau 4 de la Hiérarchie)
 * Assemble PublicLayout (Niveau 3) et ses Sections modulaires (Niveau 2)
 */
export default function HomePage() {
  useEffect(() => {
    setPageBodyClasses('home-body');
    document.title = 'RenovateEnergy - Rénovez votre maison, illuminez votre avenir';
    fetchDashboardData().catch(() => {});
    ensureCsrfCookie();
    return () => {
      clearPageBodyClasses();
    };
  }, []);

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
