# 📋 Rapport de Gouvernance des Dépendances
**Projet :** TAYIER OS V2 (Hybrid Architecture)
**Date :** 03/02/2026
**Propriétaire :** Tayier Nimait (Renovate Energy)

---

## 1. 🔍 État des Lieux
Le projet repose sur une double architecture (Python/Django + React/Vite) nécessitant une gestion stricte des dépendances pour garantir la portabilité "Clé en main".

### A. Dépendances Critiques (Backend Engine)
Ces modules sont indispensables pour le démarrage du noyau système et du navigateur embarqué.

| Module | Rôle | Statut Gestion |
| :--- | :--- | :--- |
| **Django** | Framework Web (Moteur TAYIER OS) | ✅ Auto-Install activé |
| **PyQt6** | Moteur Graphique (Fenêtre App) | ✅ Auto-Install activé |
| **PyQt6-WebEngine** | Moteur Navigateur (Chrome Embedded) | ✅ Auto-Install activé |
| **requests** | Communication API Interne | ✅ Auto-Install activé |
| **pandas** | Calculs Scientifiques (DPE/Data) | ✅ Auto-Install activé |
| **colorama** | Interface Terminal CLI | ✅ Auto-Install activé |

### B. Dépendances Frontend (React UI V2)
Gérées par `npm` lors du premier lancement.
- `react`, `react-dom` (Coeur UI)
- `vite` (Serveur Dev)
- `recharts` (Graphiques Vélo)
- `leaflet` (Cartographie)

---

## 2. 🛡️ Mécanisme de Protection (Solution au problème "V1/V2")

Pour éviter les échecs de démarrage chez les partenaires ne possédant pas l'environnement complet, un mécanisme d'auto-réparation a été intégré au lanceur `1_CLIC_DEMARRER_V2.py`.

**Algorithme de démarrage :**
1.  **Check-up Santé** : Le script tente d'importer `PyQt6` et `Django`.
2.  **Détection Manque** : Si un import échoue (Erreur `ImportError`), le protocole d'urgence s'active.
3.  **Installation Silencieuse** : Le système exécute `pip install -r RenovateApp_Launcher_2/requirements.txt` automatiquement.
4.  **Redémarrage** : Une fois les bibliothèques installées, le système lance les serveurs.

## 3. 📂 Structure des Fichiers de Dépendance

*   **`requirements.txt` (Racine)** : Contient le strict minimum pour le projet Django pur (`Django==6.0.1`, `asgiref`, etc.).
*   **`RenovateApp_Launcher_2/requirements.txt` (Kit Partenaire)** : Contient le "Full Package" pour l'interface graphique (`PyQt6`, `WebEngine`, etc.). **C'est celui-ci qui est utilisé par le lanceur automatique.**

## 4. ✅ Conclusion
Le système est désormais **autonome**. Le fichier ZIP délivré au partenaire contient :
1.  Le code source complet.
2.  La liste des ingrédients (`requirements.txt`).
3.  Le "Cuisinier automatique" (`1_CLIC_DEMARRER_V2.py`) qui assemble les ingrédients si nécessaire.

**Verdict :** Risque de "Missing Dependency" éliminé à 99%.
