# Contrôles des notices

Les fichiers `data/notices/*.json` sont les sources éditables. Les références bibliographiques sont propres à chaque notice : identifiant numérique, titre, URL et appels `[id]` dans le texte.

## Tests techniques

Depuis la racine du dépôt, avec Python 3 et Node.js :

```sh
python tools/test_notices.py
python tools/validate_creatures.py
node tools/check_app.js
node --check js/app.js
```

Le test de rendu utilise jsdom, installé dans un dossier ignoré par Git :

```sh
npm install --prefix tmp/editorial/test-runtime --no-audit --no-fund jsdom@30.0.1
NODE_PATH=./tmp/editorial/test-runtime/node_modules node tools/check_notice_render.js
```

La dernière commande emploie la syntaxe bash (notamment Git Bash sous Windows). Le test contrôle le rendu et l'échappement des textes, les rubriques, les liens de sources et le maintien sur la notice lors d'un clic de citation.

## Assemblage complet

```sh
python tools/build_notices.py --check
python tools/build_notices.py
```

L'assemblage refuse un corpus incomplet : tant que les 340 notices ne sont pas présentes, la première commande signale les notices manquantes et la seconde ne remplace pas `js/notices.js`. Le rapport technique est enregistré dans `tmp/editorial/validation.json`.

Ce verrou d'assemblage n'empêche pas les sauvegardes Git intermédiaires sur `main`. Il ne constitue pas non plus une validation éditoriale : le statut de relecture est suivi séparément.

## Publication progressive des notices relues

```sh
python tools/test_reviewed_notices.py
python tools/build_reviewed_notices.py --check
python tools/build_reviewed_notices.py
```

Ce constructeur distinct ne publie que les entrées de `data/reviewed-notices.json`. Une entrée est ajoutée après relecture, avec le SHA-256 de `json.dumps(notice, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8")`, calculé par `notice_digest`. La mise en forme JSON et les fins de ligne n'affectent pas cette empreinte ; les changements de texte l'invalident.

Une sélection vide, une notice absente ou inconnue du catalogue, un texte structurellement invalide ou une empreinte périmée bloque la génération. Une erreur laisse le fichier existant intact. L'écriture valide est atomique ; `--check` ne modifie rien. Les brouillons non approuvés ne sont pas inclus. `--manifest` et `--output` permettent de tester des chemins temporaires sans toucher au bundle du site.

La présence d'une empreinte consigne une décision éditoriale : ce n'est pas une approbation automatique du texte par le logiciel. Le détail des relectures est conservé sous `docs/relectures/`.
