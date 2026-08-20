/**
 * =====================================================================
 * RENOVATE ENERGY - UNIFIED LAUNCHER CLIENT (MJS)
 * =====================================================================
 * Gère l'orchestration des micro-services, les empreintes de ports,
 * les icônes Lucide SVG embarquées et la hiérarchie intelligente.
 * =====================================================================
 */

const API_BASE = window.location.origin;

// DOM Badges
const badgeDjango = document.getElementById("badge-django");
const badgeReact = document.getElementById("badge-react");
const badgeNode = document.getElementById("badge-node");
const badgeDeploy = document.getElementById("badge-deploy");

// DOM Labels
const djangoPortLabel = document.getElementById("django-port-label");
const reactPortLabel = document.getElementById("react-port-label");
const mvtStateText = document.getElementById("mvt-state-text");
const deployInfoText = document.getElementById("deployInfoText");
const logsBox = document.getElementById("logs");
const toastBox = document.getElementById("toast-box");

// DOM Controls Web MVT
const btnMvtMain = document.getElementById("btn-mvt-main");
const btnMvtMainText = document.getElementById("btn-mvt-main-text");
const mvtStopWrapper = document.getElementById("mvt-stop-wrapper");
const btnStopDjango = document.getElementById("btn-stop-django");

// DOM Controls React
const btnReactDeploy = document.getElementById("btn-react-deploy");
const btnReactDeployText = document.getElementById("btn-react-deploy-text");
const btnReactDev = document.getElementById("btn-react-dev");
const btnReactLaunchPreview = document.getElementById("btn-react-launch-preview");
const btnStopReact = document.getElementById("btn-stop-react");

// Utility Buttons
const btnRefresh = document.getElementById("btn-refresh");
const btnClearLogs = document.getElementById("btn-clear-logs");

let currentPorts = {
    django: 8000,
    react: 5174,
};

let appState = {
    djangoOnline: false,
    reactDevOnline: false,
    reactPreviewOnline: false,
    hasDeploy: false,
    deployDate: null,
};

// Bibliothèque d'icônes SVG Lucide embarquées
const ICONS = {
    rocket: `<svg class="lucide-icon" style="width:18px;height:18px;" viewBox="0 0 24 24"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>`,
    externalLink: `<svg class="lucide-icon" style="width:18px;height:18px;" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/></svg>`,
    check: `<svg class="lucide-icon" style="width:16px;height:16px;" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>`,
    alert: `<svg class="lucide-icon" style="width:16px;height:16px;" viewBox="0 0 24 24"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>`,
    error: `<svg class="lucide-icon" style="width:16px;height:16px;" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="15" x2="9" y1="9" y2="15"/><line x1="9" x2="15" y1="9" y2="15"/></svg>`,
    info: `<svg class="lucide-icon" style="width:16px;height:16px;" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="16" y2="12"/><line x1="12" x2="12.01" y1="8" y2="8"/></svg>`,
    package: `<svg class="lucide-icon" style="width:18px;height:18px;" viewBox="0 0 24 24"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><polyline points="3.29 7 12 12 20.71 7"/><line x1="12" x2="12" y1="22" y2="12"/></svg>`,
    zap: `<svg class="lucide-icon" style="width:16px;height:16px;" viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
};

/**
 * Affiche une notification toast.
 */
function toast(message, type = "info") {
    if (!toastBox) return;
    const item = document.createElement("div");
    item.className = "toast-item";
    
    let iconSvg = ICONS.info;
    if (type === "success") iconSvg = ICONS.check;
    if (type === "warning") iconSvg = ICONS.alert;
    if (type === "error") iconSvg = ICONS.error;

    item.innerHTML = `${iconSvg} <span>${escapeHtml(message)}</span>`;
    toastBox.appendChild(item);

    setTimeout(() => {
        item.style.opacity = "0";
        item.style.transform = "translateY(-15px)";
        setTimeout(() => item.remove(), 300);
    }, 4000);
}

/**
 * Ajoute une ligne dans le journal de démarrage.
 */
function appendLog(message, level = "info") {
    if (!logsBox) return;
    const timeStr = new Date().toLocaleTimeString("fr-FR", { hour12: false });
    const row = document.createElement("div");
    row.className = `log-row log-${level}`;
    row.innerHTML = `<span class="log-time">[${timeStr}]</span> ${escapeHtml(message)}`;
    logsBox.appendChild(row);
    logsBox.scrollTop = logsBox.scrollHeight;
}

function escapeHtml(str) {
    return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/**
 * Requête vers l'API du lanceur.
 */
async function apiCall(path, method = "GET", body = null) {
    try {
        const options = {
            method,
            headers: { "Content-Type": "application/json" },
        };
        if (body) options.body = JSON.stringify(body);
        const res = await fetch(`${API_BASE}${path}`, options);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.json();
    } catch (e) {
        appendLog(`Erreur API (${path}) : ${e.message}`, "err");
        return null;
    }
}

/**
 * Ouvre une URL dans le navigateur via Python.
 */
async function openUrl(url) {
    appendLog(`🌍 Ouverture de l'URL : ${url}`, "info");
    const res = await apiCall("/api/open-url", "POST", { url });
    if (res && res.success) {
        toast(`Navigateur ouvert : ${url}`, "success");
    }
}

/**
 * Met à jour l'ensemble de l'interface graphique selon l'état réel.
 */
async function syncUiState() {
    const status = await apiCall("/api/status");
    if (!status) return;

    currentPorts.django = status.django_port || 8000;
    currentPorts.react = status.react_port || 5174;
    djangoPortLabel.textContent = `Port :${currentPorts.django}`;
    reactPortLabel.textContent = `Port :${currentPorts.react}`;

    appState.djangoOnline = status.django_online;
    appState.reactDevOnline = status.react_dev_online;
    appState.reactPreviewOnline = status.react_preview_online;
    appState.hasDeploy = Boolean(status.deploy_info && status.deploy_info.exists);
    appState.deployDate = status.deploy_info?.date || null;

    // --- 1. ÉTAT DJANGO (WEB MVT) ---
    if (appState.djangoOnline) {
        badgeDjango.className = "badge-pill status-ok";
        badgeDjango.querySelector("span").textContent = `Django :${currentPorts.django} (Actif)`;
        mvtStateText.textContent = `✅ Serveur actif sur http://127.0.0.1:${currentPorts.django}/`;
        
        // Bouton principal devient "Ouvrir" avec icône externalLink
        btnMvtMain.innerHTML = `${ICONS.externalLink} <span id="btn-mvt-main-text">Ouvrir Web MVT</span>`;
        btnMvtMain.title = "Ouvrir l'application dans le navigateur";
        mvtStopWrapper.style.display = "block";
    } else {
        badgeDjango.className = "badge-pill status-off";
        badgeDjango.querySelector("span").textContent = `Django :${currentPorts.django} (Inactif)`;
        mvtStateText.textContent = `Serveur prêt au lancement`;
        
        // Bouton principal devient "Lancer" avec icône rocket
        btnMvtMain.innerHTML = `${ICONS.rocket} <span id="btn-mvt-main-text">Lancer Web MVT</span>`;
        btnMvtMain.title = "Démarrer le serveur Django et ouvrir l'application";
        mvtStopWrapper.style.display = "none";
    }

    // --- 2. ÉTAT REACT ---
    const reactIsRunning = appState.reactDevOnline || appState.reactPreviewOnline;
    if (reactIsRunning) {
        badgeReact.className = "badge-pill status-ok";
        const modeLabel = appState.reactDevOnline ? "Dev HMR" : "Preview";
        badgeReact.querySelector("span").textContent = `React :${currentPorts.react} (${modeLabel})`;
        btnStopReact.style.display = "inline-flex";
    } else {
        badgeReact.className = "badge-pill status-off";
        badgeReact.querySelector("span").textContent = `React :${currentPorts.react} (Inactif)`;
        btnStopReact.style.display = "none";
    }

    // --- 3. ÉTAT DU BUILD / DÉPLOIEMENT ---
    if (appState.hasDeploy) {
        badgeDeploy.className = "badge-pill status-ready";
        badgeDeploy.querySelector("span").textContent = `Build : ${appState.deployDate}`;
        deployInfoText.textContent = `Dernier déploiement : ${appState.deployDate}`;
        btnReactLaunchPreview.disabled = false;
        btnReactLaunchPreview.title = "Lancer la version de production compilée";
    } else {
        badgeDeploy.className = "badge-pill status-off";
        badgeDeploy.querySelector("span").textContent = `Aucun build dist/`;
        deployInfoText.textContent = `Aucun build disponible (Déploiement requis)`;
        btnReactLaunchPreview.disabled = true;
        btnReactLaunchPreview.title = "Veuillez d'abord cliquer sur 'Déployer'";
    }

    // --- 4. ÉTAT NODE ---
    if (status.node_available) {
        badgeNode.className = "badge-pill status-ready";
        badgeNode.querySelector("span").textContent = `Node.js Prêt`;
    } else {
        badgeNode.className = "badge-pill status-off";
        badgeNode.querySelector("span").textContent = `Node.js non trouvé`;
    }
}

/**
 * Action Web MVT : Lance Django s'il est éteint, ou l'ouvre s'il est déjà allumé.
 */
async function handleMvtClick() {
    if (appState.djangoOnline) {
        await openUrl(`http://127.0.0.1:${currentPorts.django}/dashboard/`);
        return;
    }

    appendLog("🚀 Démarrage du serveur Django Web MVT...", "info");
    btnMvtMain.disabled = true;
    btnMvtMain.innerHTML = `${ICONS.rocket} <span id="btn-mvt-main-text">Démarrage en cours...</span>`;
    toast("Initialisation du serveur Django...", "info");

    const res = await apiCall("/api/start-django", "POST");
    if (res && res.success) {
        appendLog(res.message || "Serveur Django initialisé.", "ok");
        
        let attempts = 0;
        const interval = setInterval(async () => {
            attempts++;
            await syncUiState();
            if (appState.djangoOnline) {
                clearInterval(interval);
                btnMvtMain.disabled = false;
                toast("Django est en ligne !", "success");
                appendLog("✅ Django prêt ! Ouverture du navigateur...", "ok");
                await openUrl(`http://127.0.0.1:${currentPorts.django}/dashboard/`);
            } else if (attempts > 25) {
                clearInterval(interval);
                btnMvtMain.disabled = false;
                toast("Délai de démarrage dépassé pour Django", "warning");
                appendLog("⚠️ Django met plus de temps que prévu à répondre.", "warn");
                await syncUiState();
            }
        }, 500);
    } else {
        btnMvtMain.disabled = false;
        toast("Échec du démarrage de Django", "error");
        appendLog("❌ Impossible de démarrer Django.", "err");
        await syncUiState();
    }
}

/**
 * Arrêt de Django.
 */
async function handleStopDjango() {
    appendLog("🛑 Arrêt du serveur Django...", "info");
    const res = await apiCall("/api/stop-django", "POST");
    if (res && res.success) {
        toast("Serveur Django arrêté", "info");
        appendLog("Django a été arrêté.", "warn");
        await syncUiState();
    }
}

/**
 * Action Déployer (Build React).
 */
async function handleReactDeploy() {
    appendLog("📦 Lancement de la compilation React (Vite Build)...", "info");
    btnReactDeploy.disabled = true;
    btnReactDeploy.innerHTML = `${ICONS.package} <span id="btn-react-deploy-text">Compilation...</span>`;
    toast("Compilation Vite en cours...", "info");

    const res = await apiCall("/api/build-react", "POST");
    btnReactDeploy.disabled = false;
    btnReactDeploy.innerHTML = `${ICONS.package} <span id="btn-react-deploy-text">Déployer</span>`;

    if (res && res.success) {
        toast("Déploiement terminé avec succès !", "success");
        appendLog(`✅ Build React terminé avec succès (${res.date || ""})`, "ok");
        await syncUiState();
    } else {
        toast("Erreur lors de la compilation", "error");
        appendLog(`❌ ${res?.message || "Échec du build React."}`, "err");
    }
}

/**
 * Action Mode Dev React (Vite HMR).
 */
async function handleReactDev() {
    if (appState.reactDevOnline) {
        await openUrl(`http://127.0.0.1:${currentPorts.react}/`);
        return;
    }

    appendLog("⚡ Démarrage du serveur React en mode Développement (HMR)...", "info");
    btnReactDev.disabled = true;
    toast("Démarrage de React Dev...", "info");

    const res = await apiCall("/api/start-react-dev", "POST");
    if (res && res.success) {
        appendLog(res.message || "Serveur React Dev démarré.", "ok");
        let attempts = 0;
        const interval = setInterval(async () => {
            attempts++;
            await syncUiState();
            if (appState.reactDevOnline) {
                clearInterval(interval);
                btnReactDev.disabled = false;
                toast("React Dev est prêt !", "success");
                appendLog(`✅ React Dev opérationnel sur http://127.0.0.1:${currentPorts.react}/`, "ok");
                await openUrl(`http://127.0.0.1:${currentPorts.react}/`);
            } else if (attempts > 20) {
                clearInterval(interval);
                btnReactDev.disabled = false;
                toast("Délai d'attente de React dépassé", "warning");
                await syncUiState();
            }
        }, 500);
    } else {
        btnReactDev.disabled = false;
        toast("Échec du lancement React Dev", "error");
        await syncUiState();
    }
}

/**
 * Action Lancer Preview (Build Compilé).
 */
async function handleReactLaunchPreview() {
    appendLog("🚀 Lancement du serveur Preview pour la version compilée...", "info");
    const res = await apiCall("/api/start-react-preview", "POST");
    if (res && res.success) {
        toast("Serveur Preview actif", "success");
        await syncUiState();
        await openUrl(`http://127.0.0.1:${currentPorts.react}/`);
    } else {
        toast(res?.message || "Impossible de lancer la preview", "error");
    }
}

/**
 * Arrêt de React.
 */
async function handleStopReact() {
    appendLog("🛑 Arrêt des serveurs React...", "info");
    const res = await apiCall("/api/stop-react", "POST");
    if (res && res.success) {
        toast("Serveurs React arrêtés", "info");
        appendLog("React arrêté.", "warn");
        await syncUiState();
    }
}

// Initialisation des écouteurs
btnMvtMain.addEventListener("click", handleMvtClick);
btnStopDjango.addEventListener("click", handleStopDjango);

btnReactDeploy.addEventListener("click", handleReactDeploy);
btnReactDev.addEventListener("click", handleReactDev);
btnReactLaunchPreview.addEventListener("click", handleReactLaunchPreview);
btnStopReact.addEventListener("click", handleStopReact);

btnRefresh.addEventListener("click", async () => {
    appendLog("🔄 Actualisation des statuts...", "info");
    toast("Actualisation...", "info");
    await syncUiState();
});

btnClearLogs.addEventListener("click", () => {
    logsBox.innerHTML = "";
    appendLog("Journal réinitialisé.", "info");
});

// Boot
appendLog("🌿 Initialisation du Lanceur Unifié Renovate Energy...", "info");
syncUiState().then(() => {
    appendLog("Système prêt.", "ok");
});

// Heartbeat toutes les 4 secondes
setInterval(syncUiState, 4000);
