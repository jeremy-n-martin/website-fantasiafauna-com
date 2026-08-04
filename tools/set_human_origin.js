const fs = require('fs');
const vm = require('vm');
const path = 'creatures-data.js';

let src = fs.readFileSync(path, 'utf8');

// Restore Page fields corrupted earlier + origin Humain
const pageRe = /\{\s*id:\s*15,\s*name:\s*"Page",[\s\S]*?costNeutral:\s*0,\s*\},/;
const pageMatch = src.match(pageRe);
if (!pageMatch) throw new Error('Page block not found');

const pageBlock = `{
    id: 15,
    name: "Page",
    capital: "Citadelle",
    size: "1,65",
    roles: [
      "normal",
    ],
    abilities: [
      "formation",
      "soutient",
    ],
    natures: [
      "vivant",
    ],
    origin: "Humain",
    power: 3,
    popularity: 28,
    cost: 1,
    attack: 1,
    health: 2,
    rarity: "commune",
    spell: "Charge: +1 attaque au tour d’invocation.",
    image: "img/Page 1.png",
    quote: "« Le premier pas vers la gloire est d'apprendre à porter le bouclier d'un autre. »",
    costColored: 1,
    costNeutral: 0,
  },`;

src = src.replace(pageRe, pageBlock);
fs.writeFileSync(path, src);

// Reload and rewrite origins for human class creatures
const sandbox = {};
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(path, 'utf8') + '\nthis.CREATURES = CREATURES;', sandbox);
const CREATURES = sandbox.CREATURES;

const HUMANS = new Set([
  'Guerrier',
  'Spadassin',
  'Voleur',
  'Druide',
  'Rôdeur',
  'Barbare',
  'Berserker',
  'Page',
  'Ecuyer',
]);

const changed = [];
for (const c of CREATURES) {
  if (!HUMANS.has(c.name)) continue;
  if (c.origin !== 'Humain') {
    changed.push(`${c.name}: ${c.origin || '(manquant)'} -> Humain`);
    c.origin = 'Humain';
  }
}

function fmtList(arr, indent) {
  if (!arr.length) return '[]';
  const pad = ' '.repeat(indent);
  return `[\n${arr.map((x) => `${pad}  ${JSON.stringify(x)},`).join('\n')}\n${pad}]`;
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
`;

const out = header + 'const CREATURES = [\n' + CREATURES.map(fmtCreature).join(',\n') + '\n];\n';
fs.writeFileSync(path, out, 'utf8');

console.log('Changed:');
changed.forEach((l) => console.log(' ', l));
console.log('Humain now:', CREATURES.filter((c) => c.origin === 'Humain').map((c) => c.name).join(', '));
