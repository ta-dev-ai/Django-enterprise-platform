# Règles Globales de Contexte — Django Enterprise Platform

> **Document de gouvernance** — Fixe le périmètre de travail et les interdictions
> **Auteur :** Tayierjiang Tayier — Architecte Logiciel Senior
> **Date :** Avril 2026

---

## 🎯 Objectif

Ce document fixe **formellement** le contexte de travail pour toute modification du projet. Il empêche toute sortie du périmètre et protège la source originale.

---

## 📍 1. Périmètre de travail

Tout travail se fait **uniquement** dans le répertoire :

```
c:/Users/ntpar/Dev_IT/Projet_depo/Projet_IA/Python-Mastery-Nexus-Triple-Core-main
```

**Interdiction formelle :**
- ❌ Ne jamais sortir du repo (pas de `../`, pas de dossiers externes)
- ❌ Ne jamais créer de fichiers/dossiers en dehors de ce répertoire
- ❌ Ne jamais lire/modifier des fichiers hors de ce répertoire

---

## 🛡️ 2. Source originale — INTACTE

La **racine du repo** (le code source original) est la **référence 100% fonctionnelle**.

**Règles :**
- ✅ La source originale reste **intacte** à la racine
- ✅ Elle sert de référence jusqu'à ce que la réorganisation soit 100% fonctionnelle
- ❌ **Ne rien toucher** à la racine (pas de suppression, pas de déplacement, pas de modification)

**Fichiers/dossiers protégés à la racine :**
```
batimentRenovation/  data/  templates/  static/
RenovateApp_Launcher/  app_launcher/  docs/
DEMARRER.py  manage.py  requirements.txt  pytest.ini
```

---

## 🧪 3. Zone de travail autorisée

La seule zone modifiable pour la réorganisation est :

```
multi-repo-target/
```

C'est ici que se fait le nettoyage des doublons et la restructuration en 5 repos.

---

## 🗄️ 3bis. Règle d'OR — Nettoyer = Archiver, JAMAIS supprimer

**Règle absolue :** on ne supprime JAMAIS rien. Tout élément inutile, obsolète ou en doublon est **déplacé** dans le dossier `archive/`.

**Principe :**
- ❌ **Interdit** de supprimer un fichier ou dossier
- ✅ **Obligatoire** de déplacer dans `archive/` tout ce qui n'a plus d'utilité
- ✅ Le dossier `archive/` doit être **structuré** (sous-dossiers par provenance)

**Structure d'archive :**
```
archive/
├── source-original/        # Code source original (référence)
├── doublons/               # Doublons retirés de la réorganisation
├── obsolète/               # Éléments obsolètes
└── legacy/                 # Anciennes versions
```

**Règle :** si un dossier n'a aucune utilité → le déplacer dans `archive/`, ne jamais le supprimer.

---

## 🔒 4. Sécurité Git

- **Point de restauration :** tag `pre-split-safety-checkpoint`
- **Règle :** tout changement doit être commité
- **Règle :** avant toute opération, vérifier que le working tree est propre

---

## ✅ 5. Règles de validation

Avant de considérer une tâche terminée :
1. Le travail est **dans le périmètre** (racine du repo)
2. La **source originale est intacte**
3. Les changements sont **commités**
4. Le point de restauration `pre-split-safety-checkpoint` est toujours accessible

---

## 📋 6. Récapitulatif des interdictions

| Action | Statut |
|--------|--------|
| Sortir du repo (`../`) | ❌ Interdit |
| Toucher à la source originale (racine) | ❌ Interdit |
| Créer des fichiers hors du repo | ❌ Interdit |
| Modifier `multi-repo-target/` | ✅ Autorisé |
| Commiter les changements | ✅ Obligatoire |

---

_Dernière mise à jour : Avril 2026 — Tayierjiang Tayier_