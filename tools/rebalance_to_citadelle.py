# -*- coding: utf-8 -*-
"""Rebalance non-Citadelle creatures: fewer abilities, ATK/HP aligned to Citadelle bands."""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PATH = ROOT / 'creatures-data.js'

# Citadelle-inspired bands (inclusive)
BANDS = {
  1: {'atk': (1, 1), 'hp': (1, 3)},
  2: {'atk': (2, 3), 'hp': (2, 5)},
  3: {'atk': (2, 5), 'hp': (3, 5)},
  4: {'atk': (3, 4), 'hp': (6, 7)},
  5: {'atk': (4, 6), 'hp': (5, 9)},
  6: {'atk': (4, 8), 'hp': (6, 9)},
  7: {'atk': (3, 8), 'hp': (6, 9)},
  8: {'atk': (5, 8), 'hp': (6, 9)},
}

# Max abilities by cost (stricter than Citadelle peaks, still playable)
MAX_ABS = {1: 1, 2: 1, 3: 2, 4: 2, 5: 2, 6: 3, 7: 3, 8: 3}

# Higher = keep first when trimming
PRIORITY = {
  'etendard': 100,
  'charge': 90,
  'celerite': 90,
  'camouflage': 88,
  'bouclier-divin': 86,
  'survie': 85,
  'double-attaque': 84,
  'contact-mortel': 83,
  'pietinement': 82,
  'soutient-2': 80,
  'soutient': 79,
  'donner-buff': 78,
  'invocation-intime': 76,
  'invocation-rapide': 75,
  'invocation': 74,
  'lancer-max': 72,
  'lancer-mod': 71,
  'lancer': 70,
  'sort-degat-max': 69,
  'sort-degat-mod': 68,
  'sort-degat': 67,
  'soins-avances': 66,
  'soins-moyen': 65,
  'soins-leger': 64,
  'soin-max': 63,
  'soin-mod': 62,
  'soin': 61,
  'activer-frappe': 60,
  'activer-soin': 59,
  'activer-purge': 58,
  'activer-bouclier': 57,
  'activer-tank': 56,
  'brulant': 55,
  'poison': 54,
  'gelant': 53,
  'vol-de-vie': 52,
  'lien-de-vie': 51,
  'furie': 50,
  'affaiblir': 49,
  'vol': 48,  # utile, mais ne doit pas écraser l’identité de combat
  'activer-regen': 47,
  'quand-tue': 46,
  'dernier-souffle': 45,
  'allie-meurt': 44,
  'cri-frappe': 43,
  'jetons-1-1': 42,
  'quand-blesse': 41,
  'quand-invoque': 40,
  'apres-attaque': 39,
  'debut-tour-tir': 35,
  'fin-tour-tir': 34,
  'fin-tour-buff': 33,
  'debut-tour-soin': 20,  # souvent redondant avec soin / activer-regen
}

# Prefer dropping these when choosing among a theme pack
REDUNDANT_DROP = {
  'debut-tour-soin',  # overlaps soin / activer-regen
  'activer-regen',    # overlaps soin on many forest units
  'allie-meurt',      # keep vol-de-vie or dernier-souffle instead when tight
  'furie',            # keep brulant or vol-de-vie on demons when tight
}


def clamp(v, lo, hi):
  return max(lo, min(hi, v))


def trim_abilities(abilities, max_n):
  if not abilities:
    return []
  abs_ = list(abilities)
  # Toujours retirer les doublons de thème soins / mort
  has_soin = any(a in abs_ for a in (
    'soin', 'soin-mod', 'soin-max', 'soins-leger', 'soins-moyen', 'soins-avances', 'activer-soin'
  ))
  if has_soin:
    abs_ = [a for a in abs_ if a not in ('debut-tour-soin', 'activer-regen')]
  if 'vol-de-vie' in abs_ and 'allie-meurt' in abs_:
    abs_.remove('allie-meurt')
  if 'brulant' in abs_ and 'furie' in abs_ and len(abs_) > max_n:
    abs_.remove('furie')
  # Cap par coût
  if len(abs_) <= max_n:
    return abs_
  for drop in list(REDUNDANT_DROP):
    if len(abs_) <= max_n:
      break
    if drop in abs_:
      abs_.remove(drop)
  if len(abs_) <= max_n:
    return abs_
  ranked = sorted(
    abs_,
    key=lambda a: (PRIORITY.get(a, 10), a),
    reverse=True,
  )
  return ranked[:max_n]


def rebalance(creatures):
  changed_stats = 0
  changed_abs = 0
  for c in creatures:
    if c.get('capital') == 'Citadelle':
      continue
    cost = int(c.get('cost') or 1)
    cost = clamp(cost, 1, 8)
    band = BANDS[cost]
    atk0 = int(c.get('attack') or 0)
    hp0 = int(c.get('health') or 0)
    atk = clamp(atk0, *band['atk'])
    hp = clamp(hp0, *band['hp'])
    if atk != atk0 or hp != hp0:
      c['attack'] = atk
      c['health'] = hp
      changed_stats += 1

    max_n = MAX_ABS.get(cost, 2)
    old = list(c.get('abilities') or [])
    new = trim_abilities(old, max_n)
    # Preserve original relative order for kept abilities
    kept = set(new)
    ordered = [a for a in old if a in kept]
    for a in new:
      if a not in ordered:
        ordered.append(a)
    if ordered != old:
      c['abilities'] = ordered
      changed_abs += 1
  return changed_stats, changed_abs


def dump_js(creatures):
  # Pretty JSON-like matching current file style (quoted keys)
  body = json.dumps(creatures, ensure_ascii=False, indent=2)
  # convert to 2-space with trailing style close to file
  return (
    '/**\n'
    ' * Données créatures Fantasia Fauna — source de vérité.\n'
    ' * Éditer ici, puis recharger la page (Ctrl+F5). Voir CAPACITES.md.\n'
    ' */\n'
    f'const CREATURES = {body};\n'
  )


def main():
  text = PATH.read_text(encoding='utf-8')
  m = re.search(r'const CREATURES\s*=\s*(\[[\s\S]*?\n\]);', text)
  if not m:
    raise SystemExit('CREATURES array not found')
  raw = re.sub(r',(\s*[}\]])', r'\1', m.group(1))
  creatures = json.loads(raw)
  n_cit = sum(1 for c in creatures if c.get('capital') == 'Citadelle')
  stats, abs_ = rebalance(creatures)
  out = dump_js(creatures)
  PATH.write_text(out, encoding='utf-8')
  print(f'Citadelle untouched: {n_cit}')
  print(f'Stats adjusted: {stats}')
  print(f'Abilities trimmed: {abs_}')
  # summary
  from collections import defaultdict
  by = defaultdict(list)
  for c in creatures:
    by[c.get('capital', '?')].append(len(c.get('abilities') or []))
  print('--- avg abilities after ---')
  for fac, counts in sorted(by.items()):
    print(f'{fac:16s} avg={sum(counts)/len(counts):.2f} max={max(counts)}')


if __name__ == '__main__':
  main()
