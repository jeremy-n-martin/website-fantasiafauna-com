# Fantasia Fauna — journal autonome

## Objectif produit
Transformer le site statique Fantasia Fauna en prototype jouable : cartes type Magic/Hearthstone générées depuis les créatures et leurs images, mage joueur, booster initial, carte du monde façon Might and Magic avec villes/marchés/duels, combats de cartes comme cœur du jeu.

## État initial vérifié
- Repo local : `D:/dev/website-fantasiafauna-com`
- Source GitHub : https://github.com/jeremy-n-martin/website-fantasiafauna-com
- Site public : https://fantasiafauna.com/ (fetch automatique échoué pendant l’intake)
- Données créatures : `creatures.md`
- Images disponibles : `img/` avec 2256 fichiers image détectés au premier inventaire.
- Parse prototype : 341 créatures exploitables avec image associée.

## Itération 0 — 2026-07-30
### Réalisé
- Remplacement de la landing page par un prototype jouable single-page.
- Génération de `game.js` contenant le catalogue de cartes dérivé de `creatures.md`.
- Cartes affichées avec coût, attaque, vie, rareté, faction/capitale, image et capacité de sort dérivée des rôles (`caster`, `volant`, `tank`, `ranged`, `normal`).
- Booster initial automatique de 15 cartes.
- Carte du monde avec villes, marchés et lieux de duel/boss.
- Système de combat : main, deck, plateau allié/adverse, mana, tour adverse simple, dégâts, victoire/défaite, récompenses or/cartes.

### Vérification réelle
- `node --check D:/dev/website-fantasiafauna-com/game.js` : OK.
- Serveur local `python -m http.server 8123` lancé depuis le repo : OK.
- Navigation navigateur `http://localhost:8123/` : page chargée, titre correct, carte du monde visible, booster initial visible.
- Console navigateur : aucune erreur JS.
- Duel rapide déclenché dans le navigateur : écran combat affiché.
- Invocation d’une carte via DOM click : main passée de 5 à 4 et plateau allié passé à 1.

## Contraintes pour les itérations cron
- Ne pas pousser ni déployer sans autorisation explicite.
- Préserver le travail non lié déjà présent dans l’arbre : `capitales.md` supprimé et plusieurs gros fichiers/dossiers non suivis existent déjà; ne pas les nettoyer ni les committer par défaut.
- Faire des petits commits locaux ciblés uniquement pour les fichiers réellement modifiés par l’itération.
- Priorité : jouabilité visible > loaders abstraits > refactor prématuré.
- À chaque itération : incrémenter un compteur, noter commandes/test réels, donner un résumé critique court.

## Prochaines actions minimales proposées
1. Ajouter persistance `localStorage` pour collection/progression.
2. Ajouter sélection de cibles et vraie riposte plutôt que cible automatique.
3. Ajouter deckbuilding simple depuis la collection.
4. Ajouter villes différenciées par capitale avec boutiques thématiques.
5. Ajouter équilibrage/rarités plus strict et écran de booster.


## Itération 1 — 2026-07-30
### Réalisé
- Ajout d’un vrai MVP de rectos de cartes inspirés de Magic directement visible en haut du site.
- Chaque carte affiche désormais : nom, coût d’invocation, image, capitale/faction, type/origine/nature, capacité, histoire courte, citation, ATQ, DEF et popularité.
- Ajout d’une galerie filtrable/recherchable par capitale, rôle, origine, rareté ou nom.
- Ajout d’un aperçu de booster avec cartes grand format.
- Ajout d’une sauvegarde locale `localStorage` pour collection/or/jour.

### Vérification réelle
- `node --check game.js` : OK.
- Serveur local `python -m http.server 8124` : OK.
- Navigation navigateur `http://localhost:8124/?mvp=cards` : OK.
- DOM vérifié : 17 cartes grand format visibles, textes ATQ/DEF présents, histoire de créature présente, citation `« ... »` présente.
- Recherche `dragon` saisie dans le champ : interface réactive.
- Échantillon images chargé en HTTP 200 : Jormungandr, Quetzalcoatl, Ziz, Typhon, Hécatonchire, Léviathan, Fenrir, Tarasque.

### Limites
- Certaines histoires sont générées depuis les stats existantes; elles donnent du contexte jouable mais ne sont pas encore du lore rédigé à la main carte par carte.
- Le combat reste fonctionnel mais encore simple; la priorité de cette tranche était l’affichage recto des cartes.

### Prochaine action minimale
- Ajouter un détail modal au clic sur une carte + deckbuilding drag/select avant combat.


## Itération 2 — 2026-07-30
### Réalisé
- Ajout d’un grimoire de combat/deckbuilding visible depuis l’écran monde.
- La sauvegarde `localStorage` mémorise désormais les `deckIds` choisis par le joueur.
- Le booster initial préremplit un deck de départ, les boosters/échanges ajoutent automatiquement les nouvelles cartes tant qu’il reste de la place.
- Le bouton “Duel rapide” construit le deck de combat depuis les cartes verrouillées, puis complète automatiquement les emplacements libres.
- Les cartes récentes de collection sont cliquables et affichent un badge “Dans le deck” quand elles sont sélectionnées.

### Vérification réelle
- `node --check game.js` : OK.
- Smoke test Node `.hermes/smoke_deckbuilding.js` avec DOM/localStorage simulés : OK (`deckbuilding_smoke=OK`), puis script temporaire supprimé.
- Serveur local `python -m http.server 8125` : OK.
- `curl -I http://localhost:8125/` : HTTP 200.
- `curl -s http://localhost:8125/ | grep -E 'Arcanes du Bestiaire|game.js'` : titre et script présents.

### Limites
- Test DOM simulé, pas une vraie interaction navigateur graphique dans ce run cron.
- Le choix de deck est encore basé sur les IDs de créatures; les doublons d’une même créature ne sont pas distingués visuellement comme exemplaires séparés.
- Le ciblage en combat reste automatique.

### Prochaine action minimale
- Ajouter un ciblage explicite en combat : sélectionner une créature alliée puis choisir une cible adverse ou le mage ennemi.

## Itération image-fix — 2026-07-30
### Réalisé
- Cause racine: le dossier `img/` était ignoré par `.gitignore` et n’était donc pas publié sur GitHub Pages; les cartes en ligne affichaient des cadres noirs / images 404.
- Ajout forcé des 2256 images `img/*.png` au dépôt pour que GitHub Pages puisse les servir.
- Désactivation du lazy-loading sur les illustrations de cartes pour éviter que des cartes visibles restent noires pendant le rendu initial.

### Vérification réelle
- Avant fix: `https://fantasiafauna.com/img/Jormungandr%201.png` renvoyait 404.
- Après publication: `https://fantasiafauna.com/img/Jormungandr%201.png` sert un PNG en HTTP 200, 43194 octets.
- Vérification navigateur live: les premières cartes affichent maintenant des créatures visibles; `naturalWidth > 0` pour Jormungandr, Ziz, Quetzalcoatl, Typhon, Hécatonchire, Léviathan, Fenrir, Tarasque.

### Limites
- GitHub Pages met quelques minutes à servir toutes les 2256 images via ses caches; forcer `Ctrl+F5` ou un `?v=e057227` règle le cache navigateur.


## Itération crop-fix — 2026-07-30
### Réalisé
- Correction des images coupées dans les rectos de cartes: passage de `object-fit: cover` à `object-fit: contain` pour les grandes cartes et les mini-cartes.
- Positionnement absolu des images dans le cadre pour empêcher le navigateur de conserver un rendu plus haut que le cadre.

### Vérification réelle
- Serveur local `python -m http.server 8126` : OK.
- Vérification DOM: les 8 premières grandes cartes ont `object-fit: contain`, `position: absolute`, image rendue 242x216 dans cadre 246x220, `naturalWidth > 0`.
- Vérification visuelle navigateur: les créatures sont moins zoomées et ne sont plus coupées brutalement dans les cadres.

## Itération 3 — 2026-07-30
### Réalisé
- Ajout d’un ciblage explicite en combat: cliquer une créature alliée prête la sélectionne, puis cliquer une créature adverse ou le bouton du mage adverse résout l’attaque.
- Ajout d’un feedback joueur visible: texte d’aide de ciblage, bouton `Mage adverse`, halo sur la créature alliée sélectionnée et curseur de cible sur les adversaires.
- Conservation de la règle `Garde`: une créature tank adverse doit être ciblée avant les autres cartes ou le mage.
- Remplacement de l’ancienne attaque automatique par une attaque ciblée, tout en gardant `attackWith()` comme alias compatible.

### Vérification réelle
- `node --check game.js` : OK.
- Smoke test Node `.hermes/smoke_targeting.js` avec DOM/localStorage simulés : OK (`targeting_smoke=OK`), puis script temporaire supprimé.
- Serveur local `python -m http.server 8127` : OK.
- `curl -I http://localhost:8127/` : HTTP 200.
- `curl -s http://localhost:8127/game.js | grep -E 'selectAttacker|attackEnemyMage|target-hint'` : OK.

### Limites
- Test ciblage simulé côté Node; pas de vraie session navigateur graphique pendant ce run cron.
- Les sorts des casters restent à ciblage automatique; seule l’attaque de créature est maintenant ciblée.
- Le travail sale non lié du repo est préservé et non committé.

### Prochaine action minimale
- Étendre le ciblage aux sorts/capacités de caster ou ajouter un court tutoriel de premier duel guidé.


## Itération stack-game — 2026-07-30
### Réalisé
- Suppression de `POP` et `DEF` sur les rectos: les cartes affichent maintenant `ATQ`, `HP` et le nombre d’unités `[ ]`.
- Ajout d’un tier dérivé du coût/puissance; le nombre `[ ]` est calculé dans l’intervalle approximatif tier×2 à tier×3.
- Passage du combat à une logique de stacks: chaque carte invoque plusieurs unités, les dégâts réduisent les HP du stack et donc son nombre vivant.
- Hausse des PV mages/adversaires pour que le combat ne se termine pas en un coup avec les stacks.
- Les dégâts de créature scalent maintenant avec le nombre vivant du stack, façon Heroes/Might and Magic.

### Vérification réelle
- `node --check game.js` : OK.
- Serveur local `python -m http.server 8127` : OK.
- Navigation navigateur locale : rectos affichent `ATQ`, `HP`, `[ ]` et ne montrent plus `POP`/`DEF`.
- Duel rapide via JS/browser : ennemi à 135 PV, main 5 cartes, stacks visibles `[5]`, `[6]`, etc.
- Invocation d’une carte coût 1 : plateau allié passe à 1, sort déclenché.
- Tour adverse vérifié : stack ennemi attaque avec dégâts scalés par `[nombre]`, logs de combat cohérents.

### Limites
- Le balancing reste brutal mais nettement plus proche d’un vrai jeu de stacks; prochaine passe: équilibrer ATQ × nombre avec armure/réduction et améliorer l’IA.


## Itération siege-lanes — 2026-07-30
### Réalisé
- Remplacement du duel plat par un champ de bataille de siège: côté ennemi à gauche, défense du joueur à droite.
- Ajout des structures Tour/Village/Mur, chacune à 20 HP. Si la tour du joueur tombe à 0 HP, l’assaut passe en défaite.
- Ajout des zones de placement: devant le mur, sur le mur (2 places), entre village et mur.
- La zone arrière accepte les créatures faibles/coût bas ou ranged/caster; une créature de mêlée non volante ne peut pas attaquer depuis cette zone.
- Le village donne 6 points d’invocation fixes par tour.
- Priorité d’attaque ennemie implémentée: front -> mur -> créatures sur mur -> arrière -> tour.
- Capacité Vol prioritaire: peut contourner le front et frapper mur/tour.
- UI: ennemi affiché à gauche; images ennemies miroir horizontal avec CSS `scaleX(-1)`.
- Effet visuel de hit sur structures/créatures touchées via `lastHit` + animation CSS.

### Vérification réelle
- `node --check game.js` : OK.
- Serveur local `python -m http.server 8128` : OK.
- Test navigateur: lancement d’assaut, 6 structures visibles à 20/20 HP, zones visibles des deux côtés.
- Test tour ennemi: un Draugr ennemi apparaît à gauche, image miroir confirmée par `matrix(-1, 0, 0, 1, 0, 0)`.
- Test priorité: sans créature devant, l’ennemi attaque le mur; mur joueur passe de 20 à 8 HP.
- Test placement: choix `sur le mur`, invocation d’Érinye, nombre de cartes sur mur passe de 0 à 1.

### Limites
- Les structures ennemies existent visuellement mais leur village n’a pas encore de boucle économique propre.
- Prochaine passe: meilleur ciblage joueur des structures, équilibrage des dégâts de stacks contre les 20 HP de structures, capacités spéciales plus explicites.
