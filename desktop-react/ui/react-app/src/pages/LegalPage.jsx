import { useParams } from 'react-router-dom';
import PublicLayout from '../layouts/PublicLayout';
import { legalContent } from '../i18n/legalContent';

/**
 * Page Légale Centralisée (< 25 lignes)
 */
export default function LegalPage({ docType }) {
  const params = useParams();
  const key = docType || params.type || 'mentions';
  const doc = legalContent[key]?.fr || legalContent.mentions.fr;

  return (
    <PublicLayout>
      <main className="legal-page-container max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">{doc.title}</h1>
        <p className="text-sm text-slate-400 mb-8">{doc.updated}</p>
        <article className="prose prose-slate max-w-none space-y-6">
          {doc.sections.map((sec, idx) => (
            <div key={idx} className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
              <h2 className="text-lg font-bold text-slate-800 mb-2">{sec.heading}</h2>
              {sec.body && <p className="text-slate-600 leading-relaxed whitespace-pre-line">{sec.body}</p>}
              {sec.list && (
                <ul className="list-disc pl-5 space-y-1 text-slate-600">
                  {sec.list.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </article>
      </main>
    </PublicLayout>
  );
}
