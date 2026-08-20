import { Link } from 'react-router-dom';
import ProfileSection from './ProfileSection';
import ExperienceSection from './ExperienceSection';

export default function CvSection({ cv }) {
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

        <ProfileSection profile={cv.profile} skills={cv.skills_elite} />
        <ExperienceSection experience={cv.experience} education={cv.education_focus} />
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
