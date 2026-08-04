/** Métadonnées colonnes registre bâtiments — labels FR, priorité affichage */

export const COLUMN_GROUPS = {
  primary: 'primary',
  detail: 'detail',
};

const META = {
  numero_dpe: {
    label: 'N° DPE',
    group: COLUMN_GROUPS.primary,
    mono: true,
    dpe: true,
  },
  adresse_brut: {
    label: 'Adresse',
    group: COLUMN_GROUPS.primary,
    strong: true,
    address: true,
  },
  code_postal_ban: {
    label: 'Code postal',
    group: COLUMN_GROUPS.primary,
  },
  date_etablissement_dpe: {
    label: 'Date DPE',
    group: COLUMN_GROUPS.primary,
    date: true,
  },
  classe_etiquette_dpe: {
    label: 'Classe DPE',
    group: COLUMN_GROUPS.primary,
    dpe: true,
  },
  etiquette_dpe: {
    label: 'Étiquette DPE',
    group: COLUMN_GROUPS.primary,
    dpe: true,
  },
  numero_rpls_logement: {
    label: 'N° RPLS',
    group: COLUMN_GROUPS.detail,
    mono: true,
  },
  numero_immatriculation_copropriete: {
    label: 'Immat. copropriété',
    group: COLUMN_GROUPS.detail,
    mono: true,
  },
};

function inferMeta(col) {
  if (/adresse|address/i.test(col)) {
    return { label: formatFallbackLabel(col), group: COLUMN_GROUPS.primary, strong: true, address: true };
  }
  if (/code_postal|postal/i.test(col)) {
    return { label: 'Code postal', group: COLUMN_GROUPS.primary };
  }
  if (/date/i.test(col)) {
    return { label: formatFallbackLabel(col), group: COLUMN_GROUPS.primary, date: true };
  }
  if (/dpe|etiquette|classe/i.test(col)) {
    return { label: formatFallbackLabel(col), group: COLUMN_GROUPS.primary, dpe: true };
  }
  if (/numero|id|rpls|immat/i.test(col)) {
    return { label: formatFallbackLabel(col), group: COLUMN_GROUPS.detail, mono: true };
  }
  return { label: formatFallbackLabel(col), group: COLUMN_GROUPS.detail };
}

function formatFallbackLabel(col) {
  return col.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export function getColumnMeta(col) {
  return META[col] ?? inferMeta(col);
}

export function getColumnLabel(col) {
  return getColumnMeta(col).label;
}

export function partitionColumns(columns) {
  const primary = [];
  const detail = [];
  columns.forEach((col) => {
    const group = getColumnMeta(col).group;
    if (group === COLUMN_GROUPS.primary) primary.push(col);
    else detail.push(col);
  });
  if (primary.length === 0 && columns.length > 0) {
    return { primary: columns.slice(0, Math.min(4, columns.length)), detail: columns.slice(4) };
  }
  return { primary, detail };
}

export function getVisibleTableColumns(columns, showDetail) {
  const { primary, detail } = partitionColumns(columns);
  return showDetail ? [...primary, ...detail] : primary;
}
