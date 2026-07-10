import { MVT_PAGE_MAP, DEPRECATED_REACT_REF, ARCHIVE_HTML_REF } from '../reference/mvtPageMap';

export default function ReferencePanel() {
  const dashboardRef = MVT_PAGE_MAP[0];

  return (
    <section className="mx-auto max-w-5xl rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
      <p className="font-bold">Références MVT (pas d&apos;UI inventée)</p>
      <p className="mt-1">
        Page React portée depuis{' '}
        <code className="text-xs">{dashboardRef.primary}</code>
      </p>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-xs">
        <li>
          Contrôleur : <code>{dashboardRef.controller}</code>
        </li>
        <li>
          Charts : <code>{dashboardRef.charts}</code>
        </li>
        <li>
          Archive secondaire : <code>{ARCHIVE_HTML_REF.folder}</code> (HTML seulement)
        </li>
        <li>
          Ancien React Velos Paris : <code>{DEPRECATED_REACT_REF.status}</code>
        </li>
      </ul>
    </section>
  );
}
