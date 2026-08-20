/**
 * =====================================================================
 * RENOVATE ENERGY - LAUNCHER API & UTILITIES MODULE
 * =====================================================================
 * Communication REST avec le serveur Python, Toasts et Logs.
 * =====================================================================
 */

const API_BASE = window.location.origin;
const toastBox = document.getElementById("toast-box");
const logsBox = document.getElementById("logs");

export function escapeHtml(str) {
    return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/**
 * Affiche une notification toast avec icône Microsoft Codicon.
 */
export function toast(message, type = "info") {
    if (!toastBox) return;
    const item = document.createElement("div");
    item.className = "toast-item";
    
    let iconClass = "codicon-info";
    if (type === "success") iconClass = "codicon-check";
    if (type === "warning") iconClass = "codicon-warning";
    if (type === "error") iconClass = "codicon-error";

    item.innerHTML = `<i class="codicon ${iconClass}"></i> <span>${escapeHtml(message)}</span>`;
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
export function appendLog(message, level = "info") {
    if (!logsBox) return;
    const timeStr = new Date().toLocaleTimeString("fr-FR", { hour12: false });
    const row = document.createElement("div");
    row.className = `log-row log-${level}`;
    row.innerHTML = `<span class="log-time">[${timeStr}]</span> ${escapeHtml(message)}`;
    logsBox.appendChild(row);
    logsBox.scrollTop = logsBox.scrollHeight;
}

/**
 * Appel API générique vers le serveur du lanceur.
 */
export async function apiCall(path, method = "GET", body = null) {
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
 * Ouvre une URL dans le navigateur.
 */
export async function openUrl(url) {
    appendLog(`🌍 Ouverture de l'URL : ${url}`, "info");
    const res = await apiCall("/api/open-url", "POST", { url });
    if (res && res.success) {
        toast(`Navigateur ouvert : ${url}`, "success");
    }
}
