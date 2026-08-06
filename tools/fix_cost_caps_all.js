/**
 * Plafonds stats par coût (extrapolation) :
 *   maxSum = 2C+2 · maxHp = 2C+1 (profil 1/(2C+1))
 *   C1 : déjà 1/3 · 1/2 · 1/1
 *   C2+ : none Σmax · faible Σ-1 · moyenne Σ-2 · Vol+Ranged → 1/1
 * Ex. C3 Σ≤8 (1/7, 2/6, 3/5, 4/4, 2/5…) · C4 Σ≤10 · C5 Σ≤12…
 */
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
function hasVolRanged(c) {
  const ks = keywords(c);
  return ks.has('vol') && (ks.has('ranged') || roleOf(c) === 'ranged');
}
function powerTier(c) {
  if (hasVolRanged(c)) return 'vol_ranged';
  const ks = [...keywords(c)];
  if (ks.some(isMediumId)) return 'medium';
  if (ks.some(isWeakId)) return 'weak';
  return 'none';
}

/** Budget pour coût ≥ 2. */
function budgetFor(cost, tier) {
  const maxSumBase = 2 * cost + 2;
  const maxHpBase = 2 * cost + 1;
  if (tier === 'vol_ranged') return { maxSum: 2, maxAtk: 1, maxHp: 1 };
  if (tier === 'medium') {
    return {
      maxSum: maxSumBase - 2,
      maxAtk: cost,
      maxHp: maxHpBase - 2,
    };
  }
  if (tier === 'weak') {
    return {
      maxSum: maxSumBase - 1,
      maxAtk: cost,
      maxHp: maxHpBase - 1,
    };
  }
  return {
    maxSum: maxSumBase,
    maxAtk: cost + 1,
    maxHp: maxHpBase,
  };
}

function clampCreature(c) {
  const cost = c.cost | 0;
  if (cost < 2) return null; // C1 géré ailleurs
  const tier = powerTier(c);
  const bud = budgetFor(cost, tier);
  let atk = Math.max(1, c.attack | 0);
  let hp = Math.max(1, c.health | 0);

  if (atk <= bud.maxAtk && hp <= bud.maxHp && atk + hp <= bud.maxSum) {
    return null; // déjà OK
  }

  const wasHuge = atk + hp > bud.maxSum + 2;

  atk = Math.min(atk, bud.maxAtk);
  hp = Math.min(hp, bud.maxHp);
  while (atk + hp > bud.maxSum) {
    if (hp > Math.max(atk, 1) && hp > 1) hp -= 1;
    else if (atk > 1) atk -= 1;
    else break;
  }

  // Gros hors-norme sans capa → viser C / (Σmax−C) sans monter l’ATQ
  if (tier === 'none' && wasHuge) {
    const targetAtk = Math.min(cost, atk, bud.maxAtk);
    atk = Math.max(1, targetAtk);
    hp = Math.min(bud.maxSum - atk, bud.maxHp);
    if (hp < 1) hp = 1;
  }

  // HP ≥ 1, ATQ ≥ 1
  atk = Math.max(1, atk);
  hp = Math.max(1, hp);
  return { atk, hp, tier, sum: atk + hp, bud };
}

let fixed = 0;
const byCost = {};
for (const c of CREATURES) {
  const res = clampCreature(c);
  if (!res) continue;
  const before = `${c.attack}/${c.health}`;
  c.attack = res.atk;
  c.health = res.hp;
  fixed += 1;
  const k = c.cost | 0;
  if (!byCost[k]) byCost[k] = [];
  byCost[k].push(`${c.name}: ${before} → ${res.atk}/${res.hp} (${res.tier})`);
}

fs.writeFileSync(DATA, `${header}const CREATURES = ${JSON.stringify(CREATURES, null, 2)};\n`, 'utf8');
console.log(`Corrigé ${fixed} créatures (C2+)`);
for (const cost of Object.keys(byCost).map(Number).sort((a, b) => a - b)) {
  console.log(`\n— Coût ${cost} (${byCost[cost].length}) cap Σ${2 * cost + 2} max 1/${2 * cost + 1}`);
  byCost[cost].slice(0, 12).forEach((l) => console.log(' ', l));
  if (byCost[cost].length > 12) console.log(`  … +${byCost[cost].length - 12}`);
}

// Vérif
for (let cost = 2; cost <= 8; cost++) {
  const maxSum = 2 * cost + 2;
  const maxHp = 2 * cost + 1;
  const over = CREATURES.filter(
    (c) => (c.cost | 0) === cost && ((c.attack | 0) + (c.health | 0) > maxSum || (c.health | 0) > maxHp),
  );
  // Vol+Ranged 1/1 ok; medium may be under maxHp base
  const hard = over.filter((c) => {
    const t = powerTier(c);
    if (t === 'vol_ranged') return false;
    const b = budgetFor(cost, t);
    return (c.attack | 0) + (c.health | 0) > b.maxSum || (c.health | 0) > b.maxHp;
  });
  console.log(`check C${cost}: hard-over=${hard.length}`, hard.slice(0, 3).map((c) => c.name + c.attack + '/' + c.health));
}
