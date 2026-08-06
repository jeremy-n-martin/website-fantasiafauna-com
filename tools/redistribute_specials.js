/* Redistribue poison / entrave (canalisation par coût) / bouclier-divin à ~5 %.
 * Homogène par faction & coût, 1 capacité « spéciale » max, thème logique.
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const DATA = path.join(ROOT, 'creatures-data.js');

const raw = fs.readFileSync(DATA, 'utf8');
const headerEnd = raw.indexOf('const CREATURES = ');
const header = raw.slice(0, headerEnd);
const CREATURES = new Function(`${raw.slice(headerEnd)};\nreturn CREATURES;`)();

const TARGET = Math.round(CREATURES.length * 0.05); // ~17
const SPECIAL_RE = /^(poison|entrave|bouclier-divin|canalisation-\d-entrave|invocation-entrave)$/;

function channelForCost(cost) {
  const c = cost | 0;
  if (c <= 2) return 'canalisation-3-entrave';
  if (c <= 4) return 'canalisation-2-entrave';
  return 'canalisation-1-entrave';
}

function costBucket(cost) {
  const n = cost | 0;
  if (n <= 2) return 'low';
  if (n <= 4) return 'mid';
  return 'high';
}

for (const c of CREATURES) {
  if (!Array.isArray(c.abilities)) c.abilities = [];
  c.abilities = c.abilities.filter((a) => !SPECIAL_RE.test(a));
}

function hay(c) {
  return [c.name, c.origin, ...(c.natures || []), c.spell || '', c.quote || '']
    .join(' ')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '');
}

function scorePoison(c) {
  const h = hay(c);
  let s = 0;
  const good = [
    'poison', 'venin', 'serpent', 'vipere', 'araign', 'arach', 'basilic', 'scorpion', 'mycon',
    'amphib', 'nidhogg', 'barghest', 'kappa', 'umbre', 'medus', 'gorgon', 'hydre',
    'naga', 'crapaud', 'grenouille', 'toxic', 'champignon', 'slime', 'limace',
    'wyrm', 'aspic', 'cobr', 'mantic', 'chimere', 'lamia', 'strige',
    'diablotin', 'squelette', 'goule', 'zombie', 'liche', 'mandragore',
    'sidhe', 'occult', 'fung', 'spore', 'grell', 'slaad', 'otyugh', 'troglodyte',
    'jabber', 'wyvern', 'drake', 'fenrir', 'tatzel', 'yuan', 'peluda', 'melusine',
    'marilith', 'basilic', 'amphis', 'lamassu',
  ];
  for (const w of good) if (h.includes(w)) s += 5;
  const bad = ['aarakocra', 'pegase', 'ange', 'paladin', 'pretre', 'moine', 'chevalier'];
  for (const w of bad) if (h.includes(w)) s -= 10;
  const caps = {
    Sylve: 2, Bosquet: 2, Abîme: 3, Terrier: 2, Nécropole: 2, Tertre: 2,
    Pandémonium: 2, Cénote: 1, Bastion: 1, Empyrée: 0, Citadelle: -2, Hameau: 0,
    Forteresse: 0, Manufacture: 1,
  };
  s += caps[c.capital] || 0;
  if ((c.roles || []).includes('tank')) s -= 1;
  return s;
}

function scoreEntrave(c) {
  const h = hay(c);
  let s = 0;
  const good = [
    'toile', 'filet', 'lien', 'entrave', 'glace', 'gel', 'araign', 'arach', 'medus',
    'illith', 'kraken', 'scylla', 'tentacul', 'catoble', 'otyugh', 'augure', 'vila',
    'runiste', 'sorcier', 'mage', 'occult', 'liche', 'sirene',
    'fantome', 'banshee', 'spectre', 'golem', 'xorn', 'mimique', 'tyranno',
    'guete', 'chaine', 'prison', 'cage', 'piege', 'liane', 'ronce', 'treant',
    'druide', 'dryade', 'nymphe', 'cube', 'grell', 'shoggoth', 'djinn',
    'alchimiste', 'necroman', 'ankou', 'varcolac', 'polter', 'momie', 'yuki',
    'rusalka', 'cambion', 'baba', 'rakshasa', 'clerc',
  ];
  for (const w of good) if (h.includes(w)) s += 5;
  const bad = ['licorne', 'paladin', 'ange', 'pegase', 'griffon', 'chevalier', 'orc', 'warg'];
  for (const w of bad) if (h.includes(w)) s -= 10;
  const caps = {
    Empyrée: 2, Abîme: 3, Cénote: 2, Sylve: 1, Bosquet: 2, Forteresse: 2,
    Manufacture: 2, Nécropole: 2, Tertre: 1, Terrier: 1, Bastion: 0, Citadelle: 0,
    Hameau: 1, Pandémonium: 1,
  };
  s += caps[c.capital] || 0;
  if ((c.roles || []).includes('caster')) s += 3;
  if ((c.roles || []).includes('ranged')) s += 1;
  if ((c.roles || []).includes('tank')) s -= 1;
  return s;
}

function scoreBouclier(c) {
  const h = hay(c);
  let s = 0;
  const good = [
    'paladin', 'pretre', 'moine', 'ange', 'chevalier', 'exorciste', 'valkyr', 'pegase',
    'griffon', 'seraph', 'sacre', 'divin', 'lumiere', 'beni', 'gardien', 'protect',
    'templier', 'clerc', 'oracle', 'phoenix', 'phenix', 'licorne', 'golem', 'talos',
    'gargouille', 'hippogriffe', 'alerion', 'alérion', 'tomte', 'nisse',
    'dao', 'quetzal', 'phoenix',
  ];
  for (const w of good) if (h.includes(w)) s += 6;
  const bad = [
    'demon', 'diable', 'succube', 'incube', 'vampire', 'zombie', 'squelette', 'liche',
    'goule', 'assassin', 'orc', 'gnoll', 'warg', 'barbare', 'chupacabra', 'harpie',
    'yokai', 'drake', 'behemoth', 'béhémoth', 'minotaure', 'mothman', 'spectre',
    'jabber', 'ogre', 'nain', 'lezard', 'lézard', 'homme-lezard', 'cambion',
    'marilith', 'troglodyte', 'zombie', 'mycon',
  ];
  for (const w of bad) if (h.includes(w)) s -= 12;
  const caps = {
    Citadelle: 4, Empyrée: 2, Forteresse: 1, Manufacture: 2, Hameau: 1, Sylve: 1,
    Bastion: -1, Abîme: -4, Nécropole: -4, Pandémonium: -4, Terrier: 0, Cénote: 0,
    Bosquet: 0, Tertre: -1,
  };
  s += caps[c.capital] || 0;
  if ((c.roles || []).includes('tank')) s += 2;
  return s;
}

function canTakeSpecial(c) {
  const abs = c.abilities || [];
  if (abs.some((a) => SPECIAL_RE.test(a))) return false;
  return abs.length <= 1;
}

/** Équilibre souple faction/coût parmi les scores ≥ minScore (abaisse le seuil si besoin). */
function pickBalanced(scoreFn, count, minScore) {
  const picked = [];
  const used = new Set();
  const bucketCount = { low: 0, mid: 0, high: 0 };
  let threshold = minScore;
  let guard = 0;

  while (picked.length < count && guard++ < 800) {
    const capCount = {};
    for (const p of picked) capCount[p.c.capital] = (capCount[p.c.capital] || 0) + 1;

    const cands = CREATURES
      .filter((c) => canTakeSpecial(c) && !used.has(c.id))
      .map((c) => ({ c, score: scoreFn(c) }))
      .filter((x) => x.score >= threshold)
      .sort((a, b) => {
        const ca = capCount[a.c.capital] || 0;
        const cb = capCount[b.c.capital] || 0;
        const ba = bucketCount[costBucket(a.c.cost)];
        const bb = bucketCount[costBucket(b.c.cost)];
        // Priorité : ne pas surcharger une faction, puis coûts, puis score
        if (ca !== cb) return ca - cb;
        if (ba !== bb) return ba - bb;
        if (b.score !== a.score) return b.score - a.score;
        return a.c.cost - b.c.cost || a.c.id - b.c.id;
      });

    if (!cands.length) {
      threshold -= 1;
      if (threshold < Math.max(0, minScore - 4)) break;
      continue;
    }
    const best = cands[0];
    used.add(best.c.id);
    bucketCount[costBucket(best.c.cost)] += 1;
    picked.push(best);
  }
  return picked;
}

const poisonPicks = pickBalanced(scorePoison, TARGET, 4);
for (const { c } of poisonPicks) {
  c.abilities.push('poison');
  c.spell = 'Poison : empoisonne la cible touchée (1 dégât / début de tour).';
}

const entravePicks = pickBalanced(scoreEntrave, TARGET, 4);
for (const { c } of entravePicks) {
  const id = channelForCost(c.cost);
  c.abilities.push(id);
  const turns = id.includes('-3-') ? 3 : id.includes('-2-') ? 2 : 1;
  c.spell = `Canalisation ${turns} : Entrave — après ${turns} tour(s), entrave une créature adverse.`;
}

const bouclierPicks = pickBalanced(scoreBouclier, TARGET, 6);
for (const { c } of bouclierPicks) {
  c.abilities.push('bouclier-divin');
  c.spell = 'Bouclier divin : ignore la première source de dégâts à l’invocation.';
}

fs.writeFileSync(DATA, `${header}const CREATURES = ${JSON.stringify(CREATURES, null, 2)};\n`, 'utf8');

function summarize(picks, idFn) {
  const byCap = {};
  const byCost = {};
  for (const { c } of picks) {
    byCap[c.capital] = (byCap[c.capital] || 0) + 1;
    byCost[c.cost] = (byCost[c.cost] || 0) + 1;
  }
  const rows = picks
    .slice()
    .sort((a, b) => a.c.capital.localeCompare(b.c.capital, 'fr') || a.c.cost - b.c.cost)
    .map(({ c, score }) => `  ${c.capital.padEnd(12)} c${c.cost} ${c.name.padEnd(20)} ${idFn(c)} (s${score})`);
  return { n: picks.length, byCap, byCost, rows };
}

const rP = summarize(poisonPicks, () => 'poison');
const rE = summarize(entravePicks, (c) => channelForCost(c.cost));
const rB = summarize(bouclierPicks, () => 'bouclier-divin');
const chan = { 1: 0, 2: 0, 3: 0 };
for (const { c } of entravePicks) {
  const id = channelForCost(c.cost);
  chan[id.includes('-1-') ? 1 : id.includes('-2-') ? 2 : 3] += 1;
}

console.log('POISON', rP.n, rP.byCap, rP.byCost);
console.log(rP.rows.join('\n'));
console.log('ENTRAVE', rE.n, rE.byCap, rE.byCost, 'chan', chan);
console.log(rE.rows.join('\n'));
console.log('BOUCLIER', rB.n, rB.byCap, rB.byCost);
console.log(rB.rows.join('\n'));
console.log(
  '>2 abs',
  CREATURES.filter((c) => (c.abilities || []).length > 2).map((c) => `${c.name}:${c.abilities}`),
);
const pct = (n) => `${((100 * n) / CREATURES.length).toFixed(1)}% (${n}/${CREATURES.length})`;
console.log('coverage', { poison: pct(rP.n), entrave: pct(rE.n), bouclier: pct(rB.n) });
