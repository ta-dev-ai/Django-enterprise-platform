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
        if (typeof window.ApexCharts === 'undefined') {
          await new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = '/static/js/cdn/jsdelivr.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
          });
        }

        const controllerUrl = '/static/js/controllers/mainController.js';
        await import(/* @vite-ignore */ controllerUrl);

        if (!isMounted || !window.frontController) return;

        const targetView = pageKey === 'dashboard' ? 'overview' : pageKey;

        if (!window.frontController.__hashSyncPatched) {
          const originalSwitchView = window.frontController.switchView.bind(window.frontController);
          window.frontController.switchView = (viewType) => {
            originalSwitchView(viewType);
            const nextRoute = viewType === 'overview' ? '/dashboard' : `/${viewType}`;
            if (window.location.hash !== `#${nextRoute}`) {
              window.location.hash = nextRoute;
            }
          };
          window.frontController.__hashSyncPatched = true;
        }

        if (!window.frontController.isInitialized) {
          await window.frontController.init();
        } else {
          window.frontController.currentView = targetView;
          window.frontController.switchView(targetView);
          // React remounts chart containers on route change — second pass after DOM settles.
          setTimeout(() => {
            if (isMounted && window.frontController?.isInitialized) {
              window.frontController.renderAll();
            }
          }, 200);
        }
      } catch (error) {
        console.error('[React Bridge] Failed to load legacy controller:', error);
      }
    };

    // Wait one frame so routed page DOM (#privateChart, etc.) is painted.
    const timer = setTimeout(bootstrap, 50);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [pageKey]);

  return null;
}
