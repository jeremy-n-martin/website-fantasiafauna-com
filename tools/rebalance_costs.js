/**
 * Réaffecte les coûts par faction selon la courbe cible (~24 cartes) :
 * 1→3, 2→5, 3→5, 4→4, 5→3, 6→2, 7→1, 8+→1
 * Factions à 25 : +1 sur le coût 3.
 * Tri : power, puis ATQ+PV, puis nom.
 * costColored : 1 (1–5), 2 (6–7), 3 (8+) ; costNeutral = cost - colored.
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
const dataPath = path.join(root, 'creatures-data.js');

const sandbox = {};
vm.runInNewContext(fs.readFileSync(dataPath, 'utf8') + '\nthis.CREATURES = CREATURES;', sandbox);
const CREATURES = sandbox.CREATURES;
if (!Array.isArray(CREATURES)) throw new Error('CREATURES non chargé');

/** Courbe pour n cartes (base 24, +extras sur 2 puis 3). */
function costSlots(n) {
  const base = [1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 6, 6, 7, 8];
  const slots = base.slice();
  let extra = Math.max(0, n - 24);
  let i = 0;
  const prefer = [2, 3, 4, 5, 1, 6];
  while (extra > 0) {
    slots.push(prefer[i % prefer.length]);
    i++;
    extra--;
  }
  // Si moins de 24, tronquer en gardant les extrémités proportionnelles
  if (n < 24) {
    // Prendre un sous-ensemble espacé de la courbe
    const out = [];
    for (let k = 0; k < n; k++) {
      const idx = Math.round((k * (base.length - 1)) / Math.max(1, n - 1));
      out.push(base[idx]);
    }
    return out.sort((a, b) => a - b);
  }
  return slots.sort((a, b) => a - b);
}

function coloredFor(cost) {
  if (cost >= 8) return 3;
  if (cost >= 6) return 2;
  return 1;
}

function score(c) {
  return [
    c.power | 0,
    (c.attack | 0) + (c.health | 0),
    c.attack | 0,
    c.health | 0,
    String(c.name || ''),
  ];
}

function cmpScore(a, b) {
  const sa = score(a);
  const sb = score(b);
  for (let i = 0; i < sa.length; i++) {
    if (sa[i] < sb[i]) return -1;
    if (sa[i] > sb[i]) return 1;
  }
  return 0;
}

const byCap = new Map();
for (const c of CREATURES) {
  const cap = c.capital || '?';
  if (!byCap.has(cap)) byCap.set(cap, []);
  byCap.get(cap).push(c);
}

const report = [];
for (const [cap, list] of [...byCap.entries()].sort((a, b) => a[0].localeCompare(b[0], 'fr'))) {
  const sorted = list.slice().sort(cmpScore);
  const slots = costSlots(sorted.length);
  const hist = {};
  sorted.forEach((c, i) => {
    const cost = slots[i];
    const cc = coloredFor(cost);
    const cn = cost - cc;
    c.cost = cost;
    c.costColored = cc;
    c.costNeutral = cn;
    hist[cost] = (hist[cost] || 0) + 1;
  });
  report.push({ cap, n: sorted.length, hist });
}

function fmtList(arr, indent) {
  if (!arr.length) return '[]';
  const pad = ' '.repeat(indent);
  const inner = arr.map((x) => `${pad}  ${JSON.stringify(x)},`).join('\n');
  return `[\n${inner}\n${pad}]`;
}

function fmtCreature(c) {
  const lines = ['  {'];
  const order = [
    'id', 'name', 'capital', 'size', 'roles', 'abilities', 'natures', 'origin',
    'power', 'popularity', 'cost', 'attack', 'health', 'rarity', 'spell',
    'image', 'quote', 'costColored', 'costNeutral',
  ];
  const keys = [...order.filter((k) => k in c), ...Object.keys(c).filter((k) => !order.includes(k))];
  for (const k of keys) {
    const v = c[k];
    if (k === 'roles' || k === 'abilities' || k === 'natures') {
      lines.push(`    ${k}: ${fmtList(v || [], 4)},`);
    } else if (typeof v === 'string') {
      lines.push(`    ${k}: ${JSON.stringify(v)},`);
    } else if (typeof v === 'number' || typeof v === 'boolean') {
      lines.push(`    ${k}: ${v},`);
    } else {
      lines.push(`    ${k}: ${JSON.stringify(v)},`);
    }
  }
  lines.push('  }');
  return lines.join('\n');
}

const header = `/* Catalogue des créatures — éditer ici (une carte = un bloc).
 * roles     = exactement 1 parmi : normal, fast, ranged, caster, tank
 * abilities = capacités de jeu (voir ABILITIES dans game.js + CAPACITES.md)
 * Charger ce fichier AVANT game.js (voir index.html).
 */
const CREATURES = [
`;

fs.writeFileSync(dataPath, header + CREATURES.map(fmtCreature).join(',\n') + '\n];\n');

console.log('Réaffectation coûts par faction :');
for (const r of report) {
  const h = Object.keys(r.hist).sort((a, b) => a - b).map((k) => `${k}:${r.hist[k]}`).join(' ');
  console.log(`  ${r.cap} (${r.n}) → ${h}`);
}
console.log('Written', dataPath);
