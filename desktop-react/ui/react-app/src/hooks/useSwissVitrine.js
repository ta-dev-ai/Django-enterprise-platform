import { useEffect } from 'react';
import { clearPageBodyClasses, setPageBodyClasses } from '../utils/bodyClass';

/** Active le design Swiss sur les pages vitrine publiques. */
export function useSwissVitrine(baseBodyClass) {
  useEffect(() => {
    setPageBodyClasses(baseBodyClass, 'swiss-vitrine');
    return () => {
      clearPageBodyClasses();
    };
  }, [baseBodyClass]);
}
