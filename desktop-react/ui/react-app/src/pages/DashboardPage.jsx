import BatimentSectionPanel from '../components/dashboard/BatimentSectionPanel';
import ParityStatus from '../components/ParityStatus';

function FutureCard({ icon, title, text }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-3 flex items-center gap-3">
        <div className="neu-icon-btn">
          <span className="material-symbols-outlined text-primary">{icon}</span>
        </div>
        <h2 className="text-lg font-bold text-slate-800">{title}</h2>
      </div>
      <p className="text-sm text-slate-600">{text}</p>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <main className="main-content">
      <header className="mb-10 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-xs font-bold text-slate-400 mb-1" id="viewSubtitle">
            Synthèse React native
          </span>
          <h1 className="text-2xl font-bold text-slate-800" id="viewTitle">
            Tableau de Bord React
          </h1>
        </div>
        <div className="flex items-center gap-6">
          <div className="size-10 rounded-full border-2 border-slate-200 overflow-hidden cursor-pointer">
            <img
              src="https://i.pravatar.cc/100?u=admin"
              className="w-full h-full object-cover"
              alt="Profil"
            />
          </div>
        </div>
      </header>

      <div className="space-y-8">
        <ParityStatus />

        <section id="section-batiment" className="view-section rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
          <BatimentSectionPanel />
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <FutureCard
            icon="construction"
            title="Types de travaux"
            text="La version React native de cette vue peut être branchée sur les mêmes API sans repasser par le contrôleur legacy."
          />
          <FutureCard
            icon="bolt"
            title="Classe DPE"
            text="Cette page restera indépendante du dashboard ancien et utilisera ses propres hooks de données."
          />
        </section>
      </div>
    </main>
  );
}
