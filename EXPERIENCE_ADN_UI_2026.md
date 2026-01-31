# PROTOCOLE ADN : EXPÉRIENCE UI "MIDNIGHT GLASS 2026"
# STATUT: VALIDÉ / PRODUCTION
# ORIGINE: Projet Bâtiment Rénovation Paris (Janvier 2026)
# DESTINATION: Répertoire Gouvernance Intelligence Artificielle

## 1. PHILOSOPHIE VISUELLE : "NE PAS ÉTEINDRE, MAIS ÉLECTRISER"
Le passage au Dark Mode ne doit jamais être une simple "inversion". C'est un changement d'atmosphère.
- **Règle d'Or :** Un "Dark Mode" réussi n'est pas noir, il est **Bleu Nuit Profond & Translucide**.
- **L'Effet "Vivant" :** Les images de fond (Hero Section) ne doivent pas être masquées par un voile sombre uniforme. Elles doivent être contrastées et saturées (`filter: contrast(1.1) saturate(1.2)`) pour rester vibrantes dans la pénombre.

## 2. LOI DE LA COHÉRENCE GÉOMÉTRIQUE (LE "PILL RULE")
La géométrie des objets interactifs (boutons, inputs) est une ancre cognitive pour l'utilisateur. Elle ne doit **JAMAIS** changer entre les thèmes.
- **Erreur Identifiée :** Boutons "Pilules" en Light Mode devenant "Rectangles arrondis" en Dark Mode.
- **Correction ADN :** Forcer `border-radius: 9999px` (Full Pill) dans les deux thèmes.
- **Code Standard :**
```css
/* Standard Pilule Universel */
.element-ui {
    border-radius: 9999px !important; 
}
```

## 3. LOI DU CONTRASTE ÉLECTRIQUE (TEXTE & BOUTONS)
Le blanc pur est insuffisant. Pour créer l'effet "2026 Premium", il faut utiliser la lumière.
- **Couleur Signature :** Cyan Néon (`#00f2ff`).
- **Typographie :** Les titres sur fond sombre nécessitent une lueur externe (Glow) pour la lisibilité et l'esthétique.
- **Boutons :** Ne jamais utiliser de boutons plats (Flat) en Dark Mode s'ils ont du volume en Light Mode. Utiliser des ombres internes/externes pour simuler la matérialité.
- **Code Standard (Bouton Midnight 3D) :**
```css
background-color: rgba(30, 41, 59, 0.6); /* Corps semi-solide */
box-shadow: 
    0 4px 6px rgba(0, 0, 0, 0.3), /* Ombre portée */
    inset 0 1px 0 rgba(255, 255, 255, 0.05); /* Reflet supérieur (Lumière) */
border: 1px solid rgba(56, 189, 248, 0.1); /* Bordure subtile Cyan */
```

## 4. LOI DE L'ANCRAGE UX (TOGGLE & AVATAR)
Les contrôles contextuels (comme le changement de thème) ne doivent pas flotter dans le vide s'ils concernent l'interface globale.
- **Règle :** Le bouton "Lune/Soleil" est physiquement lié à l'identité de l'utilisateur (Avatar).
- **Positionnement :** Toujours "Côte-à-Côte". Le bouton doit être le jumeau de l'avatar.
- **Esthétique :** Si l'avatar est "Clean" (Cercle, bordure nette), le bouton doit l'être aussi. Pas d'effet "Neon Glow" flou à côté d'une photo nette.

## 5. GESTION DES FLUX (SIDEBAR & OVERFLOW)
Dans une interface riche (Sidebar à arborescence), l'espace horizontal est critique.
- **Problème :** L'indentation progressive pousse le texte hors de l'écran.
- **Solution ADN :** Réduire l'indentation de moitié (`0.75rem` vs `1.5rem`) et forcer le `box-sizing: border-box`. Le contenu doit s'adapter au conteneur, jamais l'inverse.

---
*Ce document résume l'intelligence acquise lors de la session de refonte UI. Il doit servir de base "Genome" pour tout futur module d'interface généré par l'IA.*
