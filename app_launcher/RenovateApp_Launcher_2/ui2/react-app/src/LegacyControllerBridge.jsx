import { useEffect } from 'react';

/**
 * Bridge: execute existing MVT JS controllers inside React-rendered DOM.
 * Keeps current production logic (charts, filters, tables) without rewriting now.
 */
export default function LegacyControllerBridge({ pageKey }) {
  useEffect(() => {
    let isMounted = true;

    const bootstrap = async () => {
      try {
        const controllerUrl = '/static/js/controllers/mainController.js';
        await import(/* @vite-ignore */ controllerUrl);

        if (!isMounted || !window.frontController) return;

        const targetView = pageKey === 'dashboard' ? 'overview' : pageKey;

        if (!window.frontController.isInitialized) {
          await window.frontController.init();
        } else {
          window.frontController.currentView = targetView;
          window.frontController.switchView(targetView);
        }
      } catch (error) {
        console.error('[React Bridge] Failed to load legacy controller:', error);
      }
    };

    const timer = setTimeout(bootstrap, 0);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [pageKey]);

  return null;
}
