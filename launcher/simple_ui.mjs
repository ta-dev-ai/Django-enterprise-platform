/**
 * =====================================================================
 * RENOVATE ENERGY - UNIFIED LAUNCHER CLIENT (MJS)
 * =====================================================================
 * Pilote le backend Django et les deux interfaces frontend (MVT et React)
 * avec retour visuel en temps réel et communication asynchrone fetch().
 * =====================================================================
 */

const API_BASE = window.location.origin;

// Éléments DOM
const chipDjango = document.getElementById("chip-django");
const chipReact = document.getElementById("chip-react");
const chipBuild = document.getElementById("chip-build");
const chipNode = document.getElementById("chip-node");

const djangoStatusText = document.getElementById("django-status-text");
const reactBuildInfo = document.getElementById("react-build-info");
const logsConsole = document.getElementById("logs-console");

// Boutons
const btnStartDjango = document.getElementById("btn-start-django");
const btnOpenDjango = document.getElementById("btn-open-django");
const btnStopDjango = document.getElementById("btn-stop-django");

const btnStartReactDev = document.getElementById("btn-start-react-dev");
const btnBuildReact = document.getElementById("btn-build-react");
const btnStartReactPreview = document.getElementById("btn-start-react-preview");
const btnStopReact = document.getElementById("btn-stop-react");

const btnRefreshStatus = document.getElementById("btn-refresh-status");
const btnClearLogs = document.getElementById("btn-clear-logs");

let currentConfig = {
    django_port: 8000,
    react_port: 5174,
};

/**
 * Journalise un message dans la console avec horodatage et niveau.
 */
function logMessage(text, level = "info") {
    if (!logsConsole) return;
    const timeStr = new Date().toLocaleTimeString("fr-FR", { hour12: false });
    const entry = document.createElement("div");
    entry.className = `log-entry log-${level}`;
    entry.innerHTML = `<span class="log-time">[${timeStr}]</span> ${escapeHtml(text)}`;
    logsConsole.appendChild(entry);
    logsConsole.scrollTop = logsConsole.scrollHeight;
}

function escapeHtml(str) {
    return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/**
 * Appelle l'API REST du lanceur.
 */
async function callApi(endpoint, method = "GET", data = null) {
    try {
        const options = {
            method,
            headers: { "Content-Type": "application/json" },
        };
        if (data) {
            options.body = JSON.stringify(data);
        }
        const response = await fetch(`${API_BASE}${endpoint}`, options);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        logMessage(`Erreur API (${endpoint}) : ${error.message}`, "error");
        return null;
    }
}

/**
 * Ouvre une URL dans le navigateur via le serveur Python.
 */
async function openUrl(url) {
    logMessage(`Ouverture de l'URL : ${url}`, "info");
    const res = await callApi("/api/open-url", "POST", { url });
    if (res && res.success) {
        logMessage(`Navigateur ouvert avec succès sur ${url}`, "success");
    }
}

/**
 * Met à jour les statuts visuels des services.
 */
async function refreshStatus() {
    const status = await callApi("/api/status");
    if (!status) return;

    currentConfig.django_port = status.django_port || 8000;
    currentConfig.react_port = status.react_port || 5174;

    // Django Status
    if (status.django) {
        chipDjango.className = "status-chip online";
        chipDjango.querySelector("span:last-child").textContent = `Django Backend (:8000) • Actif`;
        djangoStatusText.textContent = "Statut : ✅ En ligne (:8000)";
        btnOpenDjango.disabled = false;
        btnStopDjango.disabled = false;
    } else {
        chipDjango.className = "status-chip offline";
        chipDjango.querySelector("span:last-child").textContent = `Django Backend (:8000) • Arrêté`;
        djangoStatusText.textContent = "Statut : 🛑 Arrêté";
        btnOpenDjango.disabled = true;
        btnStopDjango.disabled = true;
    }

    // React Status
    if (status.react_dev || status.react_preview) {
        const mode = status.react_dev ? "Dev (HMR)" : "Preview Prod";
        chipReact.className = "status-chip online";
        chipReact.querySelector("span:last-child").textContent = `React Frontend (:${status.react_port}) • ${mode}`;
        btnStopReact.disabled = false;
    } else {
        chipReact.className = "status-chip offline";
        chipReact.querySelector("span:last-child").textContent = `React Frontend (:${status.react_port}) • Arrêté`;
        btnStopReact.disabled = true;
    }

    // Build Info
    if (status.deploy_info && status.deploy_info.exists) {
        chipBuild.className = "status-chip ready";
        chipBuild.querySelector("span:last-child").textContent = `Build : ${status.deploy_info.date}`;
        reactBuildInfo.textContent = `Dernier build : ${status.deploy_info.date}`;
        btnStartReactPreview.disabled = false;
    } else {
        chipBuild.className = "status-chip offline";
        chipBuild.querySelector("span:last-child").textContent = `Aucun build dist/`;
        reactBuildInfo.textContent = `Aucun build de production détecté`;
        btnStartReactPreview.disabled = true;
    }

    // Node.js
    if (status.node) {
        chipNode.className = "status-chip ready";
    } else {
        chipNode.className = "status-chip offline";
        chipNode.querySelector("span:last-child").textContent = `Node.js non détecté`;
    }
}

/**
 * Lance Django et ouvre la page d'accueil / dashboard.
 */
async function handleStartDjango() {
    logMessage("🚀 Démarrage de Django Web MVT...", "info");
    btnStartDjango.disabled = true;

    const res = await callApi("/api/start-django", "POST");
    if (res && res.success) {
        logMessage(res.message || "Serveur Django démarré.", "success");
        // Attente active et rafraîchissement
        let attempts = 0;
        const interval = setInterval(async () => {
            attempts++;
            await refreshStatus();
            const status = await callApi("/api/status");
            if (status && status.django) {
                clearInterval(interval);
                btnStartDjango.disabled = false;
                logMessage("✅ Django est opérationnel. Ouverture du Web MVT...", "success");
                await openUrl(`http://127.0.0.1:${currentConfig.django_port}/dashboard/`);
            } else if (attempts > 20) {
                clearInterval(interval);
                btnStartDjango.disabled = false;
                logMessage("⚠️ Délai dépassé pour le démarrage de Django.", "warning");
            }
        }, 600);
    } else {
        btnStartDjango.disabled = false;
        logMessage("❌ Impossible de démarrer Django.", "error");
    }
}

/**
 * Arrête Django.
 */
async function handleStopDjango() {
    logMessage("🛑 Arrêt de Django...", "info");
    const res = await callApi("/api/stop-django", "POST");
    if (res && res.success) {
        logMessage(res.message || "Django a été arrêté.", "success");
        await refreshStatus();
    }
}

/**
 * Lance le serveur React en mode Dev (Vite).
 */
async function handleStartReactDev() {
    // S'assurer que Django tourne car React en a besoin pour son API
    logMessage("⚡ Lancement de React en mode Développement (HMR)...", "info");
    btnStartReactDev.disabled = true;

    const res = await callApi("/api/start-react-dev", "POST");
    if (res && res.success) {
        logMessage(res.message || "Serveur React Dev démarré.", "success");
        let attempts = 0;
        const interval = setInterval(async () => {
            attempts++;
            await refreshStatus();
            const status = await callApi("/api/status");
            if (status && status.react_dev) {
                clearInterval(interval);
                btnStartReactDev.disabled = false;
                logMessage(`✅ React Dev actif sur http://127.0.0.1:${currentConfig.react_port}/`, "success");
                await openUrl(`http://127.0.0.1:${currentConfig.react_port}/`);
            } else if (attempts > 18) {
                clearInterval(interval);
                btnStartReactDev.disabled = false;
                logMessage("⚠️ Délai d'attente de React dépassé.", "warning");
            }
        }, 600);
    } else {
        btnStartReactDev.disabled = false;
        logMessage("❌ Échec du lancement de React Dev.", "error");
    }
}

/**
 * Déclenche la compilation Vite de production (dist/).
 */
async function handleBuildReact() {
    logMessage("📦 Compilation de l'application React (Vite build)...", "info");
    btnBuildReact.disabled = true;

    const res = await callApi("/api/build-react", "POST");
    btnBuildReact.disabled = false;

    if (res && res.success) {
        logMessage(`✅ ${res.message} (${res.date || ""})`, "success");
        await refreshStatus();
    } else {
        logMessage(`❌ ${res?.message || "Erreur pendant la compilation React."}`, "error");
    }
}

/**
 * Lance la preview du build React statique.
 */
async function handleStartReactPreview() {
    logMessage("🚀 Lancement de la version Preview React compilée...", "info");
    const res = await callApi("/api/start-react-preview", "POST");
    if (res && res.success) {
        logMessage("Serveur Preview démarré.", "success");
        await refreshStatus();
        await openUrl(`http://127.0.0.1:${currentConfig.react_port}/`);
    } else {
        logMessage(`❌ ${res?.message || "Impossible de lancer la preview."}`, "error");
    }
}

/**
 * Arrête les serveurs React (Dev ou Preview).
 */
async function handleStopReact() {
    logMessage("🛑 Arrêt des services React...", "info");
    const res = await callApi("/api/stop-react", "POST");
    if (res && res.success) {
        logMessage(res.message || "Services React arrêtés.", "success");
        await refreshStatus();
    }
}

// Initialisation des écouteurs
btnStartDjango.addEventListener("click", handleStartDjango);
btnOpenDjango.addEventListener("click", () => openUrl(`http://127.0.0.1:${currentConfig.django_port}/dashboard/`));
btnStopDjango.addEventListener("click", handleStopDjango);

btnStartReactDev.addEventListener("click", handleStartReactDev);
btnBuildReact.addEventListener("click", handleBuildReact);
btnStartReactPreview.addEventListener("click", handleStartReactPreview);
btnStopReact.addEventListener("click", handleStopReact);

btnRefreshStatus.addEventListener("click", async () => {
    logMessage("🔄 Actualisation manuelle de l'état des services...", "info");
    await refreshStatus();
});

btnClearLogs.addEventListener("click", () => {
    logsConsole.innerHTML = "";
    logMessage("Journal réinitialisé.", "info");
});

// Démarrage initial
logMessage("🌿 Initialisation du Centre de Contrôle Renovate Energy...", "info");
refreshStatus().then(() => {
    logMessage("Système prêt.", "success");
});

// Polling léger toutes les 5 secondes
setInterval(refreshStatus, 5000);
