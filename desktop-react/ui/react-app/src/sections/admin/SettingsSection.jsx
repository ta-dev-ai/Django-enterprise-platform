export default function SettingsSection() {
  return (
    <div className="neu-card p-6 flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
          <span className="material-symbols-outlined">tune</span>
        </div>
        <h3 className="text-lg font-bold text-slate-700">Paramètres Système</h3>
      </div>
      <div className="flex flex-col gap-5">
        <ToggleRow title="Mode Maintenance" subtitle="Suspendre l'accès utilisateur" />
        <ToggleRow title="Inscriptions Publiques" subtitle="Autoriser les nouveaux comptes" defaultChecked />
        <hr className="border-slate-200/50" />
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-slate-700">Email Système</label>
          <div className="flex items-center neu-input rounded-xl px-3 h-10">
            <span className="material-symbols-outlined text-slate-400 text-[18px]">mail</span>
            <input className="bg-transparent border-none text-sm w-full text-slate-600 ml-2 focus:ring-0" type="email" defaultValue="system@renovenergy.com" />
          </div>
        </div>
      </div>
    </div>
  );
}

function ToggleRow({ title, subtitle, defaultChecked = false }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-col">
        <span className="text-sm font-bold text-slate-700">{title}</span>
        <span className="text-xs text-slate-400">{subtitle}</span>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input className="sr-only peer" type="checkbox" defaultChecked={defaultChecked} />
        <div className="w-11 h-6 neu-toggle-bg rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-400 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary/10 peer-checked:after:bg-primary" />
      </label>
    </div>
  );
}
