import { useTheme } from '../../context/ThemeContext';

/**
 * Bouton thème — inline (dashboard) ou flottant (vitrine / login).
 */
export default function ThemeToggle({ variant = 'inline' }) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      className={`re-theme-toggle re-theme-toggle--${variant}`}
      onClick={toggleTheme}
      title="Changer le thème"
      aria-label="Changer le thème"
    >
      <span className="material-symbols-outlined">
        {isDark ? 'light_mode' : 'dark_mode'}
      </span>
    </button>
  );
}
