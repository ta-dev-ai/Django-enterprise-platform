export default function ProfileSection({ profile, skills }) {
  if (!profile) return null;

  return (
    <>
      <section>
        <h2 className="cv-section-header">Profil de Recherche Sélectionné</h2>
        <div className="bg-slate-50 p-8 border-l-8 border-black">
          <p className="text-sm leading-relaxed font-bold text-slate-800 italic">
            &quot;{profile.content}&quot;
          </p>
        </div>
      </section>

      {skills && (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 cv-skills-grid mt-6">
          {skills.map((skill) => (
            <div key={skill.category}>
              <h2 className="cv-section-header">{skill.category}</h2>
              <p className="text-xs cv-mono font-bold leading-loose">{skill.items}</p>
            </div>
          ))}
        </section>
      )}
    </>
  );
}
