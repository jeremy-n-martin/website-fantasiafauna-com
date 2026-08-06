/* Renomme transpercer → pietinement et porte la couverture à ~10%. */
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const DATA = path.join(ROOT, 'creatures-data.js');

const raw = fs.readFileSync(DATA, 'utf8');
const headerEnd = raw.indexOf('const CREATURES = ');
const header = raw.slice(0, headerEnd);
const CREATURES = new Function(`${raw.slice(headerEnd)};\nreturn CREATURES;`)();

const TARGET_PCT = 0.10;
const target = Math.round(CREATURES.length * TARGET_PCT);

for (const c of CREATURES) {
  if (!Array.isArray(c.abilities)) c.abilities = [];
  c.abilities = c.abilities.map((a) => (a === 'transpercer' ? 'pietinement' : a));
  // dédoublonne
  c.abilities = [...new Set(c.abilities)];
  if (typeof c.spell === 'string' && /transpercer/i.test(c.spell)) {
    c.spell = c.spell.replace(/[Tt]ranspercer/g, (m) => (m[0] === 'T' ? 'Piétinement' : 'piétinement'));
  }
}

const hasP = (c) => (c.abilities || []).includes('pietinement');
let have = CREATURES.filter(hasP).length;
const need = Math.max(0, target - have);

const candidates = CREATURES.filter((c) => {
  if (hasP(c)) return false;
  const abs = c.abilities || [];
  if (abs.length >= 1) return false;
  if ((c.roles || []).includes('ranged')) return false;
  return true;
}).sort((a, b) => (b.cost | 0) - (a.cost | 0) || a.id - b.id);

const byFac = {};
for (const c of candidates) {
  (byFac[c.capital] = byFac[c.capital] || []).push(c);
}
const factions = Object.keys(byFac).sort((a, b) => a.localeCompare(b, 'fr'));
const pick = [];
let i = 0;
while (pick.length < need && factions.some((f) => byFac[f].length)) {
  const f = factions[i % factions.length];
  if (byFac[f].length) pick.push(byFac[f].shift());
  i += 1;
}
for (const c of pick) {
  c.abilities = Array.isArray(c.abilities) ? c.abilities : [];
  c.abilities.push('pietinement');
}

const out = `${header}const CREATURES = ${JSON.stringify(CREATURES, null, 2)};\n`;
fs.writeFileSync(DATA, out, 'utf8');

const finalN = CREATURES.filter(hasP).length;
console.log({
  creatures: CREATURES.length,
  target,
  added: pick.length,
  final: finalN,
  pct: `${((100 * finalN) / CREATURES.length).toFixed(1)}%`,
  sample: CREATURES.filter(hasP).slice(0, 12).map((c) => c.name),
});
