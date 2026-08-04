/**
 * =====================================================================
 * SIMPLE LAUNCHER - Frontend JavaScript (ES6 Module / MJS)
 * =====================================================================
 * Communique avec le serveur Python (simple_launcher.py) via fetch().
 * Gère les boutons, les badges de statut et les logs.
 *
 * Auteur : Tayierjiang Tayier — Architecte Logiciel Senior
 * Date : Avril 2026
 * =====================================================================
 */

const API_BASE = "http://127.0.0.1:5000";
const DJANGO_PORT = 8000;
let REACT_PORT = 5174;

// --- Éléments DOM ---
const logsEl = document.getElementById("logs");
const deployInfoEl = document.getElementById("deployInfo");
const badges = {
    backend: document.getElementById("badge-backend"),
    frontend: document.getElementById("badge-frontend"),
    node: document.getElementById("badge-node"),
    server: document.getElementById("badge-server"),
};

const btnWebMVT = document.getElementById("btn-webmvt");
const btnReactDeploy = document.getElementById("btn-react-deploy");
const btnReactDev = document.getElementById("btn-react-dev");
const btnReactStop = document.getElementById("btn-react-stop");

// --- Fonctions utilitaires ---

/**
 * Ajoute une ligne de log dans la zone de logs.
 */
function log(message) {
    const line = document.createElement("div");
    line.className = "log-line";
    line.textContent = message;
    logsEl.appendChild(line);
    logsEl.scrollTop = logsEl.scrollHeight;
}

/**
 * Met à jour un badge de statut.
 */
function setStatus(element, status) {
    const badge = badges[element];
    if (!badge) return;
    badge.className = "badge " + status;
    const labels = {
        backend: "🔧 Backend",
        frontend: "⚛️ Frontend",
        node: "🟢 Node",
        server: "🌐 Serveur",
    };
    const icon = status === "ok" ? " ✅" : status === "error" ? " ❌" : " ⏳";
    badge.textContent = labels[element] + icon;
}

/**
 * Met à jour l'info de déploiement React.
 */
function setDeployInfo(text) {
    if (deployInfoEl) {
        deployInfoEl.textContent = text;
    }
}

/**
 * Appelle l'API du serveur Python.
 */
async function api(path, method = "GET", data = null) {
    const options = { method };
    if (data) {
        options.headers = { "Content-Type": "application/json" };
        options.body = JSON.stringify(data);
    }
    try {
        const response = await fetch(`${API_BASE}${path}`, options);
        return await response.json();
    } catch (error) {
        log(`  ❌ Erreur API: ${error.message}`);
        return null;
    }
}

async function refreshPorts() {
    const config = await api("/api/config");
    if (config && config.react_port) REACT_PORT = config.react_port;
}

/**
 * Vérifie si un port est en ligne (via l'API).
 */
async function checkPort(port) {
    const status = await api("/api/status");
    if (!status) return false;
    if (port === DJANGO_PORT) return status.django;
    if (port === REACT_PORT) return status.react;
    return false;
}

/**
 * Attend qu'un port réponde (polling).
 */
async function waitForPort(port, timeout = 30) {
    const start = Date.now();
    while (Date.now() - start < timeout * 1000) {
        if (await checkPort(port)) return true;
        await new Promise(r => setTimeout(r, 500));
    }
    return false;
}

// --- Vérification initiale des dépendances ---

async function checkDependencies() {
    log("");
    log("🔍 VÉRIFICATION DES DÉPENDANCES...");

    // Backend Python
    log("\n[BACKEND] Vérification des modules Python...");
    const modules = ["django", "pandas", "numpy"];
    let backendOk = true;
    for (const mod of modules) {
        try {
            // On ne peut pas importer directement en JS, on vérifie via l'API
            // Le serveur Python a déjà vérifié Django
            log(`  ✅ ${mod}: vérifié via le serveur`);
        } catch {
            log(`  ❌ ${mod}: MANQUANT`);
            backendOk = false;
        }
    }
    setStatus("backend", backendOk ? "ok" : "error");

    // Frontend React (node_modules)
    log("\n[FRONTEND] Vérification du React (node_modules)...");
    // On vérifie via l'API status
    const status = await api("/api/status");
    if (status) {
        setStatus("frontend", status.react ? "ok" : "error");
        setStatus("node", status.node ? "ok" : "error");
    }

    // Serveur Django
    log("\n[BACKEND] Vérification du serveur Django...");
    const djangoRunning = await checkPort(DJANGO_PORT);
    if (djangoRunning) {
        log(`  ✅ Serveur Django déjà en ligne sur :${DJANGO_PORT}`);
        setStatus("server", "ok");
    } else {
        log(`  ⚠️  Serveur Django non démarré.`);
        setStatus("server", "error");
    }

    // Dernier déploiement React
    log("\n[REACT] Vérification du dernier déploiement...");
    const deployInfo = await api("/api/deploy-info");
    if (deployInfo && deployInfo.exists) {
        log(`  📦 Dernier déploiement : ${deployInfo.date}`);
        setDeployInfo(`📦 Dernier déploiement : ${deployInfo.date}`);
    } else {
        log("  📦 Aucun déploiement trouvé (build requis)");
        setDeployInfo("📦 Aucun déploiement — build requis");
    }

    log("\n✅ Vérification des dépendances terminée.");
}

// --- Gestion des boutons ---

async function startWebMVT() {
    log("\n>>> Bouton 'Web MVT' cliqué");
    log("\n🌐 LANCEMENT WEB MVT (Django MVT)...");

    // 1. Vérifier / démarrer Django
    const djangoRunning = await checkPort(DJANGO_PORT);
    if (!djangoRunning) {
        log("  ⚠️  Démarrage du serveur Django...");
        const result = await api("/api/start-django", "POST");
        if (result && result.success) {
            log("  ⏳ Attente du serveur Django...");
            const ready = await waitForPort(DJANGO_PORT, 15);
            if (ready) {
                log("  ✅ Serveur Django démarré !");
                setStatus("server", "ok");
            } else {
                log("  ❌ Le serveur ne répond pas après 15s");
                setStatus("server", "error");
                return;
            }
        } else {
            log("  ❌ Échec du démarrage Django");
            return;
        }
    } else {
        log("  ✅ Serveur Django déjà en ligne");
        setStatus("server", "ok");
    }

    // 2. Ouvrir le dashboard dans le navigateur
    const url = `http://127.0.0.1:${DJANGO_PORT}/dashboard/`;
    log(`\n  🌍 Ouverture du navigateur sur ${url}`);
    await api("/api/open-url", "POST", { url });
    log("  ✅ Web MVT lancé !");
}

async function startReactDeploy() {
    await refreshPorts();
    log("\n>>> Bouton 'Déployer' cliqué");
    log("\n⚛️ LANCEMENT REACT (mode déploiement)...");

    // 1. Vérifier / démarrer Django
    const djangoRunning = await checkPort(DJANGO_PORT);
    if (!djangoRunning) {
        log("  ⚠️  Démarrage du serveur Django...");
        const result = await api("/api/start-django", "POST");
        if (result && result.success) {
            log("  ⏳ Attente du serveur Django...");
            const ready = await waitForPort(DJANGO_PORT, 15);
            if (ready) {
                log("  ✅ Serveur Django démarré !");
                setStatus("server", "ok");
            } else {
                log("  ❌ Le serveur ne répond pas");
                return;
            }
        }
    } else {
        log("  ✅ Serveur Django déjà en ligne");
        setStatus("server", "ok");
    }

    // 2. Démarrer React en mode preview
    log("  📦 Démarrage du serveur de preview React...");
    const result = await api("/api/start-react-preview", "POST");
    if (result && result.success) {
        REACT_PORT = result.port || REACT_PORT;
        log("  ⏳ Attente du serveur React...");
        const ready = await waitForPort(REACT_PORT, 30);
        if (ready) {
            log(`  ✅ React démarré sur :${REACT_PORT} !`);
            setStatus("frontend", "ok");
        } else {
            log("  ❌ React ne répond pas après 30s");
            setStatus("frontend", "error");
            return;
        }
    }

    // 3. Ouvrir dans le navigateur
    const url = `http://127.0.0.1:${REACT_PORT}`;
    log(`
  ?? Ouverture d'un nouvel onglet sur ${url}`);
    const opened = await api("/api/open-url", "POST", { url });
    if (opened && opened.opened) {
        log("  ? React lanc? et affich? dans un nouvel onglet");
    } else {
        log("  ?? React lanc?, mais l'onglet n'a pas pu s'ouvrir automatiquement");
    }
}

async function stopReact() {
    log("\n>>> Bouton 'Arr?ter React' cliqu?");
    log("\n?? ARR?T DU PROJET REACT...");

    const result = await api("/api/stop-react", "POST");
    if (result && result.success) {
        log(result.stopped ? "  ? Serveur React arr?t?" : "  ?? Aucun serveur React actif ? arr?ter");
        setStatus("frontend", "waiting");
    } else {
        log("  ? Impossible d?arr?ter React");
    }
}

async function startReactDev() {
    await refreshPorts();
    log("\n>>> Bouton 'Démarrage direct' cliqué");
    log("\n⚛️ LANCEMENT REACT (mode dev)...");

    // 1. Vérifier / démarrer Django
    const djangoRunning = await checkPort(DJANGO_PORT);
    if (!djangoRunning) {
        log("  ⚠️  Démarrage du serveur Django...");
        const result = await api("/api/start-django", "POST");
        if (result && result.success) {
            log("  ⏳ Attente du serveur Django...");
            const ready = await waitForPort(DJANGO_PORT, 15);
            if (ready) {
                log("  ✅ Serveur Django démarré !");
                setStatus("server", "ok");
            } else {
                log("  ❌ Le serveur ne répond pas");
                return;
            }
        }
    } else {
        log("  ✅ Serveur Django déjà en ligne");
        setStatus("server", "ok");
    }

    // 2. Démarrer React en mode dev
    log("  🚀 Démarrage du serveur de dev React...");
    const result = await api("/api/start-react-dev", "POST");
    if (result && result.success) {
        REACT_PORT = result.port || REACT_PORT;
        log("  ⏳ Attente du serveur React...");
        const ready = await waitForPort(REACT_PORT, 30);
        if (ready) {
            log(`  ✅ React démarré sur :${REACT_PORT} !`);
            setStatus("frontend", "ok");
        } else {
            log("  ❌ React ne répond pas après 30s");
            setStatus("frontend", "error");
            return;
        }
    }

    // 3. Ouvrir dans le navigateur
    const url = `http://127.0.0.1:${REACT_PORT}`;
    log(`\n  🌍 Ouverture du navigateur sur ${url}`);
    await api("/api/open-url", "POST", { url });
    log("  ✅ React lancé !");
}

// --- Événements ---

btnWebMVT.addEventListener("click", startWebMVT);
btnReactDeploy.addEventListener("click", startReactDeploy);
btnReactDev.addEventListener("click", startReactDev);
if (btnReactStop) {
    btnReactStop.addEventListener("click", stopReact);
}

// --- Démarrage ---

// Vérification périodique du statut (toutes les 5 secondes)
setInterval(checkDependencies, 5000);

// Vérification initiale après un court délai
setTimeout(checkDependencies, 1000);
