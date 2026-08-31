import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import BrandTitle from '../ui/BrandTitle';
import LocaleSwitcher from '../ui/LocaleSwitcher';
import ThemeToggle from '../ui/ThemeToggle';
import { HOME_NAV_ITEMS } from '../../config/homeNavigation';
import { scrollToHomeSection } from '../../utils/homeNav';

const HOME_PATHS = ['/', '/about', '/solutions', '/mission', '/team'];

const SECTION_ROUTES = {
  about: '/about',
  features: '/solutions',
  mission: '/mission',
  team: '/team',
};

function NavSectionLink({ sectionId, children, className, onNavigate }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleClick = (event) => {
    event.preventDefault();
    onNavigate?.();

    if (HOME_PATHS.includes(location.pathname)) {
      scrollToHomeSection(sectionId);
      return;
    }

    navigate(SECTION_ROUTES[sectionId] || '/');
  };

  return (
    <a href={`#${sectionId}`} className={className} onClick={handleClick}>
      {children}
    </a>
  );
}

function SolutionsDropdown({ item, onNavigate }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const handlePointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [open]);

  return (
    <div className="home-nav-dropdown" ref={rootRef}>
      <button
        type="button"
        className="home-nav-link home-nav-dropdown-trigger"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        {item.label}
        <span className="dropdown-arrow">▾</span>
      </button>
      {open && (
        <div className="home-nav-dropdown-menu" role="menu">
          {item.items.map((entry) => (
            <Link
              key={entry.to}
              to={entry.to}
              className="home-nav-dropdown-item"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                onNavigate?.();
              }}
            >
              {entry.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function renderNavItem(item, { onNavigate, handleAccueilClick }) {
  const className = `home-nav-link${item.highlight ? ' highlight' : ''}`;

  if (item.type === 'home') {
    return (
      <Link key={item.id} className={className} to="/" onClick={handleAccueilClick}>
        {item.label}
      </Link>
    );
  }

  if (item.type === 'section') {
    return (
      <NavSectionLink
        key={item.id}
        sectionId={item.sectionId}
        className={className}
        onNavigate={onNavigate}
      >
        {item.label}
      </NavSectionLink>
    );
  }

  if (item.type === 'dropdown') {
    return <SolutionsDropdown key={item.id} item={item} onNavigate={onNavigate} />;
  }

  return (
    <Link key={item.id} className={className} to={item.to} onClick={onNavigate}>
      {item.label}
    </Link>
  );
}

export default function HomeNavbar() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const closeMenu = () => setMenuOpen(false);

  const handleAccueilClick = (event) => {
    if (!HOME_PATHS.includes(location.pathname)) return;
    event.preventDefault();
    closeMenu();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="home-header">
      <div className="home-header-container">
        <nav
          className={`home-nav${menuOpen ? ' home-nav--open' : ''}`}
          aria-label="Navigation principale"
        >
          <Link to="/" className="home-brand" onClick={closeMenu}>
            <div className="contact-logo">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13 2L3 14H11L10 22L20 10H12L13 2Z"
                  fill="white"
                  stroke="white"
                  strokeWidth="1"
                />
              </svg>
            </div>
            <BrandTitle />
          </Link>

          <button
            type="button"
            className="home-nav-menu-btn"
            aria-expanded={menuOpen}
            aria-controls="home-nav-panel"
            aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className="material-symbols-outlined">{menuOpen ? 'close' : 'menu'}</span>
          </button>

          <div id="home-nav-panel" className={`home-nav-panel${menuOpen ? ' is-open' : ''}`}>
            <div className="home-nav-links">
              {HOME_NAV_ITEMS.map((item) =>
                renderNavItem(item, { onNavigate: closeMenu, handleAccueilClick }),
              )}
            </div>
            <div className="home-nav-panel-auth">
              <Link to="/login" className="btn-connexion" onClick={closeMenu}>
                Connexion
              </Link>
              <Link to="/login" className="btn-inscription" onClick={closeMenu}>
                Inscription
              </Link>
            </div>
          </div>

          <div className="home-nav-actions">
            <LocaleSwitcher />
            <ThemeToggle variant="inline" />
            <Link to="/login" className="btn-connexion" onClick={closeMenu}>
              Connexion
            </Link>
            <Link to="/login" className="btn-inscription" onClick={closeMenu}>
              Inscription
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
