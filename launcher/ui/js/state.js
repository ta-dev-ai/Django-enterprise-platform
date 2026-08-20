/**
 * =====================================================================
 * RENOVATE ENERGY - LAUNCHER STATE MANAGEMENT MODULE
 * =====================================================================
 * Synchronisation temps réel de l'état système & Activité Vivante.
 * =====================================================================
 */

import { apiCall } from "./api.js";

export const appState = {
    currentPorts: { django: 8000, react: 5174 },
    djangoOnline: false,
    reactDevOnline: false,
    reactPreviewOnline: false,
    hasDeploy: false,
    deployDate: null,
    totalLogCount: 2,
    recentEvents: [
        {
            service: "SYSTEM",
            icon: "codicon-shield",
            text: "Système de supervision initialisé",
            time: new Date().toLocaleTimeString("fr-FR", { hour12: false }),
            type: "system",
        },
        {
            service: "READY",
            icon: "codicon-pass-filled",
            text: "Services prêts au lancement",
            time: new Date().toLocaleTimeString("fr-FR", { hour12: false }),
            type: "django",
        }
    ],
};

// DOM Elements
const heroStatusLabel = document.getElementById("hero-status-label");
const heroStatusBox = document.getElementById("system-hero-status");
const dotDjango = document.getElementById("dot-django");
const dotReact = document.getElementById("dot-react");
const dotNode = document.getElementById("dot-node");
const dotDeploy = document.getElementById("dot-deploy");

const mvtStatusPill = document.getElementById("mvt-status-pill");
const mvtStatusText = document.getElementById("mvt-status-text");
const mvtUrlText = document.getElementById("mvt-url-text");
const btnMvtMain = document.getElementById("btn-mvt-main");

const reactStatusPill = document.getElementById("react-status-pill");
const reactStatusText = document.getElementById("react-status-text");
const reactUrlText = document.getElementById("react-url-text");
const btnReactMain = document.getElementById("btn-react-main");

const deployDateText = document.getElementById("deploy-date-text");
const recentEventsBox = document.getElementById("recent-events-box");
const logsCounter = document.getElementById("logs-counter");

/**
 * Enregistre un événement riche pour le bandeau d'activité.
 */
export function addRecentEvent(service, text, icon = "codicon-pass-filled", type = "system") {
    appState.totalLogCount++;
    if (logsCounter) logsCounter.textContent = String(appState.totalLogCount);

    appState.recentEvents.unshift({
        service,
        icon,
        text,
        time: new Date().toLocaleTimeString("fr-FR", { hour12: false }),
        type,
    });
    
    if (appState.recentEvents.length > 2) {
        appState.recentEvents.pop();
    }
    renderRecentEvents();
}

export function updateLogCount(count) {
    appState.totalLogCount = count;
    if (logsCounter) logsCounter.textContent = String(count);
}

function renderRecentEvents() {
    if (!recentEventsBox) return;
    recentEventsBox.innerHTML = appState.recentEvents.map(ev => {
        const tagClass = `event-tag-${ev.type || "system"}`;
        return `
            <div class="event-pill-item">
                <span class="event-tag-badge ${tagClass}">
                    <i class="codicon ${ev.icon}"></i>
                    <span>${ev.service}</span>
                </span>
                <span>${ev.text}</span>
                <span class="event-time-stamp">${ev.time}</span>
            </div>
        `;
    }).join("");
}

/**
 * Synchronise l'état visuel de l'ensemble de l'interface graphique.
 */
export async function syncUiState() {
    const status = await apiCall("/api/status");
    if (!status) return;

    appState.currentPorts.django = status.django_port || 8000;
    appState.currentPorts.react = status.react_port || 5174;
    mvtUrlText.textContent = `http://127.0.0.1:${appState.currentPorts.django}`;
    reactUrlText.textContent = `http://127.0.0.1:${appState.currentPorts.react}`;

    appState.djangoOnline = status.django_online;
    appState.reactDevOnline = status.react_dev_online;
    appState.reactPreviewOnline = status.react_preview_online;
    appState.hasDeploy = Boolean(status.deploy_info && status.deploy_info.exists);
    appState.deployDate = status.deploy_info?.date || null;

    // 1. HERO STATUS DOTS
    dotDjango.className = `srv-dot ${appState.djangoOnline ? "active" : ""}`;
    dotReact.className = `srv-dot ${(appState.reactDevOnline || appState.reactPreviewOnline) ? "active" : ""}`;
    dotNode.className = `srv-dot ${status.node_available ? "active" : ""}`;
    dotDeploy.className = `srv-dot ${appState.hasDeploy ? "active" : ""}`;

    const anyRunning = appState.djangoOnline || appState.reactDevOnline || appState.reactPreviewOnline;
    if (anyRunning) {
        heroStatusBox.className = "health-status-main";
        heroStatusLabel.textContent = "Système Opérationnel (En ligne)";
    } else {
        heroStatusBox.className = "health-status-main";
        heroStatusLabel.textContent = "Système Prêt au lancement";
    }

    // 2. ÉTAT DJANGO (WEB MVT)
    if (appState.djangoOnline) {
        mvtStatusPill.className = "project-badge-state active";
        mvtStatusText.textContent = `Actif (: ${appState.currentPorts.django})`;
        btnMvtMain.innerHTML = `<i class="codicon codicon-link-external"></i> <span id="btn-mvt-main-text">Ouvrir Web MVT</span>`;
        btnMvtMain.title = "Ouvrir l'application dans le navigateur";
    } else {
        mvtStatusPill.className = "project-badge-state";
        mvtStatusText.textContent = `Inactif`;
        btnMvtMain.innerHTML = `<i class="codicon codicon-rocket"></i> <span id="btn-mvt-main-text">Lancer Web MVT</span>`;
        btnMvtMain.title = "Démarrer le serveur Django";
    }

    // 3. ÉTAT REACT
    const reactIsRunning = appState.reactDevOnline || appState.reactPreviewOnline;
    if (reactIsRunning) {
        reactStatusPill.className = "project-badge-state active";
        const modeLabel = appState.reactDevOnline ? "Dev HMR" : "Preview";
        reactStatusText.textContent = `${modeLabel} (: ${appState.currentPorts.react})`;
        btnReactMain.innerHTML = `<i class="codicon codicon-link-external"></i> <span id="btn-react-main-text">Ouvrir React</span>`;
        btnReactMain.disabled = false;
    } else if (appState.hasDeploy) {
        reactStatusPill.className = "project-badge-state";
        reactStatusText.textContent = `Prêt (Build dispo)`;
        btnReactMain.innerHTML = `<i class="codicon codicon-play"></i> <span id="btn-react-main-text">Lancer Preview</span>`;
        btnReactMain.disabled = false;
    } else {
        reactStatusPill.className = "project-badge-state";
        reactStatusText.textContent = `Non déployé`;
        btnReactMain.innerHTML = `<i class="codicon codicon-zap"></i> <span id="btn-react-main-text">Lancer Mode Dev</span>`;
        btnReactMain.disabled = false;
    }

    // 4. ÉTAT DÉPLOIEMENT
    if (appState.hasDeploy) {
        deployDateText.textContent = `Dernier build compilé avec succès le ${appState.deployDate}`;
    } else {
        deployDateText.textContent = `Aucun build compilé dans dist/ (Déploiement recommandé)`;
    }

    renderRecentEvents();
}
