/* Migre gelant → entrave et ajoute quelques Invocation / Canalisation. */
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const DATA = path.join(ROOT, 'creatures-data.js');

const raw = fs.readFileSync(DATA, 'utf8');
const headerEnd = raw.indexOf('const CREATURES = ');
const header = raw.slice(0, headerEnd);
const CREATURES = new Function(`${raw.slice(headerEnd)};\nreturn CREATURES;`)();

const TARGET = {
  entrave: Math.round(CREATURES.length * 0.02), // ~2%
  'invocation-entrave': Math.round(CREATURES.length * 0.015),
  'invocation-rappel': Math.round(CREATURES.length * 0.01),
  'canalisation-2-rappel': Math.round(CREATURES.length * 0.01),
  'canalisation-1-entrave': Math.round(CREATURES.length * 0.01),
  'canalisation-3-rappel': Math.max(2, Math.round(CREATURES.length * 0.006)),
};

for (const c of CREATURES) {
  if (!Array.isArray(c.abilities)) c.abilities = [];
  c.abilities = c.abilities.map((a) => (a === 'gelant' ? 'entrave' : a));
  c.abilities = [...new Set(c.abilities)];
  if (typeof c.spell === 'string' && /g[eé]lant/i.test(c.spell)) {
    c.spell = c.spell.replace(/[Gg][eé]lant/gi, 'Entrave').replace(/gel/gi, 'entrave');
  }
}

function has(c, id) {
  return (c.abilities || []).includes(id);
}
function emptyAbilitySlots(c) {
  return !(c.abilities || []).length;
}

function assign(id, count, prefer = () => true) {
  let n = CREATURES.filter((c) => has(c, id)).length;
  const need = Math.max(0, count - n);
  const pool = CREATURES.filter((c) => !has(c, id) && emptyAbilitySlots(c) && prefer(c))
    .sort((a, b) => (b.cost | 0) - (a.cost | 0) || a.id - b.id);
  const byFac = {};
  for (const c of pool) (byFac[c.capital] = byFac[c.capital] || []).push(c);
  const facs = Object.keys(byFac).sort((a, b) => a.localeCompare(b, 'fr'));
  let i = 0;
  const picked = [];
  while (picked.length < need && facs.some((f) => byFac[f].length)) {
    const f = facs[i % facs.length];
    if (byFac[f].length) picked.push(byFac[f].shift());
    i += 1;
  }
  for (const c of picked) {
    c.abilities = c.abilities || [];
    c.abilities.push(id);
  }
  return picked.length;
}

const report = {};
report.entrave = assign('entrave', TARGET.entrave, (c) => !(c.roles || []).includes('ranged'));
report['invocation-entrave'] = assign('invocation-entrave', TARGET['invocation-entrave']);
report['invocation-rappel'] = assign('invocation-rappel', TARGET['invocation-rappel']);
report['canalisation-2-rappel'] = assign('canalisation-2-rappel', TARGET['canalisation-2-rappel'], (c) => (c.cost | 0) >= 2);
report['canalisation-1-entrave'] = assign('canalisation-1-entrave', TARGET['canalisation-1-entrave']);
report['canalisation-3-rappel'] = assign('canalisation-3-rappel', TARGET['canalisation-3-rappel'], (c) => (c.cost | 0) >= 3);

fs.writeFileSync(DATA, `${header}const CREATURES = ${JSON.stringify(CREATURES, null, 2)};\n`, 'utf8');

const counts = {};
for (const id of Object.keys(TARGET)) {
  counts[id] = CREATURES.filter((c) => has(c, id)).length;
}
console.log({ added: report, totals: counts, gelantLeft: CREATURES.filter((c) => has(c, 'gelant')).length });
