# Refonte du bestiaire — 28 octobre 2026

Palette ivoire/encre/or, emblème dragon, favicon, accueil centré sur les créatures fantasy et illustration de dragon issue du catalogue. DESIGN.md décrit le système visuel et ses références.

## Couverture éditoriale

Les 340 fiches ont maintenant une description développée : 109 articles complets existants et 231 présentations courtes (introduction et paragraphes de présentation), sélectionnées depuis les brouillons existants. Ces présentations sont éditables dans data/descriptions.json et assemblées par tools/build_descriptions.py. Les articles complets restent prioritaires dans le rendu.

Cette intégration ne constitue pas une validation documentaire des 231 articles longs. Le registre reviewed-notices.json et les sources longues sont préservés. Le contrôle du corpus long préexistant trouve 151 erreurs de longueur ou de nombre de paragraphes ; aucune règle n'a été assouplie pour les masquer. Leur finalisation et leur relecture restent un travail éditorial distinct. Les accroches courtes manifestement trop absolues ont été reformulées dans la nouvelle source.

Les appels bibliographiques restent internes, conformément au fonctionnement existant du site.

## Vérification

Contrôler les 340 routes, la priorité des articles complets, la recherche, le tri, les liens de sommaire, les quatre thèmes, les shells Pages identiques et l'absence de sources publiques. Génération reproductible : python tools/build_descriptions.py --check.
