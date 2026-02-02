/**
 * Logique du Laboratoire DPE - Version Optimisée 7 Colonnes
 * Gère le chargement du nouveau format de table_financial.json
 */

/**
 * Extrait l'arrondissement à partir du code postal ban
 * @param {string} cp Code postal (ex: 75011)
 * @returns {string|null} l'arrondissement formaté (ex: 11ème)
 */
function formatArrondissement(cp) {
  if (!cp) return null;
  const cpStr = String(cp);
  const match = cpStr.match(/750(\d{2})/);
  if (match) {
    const n = parseInt(match[1]);
    return n === 1 ? '1er' : n + 'ème';
  }
  return cpStr;
}

/**
 * Nettoie l'adresse des métadonnées techniques
 * @param {string} addr Adresse brute
 * @returns {string} Adresse propre
 */
function cleanAddress(addr) {
  if (!addr) return 'Adresse inconnue';
  let cleaned = addr.replace(/^Logt\s*:\s*\d+\s*/i, '');
  cleaned = cleaned.split(/LOGT|LOT|BAT|ESC/i)[0].trim();
  cleaned = cleaned.replace(/,$/, '');
  return cleaned;
}

/**
 * Copie l'adresse dans le presse-papier et affiche une confirmation
 */
async function copyAddress(element, text) {
  try {
    await navigator.clipboard.writeText(text);
    
    // Feedback visuel : on change temporairement l'attribut data-full-address
    const originalText = element.getAttribute('data-full-address');
    element.setAttribute('data-full-address', '✅ Adresse copiée !');
    element.classList.add('copy-success');
    
    setTimeout(() => {
      element.setAttribute('data-full-address', originalText);
      element.classList.remove('copy-success');
    }, 2000);
  } catch (err) {
    console.error('Erreur de copie:', err);
  }
}

async function loadTestDPEData() {
  const tbody = document.getElementById('test-dpe-body');
  tbody.innerHTML = `
        <tr>
            <td colspan="8" style="padding: 2rem; text-align: center; color: var(--text-tertiary);">
                Chargement des données JSON (7 colonnes)...
            </td>
        </tr>
    `;

  try {
    const response = await fetch('/static/data/table_financial.json');
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const rawBody = await response.json();
    const data = rawBody.data;

    tbody.innerHTML = ''; 

    if (!data || data.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" style="padding:1rem; text-align:center;">Aucune donnée trouvée.</td></tr>`;
      return;
    }

    const sampleSize = 250;
    const displayData = data.slice(0, sampleSize);

    displayData.forEach((row, index) => {
      // MAPPING DEPUIS config_data_DPE.json :
      // 0: numero_dpe, 1: adresse_brut, 2: code_postal_ban, 3: etiquette_dpe,
      // 4: surface_habitable_logement, 5: cout_total_5_usages, 6: conso_5_usages_par_m2_ep
      const rawId = row[0];
      const rawAddr = row[1];
      const cp = row[2];
      const dpe = row[3];
      const surface = row[4];
      const cost = row[5];
      const energy = row[6];

      const arrondissement = formatArrondissement(cp);
      const cleanAddr = cleanAddress(rawAddr);

      const tr = document.createElement('tr');
      tr.className = 'fade-in';

      const badgeStyle = getDPEBadgeStyle(dpe);

      tr.innerHTML = `
                <td style="padding: 1rem;">${index + 1}</td>
                <td class="col-id">${rawId}</td>
                <td class="col-adresse" 
                    title="Cliquez pour copier" 
                    data-full-address="${rawAddr}" 
                    onclick="copyAddress(this, '${rawAddr.replace(/'/g, "\\'")}')">
                    <div class="address-wrapper">
                        ${arrondissement ? `<span class="tag-arrondissement">${arrondissement}</span>` : ''}
                        <span class="address-text">${cleanAddr}</span>
                        <i class="copy-icon" style="font-size: 0.8rem; margin-left: 4px; opacity: 0.5;">📋</i>
                    </div>
                </td>
                <td class="col-data-center">${cp || '-'}</td>
                <td class="col-data-center">${surface ? surface.toFixed(1) + ' m²' : '-'}</td>
                <td class="col-data-center"><span style="${badgeStyle}">${dpe || '?'}</span></td>
                <td class="col-cost">${cost ? Math.round(cost).toLocaleString() + ' €' : '-'}</td>
                <td class="col-energy">
                    <span style="font-weight: 700; color: #1e293b;">${energy ? energy.toFixed(0) : '-'}</span>
                    <br><small style="font-size: 0.65rem; color: #64748b; font-style: italic;">kWh/m²</small>
                </td>
            `;
      tbody.appendChild(tr);
    });

    console.log(
      `[LABORATOIRE] Affichage réussi de ${displayData.length} lignes avec la nouvelle colonne CP.`,
    );
  } catch (error) {
    console.error('Erreur:', error);
    tbody.innerHTML = `<tr><td colspan="7" style="padding: 2rem; text-align: center; color: #e74c3c;">Erreur : ${error.message}</td></tr>`;
  }
}

function getDPEBadgeStyle(grade) {
  const colors = {
    A: '#009688',
    B: '#4CAF50',
    C: '#8BC34A',
    D: '#FFC107',
    E: '#FF9800',
    F: '#F39C12',
    G: '#E74C3C',
  };
  const g = grade ? grade.toUpperCase() : 'N';
  return `background-color: ${colors[g] || '#bdc3c7'}; color: white; padding: 4px 10px; border-radius: 4px; font-weight: bold; font-size: 0.8rem; display: inline-block; min-width: 25px; text-align: center;`;
}

function clearTestDPEData() {
  document.getElementById('test-dpe-body').innerHTML =
    '<tr><td colspan="7" style="padding: 2rem; text-align: center; color: var(--text-tertiary);">Zone nettoyée.</td></tr>';
}

setTimeout(loadTestDPEData, 300);
