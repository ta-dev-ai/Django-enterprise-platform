/*
  Theme bootstrap (avant React)
  Applique le thème sauvegardé sans créer de bouton DOM — géré par React (ThemeToggle).
*/
(function applySavedTheme() {
  if (localStorage.getItem('app_theme') === 'midnight') {
    document.body.classList.add('theme-midnight');
  }
})();
