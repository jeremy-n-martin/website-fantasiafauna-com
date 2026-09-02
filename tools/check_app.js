const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.join(__dirname, "..");
const code = fs.readFileSync(path.join(root, "js/creatures-data.js"), "utf8");
const ctx = { window: {} };
vm.runInNewContext(code, ctx);
const data = ctx.window.FF_DATA;
const creatures = data.creatures;
const slugs = new Set();
const dupes = [];
const missing = [];

function fold(value) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}

creatures.forEach((creature) => {
  if (slugs.has(creature.slug)) dupes.push(creature.slug);
  slugs.add(creature.slug);
  creature.images.forEach((image) => {
    if (!fs.existsSync(path.join(root, image.src))) missing.push(image.src);
    if (!fs.existsSync(path.join(root, image.thumb))) missing.push(image.thumb);
  });
});

const dragons = creatures.filter((c) => fold(c.name).includes("dragon"));
const fee = creatures.filter((c) => fold(c.search).includes("fee"));
const fantome = creatures.find((c) => c.slug === "fantome");

console.log(JSON.stringify({
  count: creatures.length,
  unique: slugs.size,
  dupes,
  missing: missing.length,
  dragons: dragons.length,
  fee: fee.map((c) => c.name),
  fantome: fantome && fantome.name,
  sample: ["/creatures/" + creatures[0].slug, "/creatures/" + creatures[100].slug, "/creatures/" + creatures[339].slug]
}, null, 2));
