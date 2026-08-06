/**
 * Cohérence / homogénéisation :
 * - Max 1 capacité (sauf combos iconiques coût élevé)
 * - Chaque créature unique : (coût, ATQ, PV, rôle, abilities)
 * - Stats recentrées sur C / 2×C ± taxe modérée
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const DATA = path.join(ROOT, 'creatures-data.js');

const raw = fs.readFileSync(DATA, 'utf8');
const headerEnd = raw.indexOf('const CREATURES = ');
const header = raw.slice(0, headerEnd);
const CREATURES = new Function(`${raw.slice(headerEnd)};\nreturn CREATURES;`)();

const SPECIAL_RE = /^(poison|bouclier-divin|canalisation-\d-entrave)$/;

function nameHay(c) {
  return String(c.name || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '');
}
function nameTokens(c) {
  return nameHay(c).split(/[^a-z0-9]+/).filter(Boolean);
}
function nameHas(c, keys) {
  const tokens = nameTokens(c);
  const full = nameHay(c);
  return keys.some((k) => {
    const kk = k.normalize('NFD').replace(/\p{M}/gu, '');
    if (kk.includes(' ')) return full === kk || full.includes(kk);
    return tokens.includes(kk);
  });
}
function mustFly(c) {
  return (
    nameHas(c, [
      'griffon', 'pegase', 'hippogriffe', 'alerion', 'dragon', 'wyvern', 'wyverne', 'vouivre',
      'phenix', 'phoenix', 'harpie', 'aarakocra', 'quetzalcoatl', 'manticore', 'gargouille',
      'ange', 'valkyrie', 'peryton', 'tengu', 'furie', 'erinye', 'banshee', 'fantome',
      'spectre', 'djinn', 'strige', 'valravn', 'nephilim', 'mothman', 'flumph', 'sprite',
      'pixie', 'fee', 'roc', 'drake', 'chimere', 'vrock', 'vampire', 'succube', 'incube',
      'diablotin', 'imp', 'nosferatu', 'peri',
    ]) ||
    nameTokens(c).some((t) => t.startsWith('dragon')) ||
    nameHay(c).includes('fee-dragon')
  );
}
function isDragon(c) {
  return nameTokens(c).some((t) => t.startsWith('dragon')) || nameHas(c, ['wyvern', 'wyverne', 'vouivre', 'drake']);
}
function absOf(c) {
  if (!Array.isArray(c.abilities)) c.abilities = [];
  return c.abilities;
}
function hasAb(c, id) {
  return absOf(c).includes(id);
}
function roleOf(c) {
  return (c.roles && c.roles[0]) || 'normal';
}
function specialsOf(c) {
  return absOf(c).filter((a) => SPECIAL_RE.test(a));
}

/** Une seule capacité, sauf combos iconiques. */
function slimAbilities(c) {
  const abs = absOf(c).slice();
  const hasVol = abs.includes('vol');
  const hasPie = abs.includes('pietinement');
  const special = specialsOf(c)[0] || null;
  const cost = c.cost | 0;

  // Combo autorisé : gros dragon Vol + Piétinement (coût ≥ 6)
  if (isDragon(c) && cost >= 6 && hasVol && hasPie) {
    c.abilities = ['vol', 'pietinement'];
    return;
  }
  // Combo autorisé : Ange / Phénix / Quetzalcoatl Vol + Bouclier (coût ≥ 7)
  if (
    special === 'bouclier-divin' &&
    hasVol &&
    cost >= 7 &&
    nameHas(c, ['ange', 'phenix', 'phoenix', 'quetzalcoatl', 'valkyrie'])
  ) {
    c.abilities = ['vol', 'bouclier-divin'];
    return;
  }

  // Sinon : 1 max. Priorité thématique
  if (mustFly(c) || hasVol) {
    // Vol prioritaire pour les must-fly ; le spécial va ailleurs au top-up
    if (mustFly(c)) {
      c.abilities = ['vol'];
      return;
    }
  }
  if (special) {
    c.abilities = [special];
    return;
  }
  if (hasPie) {
    c.abilities = ['pietinement'];
    return;
  }
  if (hasVol) {
    c.abilities = ['vol'];
    return;
  }
  c.abilities = [];
}

for (const c of CREATURES) slimAbilities(c);

// ─── Recoller quotas après slim ─────────────────────────────────────────────
const N = CREATURES.length;
const TARGET = {
  vol: Math.round(N * 0.205),
  pietinement: Math.round(N * 0.1),
  poison: Math.round(N * 0.05),
  bouclier: Math.round(N * 0.05),
  entrave: Math.round(N * 0.05),
};

function channelForCost(cost) {
  const n = cost | 0;
  if (n <= 2) return 'canalisation-3-entrave';
  if (n <= 4) return 'canalisation-2-entrave';
  return 'canalisation-1-entrave';
}

function canTake(c) {
  return absOf(c).length === 0;
}

function hay(c) {
  return [c.name, c.origin, ...(c.natures || [])]
    .join(' ')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '');
}

function scorePoison(c) {
  const h = hay(c);
  let s = 0;
  for (const w of ['poison', 'venin', 'serpent', 'araign', 'arach', 'basilic', 'mycon', 'naga', 'hydre', 'medus', 'gorgon', 'wyrm', 'mantic', 'yuan', 'goule', 'zombie', 'mandragore', 'marilith', 'amphis', 'kappa', 'troglodyte']) {
    if (h.includes(w)) s += 5;
  }
  if (mustFly(c)) s -= 3;
  return s;
}
function scoreBouclier(c) {
  const h = hay(c);
  let s = 0;
  for (const w of ['paladin', 'pretre', 'moine', 'chevalier', 'exorciste', 'templier', 'golem', 'talos', 'licorne', 'dao', 'nisse', 'clerc']) {
    if (h.includes(w)) s += 6;
  }
  if (mustFly(c)) s -= 4; // vol déjà prioritaire
  if (/demon|diable|vampire|zombie|squelette|orc|assassin/.test(h)) s -= 10;
  if (c.capital === 'Citadelle') s += 3;
  return s;
}
function scoreEntrave(c) {
  const h = hay(c);
  let s = 0;
  for (const w of ['araign', 'medus', 'illith', 'kraken', 'grell', 'cube', 'banshee', 'sorcier', 'druide', 'vila', 'rusalka', 'yuki', 'liche', 'otyugh', 'augure', 'fantome']) {
    if (h.includes(w)) s += 5;
  }
  if (mustFly(c)) s -= 4;
  return s;
}
function scorePie(c) {
  const h = hay(c);
  let s = 0;
  for (const w of ['geant', 'troll', 'ogre', 'cyclope', 'behem', 'hydre', 'minotaure', 'treant', 'golem', 'dragon', 'wyrm', 'kraken', 'leviathan', 'sasquatch', 'yeti']) {
    if (h.includes(w)) s += 4;
  }
  if ((c.cost | 0) <= 2) s -= 8;
  if (mustFly(c) && (c.cost | 0) < 6) s -= 5;
  return s;
}

function topUp(predHave, target, assign, scoreFn) {
  let have = CREATURES.filter(predHave).length;
  if (have >= target) return;
  const cands = CREATURES
    .filter((c) => canTake(c))
    .map((c) => ({ c, score: scoreFn(c) }))
    .filter((x) => x.score >= 1)
    .sort((a, b) => {
      // équilibre faction
      return b.score - a.score || a.c.cost - b.c.cost || a.c.id - b.c.id;
    });
  // Round-robin léger par faction
  const byCap = {};
  for (const x of cands) (byCap[x.c.capital] = byCap[x.c.capital] || []).push(x);
  const caps = Object.keys(byCap).sort((a, b) => a.localeCompare(b, 'fr'));
  let i = 0;
  let guard = 0;
  while (have < target && guard++ < 500) {
    let placed = false;
    for (let k = 0; k < caps.length && have < target; k++) {
      const cap = caps[(i + k) % caps.length];
      const list = byCap[cap];
      if (!list || !list.length) continue;
      const { c } = list.shift();
      if (!canTake(c)) continue;
      assign(c);
      have += 1;
      placed = true;
      break;
    }
    i += 1;
    if (!placed) break;
  }
}

// Vol must-fly d'abord
for (const c of CREATURES) {
  if (mustFly(c) && !hasAb(c, 'vol')) {
    // Si a un spécial, on le retire pour laisser Vol (thématique > spécial)
    if (absOf(c).length && !hasAb(c, 'vol')) c.abilities = [];
    c.abilities = ['vol'];
  }
}
topUp(
  (c) => hasAb(c, 'vol'),
  TARGET.vol,
  (c) => {
    c.abilities = ['vol'];
  },
  (c) => (mustFly(c) ? -99 : scorePie(c) > 0 ? 0 : 2), // filler faible : préférer créatures « air » via scorePie bas → use soft
);

// Better vol filler score
function scoreVolFill(c) {
  if (mustFly(c) || !canTake(c)) return -99;
  const n = nameHay(c);
  let s = 0;
  for (const w of ['kenku', 'vampire', 'succube', 'sidhe', 'demon', 'diable', 'imp', 'mephit', 'corbeau', 'hibou', 'faucon']) {
    if (n.includes(w)) s += 4;
  }
  return s;
}
{
  let have = CREATURES.filter((c) => hasAb(c, 'vol')).length;
  if (have > TARGET.vol) {
    const extras = CREATURES.filter((c) => hasAb(c, 'vol') && !mustFly(c) && absOf(c).length === 1)
      .map((c) => ({ c, score: scoreVolFill(c) }))
      .sort((a, b) => a.score - b.score);
    let over = have - TARGET.vol;
    for (const { c } of extras) {
      if (over <= 0) break;
      c.abilities = [];
      over -= 1;
    }
  } else if (have < TARGET.vol) {
    topUp((c) => hasAb(c, 'vol'), TARGET.vol, (c) => { c.abilities = ['vol']; }, scoreVolFill);
  }
}

topUp((c) => hasAb(c, 'pietinement'), TARGET.pietinement, (c) => { c.abilities = ['pietinement']; }, scorePie);
topUp((c) => hasAb(c, 'poison'), TARGET.poison, (c) => { c.abilities = ['poison']; c.spell = 'Poison : empoisonne la cible touchée (1 dégât / début de tour).'; }, scorePoison);
topUp((c) => hasAb(c, 'bouclier-divin'), TARGET.bouclier, (c) => { c.abilities = ['bouclier-divin']; c.spell = 'Bouclier divin : ignore la première source de dégâts à l’invocation.'; }, scoreBouclier);
topUp(
  (c) => absOf(c).some((a) => /entrave/.test(a)),
  TARGET.entrave,
  (c) => {
    const id = channelForCost(c.cost);
    c.abilities = [id];
    const turns = id.includes('-3-') ? 3 : id.includes('-2-') ? 2 : 1;
    c.spell = `Canalisation ${turns} : Entrave — après ${turns} tour(s), entrave une créature adverse.`;
  },
  scoreEntrave,
);

// Ré-appliquer combos iconiques (écrase le slim single si besoin)
for (const c of CREATURES) {
  const cost = c.cost | 0;
  if (isDragon(c) && cost >= 6 && hasAb(c, 'vol')) {
    // Vol + piétinement si on peut « payer » le pietinement quota
    if (!hasAb(c, 'pietinement')) {
      // retire pietinement d'un non-dragon pour le donner au dragon
      const donor = CREATURES.find((x) => hasAb(x, 'pietinement') && !isDragon(x) && absOf(x).length === 1);
      if (donor) donor.abilities = [];
    }
    c.abilities = ['vol', 'pietinement'];
  }
  if (
    cost >= 7 &&
    hasAb(c, 'vol') &&
    nameHas(c, ['ange', 'phenix', 'phoenix', 'quetzalcoatl'])
  ) {
    const donor = CREATURES.find((x) => hasAb(x, 'bouclier-divin') && absOf(x).length === 1 && !nameHas(x, ['paladin', 'pretre', 'moine']));
    if (donor || hasAb(c, 'bouclier-divin')) {
      if (donor && !hasAb(c, 'bouclier-divin')) donor.abilities = [];
      c.abilities = ['vol', 'bouclier-divin'];
      c.spell = 'Bouclier divin : ignore la première source de dégâts à l’invocation.';
    }
  }
}

// ─── Stats C / 2C ± taxe ────────────────────────────────────────────────────
function powerTax(c) {
  let tax = 0;
  const role = roleOf(c);
  if (role === 'tank') tax += 2;
  if (role === 'ranged') tax += 2;
  if (hasAb(c, 'vol')) tax += 2;
  if (hasAb(c, 'pietinement')) tax += 2;
  if (hasAb(c, 'bouclier-divin')) tax += 2;
  if (hasAb(c, 'poison')) tax += 1;
  if (absOf(c).some((a) => a.startsWith('canalisation-'))) tax += 1;
  return tax;
}

function applyBaseStats(c) {
  const cost = Math.max(1, c.cost | 0);
  let atk = cost;
  let hp = 2 * cost;
  const tax = powerTax(c);
  const role = roleOf(c);
  let remove = tax >= 6 ? 2 : tax >= 4 ? 2 : tax >= 2 ? 1 : 0;

  for (let i = 0; i < remove; i++) {
    if (role === 'tank') {
      if (atk > 1) atk -= 1;
      else if (hp > atk) hp -= 1;
    } else if (role === 'ranged' || hasAb(c, 'vol')) {
      if (hp > Math.max(1, atk)) hp -= 1;
      else if (atk > 1) atk -= 1;
    } else if (i % 2 === 0 && atk > 1) atk -= 1;
    else if (hp > Math.max(1, atk)) hp -= 1;
  }

  if (tax === 0) {
    // Légère identité de base avant différenciation
    if (/geant|troll|ogre|golem|behem|treant/.test(nameHay(c))) hp += 1;
    else if (/assassin|lutin|diablotin|sprite|pixie/.test(nameHay(c))) atk += 1;
  }

  atk = Math.max(1, atk);
  hp = Math.max(atk, hp);
  c.attack = atk;
  c.health = hp;
}

for (const c of CREATURES) applyBaseStats(c);

// Piétinement : recoller ~10 % (après combos dragons)
topUp(
  (c) => hasAb(c, 'pietinement'),
  TARGET.pietinement,
  (c) => {
    c.abilities = ['pietinement'];
    c.spell = 'Piétinement : le surplus de dégâts atteint la tour.';
  },
  (c) => {
    const s = scorePie(c);
    if (s >= 1) return s;
    // filler : créatures cost ≥ 3 sans capa
    if (canTake(c) && (c.cost | 0) >= 3 && !mustFly(c)) return 1;
    return s;
  },
);
for (const c of CREATURES) applyBaseStats(c);

// ─── Unicité globale ────────────────────────────────────────────────────────
function signature(c) {
  const abs = [...absOf(c)].sort().join('+');
  return `${c.cost}|${c.attack}/${c.health}|${roleOf(c)}|${abs}`;
}

{
  const used = new Set();
  const ordered = CREATURES.slice().sort((a, b) => a.id - b.id);
  const offsets = [];
  for (let da = -2; da <= 2; da++) {
    for (let dh = -2; dh <= 4; dh++) {
      offsets.push([da, dh]);
    }
  }
  offsets.sort((a, b) => Math.abs(a[0]) + Math.abs(a[1]) - (Math.abs(b[0]) + Math.abs(b[1])));

  for (const c of ordered) {
    applyBaseStats(c);
    const cost = Math.max(1, c.cost | 0);
    const base = { atk: c.attack, hp: c.health };
    const role0 = roleOf(c);

    const candidates = [];
    candidates.push({ atk: base.atk, hp: base.hp, role: role0 });
    for (const [da, dh] of offsets) {
      const atk = Math.max(1, Math.min(cost + 2, base.atk + da));
      const hp = Math.max(atk, Math.min(2 * cost + 4, base.hp + dh));
      candidates.push({ atk, hp, role: role0 });
    }

    const altRoles = [];
    if (role0 !== 'tank' && role0 !== 'ranged') {
      const h = hay(c);
      if (/mage|sorcier|clerc|pretre|druide|runiste|alchim|witch|necroman|occult|enchante|barde/.test(h)) {
        altRoles.push('caster');
      }
      if (/assassin|voleur|rodeur|scout|felin|rapide|lutin|diablotin/.test(h)) {
        altRoles.push('fast');
      }
      // Différenciation douce pour les « normal » trop nombreux
      if (!altRoles.includes('fast') && c.id % 5 === 0) altRoles.push('fast');
      if (!altRoles.includes('caster') && c.id % 7 === 0) altRoles.push('caster');
    }
    for (const role of altRoles) {
      candidates.push({ atk: base.atk, hp: base.hp, role });
      for (const [da, dh] of offsets.slice(0, 16)) {
        const atk = Math.max(1, Math.min(cost + 2, base.atk + da));
        const hp = Math.max(atk, Math.min(2 * cost + 4, base.hp + dh));
        candidates.push({ atk, hp, role });
      }
    }

    let placed = false;
    for (const cand of candidates) {
      c.attack = cand.atk;
      c.health = Math.max(cand.atk, cand.hp);
      c.roles = role0 === 'tank' || role0 === 'ranged' ? [role0] : [cand.role];
      if (!used.has(signature(c))) {
        used.add(signature(c));
        placed = true;
        break;
      }
    }

    if (!placed) {
      const rolesTry =
        role0 === 'tank' || role0 === 'ranged'
          ? [role0]
          : [...new Set([role0, 'normal', 'caster', 'fast'])];
      outer: for (const role of rolesTry) {
        for (let atk = 1; atk <= cost + 2; atk++) {
          for (let hp = atk; hp <= 2 * cost + 5; hp++) {
            c.attack = atk;
            c.health = hp;
            c.roles = [role];
            if (!used.has(signature(c))) {
              used.add(signature(c));
              placed = true;
              break outer;
            }
          }
        }
      }
    }
    if (!placed) {
      used.add(signature(c));
      console.warn('UNIQUE FAIL', c.name, signature(c));
    }
  }
}

// Sync spell texts
for (const c of CREATURES) {
  const abs = absOf(c);
  if (abs.includes('poison')) c.spell = 'Poison : empoisonne la cible touchée (1 dégât / début de tour).';
  else if (abs.includes('bouclier-divin')) c.spell = 'Bouclier divin : ignore la première source de dégâts à l’invocation.';
  else if (abs.some((a) => a.startsWith('canalisation-'))) {
    const a = abs.find((x) => x.startsWith('canalisation-'));
    const turns = a.includes('-3-') ? 3 : a.includes('-2-') ? 2 : 1;
    c.spell = `Canalisation ${turns} : Entrave — après ${turns} tour(s), entrave une créature adverse.`;
  } else if (abs.includes('vol') && abs.includes('pietinement')) {
    c.spell = 'Vol + Piétinement : surplus de dégâts vers la tour.';
  } else if (abs.includes('vol')) c.spell = 'Vol : seules Vol ou Ranged peuvent l’attaquer.';
  else if (abs.includes('pietinement')) c.spell = 'Piétinement : le surplus de dégâts atteint la tour.';
  else c.spell = c.spell && !/Poison|Canalisation|Bouclier|Vol|Piétinement|Entrave/.test(c.spell) ? c.spell : '';
}

fs.writeFileSync(DATA, `${header}const CREATURES = ${JSON.stringify(CREATURES, null, 2)};\n`, 'utf8');

// Rapport
const bySig = {};
for (const c of CREATURES) {
  const s = signature(c);
  (bySig[s] = bySig[s] || []).push(c.name);
}
const dups = Object.entries(bySig).filter(([, v]) => v.length > 1);
const absHist = {};
const multi = [];
for (const c of CREATURES) {
  const n = absOf(c).length;
  absHist[n] = (absHist[n] || 0) + 1;
  if (n >= 2) multi.push(`${c.name} c${c.cost} [${c.abilities}]`);
}
function pct(_id, pred) {
  const n = CREATURES.filter(pred).length;
  return `${((100 * n) / N).toFixed(1)}% (${n}/${N})`;
}
console.log('duplicates left', dups.length);
if (dups.length) console.log(dups.slice(0, 3));
console.log('ability hist', absHist);
console.log('multi (iconic):', multi);
console.log({
  vol: pct('vol', (c) => hasAb(c, 'vol')),
  pietinement: pct('pie', (c) => hasAb(c, 'pietinement')),
  poison: pct('p', (c) => hasAb(c, 'poison')),
  bouclier: pct('b', (c) => hasAb(c, 'bouclier-divin')),
  entrave: pct('e', (c) => absOf(c).some((a) => /entrave/.test(a))),
  tank: pct('t', (c) => roleOf(c) === 'tank'),
  ranged: pct('r', (c) => roleOf(c) === 'ranged'),
});
let sumDa = 0;
let sumDh = 0;
for (const c of CREATURES) {
  sumDa += Math.abs(c.attack - c.cost);
  sumDh += Math.abs(c.health - 2 * c.cost);
}
console.log('avg |dev| C/2C', (sumDa / N).toFixed(2), (sumDh / N).toFixed(2));

// sanity samples
for (const n of ['Griffon', 'Paladin', 'Dragon vert', 'Ange', 'Pixie', 'Gobelin', 'Myconide']) {
  const c = CREATURES.find((x) => x.name === n);
  if (c) console.log(n, `c${c.cost}`, `${c.attack}/${c.health}`, `[${c.abilities}]`, c.roles);
}