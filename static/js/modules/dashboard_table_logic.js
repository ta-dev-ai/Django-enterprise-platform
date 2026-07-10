/**
 * MODULE: DASHBOARD TABLE LOGIC
 * Role: Gère l'affichage, le filtrage et les interactions du tableau financier.
 * Namespace: RT_Module
 */

const RT_Module = {
  allData: [],
  columns: [],
  displayLimit: 250,
  containerId: 'rt-table-container',
  tbodyId: 'rt-table-body',
  filterId: 'rt-filter-arrondissement',
  dataUrl: '/api/dashboard/table_financial/', // Source par défaut (API)

  /**
   * Initialise le module
   * @param {string} customUrl - Optionnel: URL spécifique pour les données
   */
  async init(customUrl = null) {
    if (customUrl) this.dataUrl = customUrl;
    console.log(`[RT_Module] Initialisation avec ${this.dataUrl}...`);
    await this.loadData();
  },

  /**
   * Charge les données depuis le JSON
   */
  async loadData() {
    const tbody = document.getElementById(this.tbodyId);
    if (tbody) {
      tbody.innerHTML = `
            <tr>
                <td colspan="10">
                    <div class="rt-loading-wrapper">
                        <div class="rt-spinner"></div>
                        <div class="rt-loading-text">Analyse des données en cours...</div>
                    </div>
                </td>
            </tr>
        `;
    }

    try {
      const response = await fetch(this.dataUrl);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const json = await response.json();
      this.allData = json.data || [];
      this.columns = json.meta?.columns || [];

      this.updateTableHeaders();
      this.populateFilter();
      this.render();
    } catch (error) {
      console.error('[RT_Module] Erreur chargement:', error);
      if (tbody)
        tbody.innerHTML = `<tr><td colspan="10" style="text-align:center; padding:2rem; color:#ef4444;">Erreur de chargement.</td></tr>`;
    }
  },

  /**
   * Met à jour les en-têtes du tableau selon les colonnes reçues
   */
  updateTableHeaders() {
    const thead = document.querySelector(`#${this.containerId} .rt-thead tr`);
    if (!thead || !this.columns.length) return;

    const labels = {
      numero_dpe: 'ID DPE',
      adresse_brut: 'ADRESSE',
      code_postal_ban: 'CP',
      etiquette_dpe: 'DPE',
      surface_habitable_logement: 'SURFACE',
      cout_total_5_usages: 'COÛT EST.',
      conso_5_usages_par_m2_ep: 'CONSO EP',
      annee_construction: 'ANNÉE',
      type_batiment: 'TYPE',
      numero_rpls_logement: 'RPLS',
      numero_immatriculation_copropriete: 'IMMAT.',
      date_etablissement_dpe: 'DATE',
      qualite_isolation_murs: 'ISO. MURS',
      qualite_isolation_menuiseries: 'ISO. VITRES',
      type_ventilation: 'VENTILATION',
    };

    let html = '<th>#</th>';
    this.columns.forEach((col) => {
      html += `<th>${labels[col] || col.toUpperCase()}</th>`;
    });
    thead.innerHTML = html;
  },

  /**
   * Formate le nom de l'arrondissement
   */
  formatArr(cp) {
    if (!cp) return null;
    const cpStr = String(cp);
    const match = cpStr.match(/^75\d?(\d{2})$/);
    if (match) {
      const n = parseInt(match[1]);
      if (n > 0 && n <= 20) return n === 1 ? '1er' : n + 'ème';
    }
    return cpStr;
  },

  /**
   * Remplit le menu déroulant des arrondissements
   */
  populateFilter() {
    const select = document.getElementById(this.filterId);
    if (!select) return;

    const cpIndex = this.columns.indexOf('code_postal_ban');
    if (cpIndex === -1) return;

    const names = this.allData
      .map((row) => this.formatArr(row[cpIndex]))
      .filter((name) => name && (name.includes('è') || name.includes('er')));

    const uniqueNames = [...new Set(names)].sort((a, b) => parseInt(a) - parseInt(b));

    select.innerHTML = '<option value="">Tous les arrondissements</option>';
    uniqueNames.forEach((name) => {
      const opt = document.createElement('option');
      opt.value = name;
      opt.textContent = name;
      select.appendChild(opt);
    });

    select.removeEventListener('change', this._handleFilterChange);
    this._handleFilterChange = () => this.render();
    select.addEventListener('change', this._handleFilterChange);
  },

  /**
   * Copie l'adresse dans le presse-papier
   */
  async copyAddress(element, text) {
    try {
      await navigator.clipboard.writeText(text);
      const original = element.getAttribute('data-full-address');
      element.setAttribute('data-full-address', '✅ Adresse copiée !');
      element.classList.add('rt-copy-success');

      setTimeout(() => {
        element.setAttribute('data-full-address', original);
        element.classList.remove('rt-copy-success');
      }, 2000);
    } catch (err) {
      console.error('[RT_Module] Erreur copie:', err);
    }
  },

  /**
   * Génère le style du badge DPE
   */
  getDpeStyle(grade) {
    const colors = {
      A: '#009688',
      B: '#4CAF50',
      C: '#8BC34A',
      D: '#FFC107',
      E: '#FF9800',
      F: '#F39C12',
      G: '#E74C3C',
    };
    return `background-color: ${colors[grade?.toUpperCase()] || '#bdc3c7'};`;
  },

  /**
   * Affiche les données dans le tableau
   */
  render() {
    const tbody = document.getElementById(this.tbodyId);
    const filterVal = document.getElementById(this.filterId)?.value;
    if (!tbody || !this.columns.length) return;

    const cpIndex = this.columns.indexOf('code_postal_ban');
    const addrIndex = this.columns.indexOf('adresse_brut');

    let filtered = this.allData;
    if (filterVal && cpIndex !== -1) {
      filtered = this.allData.filter((row) => this.formatArr(row[cpIndex]) === filterVal);
    }

    const items = filtered.slice(0, this.displayLimit);
    tbody.innerHTML = '';

    if (items.length === 0) {
      tbody.innerHTML = `<tr><td colspan="${this.columns.length + 1}" style="text-align:center; padding:2rem;">Aucun résultat trouvé.</td></tr>`;
      return;
    }

    items.forEach((row, idx) => {
      const tr = document.createElement('tr');
      tr.className = 'rt-row fade-in';

      let cellsHtml = `<td class="rt-cell rt-cell-index">${idx + 1}</td>`;

      this.columns.forEach((colName, colIdx) => {
        const val = row[colIdx];
        let content = val || '-';
        let cellClass = 'rt-cell';

        // Format Spécifique par colonne
        if (colName === 'adresse_brut') {
          const arrName = cpIndex !== -1 ? this.formatArr(row[cpIndex]) : null;
          const cleanAddr = String(val)
            .replace(/^Logt\s*:\s*\d+\s*/i, '')
            .split(/LOGT|LOT|BAT|ESC/i)[0]
            .trim()
            .replace(/,$/, '');
          cellClass = 'rt-cell rt-col-address';
          content = `
                <div class="rt-address-wrapper">
                    ${arrName ? `<span class="rt-tag">${arrName}</span>` : ''}
                    <span class="rt-address-text">${cleanAddr}</span>
                    <i class="rt-copy-icon">📋</i>
                </div>
            `;
          tr.setAttribute('data-full-address', val);
        } else if (colName === 'etiquette_dpe') {
          cellClass = 'rt-cell rt-cell-center';
          content = `<span class="rt-dpe-badge" style="${this.getDpeStyle(val)}">${val || '?'}</span>`;
        } else if (colName === 'surface_habitable_logement') {
          cellClass = 'rt-cell rt-cell-center';
          content = val && !isNaN(parseFloat(val)) ? parseFloat(val).toFixed(1) + ' m²' : '-';
        } else if (colName === 'cout_total_5_usages') {
          cellClass = 'rt-cell rt-cell-center rt-cell-cost';
          content =
            val && !isNaN(parseFloat(val))
              ? Math.round(parseFloat(val)).toLocaleString() + ' €'
              : '-';
        } else if (colName === 'conso_5_usages_par_m2_ep') {
          cellClass = 'rt-cell rt-cell-right';
          content = `<span class="rt-cell-bold">${val && !isNaN(parseFloat(val)) ? parseFloat(val).toFixed(0) : '-'}</span><br><small style="font-size:0.65rem; color:#64748b; font-style:italic;">kWh/m²</small>`;
        } else {
          cellClass = 'rt-cell rt-cell-center';
        }

        cellsHtml += `<td class="${cellClass}">${content}</td>`;
      });

      tr.innerHTML = cellsHtml;

      // Click pour copier l'adresse
      if (addrIndex !== -1) {
        const addrCell = tr.querySelector('.rt-col-address');
        if (addrCell) addrCell.onclick = () => this.copyAddress(addrCell, row[addrIndex]);
      }

      tbody.appendChild(tr);
    });
  },
};

// Exportation globale pour accès depuis le HTML si besoin
window.initDashboardTable = (url) => RT_Module.init(url);
