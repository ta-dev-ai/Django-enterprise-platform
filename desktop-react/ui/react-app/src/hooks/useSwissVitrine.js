import { useEffect } from 'react';

/** Active le design Swiss sur les pages vitrine publiques. */
export function useSwissVitrine(baseBodyClass) {
  useEffect(() => {
    document.body.className = `${baseBodyClass} swiss-vitrine`.trim();
    return () => {
      document.body.className = '';
    };
  }, [baseBodyClass]);
}
