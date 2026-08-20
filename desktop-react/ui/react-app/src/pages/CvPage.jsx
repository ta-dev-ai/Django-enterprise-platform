import { useEffect, useState } from 'react';
import PublicLayout from '../layouts/PublicLayout';
import CvSection from '../sections/cv/CvSection';

/**
 * Page CV Tayier NIMAIT (Niveau 4)
 * Fetch les données et délègue l'affichage à CvSection
 */
export default function CvPage() {
  const [cv, setCv] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.body.className = 'py-12 bg-slate-50';
    fetch('/static/data/cv_data.json')
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(setCv)
      .catch((e) => setError(e.message));
    return () => {
      document.body.className = '';
    };
  }, []);

  if (error) {
    return (
      <PublicLayout>
        <div className="p-8 text-center text-red-600">Impossible de charger le CV ({error})</div>
      </PublicLayout>
    );
  }

  if (!cv) {
    return (
      <PublicLayout>
        <div className="p-8 text-center text-slate-500">Chargement du CV…</div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <CvSection cv={cv} />
    </PublicLayout>
  );
}
