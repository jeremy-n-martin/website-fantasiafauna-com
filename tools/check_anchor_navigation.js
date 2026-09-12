/* NODE_PATH=./tmp/editorial/test-runtime/node_modules node tools/check_anchor_navigation.js */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');
const root = path.resolve(__dirname, '..');
const tick = () => new Promise(resolve => setTimeout(resolve, 30));
function boot(url = 'http://localhost/creatures/aasimar') {
  const dom = new JSDOM(fs.readFileSync(path.join(root, 'index.html'), 'utf8'), { url, runScripts: 'outside-only' });
  const w = dom.window;
  w.scrolls = [];
  w.scrollTo = (...args) => w.scrolls.push(args);
  w.HTMLElement.prototype.scrollIntoView = function () { w.scrolls.push(this.id); };
  w.matchMedia = () => ({ matches: true });
  for (const file of ['creatures-data.js', 'notices.js', 'fiches.js', 'app.js']) w.eval(fs.readFileSync(path.join(root, 'js', file), 'utf8'));
  return dom;
}
(async () => {
  const dom = boot();
  const w = dom.window, d = w.document;
  const notice = d.querySelector('.notice');
  const toc = d.querySelector('.toc a');
  toc.click();
  await tick();
  assert.equal(w.location.pathname, '/creatures/aasimar', 'real TOC click must stay on the creature, not route to /');
  assert.equal(w.location.hash, toc.getAttribute('href'));
  assert.equal(d.querySelector('.notice'), notice, 'fragment navigation must preserve DOM');
  console.log('PASS: real TOC click retains route, hash and notice DOM');
  w.scrolls.length = 0;
  const citation = d.querySelector('.source-call a');
  assert.ok(citation, 'real notice has citations');
  citation.click(); await tick();
  assert.equal(w.location.hash, new URL(citation.href).hash);
  d.querySelector('.skip').click(); await tick();
  assert.equal(w.location.hash, '#app');
  w.history.back(); await tick();
  assert.equal(w.location.hash, new URL(citation.href).hash);
  w.history.forward(); await tick();
  assert.equal(w.location.hash, '#app');
  assert.equal(d.querySelector('.notice'), notice);
  assert.deepEqual(w.scrolls, [], 'native fragment history must not trigger app scroll-to-top');
  const cross = d.createElement('a');
  cross.href = '/creatures/tyrannoeil#naturelle'; d.body.append(cross);
  cross.click(); await tick();
  assert.equal(w.location.pathname, '/creatures/tyrannoeil');
  assert.equal(w.location.hash, '#naturelle', 'go must preserve interpage fragment');
  assert.equal(w.scrolls.at(-1), 'naturelle', 'interpage fragment scroll after render');
  dom.window.close();
  for (let attempt = 0; attempt < 2; attempt++) {
    const direct = boot('http://localhost/creatures/aasimar#naturelle');
    assert.equal(direct.window.scrolls.at(-1), 'naturelle', 'direct URL / reload must scroll to rendered target');
    direct.window.scrolls.length = 0;
    direct.window.dispatchEvent(new direct.window.Event('pageshow'));
    await tick();
    assert.equal(direct.window.scrolls.at(-1), 'naturelle', 'reapply initial fragment after browser restores reload scroll');
    direct.window.close();
  }
  const native = boot();
  const nw = native.window, nd = nw.document;
  const topLink = nd.createElement('a'); topLink.href = '#'; nd.body.append(topLink);
  let topPrevented;
  nw.addEventListener('click', e => { topPrevented = e.defaultPrevented; e.preventDefault(); }, { once: true });
  topLink.click();
  assert.equal(topPrevented, false, 'empty fragment must retain native scroll-to-top behavior');
  const malformed = boot('http://localhost/creatures/%E0%A4%A');
  assert.equal(malformed.window.document.querySelector('h1').textContent, 'Créature introuvable');
  malformed.window.close();
  for (const attrs of [
    { href: 'https://example.org/creatures/aasimar' },
    { href: 'mailto:test@example.org' },
    { href: '/creatures/tyrannoeil', target: '_blank' },
    { href: '/creatures/tyrannoeil', download: '' },
    { href: '/js/app.js' }
  ]) {
    const a = nd.createElement('a'); Object.entries(attrs).forEach(([k,v]) => a.setAttribute(k,v)); nd.body.append(a);
    let prevented;
    const observe = event => { prevented = event.defaultPrevented; event.preventDefault(); };
    nw.addEventListener('click', observe, { once: true }); a.click();
    assert.equal(prevented, false, 'native link: ' + JSON.stringify(attrs));
  }
  for (const options of [{ ctrlKey: true }, { metaKey: true }, { shiftKey: true }, { altKey: true }, { button: 1 }]) {
    const a = nd.querySelector('.pager a');
    const event = new nw.MouseEvent('click', { bubbles: true, cancelable: true, ...options });
    let prevented;
    nw.addEventListener('click', e => { prevented = e.defaultPrevented; e.preventDefault(); }, { once: true });
    a.dispatchEvent(event);
    assert.equal(prevented, false, 'modified click remains native: ' + JSON.stringify(options));
  }
  const canceled = new nw.MouseEvent('click', { bubbles: true, cancelable: true });
  canceled.preventDefault(); nd.querySelector('.pager a').dispatchEvent(canceled);
  assert.equal(nw.location.pathname, '/creatures/aasimar', 'already canceled click must not navigate');
  nd.querySelector('.pager a').click();
  assert.notEqual(nw.location.pathname, '/creatures/aasimar', 'pager still routes');
  nd.querySelector('#nav-catalog').click();
  const input = nd.querySelector('#q'); input.value = 'aasimar';
  input.dispatchEvent(new nw.Event('input', { bubbles: true }));
  assert.equal(nw.location.search, '?q=aasimar');
  assert.equal(nd.querySelectorAll('.plate').length, 1);
  input.focus(); input.value = 'aarakocra';
  input.dispatchEvent(new nw.Event('input', { bubbles: true }));
  assert.equal(nd.activeElement, input, 'live search must retain input focus');
  nd.querySelector('.plate').focus(); nd.querySelector('.plate').click();
  assert.equal(nd.activeElement.id, 'app', 'a new page must move keyboard focus to its content');
  native.window.close();
  console.log('PASS: citations, skip, fragment history, interpage, direct/reload, native links, pager and search');
})().catch(error => { console.error(error); process.exitCode = 1; });
