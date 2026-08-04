/** Extrait / reformate CREATURES vers creatures-data.js (format lisible). */
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');

function loadCreatures(){
  const dataPath = path.join(root, 'creatures-data.js');
  const gamePath = path.join(root, 'game.js');
  if (fs.existsSync(dataPath)) {
    const src = fs.readFileSync(dataPath, 'utf8');
    const m = src.match(/const CREATURES = (\[.*?\]);/s);
    if (m) return eval(m[1]);
  }
  const g = fs.readFileSync(gamePath, 'utf8');
  const m = g.match(/^const CREATURES = (\[.*?\]);/s);
  if (!m) throw new Error('CREATURES introuvable');
  return eval(m[1]);
}

function fmtArray(arr, indent){
  if (!Array.isArray(arr) || !arr.length) return '[]';
  const pad = ' '.repeat(indent);
  const inner = arr.map((v) => `${pad}  ${JSON.stringify(v)},`).join('\n');
  return `[\n${inner}\n${pad}]`;
}

const creatures = loadCreatures();
const fields = [
  'id', 'name', 'capital', 'size', 'roles', 'natures', 'origin',
  'power', 'popularity', 'cost', 'attack', 'health', 'rarity',
  'spell', 'image', 'quote', 'costColored', 'costNeutral',
];
const body = creatures.map((c) => {
  const lines = ['  {'];
  for (const key of fields) {
    if (!(key in c)) continue;
    if (key === 'roles' || key === 'natures') {
      lines.push(`    ${key}: ${fmtArray(c[key], 4)},`);
    } else {
      lines.push(`    ${key}: ${JSON.stringify(c[key])},`);
    }
  }
  lines.push('  }');
  return lines.join('\n');
}).join(',\n');

const out = `/* Catalogue des créatures — éditer ici (une carte = un bloc).
 * roles = capacités / tags (voir CAPACITES.md et ABILITIES dans game.js)
 * Charger ce fichier AVANT game.js (voir index.html).
 */
const CREATURES = [
${body}
];
if (typeof window !== 'undefined') window.CREATURES = CREATURES;
`;

fs.writeFileSync(path.join(root, 'creatures-data.js'), out);
console.log('OK', creatures.length, 'creatures -> creatures-data.js');
