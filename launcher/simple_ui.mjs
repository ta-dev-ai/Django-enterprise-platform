/**
 * =====================================================================
 * RENOVATE ENERGY - MICROSOFT ENTERPRISE UX CONTROLLER (MJS)
 * =====================================================================
 * Moteur client asynchrone pour la supervision et le pilotage temps réel
 * des micro-services (Django MVT Core & React Modern SPA).
 * =====================================================================
 */

const API_BASE = window.location.origin;

// DOM Elements
const pillDjango = document.getElementById("pill-django");
const pillReact = document.getElementById("pill-react");
const pillBuild = document.getElementById("pill-build");
const pillNode = document.getElementById("pill-node");

const djangoStatusLabel = document.getElementById("django-status-label");
const reactDeployLabel = document.getElementById("react-deploy-label");
const terminalScreen = document.getElementById("terminal-screen");
const toastContainer = document.getElementById("toast-container");

// Buttons
const btnStartDjango = document.getElementById("btn-start-django");
const btnOpenDjango = document.getElementById("btn-open-django");
const btnStopDjango = document.getElementById("btn-stop-django");

const btnStartReactDev = document.getElementById("btn-start-react-dev");
const btnBuildReact = document.getElementById("btn-build-react");
const btnStartReactPreview = document.getElementById("btn-start-react-preview");
const btnStopReact = document.getElementById("btn-stop-react");

const btnRefreshStatus = document.getElementById("btn-refresh-status");
const btnCopyLogs = document.getElementById("btn-copy-logs");
const btnClearLogs = document.getElementById("btn-clear-logs");

let currentPorts = {
    django: 8000,
    react: 5174,
};

/**
 * Affiche une notification toast temporaire.
 */
function showToast(message, type = "info") {
    if (!toastContainer) return;
    const toast = document.createElement("div");
    toast.className = "toast";
    
    let icon = "ℹ️";
    if (type === "success") icon = "✅";
    if (type === "warning") icon = "⚠️";
    if (type === "error") icon = "❌";

    toast.innerHTML = `<span>${icon}</span> <span>${escapeHtml(message)}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateX(100%)";
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

/**
 * Journalise un message dans le terminal système.
 */
function logEntry(text, level = "info") {
    if (!terminalScreen) return;
    const timeStr = new Date().toLocaleTimeString("fr-FR", { hour12: false });
    const row = document.createElement("div");
    row.className = `log-row log-${level}`;
    row.innerHTML = `<span class="log-time-tag">[${timeStr}]</span> ${escapeHtml(text)}`;
    terminalScreen.appendChild(row);
    terminalScreen.scrollTop = terminalScreen.scrollHeight;
}

function escapeHtml(str) {
    return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/**
 * Appelle l'API REST du lanceur Python.
 */
async function fetchEndpoint(endpoint, method = "GET", payload = null) {
    try {
        const config = {
            method,
            headers: { "Content-Type": "application/json" },
        };
        if (payload) {
            config.body = JSON.stringify(payload);
        }
        const resp = await fetch(`${API_BASE}${endpoint}`, config);
        if (!resp.ok) {
            throw new Error(`HTTP ${resp.status}: ${resp.statusText}`);
        }
        return await resp.json();
    } catch (err) {
        logEntry(`Erreur API (${endpoint}) : ${err.message}`, "error");
        return null;
    }
}

/**
 * Ouvre une URL dans le navigateur système.
 */
async function openBrowserUrl(url) {
    logEntry(`🌐 Navigation vers ${url}...`, "info");
    const result = await fetchEndpoint("/api/open-url", "POST", { url });
    if (result && result.success) {
        showToast(`Navigateur ouvert sur ${url}`, "success");
    }
}

/**
 * Actualise l'état visuel de tous les services et dépendances.
 */
async function updateSystemState() {
    const data = await fetchEndpoint("/api/status");
    if (!data) return;

    currentPorts.django = data.django_port || 8000;
    currentPorts.react = data.react_port || 5174;

    // Django Status
    if (data.django) {
        pillDjango.className = "status-pill online";
        pillDjango.querySelector("span:last-child").textContent = `Django Core (:8000) • En Ligne`;
        djangoStatusLabel.innerHTML = `Statut : <span style="color: #34d399; font-weight:600;">En Ligne</span> (:8000)`;
        btnOpenDjango.disabled = false;
        btnStopDjango.disabled = false;
    } else {
        pillDjango.className = "status-pill offline";
        pillDjango.querySelector("span:last-child").textContent = `Django Core (:8000) • Arrêté`;
        djangoStatusLabel.innerHTML = `Statut : <span style="color: #fb7185;">Arrêté</span>`;
        btnOpenDjango.disabled = true;
        btnStopDjango.disabled = true;
    }

    // React Status
    if (data.react_dev || data.react_preview) {
        const mode = data.react_dev ? "Mode Dev (HMR)" : "Mode Preview Prod";
        pillReact.className = "status-pill online";
        pillReact.querySelector("span:last-child").textContent = `React (:5174) • ${mode}`;
        btnStopReact.disabled = false;
    } else {
        pillReact.className = "status-pill offline";
        pillReact.querySelector("span:last-child").textContent = `React (:5174) • Inactif`;
        btnStopReact.disabled = true;
    }

    // Build Production
    if (data.deploy_info && data.deploy_info.exists) {
        pillBuild.className = "status-pill ready";
        pillBuild.querySelector("span:last-child").textContent = `Build : ${data.deploy_info.date}`;
        reactDeployLabel.innerHTML = `Dernier Build : <span style="color: #38bdf8; font-weight:600;">${data.deploy_info.date}</span>`;
        btnStartReactPreview.disabled = false;
    } else {
        pillBuild.className = "status-pill offline";
        pillBuild.querySelector("span:last-child").textContent = `Aucun build dist/`;
        reactDeployLabel.innerHTML = `Build : <span style="color: #94a3b8;">Aucun bundle trouvé</span>`;
        btnStartReactPreview.disabled = true;
    }

    // Node.js
    if (data.node) {
        pillNode.className = "status-pill ready";
        pillNode.querySelector("span:last-child").textContent = `Node.js Runtime • Actif`;
    } else {
        pillNode.className = "status-pill offline";
        pillNode.querySelector("span:last-child").textContent = `Node.js non détecté`;
    }
}

/**
 * Démarre Django et navigue vers le dashboard.
 */
async function onStartDjango() {
    logEntry("🚀 Initialisation du service Django Web MVT...", "info");
    btnStartDjango.disabled = true;

    const res = await fetchEndpoint("/api/start-django", "POST");
    if (res && res.success) {
        showToast("Démarrage de Django en cours...", "info");
        logEntry(res.message || "Serveur Django démarré.", "success");

        let checks = 0;
        const timer = setInterval(async () => {
            checks++;
            await updateSystemState();
            const status = await fetchEndpoint("/api/status");
            if (status && status.django) {
                clearInterval(timer);
                btnStartDjango.disabled = false;
                showToast("Django Web MVT est en ligne !", "success");
                logEntry("✅ Django est opérationnel. Ouverture du Web MVT...", "success");
                await openBrowserUrl(`http://127.0.0.1:${currentPorts.django}/dashboard/`);
            } else if (checks > 25) {
                clearInterval(timer);
                btnStartDjango.disabled = false;
                showToast("Délai de démarrage dépassé pour Django", "warning");
            }
        }, 500);
    } else {
        btnStartDjango.disabled = false;
        showToast("Échec du démarrage de Django", "error");
    }
}

/**
 * Arrête Django.
 */
async function onStopDjango() {
    logEntry("🛑 Demande d'arrêt du backend Django...", "info");
    const res = await fetchEndpoint("/api/stop-django", "POST");
    if (res && res.success) {
        showToast("Serveur Django arrêté", "info");
        logEntry("Serveur Django arrêté.", "warning");
        await updateSystemState();
    }
}

/**
 * Démarre React en mode Dev HMR.
 */
async function onStartReactDev() {
    logEntry("⚡ Démarrage du serveur React Vite (Hot Module Replacement)...", "info");
    btnStartReactDev.disabled = true;

    const res = await fetchEndpoint("/api/start-react-dev", "POST");
    if (res && res.success) {
        showToast("Démarrage du serveur React Dev...", "info");
        let checks = 0;
        const timer = setInterval(async () => {
            checks++;
            await updateSystemState();
            const status = await fetchEndpoint("/api/status");
            if (status && status.react_dev) {
                clearInterval(timer);
                btnStartReactDev.disabled = false;
                showToast("React Dev HMR est prêt !", "success");
                logEntry(`✅ React Dev actif sur http://127.0.0.1:${currentPorts.react}/`, "success");
                await openBrowserUrl(`http://127.0.0.1:${currentPorts.react}/`);
            } else if (checks > 20) {
                clearInterval(timer);
                btnStartReactDev.disabled = false;
                showToast("Délai dépassé pour React Dev", "warning");
            }
        }, 500);
    } else {
        btnStartReactDev.disabled = false;
        showToast("Échec du lancement React Dev", "error");
    }
}

/**
 * Compile le bundle React Vite de production.
 */
async function onBuildReact() {
    logEntry("📦 Compilation du bundle de production React (Vite Build)...", "info");
    btnBuildReact.disabled = true;
    showToast("Compilation en cours...", "info");

    const res = await fetchEndpoint("/api/build-react", "POST");
    btnBuildReact.disabled = false;

    if (res && res.success) {
        showToast("Build React terminé avec succès !", "success");
        logEntry(`✅ Compilation réussie ! Date: ${res.date || ""}`, "success");
        await updateSystemState();
    } else {
        showToast("Erreur lors de la compilation", "error");
        logEntry(`❌ ${res?.message || "Erreur de compilation."}`, "error");
    }
}

/**
 * Lance la version preview statique.
 */
async function onStartReactPreview() {
    logEntry("🚀 Lancement du serveur Preview pour le bundle compilé...", "info");
    const res = await fetchEndpoint("/api/start-react-preview", "POST");
    if (res && res.success) {
        showToast("Serveur Preview démarré", "success");
        await updateSystemState();
        await openBrowserUrl(`http://127.0.0.1:${currentPorts.react}/`);
    } else {
        showToast("Impossible de lancer la preview", "error");
    }
}

/**
 * Arrête tous les serveurs React.
 */
async function onStopReact() {
    logEntry("🛑 Arrêt des services React...", "info");
    const res = await fetchEndpoint("/api/stop-react", "POST");
    if (res && res.success) {
        showToast("Services React arrêtés", "info");
        logEntry("React a été arrêté avec succès.", "warning");
        await updateSystemState();
    }
}

// Event Listeners
btnStartDjango.addEventListener("click", onStartDjango);
btnOpenDjango.addEventListener("click", () => openBrowserUrl(`http://127.0.0.1:${currentPorts.django}/dashboard/`));
btnStopDjango.addEventListener("click", onStopDjango);

btnStartReactDev.addEventListener("click", onStartReactDev);
btnBuildReact.addEventListener("click", onBuildReact);
btnStartReactPreview.addEventListener("click", onStartReactPreview);
btnStopReact.addEventListener("click", onStopReact);

btnRefreshStatus.addEventListener("click", async () => {
    logEntry("🔄 Actualisation manuelle de l'état système...", "info");
    showToast("Actualisation des statuts...", "info");
    await updateSystemState();
});

btnCopyLogs.addEventListener("click", () => {
    const text = terminalScreen.innerText;
    navigator.clipboard.writeText(text).then(() => {
        showToast("Logs copiés dans le presse-papier !", "success");
    });
});

btnClearLogs.addEventListener("click", () => {
    terminalScreen.innerHTML = "";
    logEntry("Journal système réinitialisé.", "info");
});

// Boot
logEntry("🌿 Démarrage du Centre de Supervision Renovate Energy...", "info");
updateSystemState().then(() => {
    logEntry("Système prêt et opérationnel.", "success");
});

// Background Heartbeat Polling
setInterval(updateSystemState, 4000);
