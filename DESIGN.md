---
name: Fantasia Fauna — Arches et argent
version: alpha
colors:
  primary: "#172334"
  secondary: "#536174"
  accent: "#394e6b"
  neutral: "#f1f4f8"
  surface: "#ffffff"
  night: "#0e1520"
  silver: "#c7d5eb"
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
    textColor: "{colors.silver}"
---

## Overview

Un bestiaire fantasy illustré : les créatures, leurs récits et leurs pouvoirs sont le sujet. L'identité évoque un livre de légendes contemporain. Aucun vocabulaire de musée ou de cabinet de curiosités dans l'accueil. Les archétypes humains restent identifiés comme tels dans les fiches.

Références consultées : [format DESIGN.md de Google](https://github.com/google-labs-code/design.md), [collection VoltAgent](https://github.com/voltagent/awesome-design-md), [analyse Oura](https://getdesign.md/oura/design-md). De cette dernière, retenir l'espace, la hiérarchie éditoriale et le contraste entre titres à empattements et interface discrète. La palette, le dragon, le logo et la mise en page sont propres à Fantasia Fauna.

## Colors

Noir bleuté #0e1520, blanc froid #f0f4fb et argent #c7d5eb, suivant le choix explicite de l’utilisateur. Surfaces #151f2d, textes secondaires #aebbd0. Les versions claires utilisent un blanc froid et une encre ardoise. Aucun accent doré, bronze ou vert. Les illustrations gardent leurs couleurs originales. Les quatre positions de thème et les préférences enregistrées restent disponibles.

## Typography

Source Serif 4 pour les titres et articles, Segoe UI/system-ui pour la navigation et les outils. Titre d'accueil de 42 à 68 px, interligne 1.06. Paragraphes d'article de 18 à 19 px avec interligne 1.8 et largeur limitée. Les textes longs doivent rester agréables à lire.

## Layout

Largeur maximale 1200 px. Accueil en deux colonnes : titre et accès au catalogue à gauche, dragon rouge dans une arche sombre à droite. Sur mobile, une seule colonne. Grille de quatre créatures sur ordinateur, deux sur mobile, une sous 380 px. Recherche et tri natifs, visibles, avec libellés. Aucune bordure de focus autour du contenu principal ; conserver les indicateurs de focus des éléments interactifs.

Les fiches réservent cinq colonnes sur douze à une grande illustration sous arche, sept à l’identité et aux caractéristiques. Les informations pratiques utilisent une police sans empattement plus compacte ; les articles gardent la police de lecture. Le décor végétal derrière les articles est supprimé. Sur mobile, titre et introduction, puis illustration large, caractéristiques et texte. Les actions permettent d’agrandir ou de changer l’image au clavier.

## Components

Emblème vectoriel original : tête de dragon inscrite dans un hexagone, réutilisée comme favicon. Les cartes présentent les sprites sous une arche, sur un fond noir bleuté, un numéro discret, un nom et une flèche. Pas de multiplication de panneaux décoratifs. Un trait fin sépare les zones fonctionnelles. Le dragon d'accueil renvoie à sa fiche.

## Motion and accessibility

Survol léger des illustrations, désactivé avec prefers-reduced-motion. Contrôles d'au moins 44 px, focus visible, lien d'évitement, titres ordonnés et texte alternatif. Les couleurs ne portent jamais seules une information. Le logo reste visible sur petits écrans.

## Content

340 créatures. Les 109 notices complètes ont priorité sur les présentations courtes. Les 231 présentations proviennent de textes existants, sont éditables dans data/descriptions.json et ne modifient pas le registre de validation des articles longs. Les références restent dans les données éditoriales et ne s'affichent pas dans les pages publiques.
