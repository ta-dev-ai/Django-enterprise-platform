import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const USERS = [
  { initials: 'JD', name: 'Jean Dupont', email: 'jean@renov.com', role: 'Admin', roleClass: 'bg-purple-100 text-purple-600', active: true, last: "Aujourd'hui, 09:42" },
  { initials: 'SL', name: 'Sophie Lambert', email: 'sophie@renov.com', role: 'Éditeur', roleClass: 'bg-blue-100 text-blue-600', active: true, last: 'Hier, 14:20' },
  { initials: 'MB', name: 'Marc Bernard', email: 'marc@client.com', role: 'Lecteur', roleClass: 'bg-slate-200 text-slate-600', active: false, last: 'Il y a 3 jours' },
];

/**
 * Porté depuis templates/pages/admin_page.html
 */
export default function AdminPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    document.body.className = 'text-slate-600 antialiased font-display h-screen flex flex-col overflow-hidden';
    return () => {
      document.body.className = '';
    };
  }, []);

  return (
    <div className="admin-page-root flex h-full w-full max-w-[1600px] mx-auto bg-neu-base shadow-2xl relative min-h-screen">
      <div className="admin-page-mobile-bar md:hidden w-full">
        <button type="button" onClick={() => setSidebarOpen((v) => !v)} aria-label="Menu admin">
          <span className="material-symbols-outlined">menu</span>
        </button>
        <span className="font-bold text-slate-800">Administration</span>
      </div>

      <aside className={`admin-page-aside w-72 flex-col h-full z-20 relative ${sidebarOpen ? 'is-open' : ''}`}>
        <div className="h-full flex flex-col justify-between p-6">
          <div className="flex flex-col gap-8">
            <div className="sidebar-header">
              <Link to="/" className="contact-brand">
                <div className="contact-logo">
                  <span className="material-symbols-outlined">energy_savings_leaf</span>
                </div>
                <h2 className="contact-brand-title">RenovateEnergy</h2>
              </Link>
            </div>
            <nav className="flex flex-col gap-3">
              <AdminNavLink to="/dashboard" icon="dashboard">Dashboard</AdminNavLink>
              <AdminNavLink to="/batiment" icon="apartment">Bâtiments Rénovés</AdminNavLink>
              <AdminNavLink to="/types" icon="construction">Types de Rénovation</AdminNavLink>
              <AdminNavLink to="/dpe" icon="description">Classe DPE</AdminNavLink>
              <a className="flex items-center gap-4 px-4 py-3 rounded-xl text-slate-500 hover:text-primary hover:bg-[#e4e9f2]" href="#">
                <span className="material-symbols-outlined" style={{ fontSize: 24 }}>settings</span>
                <span className="text-sm font-semibold">Paramètres</span>
              </a>
              <Link className="neu-card !border-none flex items-center gap-4 px-4 py-3 rounded-xl text-primary relative overflow-hidden group" to="/admin_page">
                <div className="absolute inset-0 bg-primary/5 opacity-50" />
                <span className="material-symbols-outlined filled" style={{ fontVariationSettings: "'FILL' 1" }}>admin_panel_settings</span>
                <span className="text-sm font-bold">Admin</span>
                <div className="ml-auto size-2 bg-primary rounded-full shadow-[0_0_8px_#638fe9]" />
              </Link>
            </nav>
          </div>
          <div className="mt-auto">
            <a href="/logout/" className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:text-red-500 transition-colors">
              <span className="material-symbols-outlined">logout</span>
              <span className="text-sm font-medium">Déconnexion</span>
            </a>
          </div>
        </div>
      </aside>

      <main className="admin-page-main flex-1 flex flex-col h-full overflow-hidden relative z-10">
        <header className="h-20 flex items-center justify-between px-8 py-4 shrink-0">
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight hidden md:block">Administration</h2>
          <div className="flex items-center gap-6 ml-auto">
            <div className="hidden md:flex items-center h-10 w-64 rounded-xl neu-input px-3 gap-2">
              <span className="material-symbols-outlined text-slate-400 text-[20px]">search</span>
              <input className="bg-transparent border-none focus:ring-0 text-sm w-full text-slate-600 placeholder:text-slate-400 p-0 h-full" placeholder="Rechercher..." type="text" />
            </div>
            <button type="button" className="neu-btn size-10 flex items-center justify-center rounded-xl text-slate-600 relative">
              <span className="material-symbols-outlined text-[22px]">notifications</span>
            </button>
            <div className="flex items-center gap-3 pl-2">
              <div className="w-10 h-10 rounded-full neu-card p-0.5 overflow-hidden flex items-center justify-center">
                <img alt="Profile" className="rounded-full w-full h-full object-cover" src="https://i.pravatar.cc/100?u=admin" />
              </div>
              <div className="hidden lg:flex flex-col">
                <span className="text-sm font-bold text-slate-800">Thomas R.</span>
                <span className="text-xs text-slate-500">Super Admin</span>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-8 pb-8 pt-2">
          <div className="max-w-[1200px] mx-auto flex flex-col gap-8">
            <div className="flex flex-col gap-1">
              <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Administration du Système</h1>
              <p className="text-slate-500">Gérez vos utilisateurs, contenus et paramètres globaux.</p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
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
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function AdminNavLink({ to, icon, children }) {
  return (
    <Link className="flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 text-slate-500 hover:text-primary hover:bg-[#e4e9f2]" to={to}>
      <span className="material-symbols-outlined" style={{ fontSize: 24 }}>{icon}</span>
      <span className="text-sm font-semibold">{children}</span>
    </Link>
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
