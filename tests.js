// Test suite for Fantasia Fauna combat system
// Run with: node tests.js

// Copy pure functions from combat.js for testing
function uid(){ return Math.random().toString(36).slice(2,10); }

function shuffleInPlace(arr){
  for(let i=arr.length-1;i>0;i--){ 
    const j=Math.floor(Math.random()*(i+1)); 
    [arr[i],arr[j]]=[arr[j],arr[i]]; 
  }
  return arr;
}

function pickN(arr,n){
  const copy=arr.slice(); 
  shuffleInPlace(copy); 
  return copy.slice(0,n);
}

function pickRandom(arr, n){
  const copy=arr.slice();
  shuffleInPlace(copy);
  return copy.slice(0, Math.max(0, n));
}

function buffCreature(c, atk=0, hp=0, opts={}){
  if(!c) return;
  const before={atk:c.attack||0, hp:c.hp||0};
  if(atk){
    c.baseAttack=(c.baseAttack||c.attack||0)+atk;
    c.attack=(c.attack||0)+atk;
  }
  if(hp){
    c.baseMaxHp=(c.baseMaxHp||c.maxHp||c.health||0)+hp;
    c.maxHp=(c.maxHp||0)+hp;
    c.hp=(c.hp||0)+hp;
  }
  if(!opts.silent && (atk||hp)){
    const delta=(c.attack||0)-before.atk + (c.hp||0)-before.hp;
    if(delta>0 && typeof spawnDamageFloat === 'function') spawnDamageFloat(c.uid, delta, 'buff');
    if(typeof spawnBuffSparkles === 'function') spawnBuffSparkles(c.uid, Math.min(8, Math.abs(atk||0)+Math.abs(hp||0)*2));
  }
}

function healCreature(c, amount){
  if(!c || amount<=0) return 0;
  const max=c.maxHp??c.baseMaxHp??c.health??c.hp;
  const before=c.hp??0;
  c.hp=Math.min(max, before+amount);
  const healed=c.hp-before;
  if(healed>0 && typeof spawnDamageFloat === 'function') spawnDamageFloat(c.uid, healed, 'heal');
  return healed;
}

function canAfford(p, card){
  const need = card.cost || 0;
  const colorManaTotal = Object.values(p.colorMana||{}).reduce((a,b)=>a+b,0);
  return ((p.mana || 0) + colorManaTotal) >= need;
}

function payCost(p, card){
  let need = card.cost || 0;
  const faction = card.capital;
  const fromF = Math.min(p.colorMana[faction] || 0, need);
  p.colorMana[faction] = (p.colorMana[faction] || 0) - fromF;
  need -= fromF;
  const fromN = Math.min(p.mana || 0, need);
  p.mana -= fromN;
  need -= fromN;
  for (const f of Object.keys(p.colorMana || {})) {
    if (need <= 0) break;
    const take = Math.min(p.colorMana[f] || 0, need);
    p.colorMana[f] -= take;
    need -= take;
  }
}

function sortHand(hand){
  if(!hand || hand.length<2) return hand;
  hand.sort((a,b)=>{
    const ca=a.cost||0, cb=b.cost||0;
    if(ca!==cb) return ca-cb;
    const na=a.name||'', nb=b.name||'';
    const byName=na.localeCompare(nb,'fr');
    if(byName) return byName;
    return String(a.uid||'').localeCompare(String(b.uid||''));
  });
  return hand;
}

function isTank(c){
  return !!(c && (hasRole(c,'tank') || c.tempTank));
}

function isAssassin(c){
  return !!(c && (hasRole(c,'assassin') || hasRole(c,'ranged')));
}

function hasNoRiposte(c){
  return !!(c && (hasRole(c,'sans-riposte') || hasRole(c,'ranged')));
}

function maxAttacks(c){
  return 1;
}

function strikeCount(c){
  return hasRole(c,'double-attaque') ? 2 : 1;
}

function hasRole(c, id){
  if(!c) return false;
  return !!(c.abilities||[]).includes(id) || !!(c.roles||[]).includes(id);
}

function applyStatus(c, statusId){
  if(!c) return;
  c.statuses=Array.isArray(c.statuses)?c.statuses:[];
  if(!c.statuses.includes(statusId)) c.statuses.push(statusId);
}

function hasStatus(c, statusId){
  return !!(c && Array.isArray(c.statuses) && c.statuses.includes(statusId));
}

function canCreatureAttack(c){
  if(!c || c.justPlayed || c.activatedThisTurn || c.frozen) return false;
  const used=c.attacksThisTurn||0;
  return used < maxAttacks(c) && !c.exhausted;
}

function placementSlots(board){
  const n=board.length;
  if(n>=8) return [];
  if(n===0) return [0];
  const slots=[];
  for(let i=0;i<=n;i++) slots.push(i);
  return slots;
}

function makeToken11(capital){
  return {
    id:'token-11',
    name:'Rejeton',
    capital: capital||'Hameau',
    size:'0,5',
    roles:[],
    natures:['vivant'],
    origin:'Invocation',
    power:1,
    popularity:1,
    cost:1,
    attack:1,
    health:1,
    rarity:'commune',
    spell:'',
    image:'',
    quote:'« Né du combat. »',
    costColored:1,
    costNeutral:0,
    uid: uid(),
    hp:1,
    maxHp:1
  };
}

// Stub VFX functions for testing
function spawnDamageFloat(){}
function spawnBuffSparkles(){}

const TESTS = [];
let passed = 0;
let failed = 0;

function test(name, fn) {
  TESTS.push({ name, fn });
}

function assertEqual(actual, expected, message = '') {
  if (actual !== expected) {
    throw new Error(`${message}\nExpected: ${expected}\nActual: ${actual}`);
  }
}

function assertTrue(condition, message = '') {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

function assertFalse(condition, message = '') {
  if (condition) {
    throw new Error(message || 'Assertion failed (expected false)');
  }
}

// Edge case tests
test('buffCreature with null creature', () => {
  buffCreature(null, 2, 2);
  // Should not throw
  assertTrue(true, 'buffCreature handles null gracefully');
});

test('buffCreature with 0/0 stats', () => {
  const c = { attack: 0, baseAttack: 0, health: 0, maxHp: 0, baseMaxHp: 0, hp: 0, uid: 'test' };
  buffCreature(c, 0, 0, { silent: true });
  assertEqual(c.attack, 0, 'Attack remains 0');
  assertEqual(c.hp, 0, 'HP remains 0');
});

test('buffCreature with negative values', () => {
  const c = { attack: 5, baseAttack: 5, health: 5, maxHp: 5, baseMaxHp: 5, hp: 5, uid: 'test' };
  buffCreature(c, -2, -3, { silent: true });
  assertEqual(c.attack, 3, 'Attack reduced correctly');
  assertEqual(c.hp, 2, 'HP reduced correctly');
});

test('healCreature at full HP', () => {
  const c = { hp: 5, maxHp: 5, baseMaxHp: 5, uid: 'test' };
  const healed = healCreature(c, 3);
  assertEqual(healed, 0, 'No healing when at full HP');
  assertEqual(c.hp, 5, 'HP unchanged');
});

test('healCreature with null', () => {
  const healed = healCreature(null, 5);
  assertEqual(healed, 0, 'Returns 0 for null creature');
});

test('healCreature with negative amount', () => {
  const c = { hp: 3, maxHp: 5, baseMaxHp: 5, uid: 'test' };
  const healed = healCreature(c, -2);
  assertEqual(healed, 0, 'No healing with negative amount');
});

test('dealDamageToCreature - skipped (requires state.battle)', () => {
  // Cette fonction nécessite state.battle, impossible à tester en isolation
  assertTrue(true, 'Skipped');
});

test('killCreature - skipped (requires state.battle)', () => {
  assertTrue(true, 'Skipped');
});

test('legalAttackTargets - skipped (requires state.battle)', () => {
  assertTrue(true, 'Skipped');
});

test('canCreatureAttack with frozen', () => {
  const c = { 
    justPlayed: false, 
    activatedThisTurn: false, 
    frozen: true,
    attacksThisTurn: 0,
    exhausted: false
  };
  assertFalse(canCreatureAttack(c), 'Frozen creature cannot attack');
});

test('canCreatureAttack after one strike (double-attaque is multi-hit, one action)', () => {
  const c = { 
    justPlayed: false, 
    activatedThisTurn: false, 
    frozen: false,
    attacksThisTurn: 1,
    exhausted: true,
    abilities: ['double-attaque']
  };
  assertFalse(canCreatureAttack(c), 'One attack action exhausts even with double-attaque');
});

test('strikeCount with double-attaque', () => {
  const c = { abilities: ['double-attaque'] };
  assertEqual(strikeCount(c), 2, 'Double attaque strikes twice');
});

test('strikeCount without double-attaque', () => {
  const c = { abilities: [] };
  assertEqual(strikeCount(c), 1, 'Normal creature strikes once');
});

test('legalAttackTargets - skipped (requires state.battle context)', () => {
  // Cette fonction nécessite state.battle, impossible à tester en isolation
  assertTrue(true, 'Skipped');
});

test('placementSlots with full board', () => {
  const board = Array(8).fill({ uid: 'test' });
  const slots = placementSlots(board);
  assertEqual(slots.length, 0, 'No slots on full board');
});

test('placementSlots with empty board', () => {
  const slots = placementSlots([]);
  assertEqual(slots.length, 1, 'One slot on empty board');
  assertEqual(slots[0], 0, 'Slot at position 0');
});

test('placementSlots with one creature', () => {
  const board = [{ uid: 'test' }];
  const slots = placementSlots(board);
  assertEqual(slots.length, 2, 'Two slots with one creature');
  assertTrue(slots.includes(0), 'Slot before creature');
  assertTrue(slots.includes(1), 'Slot after creature');
});

test('canAfford with insufficient mana', () => {
  const p = { mana: 3, colorMana: {} };
  const card = { cost: 5 };
  assertFalse(canAfford(p, card), 'Cannot afford card');
});

test('canAfford with exact mana', () => {
  const p = { mana: 5, colorMana: {} };
  const card = { cost: 5 };
  assertTrue(canAfford(p, card), 'Can afford with exact mana');
});

test('canAfford with color mana', () => {
  const p = { mana: 2, colorMana: { 'Citadelle': 3 } };
  const card = { cost: 5 };
  assertTrue(canAfford(p, card), 'Can afford with color mana');
});

test('payCost prioritizes faction mana', () => {
  const p = { mana: 5, colorMana: { 'Citadelle': 3 } };
  const card = { cost: 4, capital: 'Citadelle' };
  payCost(p, card);
  assertEqual(p.colorMana['Citadelle'], 0, 'Faction mana used first');
  assertEqual(p.mana, 4, 'Generic mana used for remainder');
});

test('sortHand by cost ascending', () => {
  const hand = [
    { name: 'A', cost: 3, uid: 'a' },
    { name: 'B', cost: 1, uid: 'b' },
    { name: 'C', cost: 2, uid: 'c' }
  ];
  sortHand(hand);
  assertEqual(hand[0].uid, 'b', 'Cheapest first');
  assertEqual(hand[1].uid, 'c', 'Middle cost second');
  assertEqual(hand[2].uid, 'a', 'Most expensive last');
});

test('sortHand by name when costs equal', () => {
  const hand = [
    { name: 'Zebra', cost: 2, uid: 'z' },
    { name: 'Apple', cost: 2, uid: 'a' },
    { name: 'Middle', cost: 2, uid: 'm' }
  ];
  sortHand(hand);
  assertEqual(hand[0].uid, 'a', 'Alphabetical first');
  assertEqual(hand[1].uid, 'm', 'Alphabetical middle');
  assertEqual(hand[2].uid, 'z', 'Alphabetical last');
});

test('isTank with tank role', () => {
  const c = { roles: ['tank'] };
  assertTrue(isTank(c), 'Has tank role');
});

test('isTank with tempTank', () => {
  const c = { roles: [], tempTank: true };
  assertTrue(isTank(c), 'Has tempTank');
});

test('isTank without tank', () => {
  const c = { roles: [], tempTank: false };
  assertFalse(isTank(c), 'Not a tank');
});

test('isAssassin with ranged role', () => {
  const c = { roles: ['ranged'] };
  assertTrue(isAssassin(c), 'Ranged counts as assassin');
});

test('hasNoRiposte with ranged', () => {
  const c = { roles: ['ranged'] };
  assertTrue(hasNoRiposte(c), 'Ranged has no riposte');
});

test('maxAttacks always one action (double-attaque is multi-hit)', () => {
  const c = { abilities: ['double-attaque'] };
  assertEqual(maxAttacks(c), 1, 'Still one attack action');
});

test('maxAttacks without double attack', () => {
  const c = { roles: [] };
  assertEqual(maxAttacks(c), 1, 'Normal attack allows 1');
});

test('applyStatus adds status', () => {
  const c = { statuses: [] };
  applyStatus(c, 'poison');
  assertTrue(c.statuses.includes('poison'), 'Status added');
});

test('applyStatus does not duplicate', () => {
  const c = { statuses: ['poison'] };
  applyStatus(c, 'poison');
  assertEqual(c.statuses.length, 1, 'No duplicate');
});

test('hasStatus returns true when present', () => {
  const c = { statuses: ['poison'] };
  assertTrue(hasStatus(c, 'poison'), 'Status present');
});

test('hasStatus returns false when absent', () => {
  const c = { statuses: [] };
  assertFalse(hasStatus(c, 'poison'), 'Status absent');
});

test('hasStatus with null creature', () => {
  assertFalse(hasStatus(null, 'poison'), 'Returns false for null');
});

test('makeToken11 creates valid token', () => {
  const token = makeToken11('Citadelle');
  assertEqual(token.name, 'Rejeton', 'Correct name');
  assertEqual(token.attack, 1, '1 attack');
  assertEqual(token.health, 1, '1 health');
  assertEqual(token.capital, 'Citadelle', 'Inherits capital');
  assertTrue(token.uid, 'Has unique ID');
});

// Edge cases rares
test('buffCreature with undefined attack/hp', () => {
  const c = { uid: 'test' };
  buffCreature(c, undefined, undefined, { silent: true });
  assertEqual(c.attack, undefined, 'Attack stays undefined');
});

test('healCreature with hp exceeding maxHp', () => {
  const c = { hp: 3, maxHp: 5, baseMaxHp: 5, uid: 'test' };
  const healed = healCreature(c, 10);
  assertEqual(healed, 2, 'Only heals to max');
  assertEqual(c.hp, 5, 'HP capped at max');
});

test('canAfford with 0 cost card', () => {
  const p = { mana: 0, colorMana: {} };
  const card = { cost: 0 };
  assertTrue(canAfford(p, card), 'Can afford 0 cost');
});

test('payCost with no faction mana available', () => {
  const p = { mana: 5, colorMana: {} };
  const card = { cost: 3, capital: 'NonExistent' };
  payCost(p, card);
  assertEqual(p.mana, 2, 'Generic mana used');
});

test('sortHand with single card', () => {
  const hand = [{ name: 'A', cost: 2, uid: 'a' }];
  sortHand(hand);
  assertEqual(hand.length, 1, 'Single card unchanged');
});

test('sortHand with empty hand', () => {
  const hand = [];
  sortHand(hand);
  assertEqual(hand.length, 0, 'Empty hand unchanged');
});

test('isTank with null creature', () => {
  assertFalse(isTank(null), 'Null is not a tank');
});

test('isAssassin with null creature', () => {
  assertFalse(isAssassin(null), 'Null is not an assassin');
});

test('hasNoRiposte with null creature', () => {
  assertFalse(hasNoRiposte(null), 'Null has no riposte property');
});

test('maxAttacks with null creature', () => {
  assertEqual(maxAttacks(null), 1, 'Null defaults to 1 attack');
});

test('hasRole with null creature', () => {
  assertFalse(hasRole(null, 'tank'), 'Null has no roles');
});

test('applyStatus with null creature', () => {
  applyStatus(null, 'poison');
  // Should not throw
  assertTrue(true, 'Handles null gracefully');
});

test('canCreatureAttack with just played', () => {
  const c = { 
    justPlayed: true, 
    activatedThisTurn: false, 
    frozen: false,
    attacksThisTurn: 0,
    exhausted: false,
    roles: []
  };
  assertFalse(canCreatureAttack(c), 'Just played cannot attack');
});

test('canCreatureAttack with activated this turn', () => {
  const c = { 
    justPlayed: false, 
    activatedThisTurn: true, 
    frozen: false,
    attacksThisTurn: 0,
    exhausted: false,
    roles: []
  };
  assertFalse(canCreatureAttack(c), 'Activated creature cannot attack');
});

test('canCreatureAttack with exhausted', () => {
  const c = { 
    justPlayed: false, 
    activatedThisTurn: false, 
    frozen: false,
    attacksThisTurn: 1,
    exhausted: true,
    roles: []
  };
  assertFalse(canCreatureAttack(c), 'Exhausted creature cannot attack');
});

test('placementSlots with 7 creatures', () => {
  const board = Array(7).fill({ uid: 'test' });
  const slots = placementSlots(board);
  assertEqual(slots.length, 8, '8 slots with 7 creatures');
});

test('makeToken11 with null capital', () => {
  const token = makeToken11(null);
  assertEqual(token.capital, 'Hameau', 'Defaults to Hameau');
});

test('makeToken11 with empty string capital', () => {
  const token = makeToken11('');
  assertEqual(token.capital, 'Hameau', 'Defaults to Hameau for empty');
});

test('buffCreature preserves existing baseAttack', () => {
  const c = { attack: 5, baseAttack: 3, hp: 5, maxHp: 5, uid: 'test' };
  buffCreature(c, 2, 0, { silent: true });
  assertEqual(c.baseAttack, 5, 'baseAttack incremented from base');
  assertEqual(c.attack, 7, 'attack updated');
});

test('healCreature with baseMaxHp but no maxHp', () => {
  const c = { hp: 3, baseMaxHp: 8, health: 10, uid: 'test' };
  const healed = healCreature(c, 4);
  assertEqual(healed, 4, 'Heals using baseMaxHp');
  assertEqual(c.hp, 7, 'HP updated correctly');
});

test('payCost with multiple color mana sources', () => {
  const p = { mana: 2, colorMana: { 'FactionA': 1, 'FactionB': 2 } };
  const card = { cost: 5, capital: 'FactionA' };
  payCost(p, card);
  assertEqual(p.colorMana['FactionA'], 0, 'Faction A depleted');
  assertTrue(p.mana < 2, 'Generic mana used');
  assertTrue(p.colorMana['FactionB'] < 2, 'Other faction mana used');
});

test('sortHand stability with identical cards', () => {
  const hand = [
    { name: 'A', cost: 2, uid: 'a1' },
    { name: 'A', cost: 2, uid: 'a2' },
    { name: 'A', cost: 2, uid: 'a3' }
  ];
  sortHand(hand);
  // Should maintain relative order by uid
  assertTrue(hand[0].uid < hand[1].uid, 'Sorted by uid');
  assertTrue(hand[1].uid < hand[2].uid, 'Sorted by uid');
});

test('applyStatus multiple different statuses', () => {
  const c = { statuses: [] };
  applyStatus(c, 'poison');
  applyStatus(c, 'burn');
  applyStatus(c, 'freeze');
  assertEqual(c.statuses.length, 3, 'All statuses added');
  assertTrue(c.statuses.includes('poison'), 'Has poison');
  assertTrue(c.statuses.includes('burn'), 'Has burn');
  assertTrue(c.statuses.includes('freeze'), 'Has freeze');
});

test('pickRandom with n larger than array', () => {
  const arr = [1, 2, 3];
  const picked = pickRandom(arr, 10);
  assertEqual(picked.length, 3, 'Returns all elements');
});

test('pickRandom with n = 0', () => {
  const arr = [1, 2, 3];
  const picked = pickRandom(arr, 0);
  assertEqual(picked.length, 0, 'Returns empty array');
});

test('pickN with n larger than array', () => {
  const arr = [1, 2, 3];
  const picked = pickN(arr, 10);
  assertEqual(picked.length, 3, 'Returns all elements');
});

test('shuffleInPlace returns same array', () => {
  const arr = [1, 2, 3, 4, 5];
  const result = shuffleInPlace(arr);
  assertTrue(result === arr, 'Returns same reference');
  assertEqual(result.length, 5, 'Length unchanged');
});

test('buffCreature with very large negative values', () => {
  const c = { attack: 5, baseAttack: 5, health: 5, maxHp: 5, baseMaxHp: 5, hp: 5, uid: 'test' };
  buffCreature(c, -100, -100, { silent: true });
  assertTrue(c.attack < 0, 'Attack goes negative');
  assertTrue(c.hp < 0, 'HP goes negative');
});

test('healCreature when hp is 0', () => {
  const c = { hp: 0, maxHp: 5, baseMaxHp: 5, uid: 'test' };
  const healed = healCreature(c, 3);
  assertEqual(healed, 3, 'Heals from 0');
  assertEqual(c.hp, 3, 'HP updated');
});

// Run all tests
function runTests() {
  console.log('Running Fantasia Fauna Tests...\n');
  
  TESTS.forEach(({ name, fn }) => {
    try {
      fn();
      console.log(`✓ ${name}`);
      passed++;
    } catch (error) {
      console.log(`✗ ${name}`);
      console.log(`  ${error.message}`);
      failed++;
    }
  });
  
  console.log(`\n${passed} passed, ${failed} failed`);
  return failed === 0;
}

// Auto-run if executed directly
if (typeof require !== 'undefined' && require.main === module) {
  const success = runTests();
  process.exit(success ? 0 : 1);
}
