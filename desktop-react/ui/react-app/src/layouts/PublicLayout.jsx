import HomeNavbar from '../components/home/HomeNavbar';
import SiteFooter from '../sections/common/FooterSection';

/**
 * Layout Public (Vitrine) — Navbar maquette Home + contenu + footer
 */
export default function PublicLayout({ children }) {
  return (
    <div>
      <HomeNavbar />
      <main className="home-main">
        <div className="home-page">{children}</div>
      </main>
      <SiteFooter />
    </div>
  );
}
