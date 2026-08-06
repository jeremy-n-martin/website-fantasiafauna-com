/* Porte le rôle ranged à ~23% des créatures. */
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const DATA = path.join(ROOT, 'creatures-data.js');

const raw = fs.readFileSync(DATA, 'utf8');
const headerEnd = raw.indexOf('const CREATURES = ');
const header = raw.slice(0, headerEnd);
const CREATURES = new Function(`${raw.slice(headerEnd)};\nreturn CREATURES;`)();

const TARGET_PCT = 0.23;
const target = Math.round(CREATURES.length * TARGET_PCT);
const isRanged = (c) => (c.roles || []).includes('ranged');
let have = CREATURES.filter(isRanged).length;
const need = Math.max(0, target - have);

const candidates = CREATURES.filter((c) => {
  if (isRanged(c)) return false;
  const r = (c.roles || [])[0];
  if (r === 'tank') return false; // préserver les tanks
  return true;
}).sort((a, b) => (a.cost | 0) - (b.cost | 0) || a.id - b.id);

const byFac = {};
for (const c of candidates) {
  (byFac[c.capital] = byFac[c.capital] || []).push(c);
}
const facs = Object.keys(byFac).sort((a, b) => a.localeCompare(b, 'fr'));
const pick = [];
let i = 0;
while (pick.length < need && facs.some((f) => byFac[f].length)) {
  const f = facs[i % facs.length];
  if (byFac[f].length) pick.push(byFac[f].shift());
  i += 1;
}
for (const c of pick) c.roles = ['ranged'];

fs.writeFileSync(DATA, `${header}const CREATURES = ${JSON.stringify(CREATURES, null, 2)};\n`, 'utf8');

const after = CREATURES.filter(isRanged).length;
console.log({
  target,
  converted: pick.length,
  after,
  pct: `${((100 * after) / CREATURES.length).toFixed(1)}%`,
  tanks: CREATURES.filter((c) => (c.roles || []).includes('tank')).length,
});
