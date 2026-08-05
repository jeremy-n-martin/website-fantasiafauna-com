# Guide des capacités de créatures

Guide pour **créer**, **modifier** ou **supprimer** les capacités (keywords) des cartes, sans être développeur.

---

## En 30 secondes

| Tu veux… | Fichier principal | Quoi faire |
|---|---|---|
| Changer le **nom / texte** d’une capacité | [`game.js`](./game.js) → `ABILITIES` | Éditer `label` et `description` |
| **Ajouter / retirer** une capacité sur une carte | [`creatures-data.js`](./creatures-data.js) → `abilities` | Éditer la liste `abilities` de la créature |
| **Créer une nouvelle** capacité | Plusieurs fichiers (voir plus bas) | Texte + logique + (optionnel) style |
| **Retirer** une capacité du jeu | [`creatures-data.js`](./creatures-data.js) + éventuellement [`combat.js`](./combat.js) | Voir section 3 |

---

## Carte mentale

```text
CREATURES[].roles      →  exactement 1 parmi : normal, fast, ranged, caster, tank
CREATURES[].abilities  →  capacités de jeu          (ex. "vol", "formation", "charge")
        ↓
ABILITIES[id]          →  nom + description affichés sur la carte
        ↓
combat.js              →  ce que la capacité fait vraiment en combat
        ↓
style.css              →  couleur / look du petit badge (optionnel)
```

---

## Fichiers à connaître (tous les liens)

### Obligatoires (presque toujours)

| Fichier | Rôle |
|---|---|
| [`creatures-data.js`](./creatures-data.js) | **Liste de toutes les créatures** (stats, `roles`, `abilities`, images…) — fichier lisible, une carte = un bloc |
| [`game.js`](./game.js) | Catalogue des capacités (`ABILITIES`), affichage des badges, logique UI |
| [`combat.js`](./combat.js) | Comportement en combat (`hasAbility` / `hasRole`, auras, activations, dégâts, etc.) |
| [`index.html`](./index.html) | Charge les scripts (`creatures-data.js` **avant** `game.js`) — après une modif, changer parfois le `?v=…` pour forcer le refresh navigateur |

### Souvent utiles

| Fichier | Rôle |
|---|---|
| [`style.css`](./style.css) | Apparence des badges `.ability-tag.ability-…` (couleurs) |
| [`creatures.md`](./creatures.md) | Tableau de référence (liste des créatures / fonctions) — **documentation**, pas le jeu |

### Rarement (selon le type de capacité)

| Fichier | Quand |
|---|---|
| [`campaign.js`](./campaign.js) | Seulement si une règle de campagne dépend d’un rôle (peu fréquent) |
| [`.hermes/fantasiafauna_game_status.md`](./.hermes/fantasiafauna_game_status.md) | Notes de design / suivi (pas exécuté par le jeu) |

### `roles` vs `abilities`

- **`roles`** : exactement **un** tag parmi `normal`, `fast`, `ranged`, `caster`, `tank`. Définit la forme / le style de jeu (Tank force le focus, Ranged ignore les tanks…).
- **`abilities`** : keywords de jeu listés dans `ABILITIES` (`vol`, `bouclier-divin`, `soin`, `activer-purge`…). Affichés en badges sur la carte.

---

## 1. Changer le label ou le texte d’une capacité existante

1. Ouvre [`game.js`](./game.js).
2. Cherche l’objet **`ABILITIES`** (vers la ligne 33).
3. Trouve la capacité, par ex. :

```js
formation: {
  id: 'formation',
  label: 'Formation',
  description: 'Tant que cette créature est en jeu, les deux créatures alliées adjacentes ont +1/+1.',
},
```

4. Modifie uniquement :
   - `label` → nom court sur le badge  
   - `description` → texte du tooltip / aperçu  
5. **Ne change pas** `id` (sinon la logique combat ne la reconnaît plus).
6. Sauvegarde, recharge la page (Ctrl+F5 si besoin).

Tu n’as **pas** besoin de toucher `combat.js` pour un simple changement de texte.

---

## 2. Ajouter ou retirer une capacité sur une créature

1. Ouvre [`creatures-data.js`](./creatures-data.js) (pas `game.js`).
2. Cherche la créature avec `Ctrl+F` (ex. `Arbalétrier`).
3. Regarde son champ `abilities` — une capacité par ligne :

```js
roles: [
  "caster",
],
abilities: [
  "formation",
  "vol",
],
```

4. Pour **ajouter** : mets l’`id` exact d’une capacité déjà définie dans `ABILITIES`  
   (ex. `"charge"`, `"bouclier-divin"`, `"gelant"`), une ligne = un id, **dans `abilities`** (pas dans `roles`).
5. Pour **retirer** : enlève la ligne de l’id (et vérifie les virgules).
6. Sauvegarde, recharge la page (Ctrl+F5). Si besoin, augmente le `?v=` de `creatures-data.js` dans [`index.html`](./index.html).

### Astuce recherche

Dans l’éditeur : `Ctrl+F` → nom de la créature, ou l’id de capacité (ex. `"formation"`).

> La capacité doit **exister** dans `ABILITIES` ([`game.js`](./game.js)) pour apparaître sur la carte.  
> Si tu mets un id inconnu dans `abilities`, le combat peut l’ignorer ou se comporter bizarrement selon les cas.

---

## 3. Supprimer une capacité du jeu (partout)

Deux niveaux possibles :

### A. Juste ne plus l’utiliser sur les cartes (recommandé)

- Retire l’id de tous les `abilities` dans [`creatures-data.js`](./creatures-data.js).
- Tu peux laisser la définition dans `ABILITIES` (prête à être réutilisée).

### B. La retirer complètement (catalogue + logique)

1. [`game.js`](./game.js) → supprimer l’entrée dans `ABILITIES`.
2. [`creatures-data.js`](./creatures-data.js) → retirer l’id de tous les `abilities` des créatures.
3. [`combat.js`](./combat.js) → retirer l’id de `KEYWORD_ROLES` (vers la ligne 111).
4. [`combat.js`](./combat.js) → supprimer / commenter la logique `hasRole(…, 'ton-id')` (et les listes `ACTIVATION_SPECS` / `ON_HIT_EFFECTS` / `abilityPulseSpec` si concerné).
5. [`style.css`](./style.css) → optionnel : supprimer `.ability-tag.ability-ton-id`.
---

## 4. Créer une **nouvelle** capacité (checklist)

Exemple : on veut une capacité `cri-de-guerre` affichée « Cri de guerre ».

### Étape A — Texte & id ([`game.js`](./game.js))

Dans `ABILITIES`, ajoute :

```js
'cri-de-guerre': {
  id: 'cri-de-guerre',
  label: 'Cri de guerre',
  description: 'À l’arrivée en jeu : fait quelque chose…',
},
```

Règles d’`id` :
- minuscules
- tirets OK (`activer-purge`, `vol-de-vie`)
- **identique** partout (game + combat + CSS)

### Étape B — Donner la capacité à des cartes ([`creatures-data.js`](./creatures-data.js))

Dans `abilities` des cartes concernées, ajoute `"cri-de-guerre"` (une ligne).

### Étape C — Enregistrer le keyword ([`combat.js`](./combat.js))

Ajoute `'cri-de-guerre'` dans le `Set` **`KEYWORD_ROLES`** (vers la ligne 111).

### Étape D — Coder l’effet ([`combat.js`](./combat.js))

Selon le **moment** où ça doit se déclencher, tu branches un `hasRole(c, 'cri-de-guerre')` au bon endroit :

| Type d’effet | Où regarder dans `combat.js` | Exemples déjà présents |
|---|---|---|
| À l’arrivée en jeu | `triggerEnterExtras`, `playCardOn` | `charge`, `jetons-1-1`, `donner-buff`, `cri-frappe` |
| Aura permanente (+ATQ/+PV) | `refreshBoardAuras` | `formation`, `etendard` |
| Quand on subit des dégâts | `dealDamageToCreature` | `furie`, `quand-blesse`, `survie` |
| Quand on meurt | `killCreature` | `dernier-souffle`, `allie-meurt` |
| Quand on attaque / on touche | `resolveCombatStrike`, `applyOnAttackEffects`, `ON_HIT_EFFECTS` | `poison`, `gelant`, `affaiblir`, `vol-de-vie`, `apres-attaque`, `quand-tue` |
| Début / fin de tour | boucles de tour (début / fin) | `debut-tour-soin`, `debut-tour-tir`, `fin-tour-tir`, `fin-tour-buff` |
| Pulsation périodique (lancer / soin / invoc) | `abilityPulseSpec` | `lancer`, `soin`, `invocation`… |
| Bouton **Activer** (à la place d’attaquer) | `ACTIVATION_SPECS` + `activateCreature` | `activer-purge`, `activer-tank`… |
| Forme de token (Tank / Ranged) | `BOARD_SHAPES`, `isTank`, `isAssassin` | `tank`, `ranged` |

Tables déjà prêtes dans [`combat.js`](./combat.js) :

- **`ACTIVATION_SPECS`** (~l.97) — capacités « Activer : … »
- **`ON_HIT_EFFECTS`** (~l.105) — effets appliqués quand on inflige des dégâts à un mignon
- **`KEYWORD_ROLES`** (~l.111) — liste officielle des keywords
- **`abilityPulseSpec`** (~l.390) — rythmes lancer / sort / soin / invocation
- **`hasRole` / `hasAbility`** — test « cette créature a-t-elle X ? »

### Étape E — Style du badge (optionnel) ([`style.css`](./style.css))

Cherche `.ability-tag` (~l.2215+) et ajoute par ex. :

```css
.ability-tag.ability-cri-de-guerre{
  /* couleurs du badge */
}
```

La classe CSS est toujours : `.ability-` + l’`id` (ex. `ability-formation`).

### Étape F — Affichage

L’affichage des badges est généré dans [`game.js`](./game.js) par :

- `creatureAbilityIds` — quels ids montrer  
- `abilitiesHtml` — HTML des badges / tooltips  

Pas besoin d’y toucher pour une capacité « classique » déjà dans `ABILITIES`.

Certaines capacités sont **volontairement cachées** des badges (mais actives en jeu) via un petit set `hide` dans `creatureAbilityIds`  
(`fin-tour-tir`, `fin-tour-buff`, `debut-tour-soin`, `debut-tour-tir`).

---

## 5. Recette rapide « je copie une capacité existante »

Cas le plus simple pour un non-dev :

1. Choisis une capacité déjà codée (ex. `charge`, `formation`, `gelant`).
2. Dans [`creatures-data.js`](./creatures-data.js), ajoute son **id** dans `abilities` de ta carte.
3. Recharge le jeu.

Pas besoin de créer de nouvelle logique.

---

## 6. Vérifier après modification

1. Recharge forcée du navigateur (Ctrl+F5).  
   Si ça ne bouge pas : augmente le `?v=` de `game.js` / `combat.js` / `style.css` dans [`index.html`](./index.html).
2. Ouvre la **Liste des cartes** : le badge doit apparaître (sauf ids dans `hide`).
3. Lance un **Combat** et teste le déclencheur (invocation, attaque, mort, etc.).

---

## 7. Catalogue actuel des capacités (`ABILITIES`)

Ids définis dans [`game.js`](./game.js) (à jour avec le code) :

| Id | Label (affichage) |
|---|---|
| `tank` | Tank |
| `ranged` | Ranged |
| `vol` | Vol (seuls Vol peuvent attaquer Vol ; Tank/Vol bloquent les volants) |
| `lancer` / `lancer-mod` / `lancer-max` | Rafale (+ / majeure) |
| `sort-degat` / `sort-degat-mod` / `sort-degat-max` | Sort de dégât (+ / Tempête) |
| `soin` / `soin-mod` / `soin-max` | Soin (+ / majeur) — legacy |
| `soins-leger` / `soins-moyen` / `soins-avances` | Soins légers (3 tours) / moyens (2) / avancés (1) |
| `invocation` / `invocation-rapide` / `invocation-intime` | Invocation (rapide / incessante) |
| `etendard` | Étendard |
| `formation` | Formation |
| `activer-regen` | Activer : Régénération |
| `activer-tank` | Activer : Rempart |
| `activer-bouclier` | Activer : Bouclier divin |
| `activer-frappe` | Activer : Frappe |
| `activer-soin` | Activer : Soins |
| `activer-purge` | Activer : Purification |
| `bouclier-divin` | Bouclier divin |
| `double-attaque` | Double attaque |
| `pietinement` | Piétinement |
| `transpercer` | Transpercer (surplus → tour, comme Piétinement) |
| `contact-mortel` | Contact mortel |
| `celerite` | Célérité |
| `lien-de-vie` | Lien de vie |
| `poison` | Poison |
| `brulant` | Brûlant |
| `gelant` | Gélant |
| `fin-tour-tir` | Fin de tour |
| `fin-tour-buff` | Montée en puissance |
| `debut-tour-soin` | Début de tour |
| `debut-tour-tir` | Aube sanglante |
| `quand-blesse` | Représailles |
| `quand-invoque` | Appel du sang |
| `apres-attaque` | Enchaînement |
| `jetons-1-1` | Portée de rejetons |
| `donner-buff` | Bénédiction |
| `soutient` | Soutien |
| `soutient-2` | Soutien 2 |
| `charge` | Charge |
| `camouflage` | Camouflage |
| `vol-de-vie` | Vol de vie |
| `dernier-souffle` | Dernier souffle |
| `cri-frappe` | Cri de guerre : Frappe |
| `cri-exorcisme` | Exorcisme (retire buffs adverses à l’arrivée) |
| `furie` | Furie |
| `allie-meurt` | Deuil |
| `quand-tue` | Exécution |
| `affaiblir` | Affaiblir |
| `survie` | Survie |

---

## 8. En cas de doute

1. **Texte seulement** → [`game.js`](./game.js) `ABILITIES`  
2. **Qui a quoi** → [`creatures-data.js`](./creatures-data.js) → `abilities`  
3. **Ce que ça fait** → [`combat.js`](./combat.js) chercher `hasRole(…, 'mon-id')`  
4. **Look du badge** → [`style.css`](./style.css) `.ability-tag.ability-mon-id`

Si tu copies une capacité existante sur une nouvelle carte, tu n’as en pratique besoin **que** de l’étape 2.
