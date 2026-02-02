/**
 * MODULE: DASHBOARD TABLE LOGIC
 * Role: Gère l'affichage, le filtrage et les interactions du tableau financier.
 * Namespace: RT_Module
 */

const RT_Module = {
    allData: [],
    displayLimit: 250,
    containerId: 'rt-table-container',
    tbodyId: 'rt-table-body',
    filterId: 'rt-filter-arrondissement',

    /**
     * Initialise le module
     */
    async init() {
        console.log('[RT_Module] Initialisation...');
        await this.loadData();
    },

    /**
     * Charge les données depuis le JSON
     */
    async loadData() {
        try {
            const response = await fetch('/static/data/table_financial.json');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const json = await response.json();
            this.allData = json.data || [];

            this.populateFilter();
            this.render();
        } catch (error) {
            console.error('[RT_Module] Erreur chargement:', error);
            const tbody = document.getElementById(this.tbodyId);
            if (tbody) tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:2rem; color:#ef4444;">Erreur de chargement des données.</td></tr>`;
        }
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

        const names = this.allData
            .map(row => this.formatArr(row[2]))
            .filter(name => name && (name.includes('è') || name.includes('er')));

        const uniqueNames = [...new Set(names)].sort((a, b) => parseInt(a) - parseInt(b));

        select.innerHTML = '<option value="">Tous les arrondissements</option>';
        uniqueNames.forEach(name => {
            const opt = document.createElement('option');
            opt.value = name;
            opt.textContent = name;
            select.appendChild(opt);
        });

        select.addEventListener('change', () => this.render());
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
        const colors = { A:'#009688', B:'#4CAF50', C:'#8BC34A', D:'#FFC107', E:'#FF9800', F:'#F39C12', G:'#E74C3C' };
        return `background-color: ${colors[grade?.toUpperCase()] || '#bdc3c7'};`;
    },

    /**
     * Affiche les données dans le tableau
     */
    render() {
        const tbody = document.getElementById(this.tbodyId);
        const filterVal = document.getElementById(this.filterId)?.value;
        if (!tbody) return;

        let filtered = this.allData;
        if (filterVal) {
            filtered = this.allData.filter(row => this.formatArr(row[2]) === filterVal);
        }

        const items = filtered.slice(0, this.displayLimit);
        tbody.innerHTML = '';

        if (items.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; padding:2rem;">Aucun bâtiment trouvé.</td></tr>';
            return;
        }

        items.forEach((row, idx) => {
            const [id, rawAddr, cp, dpe, surf, cost, energy] = row;
            const arrName = this.formatArr(cp);
            const cleanAddr = rawAddr.replace(/^Logt\s*:\s*\d+\s*/i, '').split(/LOGT|LOT|BAT|ESC/i)[0].trim().replace(/,$/, '');

            const tr = document.createElement('tr');
            tr.className = 'rt-row fade-in';
            tr.innerHTML = `
                <td class="rt-cell rt-cell-index">${idx + 1}</td>
                <td class="rt-cell rt-cell-id">${id}</td>
                <td class="rt-cell rt-col-address" data-full-address="${rawAddr}">
                    <div class="rt-address-wrapper">
                        ${arrName ? `<span class="rt-tag">${arrName}</span>` : ''}
                        <span class="rt-address-text">${cleanAddr}</span>
                        <i class="rt-copy-icon">📋</i>
                    </div>
                </td>
                <td class="rt-cell rt-cell-center">${cp || '-'}</td>
                <td class="rt-cell rt-cell-center">${surf ? surf.toFixed(1) + ' m²' : '-'}</td>
                <td class="rt-cell rt-cell-center">
                    <span class="rt-dpe-badge" style="${this.getDpeStyle(dpe)}">${dpe || '?'}</span>
                </td>
                <td class="rt-cell rt-cell-cost rt-cell-center">${cost ? Math.round(cost).toLocaleString() + ' €' : '-'}</td>
                <td class="rt-cell rt-cell-right">
                    <span class="rt-cell-bold">${energy ? energy.toFixed(0) : '-'}</span>
                    <br><small style="font-size:0.65rem; color:#64748b; font-style:italic;">kWh/m²</small>
                </td>
            `;

            // Ajout de l'event click pour la copie
            const addrCell = tr.querySelector('.rt-col-address');
            addrCell.onclick = () => this.copyAddress(addrCell, rawAddr);

            tbody.appendChild(tr);
        });
    }
};

// Exportation globale pour accès depuis le HTML si besoin
window.initDashboardTable = () => RT_Module.init();
