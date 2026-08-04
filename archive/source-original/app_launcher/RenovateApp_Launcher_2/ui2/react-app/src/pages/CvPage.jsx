import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

/**
 * Porté depuis templates/pages/cv_tayier.html
 * Données: static/data/cv_data.json (même source que Django views.cv)
 */
export default function CvPage() {
  const [cv, setCv] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.body.className = 'py-12';
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
      <div className="p-8 text-center text-red-600">
        Impossible de charger le CV ({error})
      </div>
    );
  }

  if (!cv) {
    return <div className="p-8 text-center text-slate-500">Chargement du CV…</div>;
  }

  return (
    <>
      <style>{`
        .cv-report-page {
          width: min(210mm, 100%);
          max-width: 100%;
          min-height: 297mm;
          background: white;
          margin: 0 auto;
          box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
          padding: clamp(1rem, 4vw, 4rem);
          display: flex;
          flex-direction: column;
          position: relative;
          box-sizing: border-box;
        }
        .cv-section-header {
          font-size: 0.75rem;
          font-weight: 900;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          border-bottom: 2px solid black;
          padding-bottom: 0.25rem;
          margin-bottom: 1.5rem;
          margin-top: 2.5rem;
        }
        .cv-mono { font-family: 'JetBrains Mono', monospace; }
        @media (max-width: 767px) {
          .cv-report-page header { flex-direction: column; gap: 1.5rem; }
          .cv-skills-grid { grid-template-columns: 1fr !important; }
          .cv-report-page h1 { font-size: 2rem !important; }
        }
        @media print {
          .cv-no-print { display: none !important; }
          .cv-report-page { box-shadow: none; width: 210mm; height: 297mm; padding: 12mm; }
        }
      `}</style>

      <div className="cv-no-print fixed top-6 left-6 z-50">
        <Link
          to="/"
          className="bg-black text-white px-6 py-2 text-xs font-black uppercase tracking-widest hover:bg-red-600 transition-all"
        >
          ← RETOUR ARCHIVE
        </Link>
      </div>

      <div className="cv-report-page">
        <header className="flex justify-between items-start border-b-4 border-black pb-8 gap-8">
          <div className="flex gap-8 items-start">
            <div className="w-28 h-28 border-4 border-black flex-shrink-0 overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <img
                src="/static/assets/tayier_photo_pro.jpg"
                alt={`Photo ${cv.header.name}`}
                className="w-full h-full object-cover contrast-110 brightness-105"
              />
            </div>
            <div className="max-w-xl">
              <h1 className="text-5xl font-black uppercase tracking-tighter leading-none mb-4">
                {cv.header.name}
              </h1>
              <p className="text-xl font-black bg-black text-white px-4 py-1 inline-block uppercase tracking-wider mb-2">
                {cv.header.job_title}
              </p>
              <p className="text-sm font-bold text-slate-600">{cv.header.subtitle}</p>
            </div>
          </div>
          <div className="text-right flex flex-col gap-1 text-[10px] font-black uppercase tracking-widest">
            <p>{cv.header.contact.location}</p>
            <p className="text-blue-600">{cv.header.contact.email}</p>
            <p>{cv.header.contact.phone}</p>
            <div className="flex gap-4 mt-4 justify-end">
              {cv.header.contact.links?.map((link) => (
                <a key={link.url} href={link.url} className="underline hover:text-red-500" target="_blank" rel="noreferrer">
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </header>

        <section>
          <h2 className="cv-section-header">Profil de Recherche Selectionné</h2>
          <div className="bg-slate-50 p-8 border-l-8 border-black">
            <p className="text-sm leading-relaxed font-bold text-slate-800 italic">
              &quot;{cv.profile.content}&quot;
            </p>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 cv-skills-grid">
          {cv.skills_elite?.map((skill) => (
            <div key={skill.category}>
              <h2 className="cv-section-header">{skill.category}</h2>
              <p className="text-xs cv-mono font-bold leading-loose">{skill.items}</p>
            </div>
          ))}
        </section>

        <section className="flex-1">
          <h2 className="cv-section-header">Parcours à Fort Impact Business</h2>
          {cv.experience?.map((job) => (
            <div key={`${job.role}-${job.dates}`} className="mb-10">
              <div className="flex justify-between items-baseline mb-2">
                <h3 className="text-lg font-black uppercase">{job.role}</h3>
                <span className="text-[10px] font-black text-slate-400 cv-mono">// {job.dates}</span>
              </div>
              <p className="text-xs font-black text-red-600 mb-4 underline decoration-2">{job.company}</p>
              <ul className="space-y-3">
                {job.tasks?.map((task) => (
                  <li key={task} className="flex items-start gap-4 text-xs font-bold text-slate-700 leading-snug">
                    <span className="w-2 h-2 bg-black mt-1 flex-shrink-0" />
                    <span>{task}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        <footer className="border-t-4 border-black pt-8 flex justify-between items-end mt-12">
          <div>
            <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">
              Formation Académique
            </h2>
            {cv.education_focus?.map((edu) => (
              <p key={`${edu.year}-${edu.degree}`} className="text-[10px] font-bold uppercase">
                <span className="text-red-600">{edu.year}</span> // {edu.degree} ({edu.school})
              </p>
            ))}
          </div>
          <div className="text-right">
            <div className="text-[40px] font-black leading-none uppercase tracking-tighter">
              L&apos;INFORMATION<br /><span className="text-red-600">IA</span>
            </div>
            <p className="text-[8px] font-black tracking-[0.4em] mt-2 opacity-50 uppercase">
              Analyse Senior / Marché 2026
            </p>
          </div>
        </footer>
      </div>

      <div className="cv-no-print fixed bottom-8 right-8">
        <button
          type="button"
          onClick={() => window.print()}
          className="bg-black text-white px-10 py-5 text-sm font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-red-600 transition-all border-4 border-white"
        >
          Générer Rapport A4
        </button>
      </div>
    </>
  );
}
