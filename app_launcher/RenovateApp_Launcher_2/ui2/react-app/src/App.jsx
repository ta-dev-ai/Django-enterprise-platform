import ParityStatus from './components/ParityStatus';

function App() {
  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10">
      <header className="mx-auto mb-8 max-w-4xl text-center">
        <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
          Django Enterprise Platform
        </p>
        <h1 className="mt-2 text-3xl font-extrabold text-slate-900">
          React V2 — Zone isolée
        </h1>
        <p className="mt-2 text-slate-600">
          Migration progressive. Le dashboard production reste sur Django MVT (:8000).
        </p>
      </header>

      <ParityStatus />
    </div>
  );
}

export default App;
