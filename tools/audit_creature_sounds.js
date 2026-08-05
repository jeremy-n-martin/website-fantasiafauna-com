/**
 * Audit creature_sounds.json vs fichiers OGG + audio_catalog (SHOOT etc.).
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const cat = JSON.parse(fs.readFileSync(path.join(root, 'creature_sounds.json'), 'utf8'));
const dir = path.join(root, 'sons', 'creatures');
const files = new Set(fs.readdirSync(dir).map(f => f.toLowerCase()));

const data = fs.readFileSync(path.join(root, 'creatures-data.js'), 'utf8');
const m = data.match(/const CREATURES = (\[[\s\S]*?\n\]);/);
if (!m) throw new Error('CREATURES not found');
const creatures = eval(m[1]);

const acts = ['attack', 'defend', 'move', 'wince', 'shoot'];
const missing = [];
const noEntry = [];
const byAction = { attack: 0, defend: 0, move: 0, wince: 0, shoot: 0 };
const missingAttackNames = [];
const casterNoShoot = [];

for (const c of creatures) {
  const e = cat.byId[String(c.id)];
  if (!e) {
    noEntry.push({ id: c.id, name: c.name });
    continue;
  }
  const tags = [...(c.roles || []), ...(c.abilities || [])];
  const rangedLike = tags.some(t =>
    t === 'caster' || t === 'ranged' || t === 'assassin' || t === 'lancer'
    || String(t).startsWith('sort-degat') || String(t).startsWith('lancer')
  );
  for (const a of acts) {
    const rel = e[a];
    if (!rel) {
      // shoot optionnel sauf pour casters/ranged
      if (a === 'shoot' && !rangedLike) continue;
      missing.push({ id: c.id, name: c.name, action: a, reason: 'no-key' });
      byAction[a]++;
      if (a === 'attack') missingAttackNames.push(`${c.name} (#${c.id}) [no-key]`);
      if (a === 'shoot' && rangedLike) casterNoShoot.push(c.name);
      continue;
    }
    const base = path.basename(rel).toLowerCase();
    if (!files.has(base)) {
      missing.push({ id: c.id, name: c.name, action: a, file: rel, reason: 'file-missing' });
      byAction[a]++;
      if (a === 'attack') missingAttackNames.push(`${c.name} (#${c.id}) → ${rel}`);
    }
  }
}

// Packs avec shoot mais attack manquant sur disque
const shootOnly = [];
for (const f of files) {
  if (!f.endsWith('_shoot.ogg')) continue;
  const code = f.replace(/_shoot\.ogg$/, '');
  const atk = `${code}_attack.ogg`;
  if (!files.has(atk)) shootOnly.push(code.toUpperCase());
}

// Entrées JSON dont attack pointe vers un fichier absent mais shoot existe
const attackMissingShootExists = [];
const seen = new Set();
for (const e of Object.values(cat.byId)) {
  if (!e.attack || seen.has(e.source)) continue;
  seen.add(e.source);
  const base = path.basename(e.attack).toLowerCase();
  if (files.has(base)) continue;
  const shoot = base.replace(/_attack\.ogg$/, '_shoot.ogg');
  if (files.has(shoot)) attackMissingShootExists.push({ source: e.source, attack: e.attack, shoot });
}

console.log(JSON.stringify({
  creatures: creatures.length,
  catalog: Object.keys(cat.byId).length,
  noEntry: noEntry.length,
  missingRefs: missing.length,
  missingByAction: byAction,
  missingAttackCount: missingAttackNames.length,
  missingAttackSample: missingAttackNames.slice(0, 50),
  casterNoShootSample: casterNoShoot.slice(0, 30),
  packsShootWithoutAttackFile: shootOnly.slice(0, 40),
  packsAttackMissingButShootExists: attackMissingShootExists,
  aboleth: cat.byId['339'],
  evliFiles: ['evli_attack.ogg', 'evli_shoot.ogg', 'evli_defend.ogg', 'evli_move.ogg', 'evli_wince.ogg']
    .map(f => [f, files.has(f)]),
}, null, 2));
