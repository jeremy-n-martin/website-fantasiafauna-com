# État du chantier éditorial — publication progressive

Ce point contient **103 notices longues JSON sur 340**, soit **33 nouvelles notices** depuis le point précédent. Il reste **237 notices à rédiger**. Les 340 fiches synthétiques du catalogue sont distinctes de ce corpus long.

## Rédaction et relecture

- Les 103 notices présentes passent les contrôles structurels et de duplication. Ce contrôle n'est pas une validation documentaire ou littéraire.
- Les neuf reprises substantielles de la première revue sont corrigées : Aarakocra, Aasimar, Aboleth, Cryomancien, Dryade, Écuyer, Marilith, Quetzalcoatl et Sidhe.
- Huit autres notices ont reçu les corrections stylistiques demandées. Une seconde relecture indépendante a validé les corrections des dix-sept textes et recoupé leurs nouveaux détails factuels. Le compte rendu est conservé dans `docs/relectures/corrections-initiales.json`.
- Avec le Shoggoth, inchangé depuis sa revue favorable, et le Tyrannœil de référence, **19 notices sont approuvées pour intégration**. Les 84 autres restent des brouillons en attente de relecture ou de décision éditoriale.

## Intégration au site

`js/notices.js` contient maintenant les **19 notices approuvées**, assemblées par `tools/build_reviewed_notices.py`. Les autres entrées conservent leur fiche synthétique ; elles ne sont pas présentées comme des notices longues terminées.

`data/reviewed-notices.json` associe chaque notice approuvée à l'empreinte SHA-256 de son JSON canonique. Toute modification invalide cette approbation jusqu'à nouvelle relecture. Le constructeur historique `tools/build_notices.py` reste inchangé et refuse toujours un corpus incomplet.

Les 19 pages ont été contrôlées sur le site local réel : cinq sections, six sous-parties naturelles, sources présentes et cibles des citations valides. Un clic de source et l'absence de débordement horizontal ont aussi été vérifiés sur Méduse en format mobile.

## Sauvegarde et déploiement

Les brouillons et les notices relues sont sauvegardés régulièrement sur `main`, avec des statuts distincts. La génération locale de `js/notices.js` ne prouve pas le déploiement distant : GitHub Pages doit être contrôlé après le push.

Les journaux d'agents, caches de sources, dépendances de test et réglages Hermes restent exclus de Git.
