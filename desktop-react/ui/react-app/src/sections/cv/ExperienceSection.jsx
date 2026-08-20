export default function ExperienceSection({ experience, education }) {
  return (
    <>
      <section className="flex-1 mt-6">
        <h2 className="cv-section-header">Parcours à Fort Impact Business</h2>
        {experience?.map((job) => (
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

      {education && (
        <footer className="border-t-4 border-black pt-8 flex justify-between items-end mt-12">
          <div>
            <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">
              Formation Académique
            </h2>
            {education.map((edu) => (
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
      )}
    </>
  );
}
