/**
 * =====================================================================
 * RENOVATE ENERGY - LAUNCHER MAIN APPLICATION ENTRY POINT (ES6 MODULE)
 * =====================================================================
 * Écouteurs d'événements, workflows d'actions et boucle de contrôle.
 * =====================================================================
 */

import { ICONS } from "./icons.js";
import { toast, appendLog, apiCall, openUrl } from "./api.js";
import { appState, syncUiState } from "./state.js";

// DOM Buttons
const btnMvtMain = document.getElementById("btn-mvt-main");
const btnStopDjango = document.getElementById("btn-stop-django");

const btnReactDeploy = document.getElementById("btn-react-deploy");
const btnReactDev = document.getElementById("btn-react-dev");
const btnReactLaunchPreview = document.getElementById("btn-react-launch-preview");
const btnStopReact = document.getElementById("btn-stop-react");

const btnRefresh = document.getElementById("btn-refresh");
const btnClearLogs = document.getElementById("btn-clear-logs");
const logsBox = document.getElementById("logs");

/**
 * Gestion du clic Web MVT (Démarrage ou Ouverture).
 */
async function handleMvtClick() {
    if (appState.djangoOnline) {
        await openUrl(`http://127.0.0.1:${appState.currentPorts.django}/dashboard/`);
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
                await openUrl(`http://127.0.0.1:${appState.currentPorts.django}/dashboard/`);
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
 * Déploiement / Compilation React.
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
 * Démarrage React en mode Dev (HMR).
 */
async function handleReactDev() {
    if (appState.reactDevOnline) {
        await openUrl(`http://127.0.0.1:${appState.currentPorts.react}/`);
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
                appendLog(`✅ React Dev opérationnel sur http://127.0.0.1:${appState.currentPorts.react}/`, "ok");
                await openUrl(`http://127.0.0.1:${appState.currentPorts.react}/`);
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
 * Lancement du serveur Preview pour la version déployée.
 */
async function handleReactLaunchPreview() {
    appendLog("🚀 Lancement du serveur Preview pour la version compilée...", "info");
    const res = await apiCall("/api/start-react-preview", "POST");
    if (res && res.success) {
        toast("Serveur Preview actif", "success");
        await syncUiState();
        await openUrl(`http://127.0.0.1:${appState.currentPorts.react}/`);
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
    if (logsBox) logsBox.innerHTML = "";
    appendLog("Journal réinitialisé.", "info");
});

// Boot initial
appendLog("🌿 Initialisation du Lanceur Unifié Renovate Energy...", "info");
syncUiState().then(() => {
    appendLog("Système prêt.", "ok");
});

// Polling Heartbeat
setInterval(syncUiState, 4000);
