# 🏗️ RENOVATE APP LAUNCHER V2 - VERSION PARTENAIRE

**⚠️ AVERTISSEMENT DE PROPRIÉTÉ INTELLECTUELLE**
Ce projet contient le **Moteur Back-End "TAYIER ENGINE"** (Protégé par le Brevet INPI 2026).
Toute modification du dossier `/engine` sans autorisation déclenchera une rupture de la licence Apache 2.0.

---

## 🎯 OBJECTIF DE CETTE VERSION v2
Cette version est destinée à l'intégration d'un front-end moderne (React/Vite).
Le partenaire doit développer la partie "UI" sans altérer la logique métier ("Engine").

## 📂 STRUCTURE
```
RenovateApp_Launcher_2/
│
├── engine/                 # ⛔ NO TOUCH ZONE
│   └── app_launcher.py     # Le coeur du système (Python/Django Logic)
│
├── ui/                     # ✅ ZONE DE TRAVAIL FRONT-END
│   ├── react-app/          # (À créer par le partenaire : 'npm create vite@latest')
│   └── ...
│
└── LICENSE                 # Apache 2.0 (À lire impérativement)
```

## 🚀 INSTRUCTIONS POUR LE DÉVELOPPEUR FRONT (REACT)

1.  **Ne touchez pas** aux fichiers Python dans `engine/`.
2.  Dans le dossier `ui/`, initialisez votre projet React :
    ```bash
    cd ui
    npm create vite@latest my-app -- --template react
    ```
3.  Pour communiquer avec le "Engine", utilisez les endpoints API documentés (à venir).
4.  Le Engine doit toujours être lancé en premier via :
    ```bash
    python engine/app_launcher.py
    ```

---
*Projet sous Licence Apache 2.0 - Tayier Nimait (Renovate Energy)*
