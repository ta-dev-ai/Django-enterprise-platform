/**
 * =====================================================================
 * RENOVATE ENERGY - UNIFIED CONTROL CENTER MAIN APP MODULE
 * =====================================================================
 * Orchestration des actions, Tiroir Latéral & Menus Contextuels
 * =====================================================================
 */

import { toast, appendLog, apiCall, openUrl } from "./api.js";
import { appState, syncUiState, addRecentEvent } from "./state.js";

// DOM - Drawer Elements
const logsDrawer = document.getElementById("logs-drawer");
const drawerBackdrop = document.getElementById("drawer-backdrop");
const btnOpenDrawer = document.getElementById("btn-open-drawer");
const btnCloseDrawer = document.getElementById("btn-close-drawer");
const btnDrawerRefresh = document.getElementById("btn-drawer-refresh");
const btnDrawerClear = document.getElementById("btn-drawer-clear");
const logsBox = document.getElementById("logs");

// DOM - Primary Actions
const btnMvtMain = document.getElementById("btn-mvt-main");
const btnReactMain = document.getElementById("btn-react-main");
const btnStripDeploy = document.getElementById("btn-strip-deploy");

// DOM - Dropdowns
const btnMvtMenu = document.getElementById("btn-mvt-menu");
const mvtDropdown = document.getElementById("mvt-dropdown");
const btnReactMenu = document.getElementById("btn-react-menu");
const reactDropdown = document.getElementById("react-dropdown");

// Dropdown Actions
const actionMvtRestart = document.getElementById("action-mvt-restart");
const actionMvtCopyUrl = document.getElementById("action-mvt-copy-url");
const actionMvtStop = document.getElementById("action-mvt-stop");

const actionReactDev = document.getElementById("action-react-dev");
const actionReactBuild = document.getElementById("action-react-build");
const actionReactCopyUrl = document.getElementById("action-react-copy-url");
const actionReactStop = document.getElementById("action-react-stop");

let isDrawerPinnedByUser = false;
let drawerAutoCloseTimer = null;

/* --- GESTION DU TIROIR LATÉRAL (DRAWER) --- */

function openDrawer(pinned = true) {
    if (drawerAutoCloseTimer) clearTimeout(drawerAutoCloseTimer);
    if (pinned) isDrawerPinnedByUser = true;
    logsDrawer.classList.add("open");
    drawerBackdrop.classList.add("active");
}

function closeDrawer() {
    if (drawerAutoCloseTimer) clearTimeout(drawerAutoCloseTimer);
    isDrawerPinnedByUser = false;
    logsDrawer.classList.remove("open");
    drawerBackdrop.classList.remove("active");
}

function flashDrawerDuringAction() {
    if (!logsDrawer.classList.contains("open")) {
        logsDrawer.classList.add("open");
        drawerBackdrop.classList.add("active");
    }
}

function autoCloseDrawerAfterDelay() {
    if (!isDrawerPinnedByUser) {
        drawerAutoCloseTimer = setTimeout(() => {
            closeDrawer();
        }, 3500);
    }
}

btnOpenDrawer.addEventListener("click", () => openDrawer(true));
btnCloseDrawer.addEventListener("click", closeDrawer);
drawerBackdrop.addEventListener("click", closeDrawer);

btnDrawerRefresh.addEventListener("click", async () => {
    appendLog("🔄 Actualisation des statuts...", "info");
    toast("Actualisation des services...", "info");
    await syncUiState();
});

btnDrawerClear.addEventListener("click", () => {
    if (logsBox) logsBox.innerHTML = "";
    appendLog("Journal d'activité réinitialisé.", "info");
});

/* --- GESTION DES MENUS DÉROULANTS (DROPDOWNS) --- */

function closeAllDropdowns() {
    mvtDropdown.classList.remove("show");
    reactDropdown.classList.remove("show");
}

btnMvtMenu.addEventListener("click", (e) => {
    e.stopPropagation();
    const isShown = mvtDropdown.classList.contains("show");
    closeAllDropdowns();
    if (!isShown) mvtDropdown.classList.add("show");
});

btnReactMenu.addEventListener("click", (e) => {
    e.stopPropagation();
    const isShown = reactDropdown.classList.contains("show");
    closeAllDropdowns();
    if (!isShown) reactDropdown.classList.add("show");
});

document.addEventListener("click", () => closeAllDropdowns());

/* --- ACTIONS DJANGO --- */

async function startDjango() {
    appendLog("🚀 Démarrage du serveur Django Web MVT...", "info");
    flashDrawerDuringAction();
    toast("Initialisation du serveur Django...", "info");
    addRecentEvent("DJANGO", "Initialisation du serveur...", "codicon-loading codicon-modifier-spin", "django");

    const res = await apiCall("/api/start-django", "POST");
    if (res && res.success) {
        let attempts = 0;
        const interval = setInterval(async () => {
            attempts++;
            await syncUiState();
            if (appState.djangoOnline) {
                clearInterval(interval);
                toast("Django est en ligne !", "success");
                appendLog(`✅ Django opérationnel sur http://127.0.0.1:${appState.currentPorts.django}/`, "ok");
                addRecentEvent("DJANGO", `Serveur actif sur le port :${appState.currentPorts.django}`, "codicon-pass-filled", "django");
                autoCloseDrawerAfterDelay();
                await openUrl(`http://127.0.0.1:${appState.currentPorts.django}/dashboard/`);
            } else if (attempts > 25) {
                clearInterval(interval);
                toast("Délai de réponse dépassé pour Django", "warning");
                appendLog("⚠️ Django tarde à répondre.", "warn");
                addRecentEvent("DJANGO", "Délai de réponse dépassé", "codicon-warning", "system");
                autoCloseDrawerAfterDelay();
            }
        }, 500);
    }
}

btnMvtMain.addEventListener("click", async () => {
    if (appState.djangoOnline) {
        await openUrl(`http://127.0.0.1:${appState.currentPorts.django}/dashboard/`);
    } else {
        await startDjango();
    }
});

actionMvtRestart.addEventListener("click", async () => {
    closeAllDropdowns();
    appendLog("🔄 Redémarrage du serveur Django...", "info");
    flashDrawerDuringAction();
    addRecentEvent("DJANGO", "Redémarrage du service...", "codicon-refresh", "django");
    await apiCall("/api/stop-django", "POST");
    await new Promise(r => setTimeout(r, 600));
    await startDjango();
});

actionMvtCopyUrl.addEventListener("click", () => {
    closeAllDropdowns();
    const url = `http://127.0.0.1:${appState.currentPorts.django}/dashboard/`;
    navigator.clipboard.writeText(url);
    toast("URL copiée dans le presse-papier !", "success");
    addRecentEvent("CLIPBOARD", `URL Django copiée (: ${appState.currentPorts.django})`, "codicon-copy", "system");
});

actionMvtStop.addEventListener("click", async () => {
    closeAllDropdowns();
    appendLog("🛑 Arrêt du serveur Django...", "warn");
    flashDrawerDuringAction();
    const res = await apiCall("/api/stop-django", "POST");
    if (res && res.success) {
        toast("Serveur Django arrêté", "info");
        appendLog("Django a été arrêté avec succès.", "warn");
        addRecentEvent("DJANGO", "Serveur arrêté", "codicon-debug-stop", "system");
        await syncUiState();
        autoCloseDrawerAfterDelay();
    }
});

/* --- ACTIONS REACT --- */

async function startReactDev() {
    appendLog("⚡ Démarrage de React en mode Dev (Vite HMR)...", "info");
    flashDrawerDuringAction();
    toast("Démarrage de React Dev...", "info");
    addRecentEvent("REACT", "Démarrage du mode Dev HMR...", "codicon-zap", "react");

    const res = await apiCall("/api/start-react-dev", "POST");
    if (res && res.success) {
        let attempts = 0;
        const interval = setInterval(async () => {
            attempts++;
            await syncUiState();
            if (appState.reactDevOnline) {
                clearInterval(interval);
                toast("React Dev est prêt !", "success");
                appendLog(`✅ React Dev opérationnel sur http://127.0.0.1:${appState.currentPorts.react}/`, "ok");
                addRecentEvent("REACT", `Serveur Dev actif sur :${appState.currentPorts.react}`, "codicon-pass-filled", "react");
                autoCloseDrawerAfterDelay();
                await openUrl(`http://127.0.0.1:${appState.currentPorts.react}/`);
            } else if (attempts > 20) {
                clearInterval(interval);
                toast("Délai dépassé pour React Dev", "warning");
                autoCloseDrawerAfterDelay();
            }
        }, 500);
    }
}

async function startReactPreview() {
    appendLog("🚀 Lancement du serveur Preview React...", "info");
    flashDrawerDuringAction();
    const res = await apiCall("/api/start-react-preview", "POST");
    if (res && res.success) {
        toast("Serveur Preview actif !", "success");
        appendLog(`✅ Preview React accessible sur http://127.0.0.1:${appState.currentPorts.react}/`, "ok");
        addRecentEvent("REACT", `Preview active sur :${appState.currentPorts.react}`, "codicon-pass-filled", "react");
        await syncUiState();
        autoCloseDrawerAfterDelay();
        await openUrl(`http://127.0.0.1:${appState.currentPorts.react}/`);
    } else {
        toast(res?.message || "Build requis", "error");
        autoCloseDrawerAfterDelay();
    }
}

btnReactMain.addEventListener("click", async () => {
    if (appState.reactDevOnline || appState.reactPreviewOnline) {
        await openUrl(`http://127.0.0.1:${appState.currentPorts.react}/`);
    } else if (appState.hasDeploy) {
        await startReactPreview();
    } else {
        await startReactDev();
    }
});

actionReactDev.addEventListener("click", async () => {
    closeAllDropdowns();
    await startReactDev();
});

actionReactCopyUrl.addEventListener("click", () => {
    closeAllDropdowns();
    const url = `http://127.0.0.1:${appState.currentPorts.react}/`;
    navigator.clipboard.writeText(url);
    toast("URL React copiée !", "success");
    addRecentEvent("CLIPBOARD", `URL React copiée (: ${appState.currentPorts.react})`, "codicon-copy", "system");
});

actionReactStop.addEventListener("click", async () => {
    closeAllDropdowns();
    appendLog("🛑 Arrêt des serveurs React...", "warn");
    flashDrawerDuringAction();
    const res = await apiCall("/api/stop-react", "POST");
    if (res && res.success) {
        toast("Serveur React arrêté", "info");
        appendLog("React arrêté.", "warn");
        addRecentEvent("REACT", "Serveur arrêté", "codicon-debug-stop", "system");
        await syncUiState();
        autoCloseDrawerAfterDelay();
    }
});

/* --- ACTION DÉPLOIEMENT (BUILD VITE) --- */

async function buildReact() {
    closeAllDropdowns();
    appendLog("📦 Compilation de production React (Vite Build)...", "info");
    flashDrawerDuringAction();
    btnStripDeploy.disabled = true;
    toast("Compilation Vite en cours...", "info");
    addRecentEvent("BUILD", "Compilation Vite en cours...", "codicon-package", "build");

    const res = await apiCall("/api/build-react", "POST");
    btnStripDeploy.disabled = false;

    if (res && res.success) {
        toast("Déploiement terminé avec succès !", "success");
        appendLog(`✅ Build React dist/ terminé avec succès (${res.date || ""})`, "ok");
        addRecentEvent("BUILD", `Build compilé avec succès (${res.date || ""})`, "codicon-pass-filled", "build");
        await syncUiState();
        autoCloseDrawerAfterDelay();
    } else {
        toast("Erreur lors de la compilation", "error");
        appendLog(`❌ ${res?.message || "Échec du build"}`, "err");
        addRecentEvent("BUILD", "Échec de compilation", "codicon-error", "system");
        autoCloseDrawerAfterDelay();
    }
}

btnStripDeploy.addEventListener("click", buildReact);
actionReactBuild.addEventListener("click", buildReact);

/* --- INITIALISATION --- */

appendLog('🌿 Initialisation du Unified Control Center DataPilot...', 'info');

let autoStartAttempts = 0;

async function ensureServicesRunning() {
  await syncUiState();
  if (appState.djangoOnline && (appState.reactDevOnline || appState.reactPreviewOnline)) {
    appendLog('✅ Django et React sont opérationnels.', 'ok');
    return;
  }
  if (autoStartAttempts > 0) return;
  autoStartAttempts++;

  if (!appState.djangoOnline) {
    appendLog('⏳ Django non détecté — lancement automatique...', 'info');
    await startDjango();
  }
  if (!appState.reactDevOnline && !appState.reactPreviewOnline) {
    appendLog('⏳ React non détecté — lancement automatique...', 'info');
    if (appState.hasDeploy) {
      await startReactPreview();
    } else {
      await startReactDev();
    }
  }
}

ensureServicesRunning();
setInterval(syncUiState, 4000);
