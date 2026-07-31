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

## Itération rempart-visibility — 2026-07-30
### Réalisé
- Ajout d’un indicateur visuel sur le Rempart: une unité tank adjacente avec Rempart affiche maintenant `Rempart actif ↔`.
- Les unités alliées protégées par un Rempart adjacent affichent maintenant `Protégé par <nom>` avec halo vert.
- La logique reste basée sur les colonnes voisines gauche/droite dans la même zone/lane; aucune régression des règles ATQ/HP/[ ], 30/[ ], dégâts ATQ seuls ou placement de siège.

### Vérification réelle
- `git status --short --branch` : branche `main`, travail sale non lié toujours présent et non touché.
- `node --check game.js` : OK.
- `node .hermes/smoke_rempart_visibility.js` : OK (`rempart_visibility_smoke=OK {"tankProtector":true,"allyGuarded":true,"noPopDef":true,"stackShown":true}`), puis script temporaire supprimé.
- Serveur local `python -m http.server 8133` : OK.
- `curl -I http://localhost:8133/` : HTTP 200.
- `curl -s http://localhost:8133/game.js | grep -E 'protectsByRempart|guard-badge|Protégé par'` : OK.
- `curl -s http://localhost:8133/style.css | grep -E 'battle-card.guarded|guard-badge'` : OK.

### Limites
- Smoke test DOM simulé côté Node; pas de vraie session navigateur graphique pendant ce run cron.
- L’indicateur est pour les Remparts alliés visibles côté joueur; les Remparts ennemis ne reçoivent pas encore un badge dédié.
- Le travail sale non lié du repo est préservé et non committé.

### Prochaine action minimale
- Ajouter un effet visuel temporaire sur la réduction de dégâts Rempart au moment où l’attaque est résolue, ou rendre la Boule de feu ciblable sur une colonne.

### Publication de l’itération rempart-visibility
- Commit local applicatif: `a8f2895` (`Show active Rempart protection`).
- `git push origin main`: OK (`09a62a3..a8f2895 main -> main`).
- Vérification GitHub raw `game.js`: OK, contient `protectsByRempart`, `guard-badge`, `Protégé par`.
- Vérification GitHub raw `style.css`: OK, contient `battle-card.guarded` et `guard-badge`.
- Vérification site public `https://fantasiafauna.com/game.js?v=a8f2895` et `style.css?v=a8f2895`: HTTP 200 mais marqueurs absents pendant ce run; probable délai/cache GitHub Pages (`Last-Modified` encore 20:36:25).

## Itération guard-flash — 2026-07-30 23:04
### Réalisé
- Ajout d’un feedback visuel temporaire au moment où `Rempart` réduit les dégâts: le protecteur pulse en doré (`guard-flash`) et la cible protégée pulse en vert (`guarded-hit`).
- Ajout de badges d’impact lisibles: `Rempart -1 dégât` côté protecteur et `Dégât amorti` côté unité protégée.
- Le journal de combat précise maintenant la réduction: `Rempart absorbe 1 dégât, dégâts réduits à ...`.
- Conservation des règles existantes: pas de POP/DEF, ATQ/HP/[ ], règle 30/[ ], dégâts ATQ seuls, colonnes adjacentes gauche/droite.

### Vérification réelle
- `git status --short --branch` : branche `main`, travail sale non lié toujours présent et non touché (`capitales.md` supprimé, fichiers/dossiers non suivis existants).
- `node --check game.js` : OK.
- `node .hermes/smoke_guard_flash.js` : OK (`guard_flash_smoke=OK`), puis script temporaire supprimé avant commit.
- Serveur local `python -m http.server 8134` : OK.
- `curl -I http://localhost:8134/` : HTTP 200.
- `curl -s http://localhost:8134/game.js | grep -E 'lastGuardUid|guard-flash|Dégât amorti'` : OK.
- `curl -s http://localhost:8134/style.css | grep -E 'rempartPulse|guardedHit|impact-badge'` : OK.

### Limites
- Smoke test DOM simulé côté Node; pas de vraie session navigateur graphique pendant ce run cron.
- L’effet flash reste mémorisé jusqu’au prochain `markHit`, donc il indique le dernier amortissement plutôt qu’une timeline animée multi-coups.
- Le travail sale non lié du repo est préservé et non committé.

### Prochaine action minimale
- Rendre la Boule de feu ciblable par colonne, avec aperçu des colonnes touchées avant résolution.

### Publication de l’itération guard-flash
- Commit local applicatif: `eb0d9d4` (`Show Rempart damage reduction flash`).
- `git push origin main`: OK (`e9f386e..eb0d9d4 main -> main`).
- Vérification GitHub raw `game.js`: OK, contient `lastGuardUid`, `guard-flash`, `Dégât amorti`.
- Vérification GitHub raw `style.css`: OK, contient `rempartPulse`, `guardedHit`, `impact-badge`.
- Vérification site public `https://fantasiafauna.com/game.js?v=eb0d9d4` et `style.css?v=eb0d9d4`: HTTP 200 mais marqueurs absents pendant ce run; `Last-Modified` encore `Thu, 30 Jul 2026 20:50:51 GMT`, donc GitHub Pages/CDN probablement stale.


## Itération structure-targets — 2026-07-30 23:19
### Réalisé
- Ajout d’un panneau visible `Cibler une structure` côté ennemi avec boutons Tour, Village, Mur et Auto.
- Ajout de `attackEnemyStructureTarget(target)` pour résoudre une attaque de créature prête vers la structure choisie, avec log explicite `la tour adverse` / `le village adverse` / `le mur adverse`.
- Conservation de l’ancien comportement `Auto`: volant vers la tour si possible, sinon mur puis tour.
- Aucun retour de POP/DEF: les rendus testés conservent ATQ/HP/[ ], unités vivantes et dégâts ATQ seuls.

### Vérification réelle
- `git status --short --branch` : branche `main`, travail sale non lié toujours présent et non touché (`capitales.md` supprimé, fichiers/dossiers non suivis existants).
- `node --check game.js` : OK.
- `node .hermes/smoke_structure_targets.js` : OK (`structure_targets_smoke=OK {"beforeVillage":20,"afterVillage":13,"wall":20}`), puis script temporaire supprimé avant commit.
- Serveur local `python -m http.server 8135` : OK.
- `curl -I http://localhost:8135/` : HTTP 200.
- `curl -s http://localhost:8135/game.js | grep -E 'structure-targets|attackEnemyStructureTarget|structureLabel'` : OK.
- `curl -s http://localhost:8135/style.css | grep -E 'structure-targets'` : OK.

### Limites
- Smoke test DOM simulé côté Node; pas de vraie session navigateur graphique pendant ce run cron.
- Le ciblage structure n’ajoute pas encore de preview de dégâts ni de règles de protection par ligne frontale côté joueur.
- Le travail sale non lié du repo est préservé et non committé.

### Prochaine action minimale
- Ajouter un aperçu de dégâts/état avant clic sur structure, ou rendre Boule de feu ciblable par colonne.

### Publication de l’itération structure-targets
- Commit local applicatif: `05020d9` (`Add explicit structure targeting`).
- `git push origin main`: OK (`cf81171..05020d9 main -> main`).
- Vérification GitHub raw `game.js`: OK, contient `structure-targets`, `attackEnemyStructureTarget`, `structureLabel`.
- Vérification GitHub raw `style.css`: OK, contient `structure-targets`.
- Vérification site public `https://fantasiafauna.com/game.js?v=05020d9-1/2/3` et `style.css?v=05020d9`: HTTP 200 mais marqueurs absents pendant ce run; `Last-Modified` encore `Thu, 30 Jul 2026 21:06:33 GMT`, donc GitHub Pages/CDN probablement stale.

## Itération hit-badges — 2026-07-30 23:37
### Réalisé
- Ajout d’un indicateur de dégâts lisible directement sur la cible touchée: badge `-N` sur structure ou mini-carte après attaque/sort.
- Ajout de `lastHitText` pour mémoriser le montant du dernier impact sans changer la logique de dégâts.
- Les attaques sur structures explicites, les frappes ennemies sur structures, Boule de feu, Étincelle/sort direct et attaques créature→créature alimentent maintenant le feedback visuel.
- Conservation des règles existantes: pas de POP/DEF, affichage ATQ/HP/[ ], `[ ]` distinct des unités, invocation `max(1, round(30/[ ]))`, dégâts ATQ seuls et une attaque par tour via `exhausted`.

### Vérification réelle
- `git status --short --branch` : branche `main`, travail sale non lié toujours présent et non touché (`capitales.md` supprimé, fichiers/dossiers non suivis existants).
- `node --check game.js` : OK.
- `node .hermes/smoke_hit_badges.js` : OK (`hit_badges_smoke=OK {"before":20,"after":13,"lastHit":"enemy-wall","lastHitText":"-7"}`), puis script temporaire supprimé avant commit.
- Serveur local `python -m http.server 8136` : OK.
- `curl -I http://localhost:8136/` : HTTP 200.
- `curl -s http://localhost:8136/game.js | grep -E 'lastHitText|hit-badge'` : OK.
- `curl -s http://localhost:8136/style.css | grep -E 'hit-badge|damagePop'` : OK.

### Limites
- Smoke test DOM simulé côté Node; pas de vraie session navigateur graphique pendant ce run cron.
- Le badge indique le dernier impact rendu, pas une timeline de plusieurs impacts simultanés si plusieurs effets se résolvent en chaîne.
- Le travail sale non lié du repo est préservé et non committé.

### Prochaine action minimale
- Ajouter un aperçu de dégâts avant clic sur structure/cible, ou rendre Boule de feu ciblable par colonne avec preview des colonnes voisines.

### Publication de l’itération hit-badges
- Commit local applicatif: `4ebf294` (`Show damage hit badges`).
- `git push origin main`: OK (`a6a79e1..4ebf294 main -> main`).
- Vérification GitHub raw `game.js`: OK, contient `lastHitText` et `hit-badge`.
- Vérification GitHub raw `style.css`: OK, contient `hit-badge` et `damagePop`.
- Vérification site public `https://fantasiafauna.com/game.js?v=4ebf294` et `style.css?v=4ebf294`: HTTP 200 mais marqueurs absents pendant ce run; `Last-Modified` encore `Thu, 30 Jul 2026 21:20:58 GMT`, donc GitHub Pages/CDN probablement stale.

## Itération fireball-column — 2026-07-30 23:52
### Réalisé
- Ajout d’une Boule de feu ciblable par colonne pour les créatures alliées ayant le passif `Boule de feu`.
- Quand une créature Boule de feu prête est sélectionnée, un panneau central affiche 5 boutons de colonnes avec aperçu des colonnes voisines touchées et du nombre de cibles/mur.
- `castFireballColumn(pos)` applique 3 dégâts sur la colonne ennemie choisie et ses voisines, épuise le caster, vide la sélection et écrit un log explicite.
- Ajout du style visible `.fireball-picker` sans modifier les règles de siège: ATQ seuls, 30/[ ], HP total de stack, tour/village/mur 20 HP, colonnes 0..4, pas de POP/DEF.

### Vérification réelle
- `git status --short --branch` : branche `main`, travail sale non lié toujours présent et non touché (`capitales.md` supprimé, fichiers/dossiers non suivis existants).
- `node --check game.js` : OK.
- `node .hermes/smoke_fireball_column.js` : OK (`fireball_column_smoke=OK {"fireball":"Ange","before":[18,18,18],"after":[18,15,18],"exhausted":true}`), puis script temporaire supprimé avant commit.
- Serveur local `python -m http.server 8137` : OK.
- `curl -I http://localhost:8137/` : HTTP 200.
- `curl -s http://localhost:8137/game.js | grep -E 'fireballPicker|castFireballColumn|Boule de feu ciblable'` : OK.
- `curl -s http://localhost:8137/style.css | grep -E 'fireball-picker'` : OK.

### Limites
- Smoke test DOM simulé côté Node; pas de vraie session navigateur graphique pendant ce run cron.
- La Boule de feu ciblable est une action manuelle disponible quand le caster est sélectionné; l’ancien déclenchement automatique tous les 3 jours est conservé.
- Le travail sale non lié du repo est préservé et non committé.

### Prochaine action minimale
- Ajouter un surlignage visuel des colonnes ennemies qui seraient touchées par la Boule de feu avant le clic, ou une règle de recharge plus explicite pour éviter cumul manuel + automatique.

### Publication de l’itération fireball-column
- Commit local applicatif: `7c51be9` (`Add targeted fireball columns`).
- `git push origin main`: OK (`8bb112c..7c51be9 main -> main`).
- Vérification GitHub raw `game.js`: OK, contient `fireballPicker`, `castFireballColumn`, `Boule de feu ciblable`.
- Vérification GitHub raw `style.css`: OK, contient `fireball-picker`.
- Vérification site public `https://fantasiafauna.com/game.js?v=7c51be9` et `style.css?v=7c51be9`: HTTP 200 mais marqueurs absents pendant ce run; `Last-Modified` encore `Thu, 30 Jul 2026 21:39:26 GMT`, donc GitHub Pages/CDN reste probablement stale.

## Itération fireball-recharge — 2026-07-31 00:08
### Réalisé
- Clarification de la recharge de `Boule de feu`: le panneau de ciblage manuel apparaît maintenant comme `Boule de feu en recharge` hors des jours multiples de 3, avec indication du prochain jour disponible.
- `castFireballColumn(pos)` refuse désormais les tirs manuels hors fenêtre tactique et écrit un log explicite au lieu de permettre un cumul permanent.
- Le déclenchement automatique tous les 3 jours ignore les casters déjà épuisés, puis épuise le caster qui consomme sa fenêtre de Boule de feu; cela évite le double tir manuel + automatique le même jour.
- Ajout d’un style bleu distinct `.fireball-picker.recharging` pour rendre l’état indisponible visible.
- Règles préservées: pas de POP/DEF, ATQ/HP/[ ], invocation 30/[ ], dégâts ATQ seuls, HP total de stack, siège tour/village/mur et colonnes 0..4.

### Vérification réelle
- `git status --short --branch` : branche `main`, travail sale non lié toujours présent et non touché (`capitales.md` supprimé, fichiers/dossiers non suivis existants).
- `node --check game.js` : OK.
- Smoke test Node inline : OK (`fireball_recharge_smoke=OK {"caster":"Ange","before":18,"after":15,"nextDay":6}`), confirmant qu’au jour 1 le tir ne fait aucun dégât et qu’au jour 3 il inflige exactement 3 dégâts puis épuise le caster.
- Serveur local `python -m http.server 8138` : OK.
- `curl -I http://localhost:8138/` : HTTP 200.
- `curl -s http://localhost:8138/game.js | grep -E 'fireballWindowOpen|Boule de feu en recharge|selectedFireballSource'` : OK.
- `curl -s http://localhost:8138/style.css | grep -E 'fireball-picker\\.recharging'` : OK.

### Limites
- Smoke test DOM simulé côté Node; pas de vraie session navigateur graphique pendant ce run cron.
- Le compteur de recharge est global par jour de bataille, pas encore une icône/cooldown par carte persistante sur plusieurs combats.
- Le travail sale non lié du repo est préservé et non committé.

### Prochaine action minimale
- Ajouter un surlignage visuel des colonnes ennemies touchées par Boule de feu quand le panneau est prêt, ou afficher une petite pastille de cooldown directement sur les mini-cartes `Boule de feu`.

### Publication de l’itération fireball-recharge
- Commit local applicatif: `6ed7e8e` (`Clarify fireball recharge window`).
- `git push origin main`: OK (`df18f8b..6ed7e8e main -> main`).
- Vérification GitHub raw `game.js`: OK, contient `fireballWindowOpen`, `Boule de feu en recharge`, `selectedFireballSource`.
- Vérification GitHub raw `style.css`: OK, contient `fireball-picker.recharging`.
- Vérification site public `https://fantasiafauna.com/game.js?v=6ed7e8e` et `style.css?v=6ed7e8e`: HTTP 200 mais marqueurs absents pendant ce run; `Last-Modified` encore `Thu, 30 Jul 2026 21:54:58 GMT`, donc GitHub Pages/CDN reste probablement stale.

## Itération fireball-preview — 2026-07-31 00:24
### Réalisé
- Ajout d’un aperçu visuel de zone pour `Boule de feu`: quand une créature Boule de feu prête est sélectionnée pendant une fenêtre de jour multiple de 3, survoler/focus une colonne du panneau surligne les 3 colonnes ennemies touchées.
- Ajout de l’état `fireballPreviewPos`, de `setFireballPreview(pos)` et du badge `Boule de feu` directement dans les cellules ennemies concernées.
- Le tir ciblé efface l’aperçu après résolution et conserve la recharge existante: pas de tir hors fenêtre, pas de cumul manuel + automatique.
- Règles préservées: pas de POP/DEF, ATQ/HP/[ ], invocation 30/[ ], dégâts ATQ seuls, HP total de stack, siège tour/village/mur et colonnes 0..4.

### Vérification réelle
- `git status --short --branch` avant édition: branche `main`, travail sale non lié toujours présent et non touché (`capitales.md` supprimé, fichiers/dossiers non suivis existants).
- `node --check game.js`: OK.
- `node .hermes/smoke_fireball_preview.js`: OK (`fireball_preview_smoke=OK {"pickerReady":true,"highlighted":9,"cleared":true,"enemyHp":[15,23,23]}`), puis script temporaire supprimé avant commit.
- Serveur local `python -m http.server 8139`: OK.
- `curl -I http://localhost:8139/`: HTTP 200.
- `curl -s http://localhost:8139/game.js | grep -E 'setFireballPreview|fireballPreviewPos|fireball-preview'`: OK.
- `curl -s http://localhost:8139/style.css | grep -E 'fireball-preview|fireball-zone'`: OK.

### Limites
- Smoke test DOM simulé côté Node; pas de vraie session navigateur graphique pendant ce run cron.
- Le survol déclenche un re-render complet; fonctionnel au smoke test, mais une future passe pourrait rendre ce feedback plus fluide sans reconstruire tout le DOM.
- Le travail sale non lié du repo est préservé et non committé.

### Prochaine action minimale
- Ajouter une petite pastille/cooldown directement sur les mini-cartes `Boule de feu`, ou introduire un premier achat de marché thématique par ville/capitale.

### Publication de l’itération fireball-preview
- Commit local applicatif: `211e381` (`Preview targeted fireball columns`).
- `git push origin main`: OK (`f1453b8..211e381 main -> main`).
- Vérification GitHub raw `game.js`: OK, contient `setFireballPreview`, `fireballPreviewPos`, `fireball-zone`.
- Vérification GitHub raw `style.css`: OK, contient `fireball-preview` et `fireball-zone`.
- Vérification site public `https://fantasiafauna.com/game.js?v=211e381`: HTTP 200 mais marqueurs absents pendant ce run; `Last-Modified` encore `Thu, 30 Jul 2026 22:11:26 GMT`, donc GitHub Pages/CDN probablement stale.

## Itération enemy-intent — 2026-07-31 00:38
### Réalisé
- Ajout d’un aperçu d’intention sur les mini-cartes ennemies: badge `Vise: ...` indiquant la prochaine cible probable et les dégâts ATQ seuls.
- `enemyIntent(e)` reprend la priorité d’assaut existante: Vol → mur/tour, sinon créature devant le mur → mur → créature sur le mur → arrière → tour.
- Ajout du style `.intent-badge` pour rendre l’intention ennemie visible sans changer la résolution de combat.
- Règles préservées: pas de POP/DEF, ATQ/HP/[ ], invocation 30/[ ], dégâts ATQ seuls, HP total de stack, tour/village/mur à 20 HP et colonnes 0..4.

### Vérification réelle
- `git status --short --branch` avant édition: branche `main`, travail sale non lié toujours présent et non touché (`capitales.md` supprimé, fichiers/dossiers non suivis existants).
- `node --check game.js`: OK.
- `node .hermes/smoke_enemy_intent.js`: OK (`enemy_intent_smoke=OK {"intentWall":"Vise: Mur (4)","intentFront":"Vise: Pégase (4)","intentFlying":"Vise: Mur (7) · Vol"}`), puis script temporaire supprimé avant commit.
- Serveur local `python -m http.server 8140`: OK.
- `curl -I http://localhost:8140/`: HTTP 200.
- `curl -s http://localhost:8140/game.js | grep -E 'enemyIntent|intent-badge|Vise:'`: OK.
- `curl -s http://localhost:8140/style.css | grep -E 'intent-badge'`: OK.

### Limites
- Smoke test DOM simulé côté Node; pas de vraie session navigateur graphique pendant ce run cron.
- Le badge prédit la cible selon l’état courant avant résolution; si plusieurs ennemis attaquent à la suite, les badges suivants peuvent changer après le premier impact.
- Le travail sale non lié du repo est préservé et non committé.

### Prochaine action minimale
- Ajouter une preview symétrique côté joueur avant clic sur cible/structure: dégâts attendus, riposte éventuelle, et blocage par front/ranged/vol.

### Publication de l’itération enemy-intent
- Commit local applicatif: `64ae1b4` (`Show enemy attack intents`).
- `git push origin main`: OK (`74f6d18..64ae1b4 main -> main`).
- Vérification GitHub raw `game.js`: OK, contient `enemyIntent`, `intent-badge`, `Vise:`.
- Vérification GitHub raw `style.css`: OK, contient `intent-badge`.
- Vérification site public `https://fantasiafauna.com/game.js?v=64ae1b4`: HTTP 200 mais marqueurs absents pendant ce run; `Last-Modified` encore `Thu, 30 Jul 2026 22:25:23 GMT`, donc GitHub Pages/CDN probablement stale.

## Itération target-preview — 2026-07-31 00:52
### Réalisé
- Ajout d’une preview symétrique côté joueur: quand une créature alliée prête est sélectionnée, chaque cible ennemie affiche un badge `Clic: N dégâts` et indique la riposte de mêlée attendue.
- Les cibles bloquées par la ligne frontale affichent maintenant `Bloqué: <front> d’abord`, ce qui rend la règle front/ranged/vol plus lisible avant le clic.
- Les structures ennemies affichent aussi un badge de preview de dégâts quand une attaque est préparée.
- Règles préservées: pas de POP/DEF, ATQ/HP/[ ], invocation 30/[ ], dégâts ATQ seuls, HP total de stack, tour/village/mur à 20 HP et colonnes 0..4.

### Vérification réelle
- `git status --short --branch` avant édition: branche `main`, travail sale non lié toujours présent et non touché (`capitales.md` supprimé, fichiers/dossiers non suivis existants).
- `node --check game.js`: OK.
- Smoke test Node inline: OK (`target_preview_smoke=OK {"blocked":"Bloqué: Chevalier d’abord","frontPreview":"Clic: 4 dégâts · riposte 4","structure":"Clic: 4 dégâts"}`).
- Serveur local `python -m http.server 8141`: OK.
- `curl -I http://localhost:8141/`: HTTP 200.
- `curl -s http://localhost:8141/game.js | grep -E 'attackPreview|structurePreview|preview-badge'`: OK.
- `curl -s http://localhost:8141/style.css | grep -E 'preview-badge'`: OK.

### Limites
- Smoke test DOM simulé côté Node; pas de vraie session navigateur graphique pendant ce run cron.
- La preview structure montre uniquement les dégâts directs; elle ne simule pas encore une future règle de protection des structures par unités ennemies frontales.
- Le travail sale non lié du repo est préservé et non committé.

### Prochaine action minimale
- Ajouter un petit tutoriel de premier assaut ou une différenciation thématique du marché par ville/capitale.

### Publication de l’itération target-preview
- Commit local applicatif: `24f4851` (`Preview player attack targets`).
- `git push origin main`: OK (`716e96e..24f4851 main -> main`).
- Vérification GitHub raw `game.js`: OK, contient `attackPreview`, `structurePreview`, `preview-badge`.
- Vérification GitHub raw `style.css`: OK, contient `preview-badge`.
- Vérification site public `https://fantasiafauna.com/game.js?v=24f4851` et `style.css?v=24f4851`: HTTP 200 mais marqueurs absents pendant ce run; `Last-Modified` encore `Thu, 30 Jul 2026 22:40:10 GMT`, donc GitHub Pages/CDN reste stale.

## Itération themed-market — 2026-07-31 01:08
### Réalisé
- Ajout d’un marché de ville visible dans le panneau monde/actions: 3 offres déterministes liées à la capitale active, avec nom, capitale, rareté, prix, ATQ, HP et valeur `[ ]`.
- Ajout de `marketOffers()`, `marketPrice(c)` et `buyMarketCard(id)` pour acheter une créature précise au lieu de dépendre seulement de l’échange aléatoire.
- Le voyage vers une ville continue de changer `activeCapital`; les offres deviennent donc thématiques (ex: Sylve propose uniquement des créatures Sylve dans le smoke test).
- Règles préservées: pas de POP/DEF, affichage ATQ/HP/[ ], invocation 30/[ ], dégâts ATQ seuls, HP total de stack, siège tour/village/mur et colonnes 0..4.

### Vérification réelle
- `git status --short --branch` avant édition: branche `main`, travail sale non lié toujours présent et non touché (`capitales.md` supprimé, fichiers/dossiers non suivis existants).
- `node --check game.js`: OK.
- Smoke test Node inline: OK (`market_stalls_smoke=OK {"capital":"Sylve","offers":["Firbolg","Dryade","Hippogriffe"],"bought":"Firbolg","gold":963}`), confirmant le rendu du panneau, l’absence de POP/DEF, les offres Sylve et l’achat ciblé.
- Serveur local `python -m http.server 8142`: OK.
- `curl -I http://localhost:8142/`: HTTP 200.
- `curl -s http://localhost:8142/game.js | grep -E 'marketOffers|buyMarketCard|Marché de'`: OK.
- `curl -s http://localhost:8142/style.css | grep -E 'market-stalls'`: OK.

### Limites
- Smoke test DOM simulé côté Node; pas de vraie session navigateur graphique pendant ce run cron.
- Les offres sont déterministes par jour/lieu/capitale mais ne sont pas encore stockées comme inventaire de marchand persistant.
- Le travail sale non lié du repo est préservé et non committé.

### Prochaine action minimale
- Ajouter un tutoriel de premier assaut, ou faire évoluer les marchés de villes vers achats/ventes plus riches avec stock persistant et disponibilité par rareté.

### Publication de l’itération themed-market
- Commit local applicatif: `6216d56` (`Add themed city market offers`).
- `git push origin main`: OK (`e71393b..6216d56 main -> main`).
- Vérification GitHub raw `game.js`: OK, contient `marketOffers`, `buyMarketCard`, `Marché de`.
- Vérification GitHub raw `style.css`: OK, contient `market-stalls`.
- Vérification site public `https://fantasiafauna.com/game.js?v=6216d56` et `style.css?v=6216d56`: HTTP 200 mais marqueurs absents pendant ce run; `Last-Modified` encore `Thu, 30 Jul 2026 22:54:23 GMT`, donc GitHub Pages/CDN reste stale.

## Itération assault-tutor — 2026-07-31 01:28
### Réalisé
- Ajout d’un tutoriel de premier assaut visible au centre du combat, sous l’ordre tactique existant.
- Le tutoriel affiche une checklist dynamique: poser un stack, préparer une attaque, lire les intentions/frapper front-mur-tour; les étapes validées sont barrées.
- Le panneau donne la prochaine action minimale selon l’état courant: jouer une carte, sélectionner une créature prête, cibler, ou terminer le tour.
- Ajout d’un rappel explicite des règles corrigées: `[ ]` sert à calculer `max(1, round(30/[ ]))` unités et l’ATQ ne se multiplie pas par le nombre d’unités.
- Règles préservées: pas de POP/DEF, ATQ/HP/[ ], dégâts ATQ seuls, HP total de stack, siège tour/village/mur, colonnes 0..4 et passifs existants.

### Vérification réelle
- `git status --short --branch` avant édition: branche `main`, travail sale non lié toujours présent et non touché (`capitales.md` supprimé, fichiers/dossiers non suivis existants).
- `node --check game.js`: OK.
- Smoke test Node inline: OK (`assault_tutor_smoke=OK {"hasTutor":true,"board":1,"noPopDef":true,"reminder":true}`), confirmant le rendu du tutoriel, la progression après pose d’un stack, l’absence POP/DEF dans le combat rendu et le rappel ATQ/[ ].
- Serveur local `python -m http.server 8143`: OK.
- `curl -I http://localhost:8143/`: HTTP 200.
- `curl -s http://localhost:8143/game.js | grep -E 'assaultTutor|Tutoriel d.assaut|ATQ ne se multiplie'`: OK.
- `curl -s http://localhost:8143/style.css | grep -E 'assault-tutor'`: OK.

### Limites
- Smoke test DOM simulé côté Node; pas de vraie session navigateur graphique pendant ce run cron.
- Le tutoriel est toujours visible en combat; il n’a pas encore de bouton “masquer” persistant.
- Le travail sale non lié du repo est préservé et non committé.

### Prochaine action minimale
- Ajouter un bouton de masquage/persistance du tutoriel, ou enrichir le marché avec une vente de cartes/stock persistant par ville.

### Publication de l’itération assault-tutor
- Commit local applicatif: `83a6dcf` (`Add first assault tutorial`).
- `git push origin main`: OK (`b6e794a..83a6dcf main -> main`).
- Vérification GitHub raw `game.js`: OK, contient `assaultTutor`, `Tutoriel d’assaut`, `ATQ ne se multiplie`.
- Vérification GitHub raw `style.css`: OK, contient `assault-tutor`.
- Vérification site public `https://fantasiafauna.com/game.js?v=83a6dcf` et `style.css?v=83a6dcf`: HTTP 200 mais marqueurs absents pendant ce run (`game_marker=0`, `css_marker=0`); `Last-Modified` encore `Thu, 30 Jul 2026 23:10:13 GMT`, donc GitHub Pages/CDN reste stale.

## Itération tutor-toggle — 2026-07-31 01:47
### Réalisé
- Ajout d’un bouton visible `Masquer` dans le tutoriel d’assaut pour réduire l’encombrement du panneau central pendant les combats.
- Ajout d’un état sauvegardé `showTutor` dans `localStorage`; si le tutoriel est masqué, un petit panneau `Afficher le tutoriel d’assaut` permet de le rouvrir.
- Le reset d’aventure réactive le tutoriel pour les nouveaux joueurs.
- Règles préservées: pas de POP/DEF, affichage ATQ/HP/[ ], invocation `max(1, round(30/[ ]))`, dégâts ATQ seuls, HP total de stack, siège tour/village/mur, colonnes 0..4 et passifs existants.

### Vérification réelle
- `git status --short --branch` avant édition: branche `main`, travail sale non lié toujours présent et non touché (`capitales.md` supprimé, fichiers/dossiers non suivis existants).
- `node --check game.js`: OK.
- Smoke test Node inline: OK (`assault_tutor_toggle_smoke=OK {"visible":true,"hidden":true,"persisted":true,"shownAgain":true}`), confirmant l’affichage, le masquage, la persistance et la réouverture.
- Serveur local `python -m http.server 8144`: OK.
- `curl -I http://localhost:8144/`: HTTP 200.
- `curl -s http://localhost:8144/game.js | grep -E 'toggleAssaultTutor|showTutor|Afficher le tutoriel'`: OK.
- `curl -s http://localhost:8144/style.css | grep -E 'assault-tutor\\.collapsed|assault-tutor button'`: OK.

### Limites
- Smoke test DOM simulé côté Node; pas de vraie session navigateur graphique pendant ce run cron.
- Le tutoriel est masqué globalement par sauvegarde, pas encore par étape/profil de joueur.
- Le travail sale non lié du repo est préservé et non committé.

### Prochaine action minimale
- Ajouter une petite progression de quête visible sur la carte du monde (ex: objectifs “visiter une ville / gagner un assaut / acheter au marché”) sans changer les règles de combat.

### Publication de l’itération tutor-toggle
- Commit local applicatif: `ce2f636` (`Allow hiding assault tutorial`).
- `git push origin main`: OK (`c68b2b1..ce2f636 main -> main`).
- Vérification GitHub raw `game.js`: OK, contient `showTutor`, `toggleAssaultTutor`, `Afficher le tutoriel d’assaut`.
- Vérification GitHub raw `style.css`: OK, contient `assault-tutor button` et `assault-tutor.collapsed`.
- Vérification site public `https://fantasiafauna.com/game.js?v=ce2f636` et `style.css?v=ce2f636`: HTTP 200 mais marqueurs absents pendant ce run (`game_marker=0`, `css_marker=0`); `Last-Modified` encore `Thu, 30 Jul 2026 23:30:27 GMT`, donc GitHub Pages/CDN reste stale.

## Itération quest-progress — 2026-07-31 02:02
### Réalisé
- Ajout d’un panneau visible `Quête du mage` sur la carte du monde avec progression d’aventure `0/3`, `1/3`, etc.
- Trois objectifs persistants guident maintenant le joueur: visiter une ville, acheter une carte au marché, gagner un assaut.
- Les flags de quête sont sauvegardés dans `localStorage` (`quests`) et mis à jour via `travel()`, `buyMarketCard()` et la victoire quand la tour adverse tombe.
- Règles préservées: pas de POP/DEF, affichage ATQ/HP/[ ], invocation `max(1, round(30/[ ]))`, dégâts ATQ seuls, HP total de stack, siège tour/village/mur, colonnes 0..4 et passifs existants.

### Vérification réelle
- `git status --short --branch` avant édition: branche `main`, travail sale non lié toujours présent et non touché (`capitales.md` supprimé, fichiers/dossiers non suivis existants).
- `node --check game.js`: OK.
- Smoke test Node inline: OK (`quest_progress_smoke=OK {"progress":"2/3","persisted":{"visitedTown":true,"boughtMarket":true,"wonAssault":false},"noPopDef":true}`), confirmant le rendu du panneau, la progression ville+marché, la persistance et l’absence de POP/DEF dans le rendu monde.
- Serveur local `python -m http.server 8145`: OK.
- `curl -I http://localhost:8145/`: HTTP 200.
- `curl -s http://localhost:8145/game.js | grep -E 'questBoard|Quête du mage|quests'`: OK.
- `curl -s http://localhost:8145/style.css | grep -E 'quest-panel|World quest progression'`: OK.

### Limites
- Smoke test DOM simulé côté Node; pas de vraie session navigateur graphique pendant ce run cron.
- La quête d’assaut se valide uniquement à la destruction de la tour adverse; pas encore de récompense/chapitre de quête séparé.
- Le travail sale non lié du repo est préservé et non committé.

### Prochaine action minimale
- Ajouter un petit objectif/récompense après la première victoire d’assaut, ou enrichir les marchés avec vente/stock persistant.

### Publication de l’itération quest-progress
- Commit local applicatif: `01deb36` (`Add world quest progression`).
- `git push origin main`: OK (`9da8263..01deb36 main -> main`).
- Vérification GitHub raw `game.js`: OK, contient `questBoard`, `Quête du mage`, `quests`.
- Vérification GitHub raw `style.css`: OK, contient `quest-panel` et `World quest progression`.
- Vérification site public `https://fantasiafauna.com/game.js?v=01deb36` et `style.css?v=01deb36`: HTTP 200 mais marqueurs absents pendant ce run (`game_marker=0`, `css_marker=0`); `Last-Modified` encore `Thu, 30 Jul 2026 23:48:59 GMT`, donc GitHub Pages/CDN reste stale.

## Itération quest-reward — 2026-07-31 02:16
### Réalisé
- Ajout d’une prime visible pour l’arc d’initiation: après les 3 objectifs `ville + marché + assaut`, le panneau `Quête du mage` propose `Réclamer la prime`.
- `claimQuestReward()` donne +75 or, ajoute une créature rare/mythique à la collection, la montre comme dernier gain et l’ajoute au grimoire si une place est libre.
- La prime est persistée via `quests.arcRewardClaimed` pour empêcher les doubles réclamations; les anciennes sauvegardes reçoivent une valeur par défaut sûre.
- Règles préservées: pas de POP/DEF, affichage ATQ/HP/[ ], invocation `max(1, round(30/[ ]))`, dégâts ATQ seuls, HP total de stack, siège tour/village/mur, colonnes 0..4 et passifs existants.

### Vérification réelle
- `git status --short --branch` avant édition: branche `main`, travail sale non lié toujours présent et non touché (`capitales.md` supprimé, fichiers/dossiers non suivis existants).
- `node --check game.js`: OK.
- Smoke test Node inline: OK (`quest_reward_smoke=OK {"beforeGold":10,"afterGold":85,"prize":"Dragon d'or","claimed":true,"noPopDef":true}`), confirmant disponibilité de la prime, récompense unique, gain carte/or et absence POP/DEF dans le rendu.
- Serveur local `python -m http.server 8146`: OK.
- `curl -I http://localhost:8146/`: HTTP 200.
- `curl -s http://localhost:8146/game.js | grep -E 'claimQuestReward|Prime disponible|questComplete'`: OK.
- `curl -s http://localhost:8146/style.css | grep -E 'quest-reward'`: OK.

### Limites
- Smoke test DOM simulé côté Node; pas de vraie session navigateur graphique pendant ce run cron.
- La récompense d’arc est fixe côté économie (+75 or + rare/mythique aléatoire), sans choix entre plusieurs récompenses.
- Le travail sale non lié du repo est préservé et non committé.

### Prochaine action minimale
- Ajouter un choix de récompense ou un chapitre suivant après l’arc d’initiation, ou enrichir les marchés avec vente/stock persistant.

### Publication de l’itération quest-reward
- Commit local applicatif: `3390423` (`Add quest completion reward`).
- `git push origin main`: OK (`721bf64..3390423 main -> main`).
- Vérification GitHub raw `game.js`: OK, contient `claimQuestReward`, `Prime disponible`, `questComplete`.
- Vérification GitHub raw `style.css`: OK, contient `quest-reward`.
- Vérification site public `https://fantasiafauna.com/game.js?v=3390423-retry` et `style.css?v=3390423-retry`: HTTP 200 mais marqueurs absents pendant ce run (`public_game_marker=0`, `public_css_marker=0`); `Last-Modified` encore `Fri, 31 Jul 2026 00:04:10 GMT`, donc GitHub Pages/CDN reste stale.

## Itération quest-reward-choice — 2026-07-31 02:30
### Réalisé
- Transformation de la prime finale d’initiation en choix visible: après ville + marché + assaut, le panneau `Quête du mage` affiche 3 créatures rares/mythiques sélectionnables.
- Ajout de `questRewardChoices()` et de `claimQuestReward(id)` pour donner réellement la créature choisie, +75 or, puis verrouiller la prime via `arcRewardClaimed`.
- Les boutons de prime montrent nom, capitale, rareté, ATQ, HP et valeur `[ ]`, sans POP/DEF.
- Ajout du style `.reward-choices` responsive pour rendre le choix lisible dans le panneau monde.

### Vérification réelle
- `git status --short --branch` avant édition: branche `main`, travail sale non lié toujours présent et non touché (`capitales.md` supprimé, fichiers/dossiers non suivis existants).
- `node --check game.js`: OK.
- Smoke test Node inline: OK (`quest_reward_choice_smoke=OK {"choices":["Hécatonchire","Elfe","Diable"],"picked":"Elfe","gold":85,"noPopDef":true}`), confirmant 3 choix, gain de la créature choisie, +75 or, anti double-réclamation et absence POP/DEF dans le rendu de quête.
- Serveur local `python -m http.server 8147`: OK.
- `curl -I http://localhost:8147/`: HTTP 200.
- `curl -s http://localhost:8147/game.js | grep -E 'questRewardChoices|Prime disponible|reward-choices'`: OK.
- `curl -s http://localhost:8147/style.css | grep -E 'reward-choices'`: OK.

### Limites
- Smoke test DOM simulé côté Node; pas de vraie session navigateur graphique pendant ce run cron.
- Les 3 choix sont déterministes selon jour/collection/lieu, pas encore stockés comme offre de récompense persistante séparée.
- Le travail sale non lié du repo est préservé et non committé.

### Prochaine action minimale
- Ajouter un chapitre suivant après la prime d’initiation, ou enrichir les marchés avec vente/stock persistant.

### Publication de l’itération quest-reward-choice
- Commit local applicatif: `6df2f7f` (`Add quest reward choice`).
- `git push origin main`: OK (`ecf2cc6..6df2f7f main -> main`).
- Vérification GitHub raw `game.js`: OK, contient `questRewardChoices`, `Prime disponible — choisis ta créature`, `reward-choices`.
- Vérification GitHub raw `style.css`: OK, contient `reward-choices`.
- Vérification site public `https://fantasiafauna.com/game.js?v=6df2f7f` et `style.css?v=6df2f7f`: HTTP 200 mais marqueurs absents pendant ce run (`public_game_marker=0`, `public_css_marker=0`); `Last-Modified` encore `Fri, 31 Jul 2026 00:18:46 GMT`, donc GitHub Pages/CDN reste stale.

## Itération chapter-two-route — 2026-07-31 02:45
### Réalisé
- Ajout d’un panneau visible `Chapitre II — Route vers l’Abîme` sous la quête d’initiation.
- Le panneau donne une suite lisible après la prime: prime choisie, au moins 3 capitales possédées, 25 cartes dans la collection.
- Ajout des fonctions `ownedCapitalCount()`, `chapterTwoSteps()` et `chapterTwoBoard()` sans modifier les règles de combat.
- Style responsive `.chapter-panel`, état verrouillé tant que la prime d’initiation n’est pas choisie.
- Règles préservées: pas de POP/DEF, affichage ATQ/HP/[ ], invocation `max(1, round(30/[ ]))`, dégâts ATQ seuls, HP total de stack, siège tour/village/mur, colonnes 0..4 et passifs existants.

### Vérification réelle
- `git status --short --branch` avant édition: branche `main`, travail sale non lié toujours présent et non touché (`capitales.md` supprimé, fichiers/dossiers non suivis existants).
- `node --check game.js`: OK.
- Smoke test Node inline initial: échec honnête dû au jeu de test trop homogène (`CREATURES.slice(0,25)` ne couvrait pas 3 capitales), code inchangé.
- Smoke test Node inline corrigé: OK (`chapter_two_smoke=OK {"initial":true,"complete":true,"noPopDef":true}`), confirmant panneau visible, progression 3/3 possible et absence POP/DEF dans le rendu.
- Serveur local `python -m http.server 8148`: OK.
- `curl -I http://localhost:8148/`: HTTP 200.
- `curl -s http://localhost:8148/game.js | grep -E 'chapterTwoBoard|Route vers|ownedCapitalCount'`: OK.
- `curl -s http://localhost:8148/style.css | grep -E 'chapter-panel'`: OK.

### Limites
- Le chapitre II est pour l’instant un panneau de progression/préparation; il ne déclenche pas encore un nouveau boss, une récompense ou un marché avancé.
- Smoke test DOM simulé côté Node; pas de vraie session navigateur graphique pendant ce run cron.
- Le travail sale non lié du repo est préservé et non committé.

### Prochaine action minimale
- Donner une récompense ou un effet de déverrouillage concret quand `Route vers l’Abîme` atteint 3/3, puis relier cette étape à un boss/lieu de la carte.

### Publication de l’itération chapter-two-route
- Commit local applicatif: `84d6ea8` (`Add chapter two route panel`).
- `git push origin main`: OK (`486ee3c..84d6ea8 main -> main`).
- Vérification GitHub raw `game.js`: OK, contient `chapterTwoBoard`, `Route vers l’Abîme`, `ownedCapitalCount`.
- Vérification GitHub raw `style.css`: OK, contient `chapter-panel`.
- Vérification site public `https://fantasiafauna.com/game.js?v=84d6ea8` et `style.css?v=84d6ea8`: HTTP 200 mais marqueurs absents pendant ce run (`game_marker=0`, `css_marker=0`); GitHub Pages/CDN semble encore stale.

## Itération chapter-two-reward — 2026-07-31 03:00
### Réalisé
- Ajout d’un déverrouillage concret au panneau `Chapitre II — Route vers l’Abîme`: quand prime + 3 capitales + 25 cartes sont validées, le joueur peut activer le `Sceau de l’Abîme`.
- `claimChapterTwoReward()` donne +120 or une seule fois, persiste `quests.chapterTwoClaimed`, puis indique que les boss deviennent l’objectif prioritaire.
- Ajout d’un état visuel verrouillé/disponible/réclamé via `.chapter-unlock`, sans modifier les règles de combat.
- Règles préservées: pas de POP/DEF, affichage ATQ/HP/[ ], invocation `max(1, round(30/[ ]))`, dégâts ATQ seuls, HP total de stack, siège tour/village/mur, colonnes 0..4 et passifs existants.

### Vérification réelle
- `git status --short --branch` avant édition: branche `main`, travail sale non lié toujours présent et non touché (`capitales.md` supprimé, fichiers/dossiers non suivis existants).
- `node --check game.js`: OK.
- Smoke test Node inline: OK (`chapter_two_reward_smoke=OK {"before":5,"after":125,"claimed":true,"noPopDef":true}`), confirmant panneau disponible, +120 or, anti double-réclamation, persistance `chapterTwoClaimed` et absence POP/DEF dans le rendu monde.
- Serveur local `python -m http.server 8149`: OK.
- `curl -I http://localhost:8149/`: HTTP 200.
- `curl -s http://localhost:8149/game.js | grep -E 'chapterTwoComplete|claimChapterTwoReward|Sceau de'`: OK.
- `curl -s http://localhost:8149/style.css | grep -E 'chapter-unlock'`: OK.

### Limites
- Smoke test DOM simulé côté Node; pas de vraie session navigateur graphique pendant ce run cron.
- Le Sceau donne une réserve d’or et un objectif narratif, mais ne verrouille/déverrouille pas encore mécaniquement l’accès aux lieux boss.
- Le travail sale non lié du repo est préservé et non committé.

### Prochaine action minimale
- Relier `chapterTwoClaimed` à un lieu boss réellement spécial: badge/condition sur l’Abîme des Miroirs, assaut boss plus dur, puis récompense de victoire.

### Publication de l’itération chapter-two-reward
- Commit local applicatif: `25cbe79` (`Add chapter two reward unlock`).
- `git push origin main`: OK (`c89c55a..25cbe79 main -> main`).
- Vérification GitHub raw `game.js`: OK, contient `claimChapterTwoReward` / `Sceau de` (`raw-game=3`).
- Vérification GitHub raw `style.css`: OK, contient `chapter-unlock` (`raw-css=1`).
- Vérification site public `https://fantasiafauna.com/game.js?v=25cbe79` et `style.css?v=25cbe79`: HTTP 200 mais marqueurs absents pendant ce run (`game_marker=0`, `css_marker=0`); `Last-Modified` encore `Fri, 31 Jul 2026 00:47:06 GMT`, donc GitHub Pages/CDN reste stale.

## Itération boss-gate — 2026-07-31 03:20
### Réalisé
- Lieu boss `Abîme des Miroirs` relié au `Sceau de l’Abîme`: avant activation, la carte affiche `Scellé — active le Sceau` et le clic refuse l’entrée avec un log explicite.
- Après activation du chapitre II, la carte affiche `Boss ouvert · Tour 30` et `newEncounter('boss')` lance un siège renforcé: Tour 30, Village 24, Mur 28 côté ennemi.
- La victoire boss donne +140 or, conserve la récompense carte, marque `quests.bossWon=true` et affiche ensuite `✓ Boss vaincu` / trophée de chapitre dans la progression.
- Règles préservées: pas de POP/DEF, affichage ATQ/HP/[ ], invocation `max(1, round(30/[ ]))`, dégâts ATQ seuls, HP total de stack, siège tour/village/mur, colonnes 0..4 et passifs existants.

### Vérification réelle
- `git status --short --branch` avant édition: branche `main`, travail sale non lié toujours présent et non touché (`capitales.md` supprimé, fichiers/dossiers non suivis existants).
- `node --check game.js`: OK.
- Smoke test Node inline: OK (`boss_gate_smoke=OK {"locked":true,"bossStarted":true,"hpShows":true,"bossWon":true}`), confirmant verrouillage, ouverture par Sceau, HP boss renforcés et récompense de victoire.
- Serveur local `python -m http.server 8150`: OK.
- `curl -I http://localhost:8150/`: HTTP 200.
- `curl -s http://localhost:8150/game.js | grep -E 'mapPlace|bossWon|Tour 30'`: OK.
- `curl -s http://localhost:8150/style.css | grep -E 'place\\.boss|Boss'`: OK.

### Limites
- Smoke test DOM simulé côté Node; pas de vraie session navigateur graphique pendant ce run cron.
- Le boss utilise les mêmes règles IA/ennemis que l’assaut normal, avec fortifications renforcées et récompense dédiée; pas encore de deck boss thématique Abîme.
- Le travail sale non lié du repo est préservé et non committé.

### Prochaine action minimale
- Donner au boss un pool d’invocations/intentions plus typé Abîme ou ajouter une récompense visuelle de trophée persistante dans le monde.

### Publication de l’itération boss-gate
- Commit local applicatif: `4421d90` (`Gate Abime boss encounter`).
- `git push origin main`: OK (`773045c..4421d90 main -> main`).
- Vérification GitHub raw `game.js`: OK, contient `mapPlace` / `bossWon` / `Tour 30` (`raw game markers: 9`).
- Vérification GitHub raw `style.css`: OK, contient `place.boss` / `boss.cleared` (`raw css markers: 2`).
- Vérification site public `https://fantasiafauna.com/game.js?v=4421d90`: HTTP 200 mais marqueurs absents pendant ce run (`public game markers: 0`, `Last-Modified: Fri, 31 Jul 2026 01:02:36 GMT`), donc GitHub Pages/CDN reste en retard.
- Vérification site public `https://fantasiafauna.com/style.css?v=4421d90`: un marqueur CSS boss déjà visible (`public css markers: 1`).

## Itération boss-abime-pool — 2026-07-31 03:35
### Réalisé
- Le boss `Abîme des Miroirs` invoque désormais depuis un pool typé `Abîme` via `bossCreaturePool()` / `enemySummonCreature()`, au lieu d’utiliser le tirage générique.
- Ajout d’un encart visible `Boss: Abîme des Miroirs` dans le panneau ennemi pendant le combat boss, indiquant les invocations typées Abîme et les fortifications renforcées Tour 30 · Village 24 · Mur 28.
- Le log d’invocation devient explicitement `L’Abîme invoque ...` pendant le boss.
- Règles préservées: pas de POP/DEF, affichage ATQ/HP/[ ], invocation `max(1, round(30/[ ]))`, dégâts ATQ seuls, HP total de stack, siège tour/village/mur, colonnes 0..4 et passifs existants.

### Vérification réelle
- `git status --short --branch` avant édition: branche `main`, travail sale non lié toujours présent et non touché (`capitales.md` supprimé, fichiers/dossiers non suivis existants).
- `node --check game.js`: OK.
- `node .hermes/smoke_boss_abime.js`: OK (`boss_abime_smoke=OK {"pool":30,"summoned":"Tyrannoeil","capital":"Abîme","tower":30}`), confirmant l’encart boss, le pool Abîme-only, l’invocation boss Abîme et l’absence POP/DEF dans le rendu de combat; script temporaire supprimé avant commit.
- Serveur local `python -m http.server 8151`: OK.
- `curl -I http://localhost:8151/`: HTTP 200.
- `curl -s http://localhost:8151/game.js | grep -E 'bossCreaturePool|boss-aura|L.Ab.me invoque|Invocations typ'`: OK.
- `curl -s http://localhost:8151/style.css | grep -E 'boss-aura'`: OK.

### Limites
- Smoke test DOM simulé côté Node; pas de vraie session navigateur graphique pendant ce run cron.
- Le boss a maintenant une identité d’invocation Abîme, mais pas encore de capacités uniques hors pool et fortifications renforcées.
- Le travail sale non lié du repo est préservé et non committé.

### Prochaine action minimale
- Ajouter une récompense/trophée visuel persistant après victoire boss, ou donner au boss une intention/capacité spéciale Abîme lisible.

### Publication de l’itération boss-abime-pool
- Commit local applicatif: `72d3a8e` (`Theme Abime boss summons`).
- `git push origin main`: OK (`9fcaf9b..72d3a8e main -> main`).
- Vérification GitHub raw `game.js`: OK, contient `bossCreaturePool`, `boss-aura`, `L’Abîme invoque` (`raw game markers: 4`).
- Vérification GitHub raw `style.css`: OK, contient `boss-aura` (`raw css markers: 1`).
- Vérification site public `https://fantasiafauna.com/game.js?v=72d3a8e` et `style.css?v=72d3a8e`: HTTP 200 mais marqueurs absents pendant ce run (`public_game_markers=0`, `public_css_markers=0`, `Last-Modified: Fri, 31 Jul 2026 01:22:40 GMT`), donc GitHub Pages/CDN reste en retard.

## Itération boss-mirror-ritual — 2026-07-31 03:50
### Réalisé
- Ajout d’une capacité spéciale lisible pour le boss `Abîme des Miroirs`: `Rituel du miroir`.
- L’encart boss indique maintenant le compte à rebours du rituel (`ce tour` / `dans N jours`) en plus du pool d’invocations Abîme et des fortifications renforcées.
- Tous les 3 jours, au tour ennemi en combat boss, le rituel inflige 2 dégâts au mur allié; si le mur est déjà tombé, il touche la tour alliée.
- Le rituel utilise `damageStructure`, donc il conserve l’effet visuel de hit et le log de combat sans modifier les règles de stack.
- Règles préservées: pas de POP/DEF, affichage ATQ/HP/[ ], invocation `max(1, round(30/[ ]))`, dégâts ATQ seuls, HP total de stack, siège tour/village/mur, colonnes 0..4 et passifs existants.

### Vérification réelle
- `git status --short --branch` avant édition: branche `main`, travail sale non lié toujours présent et non touché (`capitales.md` supprimé, fichiers/dossiers non suivis existants).
- `node --check game.js`: OK.
- `node .hermes/smoke_boss_rift.js`: OK (`boss_rift_smoke=OK {"wallAfterRift":18,"countdown":"dans 2 jours","hit":"ally-wall"}`), confirmant l’encart, le dégât rituel de 2 au mur, le marqueur de hit, l’absence POP/DEF dans le recto et `strikePower === ATQ`.
- Serveur local `python -m http.server 8152`: OK.
- `curl -I http://localhost:8152/`: HTTP 200.
- `curl -s http://localhost:8152/game.js | grep -E 'bossRiftCountdown|Rituel du miroir|bossMirrorRift'`: OK.

### Limites
- Smoke test DOM simulé côté Node; pas de vraie session navigateur graphique pendant ce run cron.
- Le rituel boss est volontairement simple et lisible; il ne crée pas encore de choix de contre-jeu spécifique côté joueur.
- Le travail sale non lié du repo est préservé et non committé.

### Prochaine action minimale
- Ajouter une réponse jouable au rituel boss (ex: une action de réparation/contre-sort visible ou récompense/trophée persistant après victoire boss).

### Publication de l’itération boss-mirror-ritual
- Commit local applicatif: `e6fc0bb` (`Add Abime mirror ritual`).
- `git push origin main`: OK (`db2234d..e6fc0bb main -> main`).
- Vérification GitHub raw `game.js`: OK, contient `bossRiftCountdown`, `Rituel du miroir`, `bossMirrorRift` (`raw markers: 4`).
- Vérification site public `https://fantasiafauna.com/game.js?v=e6fc0bb`: HTTP 200 mais marqueurs absents pendant ce run (`public markers: 0`, `Last-Modified: Fri, 31 Jul 2026 01:37:45 GMT`, `Cache-Control: max-age=600`), donc GitHub Pages/CDN reste en retard.

## Itération boss-counterplay — 2026-07-31 04:06
### Réalisé
- Ajout d’une réponse jouable et visible au `Rituel du miroir` pendant le boss Abîme: panneau `Réponse au Rituel du miroir` au centre du combat boss.
- Nouvelle action `Renforcer le mur`: dépense 2 points d’invocation pour restaurer +3 HP au mur allié, avec badge de hit `+3` et log de combat.
- L’action est désactivée/lisible si le mur est intact, détruit, ou si l’invocation disponible est insuffisante.
- Règles préservées: pas de POP/DEF, affichage ATQ/HP/[ ], invocation `max(1, round(30/[ ]))`, dégâts ATQ seuls, HP total de stack, siège tour/village/mur, colonnes 0..4 et passifs existants.

### Vérification réelle
- `git status --short --branch` avant édition: branche `main`, travail sale non lié toujours présent et non touché (`capitales.md` supprimé, fichiers/dossiers non suivis existants).
- `node --check game.js`: OK.
- `node .hermes/smoke_boss_counterplay.js`: OK (`boss_counterplay_smoke=OK {"panel":true,"button":true,"noPopDef":true}`), confirmant le panneau boss, le bouton, la réparation visible après le rituel et l’absence POP/DEF dans le rendu; script temporaire supprimé avant commit.
- Serveur local `python -m http.server 8153`: OK.
- `curl -I http://localhost:8153/`: HTTP 200.
- `curl -s http://localhost:8153/game.js | grep -E 'reinforceWall|bossCounterplay|Réponse au Rituel'`: OK.
- `curl -s http://localhost:8153/style.css | grep -E 'boss-counter'`: OK.

### Limites
- Smoke test DOM simulé côté Node; pas de vraie session navigateur graphique pendant ce run cron.
- Le contre-jeu boss est une réparation tactique simple; il ne retarde pas encore le compte à rebours ni ne crée un choix de contre-sort avancé.
- Le travail sale non lié du repo est préservé et non committé.

### Prochaine action minimale
- Ajouter un trophée visuel persistant après victoire boss dans la carte du monde / panneau Chapitre II, ou enrichir la récompense boss.

### Publication de l’itération boss-counterplay
- Commit local applicatif: `a021bed` (`Add Abime ritual counterplay`).
- `git push origin main`: OK (`0662a11..a021bed main -> main`).
- Vérification GitHub raw `game.js`: OK, contient `reinforceWall`, `bossCounterplay`, `Réponse au Rituel` (`raw game markers: 4`).
- Vérification GitHub raw `style.css`: OK, contient `boss-counter` (`raw css markers: 1`).
- Vérification site public `https://fantasiafauna.com/game.js?v=a021bed` et `style.css?v=a021bed`: HTTP 200 mais marqueurs absents pendant ce run (`public_game_markers=0`, `public_css_markers=0`, `Last-Modified: Fri, 31 Jul 2026 01:52:31 GMT`, `Cache-Control: max-age=600`), donc GitHub Pages/CDN reste en retard.
