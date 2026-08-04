# Guide de commit et remote

## Stratégie de branches

Le projet utilise désormais 2 branches principales :

- main : branche stable de référence
- feature/swiss-esn-vitrine : branche de travail pour le développement React/ESN

Règle simple :
- on ne travaille pas directement sur main
- les évolutions se commitent sur feature/swiss-esn-vitrine
- main sert à recevoir les versions stabilisées

## Avant chaque commit

1. Vérifier l’état du dépôt
   ```bash
   git status
   ```

2. Vérifier les fichiers modifiés
   ```bash
   git diff --stat
   ```

3. Ajouter seulement les fichiers pertinents
   ```bash
   git add <fichier1> <fichier2>
   ```

   ou tout le lot si c’est un correctif cohérent :
   ```bash
   git add .
   ```

4. Vérifier ce qui va être commité
   ```bash
   git diff --cached
   ```

## Format de commit

Utiliser des messages clairs et courts.

Exemples :
```bash
git commit -m "feat(home): aligner la page d'accueil Swiss/ESN"
git commit -m "fix(launcher): corriger le démarrage depuis le bon dossier"
git commit -m "chore: nettoyer les artefacts et ignorer les fichiers générés"
```

## Push vers le remote

Vérifier le remote actuel :
```bash
git remote -v
```

Push de la branche de travail :
```bash
git push origin feature/swiss-esn-vitrine
```

Si la branche n’est pas encore suivie sur le remote :
```bash
git push -u origin feature/swiss-esn-vitrine
```

## Synchronisation avec main

Avant de continuer sur la branche de travail, il est conseillé de récupérer les derniers changements de main :

```bash
git checkout main
git pull origin main
git checkout feature/swiss-esn-vitrine
git merge main
```

## Bonnes pratiques

- un commit = une amélioration logique
- éviter les commits trop gros
- ne pas committer les fichiers générés inutiles
- garder les messages de commit explicites
- pousser régulièrement pour éviter de perdre du travail

## Remote actuel

Le remote configuré pour ce dépôt est :
```bash
origin  https://github.com/ta-dev-ai/Django-enterprise-platform.git
```
