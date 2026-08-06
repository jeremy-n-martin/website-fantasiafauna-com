/* Retire du jeu toutes les capacités hors liste KEEP. */
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');

const KEEP = new Set([
  'tank',
  'vol',
  'pietinement',
  'poison',
  'ranged',
  'canalisation-1-entrave',
  'canalisation-2-entrave',
  'canalisation-3-entrave',
  'bouclier-divin',
]);

const DATA = path.join(ROOT, 'creatures-data.js');
const raw = fs.readFileSync(DATA, 'utf8');
const headerEnd = raw.indexOf('const CREATURES = ');
const header = raw.slice(0, headerEnd);
const CREATURES = new Function(`${raw.slice(headerEnd)};\nreturn CREATURES;`)();

let stripped = 0;
for (const c of CREATURES) {
  const before = (c.abilities || []).slice();
  c.abilities = before.filter((id) => KEEP.has(id));
  stripped += before.length - c.abilities.length;
}
fs.writeFileSync(DATA, `${header}const CREATURES = ${JSON.stringify(CREATURES, null, 2)};\n`, 'utf8');
console.log({ creatures: CREATURES.length, abilitiesRemovedFromCards: stripped, keep: [...KEEP] });
