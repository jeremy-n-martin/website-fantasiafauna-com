/* Vol + Ranged : corps 1/1. Combos iconiques (Vol+Piétinement / Vol+Bouclier) : retirer ranged. */
const fs = require('fs');
const path = require('path');
const DATA = path.join(__dirname, '..', 'creatures-data.js');
const code = fs.readFileSync(DATA, 'utf8');
const headerMatch = code.match(/^[\s\S]*?(?=const CREATURES\s*=)/);
const header = headerMatch ? headerMatch[0] : '/* Auto-generated creature dataset for Fantasia Fauna. */\n';
const CREATURES = new Function(`${code};\nreturn CREATURES;`)();

function hasAb(c, id) {
  return (c.abilities || []).includes(id);
}
function isVol(c) {
  return hasAb(c, 'vol') || (c.roles || []).includes('volant');
}
function isRanged(c) {
  return (c.roles || []).includes('ranged') || hasAb(c, 'ranged');
}

let to11 = 0;
let stripped = 0;
for (const c of CREATURES) {
  if (!isVol(c) || !isRanged(c)) continue;
  const iconic = hasAb(c, 'pietinement') || hasAb(c, 'bouclier-divin');
  if (iconic) {
    c.roles = [...new Set((c.roles || []).map((r) => (r === 'ranged' ? 'normal' : r)))];
    if (!c.roles.length) c.roles = ['normal'];
    if (Array.isArray(c.abilities)) c.abilities = c.abilities.filter((a) => a !== 'ranged');
    stripped += 1;
    continue;
  }
  c.attack = 1;
  c.health = 1;
  c.power = Math.max(1, ((c.cost | 0) * 8) + 4);
  c.spell =
    'Vol + Ranged : corps 1/1 — ignore les Tanks, cible les Vol, pas de riposte ; seules Vol/Ranged peuvent l’attaquer.';
  to11 += 1;
}

fs.writeFileSync(DATA, `${header}const CREATURES = ${JSON.stringify(CREATURES, null, 2)};\n`, 'utf8');
console.log(`Vol+Ranged → 1/1 : ${to11}`);
console.log(`Iconiques : ranged retiré : ${stripped}`);
const aara = CREATURES.find((c) => c.name === 'Aarakocra');
console.log('Aarakocra', aara && { atk: aara.attack, hp: aara.health, roles: aara.roles, abs: aara.abilities });
