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
    
    // Style directly in JS to ensure it works everywhere without waiting for CSS
    Object.assign(toggleBtn.style, {
        position: 'fixed',
        top: '6rem', /* Below navbar usually */
        right: '1.5rem',
        width: '3rem',
        height: '3rem',
        borderRadius: '50%',
        background: 'var(--bg-card, #ffffff)',
        border: '1px solid var(--border-color, #e2e8f0)',
        color: 'var(--text-main, #334155)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        zIndex: '9999',
        transition: 'all 0.3s ease'
    });

    document.body.appendChild(toggleBtn);

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
    });

    // Helper to update button appearance based on theme
    function updateButtonStyle(isDark) {
        if (isDark) {
            toggleBtn.style.background = 'rgba(30, 41, 59, 0.8)';
            toggleBtn.style.borderColor = 'rgba(56, 189, 248, 0.3)';
            toggleBtn.style.color = '#38bdf8';
            toggleBtn.style.boxShadow = '0 0 15px rgba(56, 189, 248, 0.3)';
        } else {
            toggleBtn.style.background = '#ffffff';
            toggleBtn.style.borderColor = '#e2e8f0';
            toggleBtn.style.color = '#334155';
            toggleBtn.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
        }
    }
});
