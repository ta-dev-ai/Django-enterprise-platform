/**
 * Logique du Laboratoire DPE
 * Gère le chargement et le filtrage des données financières réelles.
 */

async function loadTestDPEData() {
  const tbody = document.getElementById('test-dpe-body');
  tbody.innerHTML = `
        <tr>
            <td colspan="6" style="padding: 2rem; text-align: center; color: var(--text-tertiary);">
                Chargement des données JSON (49MB)...
            </td>
        </tr>
    `;

  try {
    const response = await fetch('/static/data/table_financial.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const rawBody = await response.json();
    const data = rawBody.data;

    tbody.innerHTML = ''; // Nettoyage

    if (!data || data.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="padding:1rem; text-align:center;">Aucune donnée trouvée.</td></tr>`;
      return;
    }

    // On affiche un échantillon (ex: 200 premières lignes) pour éviter de figer le navigateur
    const sampleSize = 200;
    const displayData = data.slice(0, sampleSize);

    displayData.forEach((rowArray) => {
      // Mapping indexé basé sur meta.columns reconnus:
      // ["numero_dpe","adresse_brut","etiquette_dpe","surface_habitable_logement","cout_total_5_usages","conso_5_usages_par_m2_ep"]
      const item = {
        id: rowArray[0],
        adresse: rowArray[1],
        dpe: rowArray[2],
        surface: rowArray[3],
        cout: rowArray[4],
        conso: rowArray[5],
      };

      const tr = document.createElement('tr');
      tr.className = 'fade-in';

      const badgeStyle = getDPEBadgeStyle(item.dpe);

      tr.innerHTML = `
                <td style="padding: 1rem; font-family: monospace; font-size: 0.8rem; color: var(--text-secondary);">${
                  item.id
                }</td>
                <td style="padding: 1rem;">${
                  item.adresse || 'Adresse inconnue'
                }</td>
                <td style="padding: 1rem; text-align: center;">${
                  item.surface ? item.surface.toFixed(1) + ' m²' : '-'
                }</td>
                <td style="padding: 1rem; text-align: center;"><span style="${badgeStyle}">${
        item.dpe || '?'
      }</span></td>
                <td style="padding: 1rem; font-weight: 600; color: #2ecc71;">${
                  item.cout ? Math.round(item.cout).toLocaleString() + ' €' : '-'
                }</td>
                <td style="padding: 1rem; font-style: italic; color: var(--text-tertiary);">${
                  item.conso ? item.conso.toFixed(0) : '-'
                } <small>kWh/m²</small></td>
            `;
      tbody.appendChild(tr);
    });

    console.log(
      `[LABORATOIRE] Affichage de ${displayData.length} / ${data.length} lignes.`
    );
  } catch (error) {
    console.error('Erreur chargement données:', error);
    tbody.innerHTML = `
            <tr>
                <td colspan="6" style="padding: 2rem; text-align: center; color: #F44336;">
                    Erreur de chargement: ${error.message}<br>
                    <small>Vérifiez que le fichier /static/data/table_financial.json est accessible.</small>
                </td>
            </tr>
        `;
  }
}

function getDPEBadgeStyle(grade) {
  const colors = {
    A: '#009688',
    B: '#4CAF50',
    C: '#8BC34A',
    D: '#FFC107',
    E: '#FF9800',
    F: '#FF5722',
    G: '#F44336',
  };
  const g = grade ? grade.toUpperCase() : 'N';
  return `background-color: ${
    colors[g] || '#9E9E9E'
  }; color: white; padding: 4px 10px; border-radius: 4px; font-weight: bold; font-size: 0.85rem; display: inline-block; min-width: 25px; text-align: center;`;
}

function clearTestDPEData() {
  document.getElementById('test-dpe-body').innerHTML = `
        <tr>
            <td colspan="6" style="padding: 2rem; text-align: center; color: var(--text-tertiary);">
                Zone nettoyée. Cliquez sur "Recharger" pour relancer le test.
            </td>
        </tr>
    `;
}

// Auto-chargement au démarrage
document.addEventListener('DOMContentLoaded', () => {
  // Optionnel: on peut attendre un peu ou charger direct
  // loadTestDPEData();
});
