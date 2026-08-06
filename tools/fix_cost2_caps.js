/* Coût 2 : Σ ATQ+PV ≤ 6, PV ≤ 5 (max 1/5) ; taxe capa : faible ≤5, moyenne ≤4. */
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
function cost2Tier(c) {
  const ks = [...keywords(c)];
  if (hasVolRanged(c)) return 'vol_ranged';
  if (ks.some(isMediumId)) return 'medium';
  if (ks.some(isWeakId)) return 'weak';
  return 'none';
}
function hasVolRanged(c) {
  const ks = keywords(c);
  return ks.has('vol') && (ks.has('ranged') || roleOf(c) === 'ranged');
}
function cost2Budget(tier) {
  if (tier === 'vol_ranged') return { maxSum: 2, maxAtk: 1, maxHp: 1 }; // 1/1
  if (tier === 'medium') return { maxSum: 4, maxAtk: 2, maxHp: 3 }; // ex. 2/2, 1/3
  if (tier === 'weak') return { maxSum: 5, maxAtk: 2, maxHp: 4 }; // ex. 2/3, 1/4
  return { maxSum: 6, maxAtk: 3, maxHp: 5 }; // max 1/5, 2/4, 3/3
}

function clampCost2(c) {
  const tier = cost2Tier(c);
  const bud = cost2Budget(tier);
  let atk = Math.max(1, c.attack | 0);
  let hp = Math.max(1, c.health | 0);

  // Déjà dans le budget : ne pas buff
  if (atk <= bud.maxAtk && hp <= bud.maxHp && atk + hp <= bud.maxSum) {
    return { atk, hp, tier };
  }

  // Hors budget : réduire (PV d’abord), sans monter l’ATQ
  atk = Math.min(atk, bud.maxAtk);
  hp = Math.min(hp, bud.maxHp);
  while (atk + hp > bud.maxSum) {
    if (hp > Math.max(atk, 1) && hp > 1) hp -= 1;
    else if (atk > 1) atk -= 1;
    else break;
  }
  // Si encore trop bas côté corps « vanilla » hors capa : remonter vers 2/4 uniquement pour none sur-budgétisé au départ
  // (déjà géré par la réduction ci-dessus)

  // Profil cible si la carte était largement au-dessus (Σ>8) et sans capa : 2/4
  const wasHuge = ((c.attack | 0) + (c.health | 0)) > 8;
  if (tier === 'none' && wasHuge) {
    atk = 2;
    hp = 4;
  }
  return { atk, hp, tier };
}

let fixed = 0;
const report = [];
for (const c of CREATURES) {
  if ((c.cost | 0) !== 2) continue;
  const before = `${c.attack}/${c.health}`;
  const { atk, hp, tier } = clampCost2(c);
  if (c.attack !== atk || c.health !== hp) {
    report.push(`${c.name}: ${before} → ${atk}/${hp} (${tier}, Σ${atk + hp})`);
    fixed += 1;
  }
  c.attack = atk;
  c.health = hp;
}

fs.writeFileSync(DATA, `${header}const CREATURES = ${JSON.stringify(CREATURES, null, 2)};\n`, 'utf8');
console.log(`Corrigé ${fixed} créatures coût 2`);
report.slice(0, 40).forEach((l) => console.log(' ', l));
if (report.length > 40) console.log(`  … +${report.length - 40}`);

const over = CREATURES.filter((c) => (c.cost | 0) === 2 && ((c.attack | 0) + (c.health | 0) > 6 || (c.health | 0) > 5));
console.log('over cap', over.map((c) => c.name + ':' + c.attack + '/' + c.health));
