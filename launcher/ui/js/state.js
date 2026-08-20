/**
 * =====================================================================
 * RENOVATE ENERGY - LAUNCHER STATE MANAGEMENT MODULE
 * =====================================================================
 * Synchronisation temps réel de l'état système et mise à jour du DOM.
 * =====================================================================
 */

import { ICONS } from "./icons.js";
import { apiCall } from "./api.js";

export const appState = {
    currentPorts: { django: 8000, react: 5174 },
    djangoOnline: false,
    reactDevOnline: false,
    reactPreviewOnline: false,
    hasDeploy: false,
    deployDate: null,
};

// DOM Elements
const badgeDjango = document.getElementById("badge-django");
const badgeReact = document.getElementById("badge-react");
const badgeNode = document.getElementById("badge-node");
const badgeDeploy = document.getElementById("badge-deploy");

const djangoPortLabel = document.getElementById("django-port-label");
const reactPortLabel = document.getElementById("react-port-label");
const mvtStateText = document.getElementById("mvt-state-text");
const deployInfoText = document.getElementById("deployInfoText");

const btnMvtMain = document.getElementById("btn-mvt-main");
const mvtStopWrapper = document.getElementById("mvt-stop-wrapper");

const btnReactLaunchPreview = document.getElementById("btn-react-launch-preview");
const btnStopReact = document.getElementById("btn-stop-react");

/**
 * Synchronise l'état visuel de l'ensemble de l'interface graphique.
 */
export async function syncUiState() {
    const status = await apiCall("/api/status");
    if (!status) return;

    appState.currentPorts.django = status.django_port || 8000;
    appState.currentPorts.react = status.react_port || 5174;
    djangoPortLabel.textContent = `Port :${appState.currentPorts.django}`;
    reactPortLabel.textContent = `Port :${appState.currentPorts.react}`;

    appState.djangoOnline = status.django_online;
    appState.reactDevOnline = status.react_dev_online;
    appState.reactPreviewOnline = status.react_preview_online;
    appState.hasDeploy = Boolean(status.deploy_info && status.deploy_info.exists);
    appState.deployDate = status.deploy_info?.date || null;

    // 1. ÉTAT DJANGO (WEB MVT)
    if (appState.djangoOnline) {
        badgeDjango.className = "badge-pill status-ok";
        badgeDjango.querySelector("span").textContent = `Django :${appState.currentPorts.django} (Actif)`;
        mvtStateText.textContent = `✅ Serveur actif sur http://127.0.0.1:${appState.currentPorts.django}/`;
        
        btnMvtMain.innerHTML = `${ICONS.externalLink} <span id="btn-mvt-main-text">Ouvrir Web MVT</span>`;
        btnMvtMain.title = "Ouvrir l'application dans le navigateur";
        mvtStopWrapper.style.display = "block";
    } else {
        badgeDjango.className = "badge-pill status-off";
        badgeDjango.querySelector("span").textContent = `Django :${appState.currentPorts.django} (Inactif)`;
        mvtStateText.textContent = `Serveur prêt au lancement`;
        
        btnMvtMain.innerHTML = `${ICONS.rocket} <span id="btn-mvt-main-text">Lancer Web MVT</span>`;
        btnMvtMain.title = "Démarrer le serveur Django et ouvrir l'application";
        mvtStopWrapper.style.display = "none";
    }

    // 2. ÉTAT REACT
    const reactIsRunning = appState.reactDevOnline || appState.reactPreviewOnline;
    if (reactIsRunning) {
        badgeReact.className = "badge-pill status-ok";
        const modeLabel = appState.reactDevOnline ? "Dev HMR" : "Preview";
        badgeReact.querySelector("span").textContent = `React :${appState.currentPorts.react} (${modeLabel})`;
        btnStopReact.style.display = "inline-flex";
    } else {
        badgeReact.className = "badge-pill status-off";
        badgeReact.querySelector("span").textContent = `React :${appState.currentPorts.react} (Inactif)`;
        btnStopReact.style.display = "none";
    }

    // 3. ÉTAT DU BUILD / DÉPLOIEMENT
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

    // 4. ÉTAT NODE
    if (status.node_available) {
        badgeNode.className = "badge-pill status-ready";
        badgeNode.querySelector("span").textContent = `Node.js Prêt`;
    } else {
        badgeNode.className = "badge-pill status-off";
        badgeNode.querySelector("span").textContent = `Node.js non trouvé`;
    }
}
