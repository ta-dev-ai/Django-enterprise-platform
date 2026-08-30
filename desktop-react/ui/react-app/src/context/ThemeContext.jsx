import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const ThemeContext = createContext(null);
const STORAGE_KEY = 'app_theme';

function readTheme() {
  return localStorage.getItem(STORAGE_KEY) === 'midnight' ? 'midnight' : 'default';
}

function syncTheme(theme) {
  document.body.classList.toggle('theme-midnight', theme === 'midnight');
  localStorage.setItem(STORAGE_KEY, theme);
  document.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(readTheme);

  useEffect(() => {
    document.getElementById('theme-toggle-global')?.remove();
    syncTheme(theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === 'midnight' ? 'default' : 'midnight'));
  }, []);

  const value = useMemo(
    () => ({
      theme,
      isDark: theme === 'midnight',
      toggleTheme,
      setTheme,
    }),
    [theme, toggleTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
