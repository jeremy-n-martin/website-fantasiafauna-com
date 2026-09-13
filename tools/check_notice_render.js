/* Run with NODE_PATH=tmp/editorial/test-runtime/node_modules node tools/check_notice_render.js */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { JSDOM } = require("jsdom");

const root = path.resolve(__dirname, "..");
const dom = new JSDOM(fs.readFileSync(path.join(root, "index.html"), "utf8"), {
  url: "http://localhost/creatures/tyrannoeil",
  runScripts: "outside-only"
});
const win = dom.window;
win.scrollTo = () => {};
win.matchMedia = () => ({ matches: true });
for (const file of ["creatures-data.js", "notices.js", "fiches.js"]) {
  win.eval(fs.readFileSync(path.join(root, "js", file), "utf8"));
}
// Deliberately artificial reference: tests rendering, not editorial evidence.
const notice = win.FF_NOTICES.tyrannoeil;
notice.sources = [{ id: 17, title: "Source <test> & référence", url: "https://example.org/reference?a=1&b=2" }];
notice.description = 'Une créature de 1977, « je demeure », <img src=x onerror=alert(1)>.[17][999]';
notice.sections.fascination = ["Un texte <script>ne doit pas être exécuté</script>. 12 yeux, « regarde ».[17][999]"];
win.eval(fs.readFileSync(path.join(root, "js/app.js"), "utf8"));
const doc = win.document;
assert.equal(doc.querySelector('.source-call, .notice-sources, #sources-title, [id^="source-"]'), null, 'No public citation or bibliography DOM');
assert.doesNotMatch(doc.querySelector('#app').textContent, /\[\d+\]|Sources et lectures/);
assert.equal(doc.querySelector('#fascination p').textContent, 'Un texte <script>ne doit pas être exécuté</script>. 12 yeux, « regarde ».');
assert.equal(doc.querySelector('.lede').textContent, 'Une créature de 1977, « je demeure », <img src=x onerror=alert(1)>.');
assert.equal(doc.querySelector('.lede img'), null);
assert.doesNotMatch(doc.querySelector('meta[name="description"]').content, /\[\d+\]/);
assert.equal(notice.sources[0].id, 17, 'Internal references stay intact');
assert.match(notice.sections.fascination[0], /\[17\]\[999\]$/, 'Internal text stays intact');
assert.equal(doc.querySelectorAll(".notice script").length, 0);
assert.equal(doc.querySelectorAll(".notice > section").length, 5);
assert.deepEqual(Array.from(doc.querySelectorAll("#naturelle h3"), n => n.textContent),
  ["Comportement", "Habitat", "Alimentation", "Intelligence", "Reproduction", "Prédateurs"]);
assert.deepEqual(Array.from(doc.querySelectorAll('.notice > section > h2'), n => n.textContent),
  ['Présentation', 'Mythes et origines', 'Particularités', 'Histoire naturelle', 'Héritage et curiosités']);
assert.ok(doc.querySelector('.toc-title'));
assert.ok(doc.querySelector('.toc').compareDocumentPosition(doc.querySelector('.notice')) & win.Node.DOCUMENT_POSITION_FOLLOWING);
assert.equal(doc.querySelector('.toc a[href="#sources-title"]'), null);
assert.equal(doc.querySelectorAll('.toc a').length, 11);
for (const heading of doc.querySelectorAll('#naturelle h3')) {
  assert.match(heading.id, /^naturelle-[a-z-]+$/);
  assert.equal(doc.querySelector('.toc-sub[href="#' + heading.id + '"]').textContent, heading.textContent);
}
assert.ok(doc.querySelector('.lede').compareDocumentPosition(doc.querySelector('.dossier')) & win.Node.DOCUMENT_POSITION_FOLLOWING);
assert.deepEqual(Array.from(doc.querySelectorAll('.dossier dt'), n => n.textContent),
  ['Origine', 'Taille', 'Poids', 'Famille', 'Danger', 'Habitat imaginaire', 'Trait remarquable']);
const zoom = doc.querySelector('button.exhibit-zoom');
assert.ok(zoom);
assert.ok(zoom.getAttribute('aria-label').includes('Agrandir'));
const dialog = doc.querySelector('#viewer');
dialog.showModal = () => { dialog.open = true; };
dialog.close = () => { dialog.open = false; dialog.dispatchEvent(new win.Event('close')); };
zoom.focus(); zoom.click();
assert.equal(dialog.open, true);
assert.equal(doc.querySelector('#viewer-image').alt, win.FF_DATA.creatures.find(c => c.slug === 'tyrannoeil').name);
doc.querySelector('#viewer-close').click();
assert.equal(dialog.open, false);
assert.equal(doc.activeElement, zoom);
doc.querySelector('.toc-sub').click();
assert.equal(win.location.pathname, "/creatures/tyrannoeil", "Natural-history anchors stay on the notice");
console.log("PASS: no public sources, preserved numbers/quotes, text escaping, five sections and six natural-history headings");
dom.window.close();
