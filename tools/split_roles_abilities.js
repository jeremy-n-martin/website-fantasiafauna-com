/**
 * Sépare roles (1 parmi normal/fast/ranged/caster/tank) et abilities (keywords ABILITIES)
 * dans creatures-data.js. Idempotent.
 * Ne déplace pas les rôles de forme même s’ils existent aussi dans ABILITIES (tank, ranged).
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const dataPath = path.join(root, 'creatures-data.js');
const gamePath = path.join(root, 'game.js');

const CREATURE_ROLES = new Set(['normal', 'fast', 'ranged', 'caster', 'tank']);

const gameSrc = fs.readFileSync(gamePath, 'utf8');
const abMatch = gameSrc.match(/const ABILITIES = \{([\s\S]*?)\n\};/);
if (!abMatch) throw new Error('ABILITIES introuvable dans game.js');

const abilityIds = new Set();
for (const m of abMatch[1].matchAll(/^\s*'?([a-z0-9-]+)'?\s*:\s*\{/gm)) {
  abilityIds.add(m[1]);
}
if (!abilityIds.size) throw new Error('Aucun id ABILITIES extrait');

// Charge CREATURES
const sandbox = { module: { exports: {} }, exports: {} };
const vm = require('vm');
vm.runInNewContext(fs.readFileSync(dataPath, 'utf8') + '\nthis.CREATURES = CREATURES;', sandbox);
const CREATURES = sandbox.CREATURES;
if (!Array.isArray(CREATURES)) throw new Error('CREATURES non chargé');

const roleOnly = new Map();
const abilityHits = new Map();
let moved = 0;

for (const c of CREATURES) {
  const rolesIn = Array.isArray(c.roles) ? c.roles : [];
  const abilitiesIn = Array.isArray(c.abilities) ? c.abilities : [];
  const roles = [];
  const abilities = [...abilitiesIn];
  for (const r of rolesIn) {
    if (r === 'volant') {
      if (!abilities.includes('vol')) abilities.push('vol');
      abilityHits.set('vol', (abilityHits.get('vol') || 0) + 1);
      moved++;
      continue;
    }
    if (CREATURE_ROLES.has(r)) {
      roles.push(r);
      roleOnly.set(r, (roleOnly.get(r) || 0) + 1);
      continue;
    }
    if (abilityIds.has(r)) {
      if (!abilities.includes(r)) abilities.push(r);
      abilityHits.set(r, (abilityHits.get(r) || 0) + 1);
      moved++;
    } else {
      roles.push(r);
      roleOnly.set(r, (roleOnly.get(r) || 0) + 1);
    }
  }
  // Un seul rôle : priorité tank > ranged > fast > caster > normal
  const prio = ['tank', 'ranged', 'fast', 'caster', 'normal'];
  const role = prio.find((id) => roles.includes(id)) || 'normal';
  c.roles = [role];
  c.abilities = abilities.filter((a) => a !== 'tank' && a !== 'ranged' && a !== 'fast' && a !== 'volant');
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
`;

const out = header + 'const CREATURES = [\n' + CREATURES.map(fmtCreature).join(',\n') + '\n];\n';
fs.writeFileSync(dataPath, out, 'utf8');

console.log('Ability ids:', abilityIds.size);
console.log('Entries moved from roles→abilities:', moved);
console.log('Role tags remaining:', [...roleOnly.entries()].sort((a, b) => b[1] - a[1]));
console.log('Ability hits:', [...abilityHits.entries()].sort((a, b) => b[1] - a[1]).slice(0, 15));
console.log('Written', dataPath);
