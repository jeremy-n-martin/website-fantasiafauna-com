/* NODE_PATH=./tmp/editorial/test-runtime/node_modules node tools/check_no_public_sources.js */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');
const root = path.resolve(__dirname, '..');
const dom = new JSDOM(fs.readFileSync(path.join(root, 'index.html'), 'utf8'), {url: 'http://localhost/', runScripts: 'outside-only'});
const w = dom.window;
w.scrollTo = () => {};
w.matchMedia = () => ({matches: true});
w.HTMLElement.prototype.scrollIntoView = () => {};
for (const file of ['creatures-data.js', 'notices.js', 'fiches.js']) w.eval(fs.readFileSync(path.join(root, 'js', file), 'utf8'));
const before = JSON.stringify([w.FF_DATA, w.FF_NOTICES, w.FF_FICHES]);
const expected = w.FF_DATA.creatures.map(c => c.slug);
assert.equal(expected.length, 340);
assert.equal(new Set(expected).size, 340);
w.eval(fs.readFileSync(path.join(root, 'js/app.js'), 'utf8'));
const d = w.document;
const rows = [];
const failures = [];
const measureKeys = ['taille', 'poids', 'size', 'height', 'weight'];
const measurementFields = [];
for (const [bundle, entries] of [['FF_DATA', w.FF_DATA.creatures], ['FF_NOTICES', Object.values(w.FF_NOTICES)], ['FF_FICHES', Object.values(w.FF_FICHES)]]) {
  for (const entry of entries) for (const key of measureKeys) if (Object.hasOwn(entry, key)) measurementFields.push({bundle, key, value: entry[key]});
}
d.querySelector('.plate').click();
for (let i = 0; i < expected.length; i++) {
  const slug = decodeURIComponent(w.location.pathname.split('/').pop());
  const row = {slug, route: w.location.pathname, longNotice: !!w.FF_NOTICES[slug]?.sections, sections: d.querySelectorAll('.notice > section').length, naturalParts: d.querySelectorAll('#naturelle h3').length, tocLinks: d.querySelectorAll('.toc a').length};
  try {
    assert.ok(expected.includes(slug), 'known route');
    assert.ok(d.querySelector('.creature h1')?.textContent, 'rendered creature');
    assert.ok(w.FF_FICHES[slug], 'synthesis exists');
    const creature = w.FF_DATA.creatures.find(c => c.slug === slug);
    const originalIntro = w.FF_NOTICES[slug]?.description || creature.description || w.FF_FICHES[slug].accroche;
    assert.equal(d.querySelector('.lede')?.textContent, originalIntro.replace(/\[\d+\]/g, ''), 'original introduction restored, long description has priority');
    assert.equal(d.querySelector('meta[name="description"]').content, originalIntro.replace(/\[\d+\]/g, ''), 'SEO uses available introduction');
    if (!row.longNotice) assert.ok(d.querySelector('.undocumented'), 'short synthesis does not pretend to be a complete notice');
    assert.equal(d.querySelectorAll('.dossier dt').length, 7, 'seven dossier fields');
    const dossier = Object.fromEntries(Array.from(d.querySelectorAll('.dossier > div'), n => [n.querySelector('dt').textContent, n.querySelector('dd').textContent]));
    assert.equal(dossier.Tradition, undefined, 'no Tradition field');
    assert.equal(dossier.Taille, 'Non renseignée');
    assert.equal(dossier.Poids, 'Non renseigné');
    row.taille = dossier.Taille; row.poids = dossier.Poids;
    assert.doesNotMatch(d.querySelector('#app').textContent, /\[\d+\]|Sources et lectures/i);
    assert.doesNotMatch(d.querySelector('meta[name="description"]').content, /\[\d+\]/);
    assert.equal(d.querySelector('.source-call, .notice-sources, #sources-title, [id^="source-"], a[href*="#source-"] , a[href*="#sources-title"]'), null, 'no bibliography DOM or source anchors');
    if (row.longNotice) {
      assert.equal(row.sections, 5);
      assert.equal(row.naturalParts, 6);
      assert.equal(row.tocLinks, 11);
      for (const a of d.querySelectorAll('.toc a')) assert.ok(d.getElementById(a.getAttribute('href').slice(1)), 'TOC target exists');
    }
    row.pass = true;
  } catch (error) { row.pass = false; row.error = error.message; failures.push({slug, error: error.message}); }
  rows.push(row);
  d.querySelector('.pager .next').click();
}
assert.equal(new Set(rows.map(r => r.slug)).size, 340, 'pager visits every route exactly once');
assert.deepEqual(rows.map(r => r.slug).sort(), [...expected].sort());
assert.equal(JSON.stringify([w.FF_DATA, w.FF_NOTICES, w.FF_FICHES]), before, 'rendering never mutates corpus or internal references');
const report = {total: rows.length, passed: rows.filter(r => r.pass).length, failed: failures.length, longNotices: rows.filter(r => r.longNotice).length, shortFiches: rows.filter(r => !r.longNotice).length, measurementFields, realMeasurementCount: rows.filter(r => r.taille && r.taille !== 'Non renseignée').length, missingMeasurementCount: rows.filter(r => r.taille === 'Non renseignée' && r.poids === 'Non renseigné').length, internalDataUnchanged: true, failures, routes: rows};
fs.mkdirSync(path.join(root, 'tmp/redesign'), {recursive: true});
fs.writeFileSync(path.join(root, 'tmp/redesign/no-sources-audit.json'), JSON.stringify(report, null, 2) + '\n');
dom.window.close();
console.log(JSON.stringify({...report, routes: undefined, failures: failures.slice(0, 3)}, null, 2));
assert.equal(failures.length, 0, 'all 340 public routes must pass; see tmp/redesign/no-sources-audit.json');
