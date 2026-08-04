/** Retire le tableau CREATURES de game.js (désormais dans creatures-data.js). */
const fs = require('fs');
const path = require('path');
const gamePath = path.join(__dirname, '..', 'game.js');
let src = fs.readFileSync(gamePath, 'utf8');
if (src.startsWith('const CREATURES')) {
  const end = src.indexOf('];');
  if (end < 0) throw new Error('fin CREATURES introuvable');
  src = src.slice(end + 2).replace(/^\r?\n/, '');
}
if (!src.includes('CREATURES manquant')) {
  const head = `/* CREATURES est defini dans creatures-data.js (charge avant ce fichier). */
if (typeof CREATURES === 'undefined') {
  throw new Error('CREATURES manquant : charge creatures-data.js avant game.js');
}

`;
  src = head + src;
}
fs.writeFileSync(gamePath, src);
console.log('game.js OK', fs.statSync(gamePath).size);
