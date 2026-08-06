/**
 * Passe complète capacités + stats.
 * - Capacités logiques (Griffon → Vol, etc.), max 2 abilities, quotas ~conservés
 * - Stats de base : ATQ = C, PV = 2×C
 * - Taxe selon puissance : −1/−2 ; sans capacité forte : 0 ou +1
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const DATA = path.join(ROOT, 'creatures-data.js');

const raw = fs.readFileSync(DATA, 'utf8');
const headerEnd = raw.indexOf('const CREATURES = ');
const header = raw.slice(0, headerEnd);
const CREATURES = new Function(`${raw.slice(headerEnd)};\nreturn CREATURES;`)();

const N = CREATURES.length;
const TARGET = {
  vol: Math.round(N * 0.205),
  pietinement: Math.round(N * 0.10),
  tank: Math.round(N * 0.246),
  ranged: Math.round(N * 0.229),
  poison: Math.round(N * 0.05),
  bouclier: Math.round(N * 0.05),
  entrave: Math.round(N * 0.05),
};

const SPECIAL_RE = /^(poison|bouclier-divin|canalisation-\d-entrave|entrave|invocation-entrave)$/;
const FILLER_RE = /^(vol|pietinement)$/;

function hay(c) {
  return [c.name, c.origin, ...(c.natures || [])]
    .join(' ')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '');
}

function nameHay(c) {
  return String(c.name || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '');
}

function nameTokens(c) {
  return nameHay(c).split(/[^a-z0-9]+/).filter(Boolean);
}

/** Correspondance sur le nom (mots entiers) — évite ange⊂changeling, roc⊂croque… */
function nameHas(c, keys) {
  const tokens = nameTokens(c);
  const full = nameHay(c);
  return keys.some((k) => {
    const kk = k.normalize('NFD').replace(/\p{M}/gu, '');
    if (kk.includes(' ')) return full === kk || full.includes(kk);
    return tokens.includes(kk);
  });
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
function setRole(c, role) {
  c.roles = [role];
}
function addAb(c, id) {
  const a = absOf(c);
  if (!a.includes(id)) a.push(id);
}
function remAb(c, id) {
  c.abilities = absOf(c).filter((x) => x !== id);
}
function remFiller(c) {
  c.abilities = absOf(c).filter((x) => !FILLER_RE.test(x));
}
function specialsOf(c) {
  return absOf(c).filter((x) => SPECIAL_RE.test(x));
}
function channelForCost(cost) {
  const n = cost | 0;
  if (n <= 2) return 'canalisation-3-entrave';
  if (n <= 4) return 'canalisation-2-entrave';
  return 'canalisation-1-entrave';
}

/** Noms qui DOIVENT voler. */
function mustFly(c) {
  return nameHas(c, [
    'griffon', 'pegase', 'hippogriffe', 'alerion', 'dragon', 'wyvern', 'wyverne', 'vouivre',
    'phenix', 'phoenix', 'harpie', 'aarakocra', 'quetzalcoatl', 'manticore', 'gargouille',
    'ange', 'valkyrie', 'peryton', 'tengu', 'furie', 'erinye', 'banshee', 'fantome',
    'spectre', 'djinn', 'strige', 'valravn', 'nephilim', 'mothman', 'flumph', 'sprite',
    'pixie', 'fee', 'roc', 'drake', 'chimere', 'vrock', 'vampire', 'succube', 'incube',
    'diablotin', 'imp', 'nosferatu', 'peri',
  ]) || nameTokens(c).some((t) => t.startsWith('dragon')) || nameHay(c).includes('fee-dragon');
}

/** Créatures clairement terrestres — pas de Vol. */
function mustGround(c) {
  if (mustFly(c)) return false;
  return nameHas(c, [
    'treant', 'golem', 'nain', 'orc', 'ogre', 'troll', 'geant', 'cyclope', 'minotaure',
    'chevalier', 'paladin', 'moine', 'pretre', 'clerc', 'exorciste', 'barbare', 'gnoll',
    'kobold', 'gobelin', 'hobgobelin', 'halfling', 'zombie', 'squelette', 'momie', 'goule',
    'myconide', 'troglodyte', 'xorn', 'centaure', 'warg', 'modron', 'talos', 'naga',
    'elfe', 'demie-elfe', 'demi-elfe', 'nain',
  ]) || nameTokens(c).some((t) => t.startsWith('golem') || t === 'treant' || t.startsWith('ours'));
}

/** Gros / piétinement thématique. */
function scorePietinement(c) {
  const h = hay(c);
  let s = 0;
  const good = [
    'geant', 'troll', 'ogre', 'cyclope', 'behemoth', 'hydre', 'minotaure',
    'treant', 'elephant', 'mammouth', 'golem', 'dragon', 'drake', 'wyrm', 'typhon',
    'jormung', 'leviathan', 'kraken', 'sasquatch', 'yeti', 'fenrir', 'talos', 'behem',
    'rakshasa', 'umber', 'otyugh', 'gorgone', 'chimere', 'manticore',
  ];
  for (const w of good) if (h.includes(w)) s += 4;
  if ((c.cost | 0) >= 5) s += 2;
  if ((c.cost | 0) <= 2) s -= 5;
  if (mustFly(c) && (c.cost | 0) < 5) s -= 3;
  if (nameHas(c, ['pixie', 'sprite', 'fee', 'flumph', 'kobold', 'lutin', 'tomte', 'nisse'])) s -= 10;
  return s;
}

function scoreVolFill(c) {
  const n = nameHay(c);
  let s = 0;
  const soft = [
    'kenku', 'corbeau', 'hibou', 'faucon', 'aigle', 'chouette', 'oiseau',
    'sidhe', 'peri', 'elementaire', 'air', 'nuage', 'ailes', 'wing',
    'marilith', 'balor', 'pit fiend', 'demon', 'archidem', 'archidiable',
    'mephite', 'mephit', 'imp', 'homunculus', 'homoncule', 'cherub', 'seraph',
    'couatl', 'pseudodragon', 'faerie', 'fairy', 'will-o', 'feu follet',
    'poltergeist', 'wraith', 'ombre vol', 'bat', 'chauve',
  ];
  for (const w of soft) if (n.includes(w)) s += 4;
  // natures / origine céleste
  const h = hay(c);
  if (/\bceleste\b|\bair\b| ethere /.test(` ${h} `)) s += 2;
  if (mustGround(c)) return -99;
  if (mustFly(c)) return -99;
  return s;
}

function scoreTank(c) {
  const h = hay(c);
  let s = 0;
  const good = [
    'golem', 'treant', 'paladin', 'chevalier', 'geant', 'troll', 'ogre', 'cyclope',
    'behem', 'hydre', 'minotaure', 'tank', 'bouclier', 'fort', 'armure', 'gargouille',
    'talos', 'xorn', 'ours', 'rhino', 'tortue', 'nain', 'forgeron',
  ];
  for (const w of good) if (h.includes(w)) s += 4;
  if (mustFly(c) && (c.cost | 0) < 6) s -= 3;
  if (/pixie|sprite|fee|flumph|lutin|kobold|diablotin/.test(h)) s -= 8;
  if ((c.cost | 0) >= 4) s += 1;
  return s;
}

function scoreRanged(c) {
  const h = hay(c);
  let s = 0;
  const good = [
    'archer', 'arbalet', 'mage', 'sorcier', 'witch', 'necroman', 'runiste', 'alchimiste',
    'pretre', 'clerc', 'oracle', 'augure', 'rodeur', 'ranger', 'chasseur', 'sagit', 'elfe',
    'gun', 'fusil', 'lancer', 'foudre', 'laser', 'oeil', 'illith', 'tyranno', 'medus', 'gorgon', 'basilic',
  ];
  for (const w of good) if (h.includes(w)) s += 4;
  // Dague / corps à corps : jamais Ranged
  if (/voleur|assassin|bandit|couteau|dague/.test(h)) s -= 20;
  if ((c.roles || [])[0] === 'caster') s += 2;
  if (mustFly(c)) s += 1; // archers volants ok
  if (/golem|treant|ogre|troll|geant|behem/.test(h)) s -= 5;
  return s;
}

function scorePoison(c) {
  const h = hay(c);
  let s = 0;
  const good = [
    'poison', 'venin', 'serpent', 'vipere', 'araign', 'arach', 'basilic', 'scorpion', 'mycon',
    'amphib', 'nidhogg', 'barghest', 'kappa', 'medus', 'gorgon', 'hydre', 'naga', 'wyrm',
    'mantic', 'yuan', 'peluda', 'melusine', 'marilith', 'amphis', 'slaad', 'grell', 'troglodyte',
    'mandragore', 'sidhe', 'goule', 'zombie', 'squelette', 'drake',
  ];
  for (const w of good) if (h.includes(w)) s += 5;
  if (/ange|paladin|pegase|pretre|moine/.test(h)) s -= 10;
  return s;
}

function scoreEntrave(c) {
  const h = hay(c);
  let s = 0;
  const good = [
    'toile', 'araign', 'arach', 'medus', 'illith', 'kraken', 'scylla', 'catoble', 'otyugh',
    'grell', 'cube', 'fantome', 'banshee', 'liche', 'sorcier', 'mage', 'druide', 'vila',
    'rusalka', 'yuki', 'tyranno', 'shoggoth', 'cambion', 'rakshasa', 'momie', 'augure',
  ];
  for (const w of good) if (h.includes(w)) s += 5;
  if (/licorne|paladin|ange|pegase|griffon/.test(h)) s -= 10;
  if (roleOf(c) === 'caster') s += 2;
  return s;
}

function scoreBouclier(c) {
  const h = hay(c);
  let s = 0;
  const good = [
    'paladin', 'pretre', 'moine', 'ange', 'chevalier', 'exorciste', 'valkyr', 'pegase',
    'griffon', 'licorne', 'golem', 'talos', 'gargouille', 'alerion', 'hippogriffe',
    'phenix', 'phoenix', 'quetzal', 'nisse', 'tomte', 'dao', 'peri', 'péri',
  ];
  for (const w of good) if (h.includes(w)) s += 6;
  const bad = [
    'demon', 'diable', 'succube', 'vampire', 'zombie', 'squelette', 'liche', 'goule',
    'assassin', 'orc', 'mothman', 'jabber', 'ogre', 'spectre',
  ];
  for (const w of bad) if (h.includes(w)) s -= 12;
  if (c.capital === 'Citadelle') s += 3;
  if (c.capital === 'Abîme' || c.capital === 'Nécropole' || c.capital === 'Pandémonium') s -= 3;
  return s;
}

function trimAbilities(c) {
  // Max 2 abilities ; priorité : must-fly vol > spécial > pietinement > vol filler
  let abs = absOf(c).slice();
  const special = abs.filter((a) => SPECIAL_RE.test(a));
  const hasVol = abs.includes('vol');
  const hasPie = abs.includes('pietinement');
  const out = [];
  if (mustFly(c) || hasVol) out.push('vol');
  if (special[0]) out.push(special[0]);
  if (out.length < 2 && hasPie) out.push('pietinement');
  if (out.length < 2 && hasVol && !out.includes('vol')) out.push('vol');
  // Si mustFly + special + pietinement → drop pietinement
  c.abilities = [...new Set(out)].slice(0, 2);
}

function pickBalanced(scoreFn, count, minScore, excludeIds) {
  const used = new Set(excludeIds || []);
  const picked = [];
  const bucket = { low: 0, mid: 0, high: 0 };
  const costBucket = (cost) => ((cost | 0) <= 2 ? 'low' : (cost | 0) <= 4 ? 'mid' : 'high');
  let thr = minScore;
  let guard = 0;
  while (picked.length < count && guard++ < 1000) {
    const capCount = {};
    for (const p of picked) capCount[p.c.capital] = (capCount[p.c.capital] || 0) + 1;
    const cands = CREATURES
      .filter((c) => !used.has(c.id) && scoreFn(c) >= thr)
      .map((c) => ({ c, score: scoreFn(c) }))
      .sort((a, b) => {
        const ca = capCount[a.c.capital] || 0;
        const cb = capCount[b.c.capital] || 0;
        if (ca !== cb) return ca - cb;
        const ba = bucket[costBucket(a.c.cost)];
        const bb = bucket[costBucket(b.c.cost)];
        if (ba !== bb) return ba - bb;
        return b.score - a.score || a.c.cost - b.c.cost || a.c.id - b.c.id;
      });
    if (!cands.length) {
      thr -= 1;
      if (thr < Math.max(0, minScore - 5)) break;
      continue;
    }
    const best = cands[0];
    used.add(best.c.id);
    bucket[costBucket(best.c.cost)] += 1;
    picked.push(best);
  }
  return picked;
}

// ─── PHASE 1 : nettoyer fillers, forcer Vol logique ─────────────────────────
for (const c of CREATURES) {
  remFiller(c);
  // Normaliser canalisation selon coût si entrave présente
  const specs = specialsOf(c);
  const ent = specs.find((a) => /entrave/.test(a));
  if (ent) {
    remAb(c, ent);
    addAb(c, channelForCost(c.cost));
  }
}

for (const c of CREATURES) {
  if (mustFly(c)) addAb(c, 'vol');
  if (mustGround(c)) remAb(c, 'vol');
}

// Remplir Vol jusqu'à la cible (uniquement candidats clairement ailés)
{
  let have = CREATURES.filter((c) => hasAb(c, 'vol')).length;
  if (have < TARGET.vol) {
    const capCount = {};
    const cands = CREATURES
      .filter((c) => !hasAb(c, 'vol') && !mustGround(c) && !mustFly(c))
      .map((c) => ({ c, score: scoreVolFill(c) }))
      .filter((x) => x.score >= 2)
      .sort((a, b) => b.score - a.score || a.c.cost - b.c.cost || a.c.id - b.c.id);
    for (const { c } of cands) {
      if (have >= TARGET.vol) break;
      const n = capCount[c.capital] || 0;
      if (n >= 3) continue; // pas trop par faction en filler
      addAb(c, 'vol');
      capCount[c.capital] = n + 1;
      have += 1;
    }
  } else if (have > TARGET.vol) {
    // Retirer le Vol filler (hors mustFly)
    const extras = CREATURES
      .filter((c) => hasAb(c, 'vol') && !mustFly(c))
      .map((c) => ({ c, score: scoreVolFill(c) }))
      .sort((a, b) => a.score - b.score);
    let over = have - TARGET.vol;
    for (const { c } of extras) {
      if (over <= 0) break;
      remAb(c, 'vol');
      over -= 1;
    }
  }
}

// ─── PHASE 2 : Piétinement ──────────────────────────────────────────────────
for (const c of CREATURES) remAb(c, 'pietinement');
{
  const picks = pickBalanced(
    (c) => {
      // éviter de dépasser 2 abs : si déjà 2 specials+vol, score bas
      const n = absOf(c).length;
      let s = scorePietinement(c);
      if (n >= 2) s -= 20;
      if (n === 1 && hasAb(c, 'vol') && (c.cost | 0) < 5) s -= 4;
      return s;
    },
    TARGET.pietinement,
    2,
    [],
  );
  for (const { c } of picks) addAb(c, 'pietinement');
}

// ─── PHASE 3 : redistribuer spéciaux ~5 % (thématique) ───────────────────────
for (const c of CREATURES) {
  c.abilities = absOf(c).filter((a) => !SPECIAL_RE.test(a));
}

function roomForSpecial(c) {
  return absOf(c).length < 2;
}

{
  const poisonPicks = pickBalanced(
    (c) => (roomForSpecial(c) ? scorePoison(c) : -99),
    TARGET.poison,
    4,
    [],
  );
  for (const { c } of poisonPicks) {
    addAb(c, 'poison');
    c.spell = 'Poison : empoisonne la cible touchée (1 dégât / début de tour).';
  }

  const taken = new Set(poisonPicks.map((p) => p.c.id));
  const entravePicks = pickBalanced(
    (c) => (roomForSpecial(c) && !taken.has(c.id) ? scoreEntrave(c) : -99),
    TARGET.entrave,
    4,
    [...taken],
  );
  for (const { c } of entravePicks) {
    const id = channelForCost(c.cost);
    addAb(c, id);
    const turns = id.includes('-3-') ? 3 : id.includes('-2-') ? 2 : 1;
    c.spell = `Canalisation ${turns} : Entrave — après ${turns} tour(s), entrave une créature adverse.`;
    taken.add(c.id);
  }

  const bouclierPicks = pickBalanced(
    (c) => (roomForSpecial(c) && !taken.has(c.id) ? scoreBouclier(c) : -99),
    TARGET.bouclier,
    5,
    [...taken],
  );
  for (const { c } of bouclierPicks) {
    addAb(c, 'bouclier-divin');
    c.spell = 'Bouclier divin : ignore la première source de dégâts à l’invocation.';
  }
}

/** Échange une capacité depuis le porteur le moins thématique vers un archétype prioritaire. */
function ensureAbility(nameKeys, abilityId, scoreFn, spellText) {
  for (const c of CREATURES) {
    if (!nameHas(c, nameKeys)) continue;
    if (hasAb(c, abilityId)) continue;
    if (!roomForSpecial(c) && absOf(c).length >= 2) continue;
    // Si déjà 1 filler, on peut encore ajouter un spécial
    const holders = CREATURES.filter((x) => hasAb(x, abilityId));
    if (holders.length < (abilityId.startsWith('canalisation') ? TARGET.entrave : TARGET[abilityId === 'bouclier-divin' ? 'bouclier' : 'poison'])) {
      addAb(c, abilityId);
      if (spellText) c.spell = spellText;
      continue;
    }
    const victim = holders
      .map((x) => ({ c: x, score: scoreFn(x) }))
      .sort((a, b) => a.score - b.score || b.c.id - a.c.id)[0];
    if (!victim || scoreFn(c) < victim.score) continue;
    remAb(victim.c, abilityId);
    addAb(c, abilityId);
    if (spellText) c.spell = spellText;
  }
}

ensureAbility(
  ['paladin', 'pretre', 'moine', 'ange', 'templier', 'exorciste'],
  'bouclier-divin',
  scoreBouclier,
  'Bouclier divin : ignore la première source de dégâts à l’invocation.',
);
ensureAbility(
  ['myconide', 'basilic', 'amphisbene', 'arachne', 'araignee', 'naga', 'hydre', 'meduse', 'gorgone'],
  'poison',
  scorePoison,
  'Poison : empoisonne la cible touchée (1 dégât / début de tour).',
);

// Recoller les quotas spéciaux si ensure a fait baisser le compte
function topUp(abilityId, target, scoreFn, spellText) {
  let have = CREATURES.filter((c) => hasAb(c, abilityId)).length;
  if (have >= target) return;
  const picks = pickBalanced(
    (c) => (roomForSpecial(c) && !hasAb(c, abilityId) ? scoreFn(c) : -99),
    target - have,
    2,
    CREATURES.filter((c) => hasAb(c, abilityId)).map((c) => c.id),
  );
  for (const { c } of picks) {
    addAb(c, abilityId);
    if (spellText) c.spell = spellText;
  }
}
topUp('poison', TARGET.poison, scorePoison, 'Poison : empoisonne la cible touchée (1 dégât / début de tour).');
topUp('bouclier-divin', TARGET.bouclier, scoreBouclier, 'Bouclier divin : ignore la première source de dégâts à l’invocation.');

// Trim final max 2
for (const c of CREATURES) trimAbilities(c);

// Top-up poison après trim (au cas où un trim a fait baisser)
{
  let have = CREATURES.filter((c) => hasAb(c, 'poison')).length;
  while (have < TARGET.poison) {
    const c = CREATURES
      .filter((x) => !hasAb(x, 'poison') && absOf(x).length < 2 && !specialsOf(x).length)
      .map((x) => ({ c: x, score: scorePoison(x) }))
      .sort((a, b) => b.score - a.score)[0];
    if (!c || c.score < 0) break;
    addAb(c.c, 'poison');
    c.c.spell = 'Poison : empoisonne la cible touchée (1 dégât / début de tour).';
    have += 1;
  }
}

// ─── PHASE 4 : rôles tank / ranged (quotas + logique) ────────────────────────
for (const c of CREATURES) {
  const r = roleOf(c);
  if (r === 'tank' || r === 'ranged') setRole(c, 'normal'); // on reconstruit
  // garder caster/fast si déjà là et pas tank/ranged — reset non-tank/ranged to sensible default
}
// Re-assign from scratch for tank/ranged only; others: prefer caster if spellcaster name else normal
for (const c of CREATURES) {
  const h = hay(c);
  if (/mage|sorcier|necroman|druide|clerc|pretre|runiste|alchimiste|illith|occult|witch|enchante/.test(h)) {
    setRole(c, 'caster');
  } else if (/rapide|assassin|voleur|scout|fél|felin/.test(h)) {
    setRole(c, 'fast');
  } else if (/rodeur|ranger|chasseur/.test(h)) {
    setRole(c, 'normal'); // sera promu ranged ensuite
  } else {
    setRole(c, 'normal');
  }
}

{
  const tankPicks = pickBalanced((c) => scoreTank(c), TARGET.tank, 2, []);
  for (const { c } of tankPicks) setRole(c, 'tank');
  const tankIds = new Set(tankPicks.map((p) => p.c.id));
  const rangedPicks = pickBalanced(
    (c) => (tankIds.has(c.id) ? -99 : scoreRanged(c)),
    TARGET.ranged,
    2,
    [...tankIds],
  );
  for (const { c } of rangedPicks) setRole(c, 'ranged');
}

// Petits volants : éviter tank
for (const c of CREATURES) {
  if (mustFly(c) && roleOf(c) === 'tank' && (c.cost | 0) <= 3) {
    setRole(c, scoreRanged(c) >= 2 ? 'ranged' : 'normal');
  }
  if (/aarakocra|pixie|sprite|flumph|^fee$/.test(nameHay(c)) && roleOf(c) === 'tank') {
    setRole(c, 'ranged');
  }
  // Montures / bêtes ailées : plutôt normal que ranged artificiel
  if (nameHas(c, ['griffon', 'hippogriffe', 'pegase', 'alerion', 'roc']) && roleOf(c) === 'ranged') {
    setRole(c, 'normal');
  }
}

// Recoller ranged si sous quota
{
  let have = CREATURES.filter((c) => roleOf(c) === 'ranged').length;
  if (have < TARGET.ranged) {
    const picks = pickBalanced(
      (c) => {
        if (roleOf(c) === 'tank' || roleOf(c) === 'ranged') return -99;
        if (nameHas(c, ['griffon', 'hippogriffe', 'pegase', 'alerion', 'roc'])) return -99;
        return scoreRanged(c);
      },
      TARGET.ranged - have,
      1,
      CREATURES.filter((c) => roleOf(c) === 'ranged' || roleOf(c) === 'tank').map((c) => c.id),
    );
    for (const { c } of picks) setRole(c, 'ranged');
  }
}
// Remontures : jamais ranged
for (const c of CREATURES) {
  if (nameHas(c, ['griffon', 'hippogriffe', 'pegase', 'alerion', 'roc']) && roleOf(c) === 'ranged') {
    setRole(c, 'normal');
  }
}
// Dague / mêlée : jamais ranged — Rôdeur : toujours ranged
for (const c of CREATURES) {
  if (c.name === 'Voleur' || c.name === 'Assassin') {
    if (roleOf(c) === 'ranged') setRole(c, 'fast');
  }
  if (c.name === 'Rôdeur') setRole(c, 'ranged');
}
// Combos iconiques Vol+Piétinement / Vol+Bouclier : pas de rôle Ranged (stats normales)
for (const c of CREATURES) {
  if (!hasAb(c, 'vol')) continue;
  if (!(hasAb(c, 'pietinement') || hasAb(c, 'bouclier-divin'))) continue;
  if (roleOf(c) === 'ranged') setRole(c, 'normal');
}

// ─── PHASE 5 : stats C / 2C ± puissance ──────────────────────────────────────
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

function flavorBonus(c) {
  const h = hay(c);
  // +1 possible si taxe 0
  if (/geant|troll|ogre|golem|behem|treant|dragon|hydre/.test(h)) return { atk: 0, hp: 1 };
  if (/assassin|diablotin|lutin|sprite|pixie|fee/.test(h)) return { atk: 1, hp: 0 };
  return { atk: 0, hp: 0 };
}

function applyStats(c) {
  // Vol + Ranged = corps 1/1 (combo trop fort sinon)
  if (hasAb(c, 'vol') && roleOf(c) === 'ranged') {
    c.attack = 1;
    c.health = 1;
    return;
  }

  const cost = Math.max(1, c.cost | 0);
  const abs = absOf(c);
  const role = roleOf(c);
  const medium =
    hasAb(c, 'vol') ||
    hasAb(c, 'pietinement') ||
    hasAb(c, 'bouclier-divin') ||
    role === 'ranged' ||
    role === 'tank';
  const weak =
    !medium &&
    (hasAb(c, 'poison') ||
      abs.some((a) => a === 'entrave' || a.startsWith('canalisation-') || a.startsWith('invocation-')));

  // Coût 1 — plafonds stricts : 1/3 · 1/2 · 1/1
  if (cost === 1) {
    c.attack = 1;
    c.health = medium ? 1 : weak ? 2 : 3;
    return;
  }

  // Coût 2+ — Σ ≤ 2C+2 (max 1/(2C+1)) ; faible −1 ; moyenne −2
  {
    const maxSumBase = 2 * cost + 2;
    const maxHpBase = 2 * cost + 1;
    const maxSum = medium ? maxSumBase - 2 : weak ? maxSumBase - 1 : maxSumBase;
    const maxHp = medium ? maxHpBase - 2 : weak ? maxHpBase - 1 : maxHpBase;
    const maxAtk = medium || weak ? cost : cost + 1;

    let atk = Math.min(cost, maxAtk); // base C
    let hp = Math.min(2 * cost, maxHp); // base 2C
    // Si C/2C dépasse le budget (ex. C3 = 9 > 8), compresser
    while (atk + hp > maxSum) {
      if (hp > Math.max(atk, 1)) hp -= 1;
      else if (atk > 1) atk -= 1;
      else break;
    }
    // Taxe légère already in maxSum for medium/weak; ensure floors
    atk = Math.max(1, Math.min(atk, maxAtk));
    hp = Math.max(1, Math.min(hp, maxHp));
    while (atk + hp > maxSum) {
      if (hp > atk && hp > 1) hp -= 1;
      else if (atk > 1) atk -= 1;
      else break;
    }
    c.attack = atk;
    c.health = hp;
    return;
  }
}

for (const c of CREATURES) applyStats(c);

// Spell text sync for vol / pietinement only cards
for (const c of CREATURES) {
  if (hasAb(c, 'vol') && roleOf(c) === 'ranged') {
    c.spell =
      'Vol + Ranged : corps 1/1 — ignore les Tanks, cible les Vol, pas de riposte ; seules Vol/Ranged peuvent l’attaquer.';
    continue;
  }
  if (specialsOf(c).length) continue;
  if (hasAb(c, 'vol') && hasAb(c, 'pietinement')) {
    c.spell = 'Vol + Piétinement : surplus de dégâts vers la tour.';
  } else if (hasAb(c, 'vol')) {
    c.spell = 'Vol : seules Vol ou Ranged peuvent l’attaquer.';
  } else if (hasAb(c, 'pietinement')) {
    c.spell = 'Piétinement : le surplus de dégâts atteint la tour.';
  } else if (!c.spell || /Poison|Canalisation|Bouclier|Vol|Piétinement|Entrave/.test(c.spell)) {
    c.spell = '';
  }
}

fs.writeFileSync(DATA, `${header}const CREATURES = ${JSON.stringify(CREATURES, null, 2)};\n`, 'utf8');

// ─── Rapport ────────────────────────────────────────────────────────────────
function countAb(id) {
  return CREATURES.filter((c) => hasAb(c, id) || (id === 'tank' && roleOf(c) === 'tank') || (id === 'ranged' && roleOf(c) === 'ranged')).length;
}
function pct(n) {
  return `${((100 * n) / N).toFixed(1)}% (${n}/${N})`;
}

const mustFlyMissing = CREATURES.filter((c) => mustFly(c) && !hasAb(c, 'vol')).map((c) => c.name);
const groundFlying = CREATURES.filter((c) => mustGround(c) && hasAb(c, 'vol')).map((c) => c.name);
const overAbs = CREATURES.filter((c) => absOf(c).length > 2).map((c) => `${c.name}:${c.abilities}`);

let sumDa = 0;
let sumDh = 0;
const sample = [];
for (const c of CREATURES) {
  const eA = c.cost;
  const eH = 2 * c.cost;
  sumDa += Math.abs(c.attack - eA);
  sumDh += Math.abs(c.health - eH);
  if (mustFly(c) || hasAb(c, 'poison') || roleOf(c) === 'tank') {
    if (sample.length < 25) {
      sample.push(`${c.name} c${c.cost} ${c.attack}/${c.health} (base ${eA}/${eH}) tax=${powerTax(c)} [${c.abilities}] ${roleOf(c)}`);
    }
  }
}

console.log('=== COUVERTURE ===');
console.log({
  vol: pct(countAb('vol')),
  pietinement: pct(countAb('pietinement')),
  tank: pct(CREATURES.filter((c) => roleOf(c) === 'tank').length),
  ranged: pct(CREATURES.filter((c) => roleOf(c) === 'ranged').length),
  poison: pct(countAb('poison')),
  bouclier: pct(countAb('bouclier-divin')),
  entrave: pct(CREATURES.filter((c) => absOf(c).some((a) => /entrave/.test(a))).length),
});
console.log('mustFly missing vol', mustFlyMissing);
console.log('mustGround with vol', groundFlying);
console.log('>2 abilities', overAbs);
console.log('avg |dev| from C/2C — atk', (sumDa / N).toFixed(2), 'hp', (sumDh / N).toFixed(2));
console.log('samples:\n' + sample.join('\n'));

const histAbs = {};
for (const c of CREATURES) {
  const n = absOf(c).length;
  histAbs[n] = (histAbs[n] || 0) + 1;
}
console.log('ability count hist', histAbs);
