---
name: Fantasia Fauna — Encre et légendes
version: alpha
colors:
  primary: "#29252b"
  secondary: "#625961"
  accent: "#805729"
  neutral: "#f5f1e8"
  surface: "#fffcf6"
  night: "#151419"
  gold: "#dcb579"
typography:
  heading:
    fontFamily: Source Serif 4
    fontWeight: 500
    lineHeight: 1.06
  body:
    fontFamily: Segoe UI
    fontSize: 1rem
    lineHeight: 1.6
rounded:
  sm: 4px
  md: 6px
spacing:
  xs: 8px
  sm: 16px
  md: 24px
  lg: 48px
components:
  page:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.primary}"
  link:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.accent}"
  caption:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.secondary}"
  dark-page:
    backgroundColor: "{colors.night}"
    textColor: "{colors.gold}"
---

## Overview

Un bestiaire fantasy illustré : les créatures, leurs récits et leurs pouvoirs sont le sujet. L'identité évoque un livre de légendes contemporain. Aucun vocabulaire de musée ou de cabinet de curiosités dans l'accueil. Les archétypes humains restent identifiés comme tels dans les fiches.

Références consultées : [format DESIGN.md de Google](https://github.com/google-labs-code/design.md), [collection VoltAgent](https://github.com/voltagent/awesome-design-md), [analyse Oura](https://getdesign.md/oura/design-md). De cette dernière, retenir l'espace, la hiérarchie éditoriale et le contraste entre titres à empattements et interface discrète. La palette, le dragon, le logo et la mise en page sont propres à Fantasia Fauna.

## Colors

Ivoire chaud pour la lecture, encre légèrement prune pour les textes, bronze pour les liens. En mode sombre : fond encre #151419, surface #201e25, texte #f3ede2, secondaire #bcb3ad, or #dcb579. Aucun vert dans l'interface. Les illustrations gardent leurs couleurs originales. Les quatre positions de thème et les préférences enregistrées restent disponibles.

## Typography

Source Serif 4 pour les titres et articles, Segoe UI/system-ui pour la navigation et les outils. Titre d'accueil de 42 à 68 px, interligne 1.06. Paragraphes d'article de 18 à 19 px avec interligne 1.8 et largeur limitée. Les textes longs doivent rester agréables à lire.

## Layout

Largeur maximale 1200 px. Accueil en deux colonnes : titre et accès au catalogue à gauche, dragon rouge dans une arche sombre à droite. Sur mobile, une seule colonne. Grille de quatre créatures sur ordinateur, deux sur mobile, une sous 380 px. Recherche et tri natifs, visibles, avec libellés. Aucune bordure de focus autour du contenu principal ; conserver les indicateurs de focus des éléments interactifs.

## Components

Emblème vectoriel original : tête de dragon inscrite dans un hexagone, réutilisée comme favicon. Les cartes présentent les sprites sur un fond presque noir, un numéro discret, un nom et une flèche. Pas de multiplication de panneaux décoratifs. Un trait fin sépare les zones fonctionnelles. Le dragon d'accueil renvoie à sa fiche.

## Motion and accessibility

Survol léger des illustrations, désactivé avec prefers-reduced-motion. Contrôles d'au moins 44 px, focus visible, lien d'évitement, titres ordonnés et texte alternatif. Les couleurs ne portent jamais seules une information. Le logo reste visible sur petits écrans.

## Content

340 créatures. Les 109 notices complètes ont priorité sur les présentations courtes. Les 231 présentations proviennent de textes existants, sont éditables dans data/descriptions.json et ne modifient pas le registre de validation des articles longs. Les références restent dans les données éditoriales et ne s'affichent pas dans les pages publiques.
