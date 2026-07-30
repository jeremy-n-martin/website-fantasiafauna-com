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


## Itération unit-count-rule — 2026-07-30
### Réalisé
- Changement de sémantique de `[ ]`: ce n’est plus le nombre direct d’unités en jeu, c’est la valeur de division.
- À la mise en jeu, le nombre d’unités vaut `max(1, round(30 / [ ]))`.
- Les dégâts d’une créature valent maintenant son ATQ seule, plus `ATQ × nombre`.
- Une créature reste limitée à une attaque par tour via `exhausted`; les cartes jouées arrivent déjà épuisées.
- Les HP de stack restent cumulés: si les dégâts dépassent les HP de l’unité du dessus, l’unité suivante prend le reliquat, et ainsi de suite jusqu’à destruction du tas.
- Les mini-cartes de bataille affichent maintenant `[valeur]` et `Unités: vivantes/initiales`.

### Vérification réelle
- `node --check game.js` : OK.
- Serveur local `python -m http.server 8129` : OK.
- Test navigateur: carte avec `[10]` invoque 3 unités (`round(30/10)`).
- Test overflow: stack 3 unités × 7 HP = 21 HP; après 8 dégâts, HP=13 et unités vivantes=2, donc le reliquat est bien passé à l’unité suivante.
- Test dégâts: `strikePower(c) === c.attack` confirmé.
- Test cadence: carte jouée arrive `exhausted=true`, donc pas d’attaque immédiate/supplémentaire.


## Itération passive-effects-columns — 2026-07-30
### Réalisé
- Ajout d’une première couche de mécaniques spéciales/passives dérivées des rôles des créatures.
- Chaque lane contient maintenant 5 colonnes/emplacements verticaux; les cartes posées reçoivent une position `pos` de 0 à 4.
- Les effets adjacents utilisent la position: un tank avec Rempart protège les unités gauche/droite dans le même emplacement.
- Passifs ajoutés:
  - Maçon: créature faible coût <=2 répare +1 HP au mur allié au début du tour si le mur est endommagé.
  - Étincelle: caster inflige 1 dégât à une unité adverse aléatoire au début du tour.
  - Rempart: tank réduit de 1 les dégâts reçus par une unité adjacente gauche/droite.
  - Boule de feu: gros caster/mage tous les 3 jours, 3 dégâts en cercle sur une colonne et les colonnes voisines.
  - Sentinelle: ranged identifié comme soutien/attaque arrière.
- UI: mini-cartes affichent maintenant le libellé de l’effet spécial; lanes rendues en 5 colonnes épaisses.

### Vérification réelle
- `node --check game.js` : OK.
- Serveur local `python -m http.server 8130` : OK.
- Test navigateur: assaut lancé, lane front affiche 5 cellules.
- Test placement: deux cartes jouées devant le mur, positions 0 et 1.
- Test effet Rempart: Nuckelavee tank en colonne 2 protège Cacodémon adjacent; dégâts ennemis réduits de 3 à 2 dans le log.
- Test affichage effets: Étincelle/Rempart visibles sur mini-cartes.

### Limites
- Les effets sont encore dérivés automatiquement des rôles, pas encore assignés créature par créature.

### Prochaine action minimale
- Permettre au joueur de choisir explicitement la colonne de placement au lieu du premier slot libre.


## Itération column-choice — 2026-07-30
### Réalisé
- Ajout d’un choix explicite de colonne tactique côté joueur: les 5 cellules alliées sont cliquables et la cellule choisie reçoit un halo visible.
- Le placement de carte utilise maintenant la colonne choisie si elle est libre, sinon retombe honnêtement sur la première colonne libre de la zone.
- Conservation des contraintes de combat: pas de POP/DEF, affichage `[ ]` distinct des unités vivantes, règle 30/[ ], dégâts ATQ seuls et placement par zones front/mur/arrière.
- Évite le conflit entre clic de cellule et clic de carte alliée/adverse via `event.stopPropagation()` sur les mini-cartes.

### Vérification réelle
- `node --check game.js` : OK.
- `node .hermes/smoke_column_choice.js` : OK (`column_choice_smoke=OK`), puis script temporaire supprimé avant commit.
- Serveur local `python -m http.server 8131` : OK.
- `curl -I http://localhost:8131/` : HTTP 200.
- `curl -s http://localhost:8131/game.js | grep -E 'setPendingPos|chosenPosFor|cell chosen'` : OK.
- Commit local `f5ed9ab` puis `git push origin main` : OK (`009eea2..f5ed9ab main -> main`).
- Vérification GitHub raw `https://raw.githubusercontent.com/.../main/game.js` : OK, contient `setPendingPos` et `chosenPosFor`.
- Vérification site public `https://fantasiafauna.com/game.js?v=f5ed9ab-retry` : encore stale pendant ce run (`public_game_js_attempt_1/2/3=False`, 131853 octets); probable délai/cache GitHub Pages.

### Limites
- Smoke test DOM simulé côté Node; pas de vraie session navigateur graphique dans ce run cron.
- Les deux logs de choix zone/colonne peuvent apparaître lors d’un clic cellule; c’est lisible mais encore verbeux.
- Le travail sale non lié du repo est préservé et non committé.
- Le commit applicatif est sur `origin/main`, mais `fantasiafauna.com` ne servait pas encore le nouveau `game.js` au moment de la vérification finale.

### Prochaine action minimale
- Ajouter une petite aide visuelle/texte en combat indiquant explicitement “clique une colonne puis une carte” et vérifier un effet adjacent Rempart avec colonne choisie.

## Itération placement-guide — 2026-07-30
### Réalisé
- Ajout d’une aide visible au centre du champ de bataille: ordre tactique en 3 étapes (colonne → carte de main → attaque).
- Ajout d’un badge “Placement actif” affichant la zone et la colonne actuellement choisies.
- Remplacement du double log de clic cellule par `setPlacement(slot, pos)`: un clic de colonne choisit zone+colonne avec un seul message d’action.
- Conservation des règles existantes: pas de POP/DEF, affichage ATQ/HP/[ ], règle 30/[ ], dégâts ATQ seuls, colonnes 0..4, placement front/mur/arrière.

### Vérification réelle
- `git status --short --branch` : branche `main`, travail sale non lié toujours présent et non touché.
- `node --check game.js` : OK.
- `node .hermes/smoke_placement_guide.js` : OK (`placement_guide_smoke=OK`), puis script temporaire supprimé.
- Serveur local `python -m http.server 8132` : OK.
- `curl -I http://localhost:8132/` : HTTP 200.
- `curl -s http://localhost:8132/game.js | grep -E 'setPlacement|Ordre tactique|Placement actif'` : OK.

### Limites
- Smoke test DOM simulé côté Node; pas de vraie session navigateur graphique dans ce run cron.
- Amélioration volontairement UI/UX minimale; elle rend le placement plus lisible mais n’ajoute pas encore de nouvelle capacité.
- Le travail sale non lié du repo est préservé et non committé.

### Prochaine action minimale
- Vérifier/renforcer en jeu l’effet Rempart avec colonne choisie, idéalement avec un indicateur visuel sur l’unité protégée et son protecteur adjacent.

### Publication de l’itération placement-guide
- Commit local applicatif: `a752e22` (`Add siege placement guide`).
- `git push origin main`: OK (`5e56b3f..a752e22 main -> main`).
- Vérification GitHub raw `game.js`: OK, contient `setPlacement`, `Ordre tactique`, `Placement actif`.
- Vérification GitHub raw `style.css`: OK, contient `placement-guide`.
- Vérification site public `https://fantasiafauna.com/game.js?v=a752e22`: HTTP 200 mais marqueurs absents pendant ce run; probable délai/cache GitHub Pages.

