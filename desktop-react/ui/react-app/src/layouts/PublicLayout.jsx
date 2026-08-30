import HomeNavbar from '../components/home/HomeNavbar';
import SiteFooter from '../sections/common/FooterSection';

/**
 * Layout Public (Vitrine) — Navbar maquette Home + contenu + footer
 */
export default function PublicLayout({ children, contentClassName = '' }) {
  return (
    <div>
      <HomeNavbar />
      <main className="home-main">
        <div className={`home-page${contentClassName ? ` ${contentClassName}` : ''}`}>
          {children}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
