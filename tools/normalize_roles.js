/**
 * Normalise creatures-data.js :
 * - roles = exactement 1 parmi normal | fast | ranged | caster | tank
 * - volant (role) → ability "vol"
 * - tank / ranged déplacés des abilities vers le rôle unique
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
const dataPath = path.join(root, 'creatures-data.js');

const ALLOWED = ['tank', 'ranged', 'fast', 'caster', 'normal'];
const ROLE_PRIORITY = ['tank', 'ranged', 'fast', 'caster', 'normal'];

const sandbox = {};
vm.runInNewContext(fs.readFileSync(dataPath, 'utf8') + '\nthis.CREATURES = CREATURES;', sandbox);
const CREATURES = sandbox.CREATURES;
if (!Array.isArray(CREATURES)) throw new Error('CREATURES non chargé');

const stats = { volMoved: 0, roleChosen: {}, emptied: 0 };

function pickRole(tags) {
  for (const id of ROLE_PRIORITY) {
    if (tags.has(id)) return id;
  }
  return 'normal';
}

for (const c of CREATURES) {
  const rolesIn = Array.isArray(c.roles) ? c.roles : [];
  const abilitiesIn = Array.isArray(c.abilities) ? c.abilities : [];
  const tags = new Set();
  let hadVol = false;

  for (const r of rolesIn) {
    if (r === 'volant' || r === 'vol') {
      hadVol = true;
      continue;
    }
    if (ALLOWED.includes(r)) tags.add(r);
  }
  for (const a of abilitiesIn) {
    if (a === 'volant' || a === 'vol') {
      hadVol = true;
      continue;
    }
    if (a === 'tank' || a === 'ranged' || a === 'fast') tags.add(a);
  }

  const role = pickRole(tags);
  stats.roleChosen[role] = (stats.roleChosen[role] || 0) + 1;
  if (!rolesIn.length) stats.emptied++;

  const abilities = [];
  for (const a of abilitiesIn) {
    if (a === 'volant' || a === 'vol') continue;
    if (a === 'tank' || a === 'ranged' || a === 'fast') continue; // portés par le rôle
    if (!abilities.includes(a)) abilities.push(a);
  }
  if (hadVol) {
    if (!abilities.includes('vol')) abilities.push('vol');
    stats.volMoved++;
  }

  c.roles = [role];
  c.abilities = abilities;
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

const out = header + CREATURES.map(fmtCreature).join(',\n') + '\n];\n';
fs.writeFileSync(dataPath, out);
console.log('OK', stats);