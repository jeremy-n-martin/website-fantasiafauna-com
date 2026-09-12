# Refonte de l’interface du bestiaire

## Direction

Le catalogue est une galerie à explorer ; la fiche est une page de lecture. Conserver les illustrations existantes et les textes, sans ajouter de framework ni convertir les brouillons en notices publiées.

Remplacer le fond sombre texturé et la police condensée par un fond papier clair, une encre foncée et un accent vert forêt. Conserver Source Serif 4 pour la lecture et les titres ; employer une sans-serif système pour les commandes et les métadonnées. Donner au texte une largeur de lecture raisonnable et une taille explicite, plutôt que laisser une grille de trois colonnes comprimer les paragraphes.

Le sommaire doit rester disponible sur mobile, et les six sous-parties d’histoire naturelle doivent avoir leurs propres ancres. Les métadonnées ne répètent plus le nom et l’accroche déjà présentés. Le zoom de l’illustration doit également être accessible au clavier.

## Références réellement consultées

- [Mintlify — documentation](https://www.mintlify.com/docs) : hiérarchie, navigation persistante, distinction entre texte et commandes. Référence de principes, pas copie de son identité visuelle.
- [MDN — élément a](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/a) : organisation d’un article avec sommaire et comportement natif des liens.
- [Baymard Institute — Readability: The Optimal Line Length](https://baymard.com/blog/line-length-readability) : éviter les lignes excessivement longues comme les colonnes trop étroites ; article consulté, recommandant un ordre de grandeur de 50–75 caractères.

## Défaut reproduit avant correction

Sur le site public, depuis `/creatures/aasimar`, un clic sur le sommaire « Histoire naturelle » ramenait à `/`. Le gestionnaire global construisait `new URL(href, location.origin)` : `#naturelle` était donc interprété relativement à la racine, et non à la page courante. Le correctif précédent des seules citations n’avait pas corrigé le routeur général.

## Critères de validation

- Clic réel sur sommaire, sous-parties naturelles, citations et lien d’évitement.
- URL directe avec fragment, rechargement, historique précédent/suivant.
- Liens externes, ouverture dans un autre onglet et téléchargements conservés.
- Recherche, tri, remise à zéro, fiche courte, page inconnue, navigation entre créatures et zoom accessibles.
- Vérification sur ordinateur et mobile, sans masquer un débordement avec `overflow-x: hidden`.
- `index.html` et `404.html` synchronisés pour les accès directs sur GitHub Pages.
- Relecture indépendante du code, puis contrôle du contenu effectivement déployé.

## Résultats de recette locale

- 19 notices longues et 594 clics de sommaire/citations contrôlés dans Chromium : route conservée, cible existante et DOM de notice préservé, aucune erreur relevée. Cela ne valide pas les contenus des sites externes cités.
- Catalogue, Aasimar et Chevalier de la mort contrôlés à 320, 390, 768 et 1280 pixels : aucun débordement horizontal dans ces 12 cas. Texte de notice : 18 px sur petit écran, 19 px sur grand écran.
- Axe-core 4.10.3, règles WCAG 2 A/AA et 2.1 AA : aucune violation automatique sur le catalogue de bureau et Aasimar de bureau/mobile. Ce résultat ne constitue pas une certification d’accessibilité.
- Recherche « dragon » : 13 résultats conformes aux données ; tri inverse et retour navigateur conservant recherche et tri contrôlés.
- Visionneuse : image Aasimar effectivement chargée et affichée, fermeture et restitution du focus au bouton contrôlées.
- Relecture indépendante : pas de régression bloquante ; régressions supplémentaires reproduites puis corrections pour l’ancre vide `#`, le chemin mal encodé et le transfert du focus après ouverture d’une autre page.
- Les tests `tools/check_anchor_navigation.js`, `tools/check_notice_render.js` et `tools/check_page_shells.py` contrôlent les principaux contrats. Les pages d’entrée GitHub Pages sont identiques et appellent les nouveaux assets `editorial4`.

Limites : contrôles visuels dans Chromium, pas sur appareils Safari/Firefox réels ; les 340 fiches partagent le nouveau gabarit, mais toutes n’ont pas été relues visuellement une à une. Les textes et le manifeste de publication ne sont pas modifiés par cette refonte.
