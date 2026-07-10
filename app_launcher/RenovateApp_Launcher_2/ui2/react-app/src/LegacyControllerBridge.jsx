import { useEffect } from 'react';

/**
 * Bridge: execute existing MVT JS controllers inside React-rendered DOM.
 * Keeps current production logic (charts, filters, tables) without rewriting now.
 */
export default function LegacyControllerBridge() {
  useEffect(() => {
    let isMounted = true;

    const bootstrap = async () => {
      try {
        const controllerUrl = '/static/js/controllers/mainController.js';
        await import(/* @vite-ignore */ controllerUrl);

        // mainController.js bootstraps on DOMContentLoaded; in React route, call init manually.
        if (isMounted && window.frontController && !window.frontController.isInitialized) {
          window.frontController.init();
        }
      } catch (error) {
        console.error('[React Bridge] Failed to load legacy controller:', error);
      }
    };

    // Let React finish painting before legacy DOM manipulations.
    const timer = setTimeout(bootstrap, 0);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, []);

  return null;
}
