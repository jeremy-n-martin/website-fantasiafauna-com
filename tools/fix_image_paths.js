const fs = require('fs');
const path = require('path');

const dataPath = 'creatures-data.js';
let src = fs.readFileSync(dataPath, 'utf8');

// Fix known bad path
src = src.replace(/img\/Lindworm {2,}1\.png/g, 'img/Lindworm 1.png');

const imgs = [...src.matchAll(/image:\s*"([^"]+)"/g)].map((m) => m[1]);
const missing = [];
const doubles = [];
for (const p of imgs) {
  if (/ {2,}/.test(p)) doubles.push(p);
  if (!fs.existsSync(p)) missing.push(p);
}

// Try to auto-fix double spaces if single-space file exists
let fixed = 0;
for (const p of doubles) {
  const fixedPath = p.replace(/ {2,}/g, ' ');
  if (fs.existsSync(fixedPath)) {
    src = src.split(p).join(fixedPath);
    fixed++;
  }
}

fs.writeFileSync(dataPath, src);

const imgs2 = [...src.matchAll(/image:\s*"([^"]+)"/g)].map((m) => m[1]);
const missing2 = imgs2.filter((p) => !fs.existsSync(p));
console.log({ doublesBefore: doubles.length, autoFixed: fixed, stillMissing: missing2.length });
if (missing2.length) console.log(missing2.slice(0, 40));
