#!/usr/bin/env node
/**
 * Runner headless : enchaîne des sessions d’équilibre (2 parties chacune)
 * sans UI, et append dans balance_sessions.jsonl
 *
 * Usage:
 *   node tools/balance_headless.mjs [sessions]
 *   node tools/balance_headless.mjs 50
 */
import fs from 'fs';
import path from 'path';
import vm from 'vm';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const LOG_FILE = path.join(ROOT, 'balance_sessions.jsonl');
const SESSIONS = Math.max(1, Math.min(500, Number(process.argv[2] || 50) || 50));

function makeEl(tag = 'div') {
  const el = {
    tagName: String(tag).toUpperCase(),
    style: {
      setProperty() {},
      removeProperty() {},
      getPropertyValue() { return ''; },
    },
    classList: {
      _set: new Set(),
      add(...xs) { xs.forEach((x) => el.classList._set.add(x)); },
      remove(...xs) { xs.forEach((x) => el.classList._set.delete(x)); },
      contains(x) { return el.classList._set.has(x); },
      toggle(x, force) {
        if (force === true) { el.classList._set.add(x); return true; }
        if (force === false) { el.classList._set.delete(x); return false; }
        if (el.classList._set.has(x)) { el.classList._set.delete(x); return false; }
        el.classList._set.add(x); return true;
      },
    },
    children: [],
    childNodes: [],
    parentNode: null,
    dataset: {},
    attributes: {},
    innerHTML: '',
    textContent: '',
    value: '',
    checked: false,
    disabled: false,
    hidden: false,
    id: '',
    className: '',
    href: '',
    width: 0,
    height: 0,
    setAttribute(k, v) { el.attributes[k] = String(v); if (k === 'id') el.id = String(v); },
    getAttribute(k) { return el.attributes[k] ?? null; },
    removeAttribute(k) { delete el.attributes[k]; },
    appendChild(c) { el.children.push(c); el.childNodes.push(c); if (c) c.parentNode = el; return c; },
    removeChild(c) {
      el.children = el.children.filter((x) => x !== c);
      el.childNodes = el.childNodes.filter((x) => x !== c);
      return c;
    },
    remove() { if (el.parentNode?.removeChild) el.parentNode.removeChild(el); },
    addEventListener() {},
    removeEventListener() {},
    closest() { return null; },
    matches() { return false; },
    querySelector() { return null; },
    querySelectorAll() { return []; },
    getBoundingClientRect() { return { left: 0, top: 0, right: 0, bottom: 0, width: 0, height: 0, x: 0, y: 0 }; },
    focus() {},
    blur() {},
    click() {},
    getContext() {
      return {
        fillRect() {}, clearRect() {}, drawImage() {},
        beginPath() {}, moveTo() {}, lineTo() {}, stroke() {}, fill() {},
        arc() {}, save() {}, restore() {}, translate() {}, scale() {},
        measureText() { return { width: 0 }; },
      };
    },
  };
  return el;
}

const appEl = makeEl('div');
appEl.id = 'app';

const document = {
  body: makeEl('body'),
  documentElement: makeEl('html'),
  head: makeEl('head'),
  readyState: 'complete',
  getElementById(id) { return id === 'app' ? appEl : null; },
  querySelector() { return null; },
  querySelectorAll() { return []; },
  createElement(tag) { return makeEl(tag); },
  createElementNS(_ns, tag) { return makeEl(tag); },
  createTextNode(t) { return { textContent: String(t), nodeType: 3 }; },
  createDocumentFragment() { return makeEl('fragment'); },
  addEventListener() {},
  removeEventListener() {},
  elementsFromPoint() { return []; },
};

const localStorage = {
  _data: Object.create(null),
  getItem(k) { return Object.prototype.hasOwnProperty.call(this._data, k) ? this._data[k] : null; },
  setItem(k, v) { this._data[k] = String(v); },
  removeItem(k) { delete this._data[k]; },
};

const taskQueue = [];
let flushing = false;
function flushTasks() {
  if (flushing) return;
  flushing = true;
  while (taskQueue.length) {
    const fn = taskQueue.shift();
    try { fn(); } catch (e) { console.error('[headless timer]', e.message || e); }
  }
  flushing = false;
}
function schedule(fn) {
  taskQueue.push(fn);
  queueMicrotask(flushTasks);
  return 1;
}

const windowObj = {
  document,
  localStorage,
  console,
  Math,
  Date,
  JSON,
  crypto,
  Array,
  Object,
  String,
  Number,
  Boolean,
  RegExp,
  Error,
  Promise,
  Map,
  Set,
  parseInt,
  parseFloat,
  isNaN,
  Infinity,
  NaN,
  undefined,
  setTimeout: (fn) => schedule(typeof fn === 'function' ? fn : () => {}),
  clearTimeout() {},
  setInterval() { return 0; },
  clearInterval() {},
  requestAnimationFrame(fn) { return schedule(fn); },
  cancelAnimationFrame() {},
  fetch: async () => ({ ok: false, json: async () => ({}) }),
  navigator: { userAgent: 'balance-headless' },
  location: { href: 'http://localhost:5500/', pathname: '/' },
  FFAudio: {
    unlockAudio() {},
    preloadCreatureSounds: async () => {},
    syncVolumeUi() {},
    volumeControlHtml: () => '',
  },
  FFBalanceWriteLog(payload) {
    const entry = {
      ts: new Date().toISOString().replace(/\.\d{3}Z$/, 'Z'),
      ip: 'headless',
      source: 'headless',
      ...payload,
    };
    fs.appendFileSync(LOG_FILE, JSON.stringify(entry) + '\n', 'utf8');
  },
  innerWidth: 1280,
  innerHeight: 720,
  addEventListener() {},
  removeEventListener() {},
  dispatchEvent() { return true; },
};

windowObj.window = windowObj;
windowObj.globalThis = windowObj;
windowObj.self = windowObj;

const context = vm.createContext(windowObj);

function loadScript(rel) {
  const full = path.join(ROOT, rel);
  const code = fs.readFileSync(full, 'utf8');
  vm.runInContext(code, context, { filename: full });
}

console.log(`Headless équilibre — ${SESSIONS} session(s) × 2 parties → ${path.basename(LOG_FILE)}`);
const t0 = Date.now();

loadScript('creatures-data.js');
loadScript('game.js');
// Évite le render DOM massif pendant le batch
vm.runInContext('window.render = function(){};', context);
loadScript('combat.js');
vm.runInContext('window.render = function(){};', context);
loadScript('balance.js');

await flushTasks();

const run = context.runHeadlessBalance || context.FFBalance?.runHeadlessSessions;
if (typeof run !== 'function') {
  console.error('runHeadlessBalance introuvable');
  process.exit(1);
}

const result = await run.call(context.FFBalance, SESSIONS);
await new Promise((r) => setImmediate(r));
flushTasks();
await new Promise((r) => setImmediate(r));

const ms = Date.now() - t0;
const lines = fs.existsSync(LOG_FILE) ? fs.readFileSync(LOG_FILE, 'utf8').trim().split(/\n+/).filter(Boolean).length : 0;
console.log(`OK — sessions demandées: ${SESSIONS}, flushed: ${result?.flushed ?? '?'}, lignes log: ${lines}, ${ms} ms`);
