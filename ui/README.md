# UI assets

## Structure

- `_sheets/` — spritesheets d’origine (non découpés)
- `sprites/<catégorie>/` — sprites individuels découpés et classés
- `manifest.json` — inventaire (compteurs par catégorie)

## Catégories

| Dossier | Contenu |
|---|---|
| `bars/` | barres HP / mana / énergie |
| `candles/` | bougies (frames d’anim) |
| `furniture/` | lits, chaises, tables, placards, etc. |
| `tools/` | outils |
| `weather/` | icônes météo |
| `farm/` | ferme |
| `food/meat/` | viandes |
| `kitchen/pans/` | casseroles (anim) |
| `environment/` | rochers, végétation, murs/sols |
| `workshop/blacksmith/` | forge |
| `props/` | déco / cuisine |
| `ui/speech/` | bulles, emojis, réactions |
| `effects/shadows/` | ombres |
| `esoteric/`, `resources/`, `seasonal/xmas/`, `misc/` | divers |

## Régénérer

```bash
python slice_ui.py
python fix_ui_special.py
```

Les sheets doivent être dans `ui/` (ou déjà dans `ui/_sheets/`).
