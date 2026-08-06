/* Plafond coût 1 : 1/3 sans capa · 1/2 capa faible · 1/1 capa moyenne. */
const fs = require('fs');
const path = require('path');
const DATA = path.join(__dirname, '..', 'creatures-data.js');
const raw = fs.readFileSync(DATA, 'utf8');
const header = raw.slice(0, raw.indexOf('const CREATURES = '));
const CREATURES = new Function(`${raw.slice(raw.indexOf('const CREATURES = '))};\nreturn CREATURES;`)();

const WEAK = new Set(['poison', 'entrave', 'invocation-entrave']);
const MEDIUM = new Set(['vol', 'ranged', 'tank', 'pietinement', 'bouclier-divin']);

function roleOf(c) {
  return (c.roles && c.roles[0]) || 'normal';
}
function keywords(c) {
  const out = new Set(c.abilities || []);
  const r = roleOf(c);
  if (r === 'tank' || r === 'ranged') out.add(r);
  if ((c.roles || []).includes('volant')) out.add('vol');
  return out;
}
function isWeakId(id) {
  return WEAK.has(id) || String(id).startsWith('canalisation-');
}
function isMediumId(id) {
  return MEDIUM.has(id);
}
/** @returns {'none'|'weak'|'medium'} */
function cost1PowerTier(c) {
  const ks = [...keywords(c)];
  if (ks.some(isMediumId)) return 'medium';
  if (ks.some(isWeakId)) return 'weak';
  return 'none';
}
function cost1Cap(tier) {
  if (tier === 'medium') return { atk: 1, hp: 1 };
  if (tier === 'weak') return { atk: 1, hp: 2 };
  return { atk: 1, hp: 3 };
}

let fixed = 0;
const report = [];
for (const c of CREATURES) {
  if ((c.cost | 0) !== 1) continue;
  const tier = cost1PowerTier(c);
  const cap = cost1Cap(tier);
  const before = `${c.attack}/${c.health}`;
  let atk = Math.min(c.attack | 0, cap.atk);
  let hp = Math.min(c.health | 0, cap.hp);
  atk = Math.max(1, atk);
  hp = Math.max(atk, Math.min(hp, cap.hp));
  // Forcer le plafond exact recommandé (corps coût 1)
  atk = cap.atk;
  hp = cap.hp;
  if (c.attack !== atk || c.health !== hp) {
    report.push(`${c.name}: ${before} → ${atk}/${hp} (${tier})`);
    fixed += 1;
  }
  c.attack = atk;
  c.health = hp;
  if (tier === 'none' && (!c.spell || /Tir:|Garde:|Vol \+|Ranged :/.test(c.spell))) {
    c.spell = '';
  }
}

fs.writeFileSync(DATA, `${header}const CREATURES = ${JSON.stringify(CREATURES, null, 2)};\n`, 'utf8');
console.log(`Corrigé ${fixed} créatures coût 1`);
report.forEach((l) => console.log(' ', l));
const samples = ['Tatzelwurm', 'Sahuagin', 'Sasquatch', 'Kuo-toa', 'Aarakocra', 'Gobelin', 'Voleur', 'Troglodyte'];
for (const n of samples) {
  const c = CREATURES.find((x) => x.name === n);
  if (c) console.log('✓', n, c.attack + '/' + c.health, c.roles, c.abilities);
}
