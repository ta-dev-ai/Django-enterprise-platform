/* 
  Theme Manager (Global)
  Handles dynamic theme toggling (Default <-> Midnight) across the entire application.
  Injects a toggle button into the UI without HTML modification.
*/

document.addEventListener('DOMContentLoaded', () => {
  // 1. Create Floating Toggle Button (Top Right)
  const toggleBtn = document.createElement('button');
  toggleBtn.id = 'theme-toggle-global';
  toggleBtn.title = 'Changer le thème';
  toggleBtn.innerHTML = '<span class="material-symbols-outlined">dark_mode</span>';

  // Style initial (reset)
  toggleBtn.style.cursor = 'pointer';
  toggleBtn.style.display = 'flex';
  toggleBtn.style.alignItems = 'center';
  toggleBtn.style.justifyContent = 'center';
  toggleBtn.style.borderRadius = '50%';
  toggleBtn.style.transition = 'all 0.3s ease';

  // Try to find the Avatar Container (in Dashboard Header)
  // Look for the header div with 'flex items-center gap-6' or similar structure containing the avatar
  const headerActions = document.querySelector('header .flex.items-center.gap-6');

  if (headerActions) {
    // --- DASHBOARD MODE (Aligné à droite) ---
    toggleBtn.style.width = '2.5rem';
    toggleBtn.style.height = '2.5rem';
    toggleBtn.style.marginLeft = '1rem'; // Espace après l'avatar
    toggleBtn.className = 'theme-toggle-inline';

    // Force flex alignment
    headerActions.style.display = 'flex';
    headerActions.style.alignItems = 'center';

    headerActions.appendChild(toggleBtn); // Insère APRÈS l'avatar (à droite)
  } else {
    // --- FLOATING MODE (Fallback for Login/Home) ---
    Object.assign(toggleBtn.style, {
      position: 'fixed',
      top: '6rem',
      right: '1.5rem',
      width: '3rem',
      height: '3rem',
      zIndex: '9999',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    });
    document.body.appendChild(toggleBtn);
  }

  // 2. Check Saved Theme
  const savedTheme = localStorage.getItem('app_theme');
  if (savedTheme === 'midnight') {
    document.body.classList.add('theme-midnight');
    toggleBtn.innerHTML = '<span class="material-symbols-outlined">light_mode</span>';
    updateButtonStyle(true);
  }

  // 3. Handle Click
  toggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('theme-midnight');
    const isDark = document.body.classList.contains('theme-midnight');

    // Update Icon
    toggleBtn.innerHTML = isDark
      ? '<span class="material-symbols-outlined">light_mode</span>'
      : '<span class="material-symbols-outlined">dark_mode</span>';

    updateButtonStyle(isDark);

    // Save Preference
    localStorage.setItem('app_theme', isDark ? 'midnight' : 'default');

    // 4. Dispatch Global Event for Charts/Components
    document.dispatchEvent(
      new CustomEvent('themeChanged', { detail: { theme: isDark ? 'midnight' : 'default' } }),
    );
  });

  // Helper to update button appearance based on theme
  function updateButtonStyle(isDark) {
    if (isDark) {
      // Style "Clean" : Comme l'avatar (Cercle simple, pas de néon flou)
      toggleBtn.style.background = 'transparent';
      toggleBtn.style.border = '2px solid rgba(255, 255, 255, 0.2)'; // Bordure comme l'avatar
      toggleBtn.style.color = '#ffffff'; // Icone blanche nette
      toggleBtn.style.boxShadow = 'none'; // PLUS d'effet glow
    } else {
      toggleBtn.style.background = '#ffffff';
      toggleBtn.style.border = '2px solid #e2e8f0';
      toggleBtn.style.color = '#334155';
      toggleBtn.style.boxShadow = '0 2px 5px rgba(0,0,0,0.05)';
    }
  }
};);
