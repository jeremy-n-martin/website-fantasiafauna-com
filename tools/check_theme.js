/* NODE_PATH=./tmp/editorial/test-runtime/node_modules node tools/check_theme.js */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');
const root = path.resolve(__dirname, '..');
const states = ['sombre', 'sombre-doux', 'clair-doux', 'clair'];
const labels = ['sombre', 'sombre doux', 'clair doux', 'clair'];
function boot(saved, storageError = false) {
  const dom = new JSDOM(fs.readFileSync(path.join(root, 'index.html'), 'utf8'), { url: 'https://example.test/creatures/aasimar', runScripts: 'outside-only' });
  const w = dom.window;
  if (saved !== undefined) w.localStorage.setItem('ff-theme', saved);
  if (storageError) Object.defineProperty(w, 'localStorage', { get() { throw new Error('storage denied'); } });
  const file = path.join(root, 'js/theme.js');
  if (fs.existsSync(file)) w.eval(fs.readFileSync(file, 'utf8'));
  return dom;
}
const dom = boot();
const w = dom.window, d = w.document;
assert.equal(d.documentElement.dataset.theme, 'clair-doux', 'apply default before DOMContentLoaded');
d.dispatchEvent(new w.Event('DOMContentLoaded'));
const slider = d.querySelector('#theme-range');
assert.ok(slider, 'native theme slider is present');
assert.equal(slider.type, 'range');
assert.equal(slider.min, '0'); assert.equal(slider.max, '3'); assert.equal(slider.step, '1');
assert.equal(d.querySelector('label[for="theme-range"]').textContent, 'Thème');
for (let i = 0; i < states.length; i++) {
  slider.value = String(i);
  slider.dispatchEvent(new w.Event('input', { bubbles: true }));
  assert.equal(d.documentElement.dataset.theme, states[i]);
  assert.equal(slider.getAttribute('aria-valuetext'), labels[i]);
  assert.equal(d.querySelector('#theme-label').textContent, labels[i]);
}
w.close();
console.log('PASS: early default and four accessible slider states');
for (const state of states) {
  const reload = boot(state), rw = reload.window;
  assert.equal(rw.document.documentElement.dataset.theme, state, 'restore before CSS/DOMContentLoaded');
  rw.document.dispatchEvent(new rw.Event('DOMContentLoaded'));
  const range = rw.document.querySelector('#theme-range');
  assert.equal(range.value, String(states.indexOf(state)));
  range.value = '0'; range.dispatchEvent(new rw.Event('input'));
  assert.equal(rw.localStorage.getItem('ff-theme'), 'sombre');
  rw.close();
}
for (const invalid of ['', 'dark', '0', '__proto__', 'SOMBRE']) {
  const invalidDom = boot(invalid);
  assert.equal(invalidDom.window.document.documentElement.dataset.theme, 'clair-doux');
  invalidDom.window.close();
}
const denied = boot(undefined, true), dw = denied.window;
dw.document.dispatchEvent(new dw.Event('DOMContentLoaded'));
const deniedRange = dw.document.querySelector('#theme-range');
deniedRange.value = '1'; deniedRange.dispatchEvent(new dw.Event('input'));
assert.equal(dw.document.documentElement.dataset.theme, 'sombre-doux');
dw.close();
const quota = boot('clair'), qw = quota.window;
qw.Storage.prototype.setItem = () => { throw new Error('quota exceeded'); };
qw.document.dispatchEvent(new qw.Event('DOMContentLoaded'));
const quotaRange = qw.document.querySelector('#theme-range');
quotaRange.value = '0'; quotaRange.dispatchEvent(new qw.Event('input'));
assert.equal(qw.document.documentElement.dataset.theme, 'sombre', 'write failure cannot block theme change');
qw.close();
const routed = boot('sombre'), rw = routed.window, rd = rw.document;
rw.scrollTo = () => {};
rw.HTMLElement.prototype.scrollIntoView = () => {};
rw.matchMedia = () => ({ matches: true });
rd.dispatchEvent(new rw.Event('DOMContentLoaded'));
for (const file of ['creatures-data.js', 'notices.js', 'fiches.js', 'app.js']) rw.eval(fs.readFileSync(path.join(root, 'js', file), 'utf8'));
const persistent = rd.querySelector('#theme-range');
const notice = rd.querySelector('.notice');
persistent.value = '1'; persistent.dispatchEvent(new rw.Event('input'));
assert.equal(rd.querySelector('.notice'), notice, 'theme must not rerender app');
rd.querySelector('#nav-catalog').click();
assert.equal(rw.location.pathname, '/');
assert.equal(rd.querySelector('#theme-range'), persistent, 'router preserves slider');
assert.equal(rd.documentElement.dataset.theme, 'sombre-doux');
persistent.value = '3'; persistent.dispatchEvent(new rw.Event('input'));
assert.equal(rd.documentElement.dataset.theme, 'clair');
rw.close();
console.log('PASS: storage, reload, whitelist, denied storage and real route survival');
const css = fs.readFileSync(path.join(root, 'css/site.css'), 'utf8');
function tokens(block) { return Object.fromEntries([...block.matchAll(/--([\w-]+):\s*(#[\da-f]{6})/g)].map(m => [m[1], m[2]])); }
const base = tokens(css.match(/:root\s*\{([^}]+)/)[1]);
function luminance(hex) {
  const rgb = hex.slice(1).match(/../g).map(v => parseInt(v, 16) / 255).map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4);
  return rgb[0] * .2126 + rgb[1] * .7152 + rgb[2] * .0722;
}
const ratios = {};
for (const state of states) {
  const block = css.match(new RegExp(':root\\[data-theme="' + state + '"\\]\\s*\\{([^}]+)'));
  assert.ok(block, 'explicit palette: ' + state);
  const t = { ...base, ...tokens(block[1]) };
  const pairs = ['paper', 'surface', 'wash', 'target'].flatMap(bg => ['ink', 'muted', 'forest'].map(fg => [fg, bg]));
  pairs.push(['header-text', 'header-background']);
  ratios[state] = Math.min(...pairs.map(([fg,bg]) => {
    const a = luminance(t[fg]), b = luminance(t[bg]);
    const ratio = (Math.max(a,b) + .05) / (Math.min(a,b) + .05);
    assert.ok(ratio >= 4.5, `${state}: ${fg}/${bg} contrast ${ratio}`);
    return ratio;
  }));
}
assert.match(css, /@media print\s*\{\s*:root,\s*:root\[data-theme\]/);
assert.match(css, /prefers-reduced-motion: reduce/);
assert.match(css, /animation: none !important/);
assert.match(css, /\.theme-control input[^}]*min-height: 44px/);
assert.match(css, /\.site-header[^}]*flex-wrap: wrap/);
const decorative = boot();
for (const selector of ['.theme-icon', '.brand .mark']) {
  assert.equal(decorative.window.document.querySelector(selector)?.getAttribute('aria-hidden'), 'true');
}
assert.equal(decorative.window.document.querySelectorAll('.brand .wing').length, 2);
decorative.window.close();
console.log('PASS: AA palette text contrast minima ' + JSON.stringify(ratios));
console.log('PASS: decorative SVG, reduced motion, print specificity and touch control contracts');
