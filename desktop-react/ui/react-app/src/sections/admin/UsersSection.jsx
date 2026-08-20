const USERS = [
  { initials: 'JD', name: 'Jean Dupont', email: 'jean@renov.com', role: 'Admin', roleClass: 'bg-purple-100 text-purple-600', active: true, last: "Aujourd'hui, 09:42" },
  { initials: 'SL', name: 'Sophie Lambert', email: 'sophie@renov.com', role: 'Éditeur', roleClass: 'bg-blue-100 text-blue-600', active: true, last: 'Hier, 14:20' },
  { initials: 'MB', name: 'Marc Bernard', email: 'marc@client.com', role: 'Lecteur', roleClass: 'bg-slate-200 text-slate-600', active: false, last: 'Il y a 3 jours' },
];

export default function UsersSection() {
  return (
    <div className="xl:col-span-2 neu-card p-6 flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined">group</span>
          </div>
          <h3 className="text-lg font-bold text-slate-700">Gestion des Utilisateurs</h3>
        </div>
        <div className="flex gap-3">
          <button type="button" className="neu-btn px-4 py-2 rounded-xl flex items-center gap-2 text-slate-600 text-sm font-medium">
            <span className="material-symbols-outlined text-[18px]">filter_list</span>
            Filtrer
          </button>
          <button type="button" className="neu-btn-primary px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-bold shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined text-[18px]">person_add</span>
            Ajouter
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-xs uppercase text-slate-400 font-semibold border-b border-slate-200/50">
              <th className="px-4 py-3 min-w-[200px]">Utilisateur</th>
              <th className="px-4 py-3">Rôle</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3 min-w-[150px]">Dernière connexion</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {USERS.map((user) => (
              <tr key={user.email} className="group hover:bg-white/40 transition-colors border-b border-transparent hover:border-slate-200/30">
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-xs font-bold">{user.initials}</div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-700">{user.name}</span>
                      <span className="text-xs text-slate-400">{user.email}</span>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${user.roleClass}`}>{user.role}</span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <span className={`size-2 rounded-full ${user.active ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' : 'bg-slate-300'}`} />
                    <span className={`font-medium text-xs ${user.active ? 'text-emerald-600' : 'text-slate-500'}`}>{user.active ? 'Actif' : 'Inactif'}</span>
                  </div>
                </td>
                <td className="px-4 py-4 text-slate-500">{user.last}</td>
                <td className="px-4 py-4 text-right">
                  <button type="button" className="neu-btn size-8 inline-flex items-center justify-center rounded-lg text-slate-400 hover:text-primary mx-1">
                    <span className="material-symbols-outlined text-[18px]">edit</span>
                  </button>
                  <button type="button" className="neu-btn size-8 inline-flex items-center justify-center rounded-lg text-slate-400 hover:text-red-500 mx-1">
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center pt-2">
        <span className="text-xs text-slate-400">Affichage de 3 sur 48 utilisateurs</span>
      </div>
    </div>
  );
}
