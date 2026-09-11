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
notice.sections.fascination = ["Un texte <script>ne doit pas être exécuté</script>.[17]"];
win.eval(fs.readFileSync(path.join(root, "js/app.js"), "utf8"));
const doc = win.document;
const citation = doc.querySelector('#fascination .source-call a');
assert.ok(citation, "Inline source calls must link to their bibliography entry");
assert.equal(citation.textContent, "[17]");
assert.equal(new URL(citation.href).pathname, "/creatures/tyrannoeil", "Citations must stay on the current notice despite the base element");
assert.equal(new URL(citation.href).hash, "#source-17");
const source = doc.querySelector("#source-17 a");
assert.ok(source, "The source must be readable from the notice");
assert.equal(source.href, "https://example.org/reference?a=1&b=2");
assert.equal(source.textContent, "Source <test> & référence");
assert.equal(doc.querySelectorAll(".notice script").length, 0);
assert.equal(doc.querySelectorAll(".notice > section").length, 5);
assert.deepEqual(Array.from(doc.querySelectorAll("#naturelle h3"), n => n.textContent),
  ["Comportement", "Habitat", "Alimentation", "Intelligence", "Reproduction", "Prédateurs"]);
citation.click();
assert.equal(win.location.pathname, "/creatures/tyrannoeil", "Clicking a citation must not route to the catalogue");
console.log("PASS: citations, source links, text escaping, five sections and six natural-history headings");
dom.window.close();
