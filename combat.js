/* Combat — plateau type Hearthstone, decks 40 / 4 factions */

function uid(){ return crypto.randomUUID?.() || Math.random().toString(36).slice(2,10); }
function shuffleInPlace(arr){
  for(let i=arr.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [arr[i],arr[j]]=[arr[j],arr[i]]; }
  return arr;
}
function pickN(arr,n){
  const copy=arr.slice(); shuffleInPlace(copy); return copy.slice(0,n);
}
function cloneCard(c){
  return {
    ...c,
    uid: uid(),
    hp: c.health,
    maxHp: c.health,
    canAttack: false,
    exhausted: false,
    justPlayed: true,
  };
}
function allFactions(){
  return Array.from(new Set(CREATURES.map(c=>c.capital))).sort((a,b)=>a.localeCompare(b,'fr'));
}
function buildDeck(factions, size=40){
  const pool=CREATURES.filter(c=>factions.includes(c.capital));
  if(pool.length < size){
    const deck=[];
    while(deck.length < size){
      deck.push(...pickN(pool, Math.min(size-deck.length, pool.length)));
    }
    return shuffleInPlace(deck).slice(0,size).map(cloneCard);
  }
  return pickN(pool, size).map(cloneCard);
}
function colorManaTotal(p){
  return Object.values(p.colorMana||{}).reduce((a,b)=>a+b,0);
}
function canAfford(p, card){
  const need = card.cost || 0;
  return ((p.mana || 0) + colorManaTotal(p)) >= need;
}
function payCost(p, card){
  let need = card.cost || 0;
  const faction = card.capital;
  // D'abord l'élément de la faction, puis l'incolore, puis le reste.
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
function combatLog(msg){
  const b=state.battle;
  if(!b) return;
  b.log.unshift(msg);
  b.log=b.log.slice(0,40);
}
function makeSide(factions){
  const deck=buildDeck(factions,40);
  const hand=deck.splice(0,7);
  return {
    hp:30, mana:0, maxMana:0, turnCount:0,
    colorMana:Object.fromEntries(factions.map(f=>[f,0])),
    deck, hand, board:[],
  };
}
function startCombat(){
  const factions=pickN(allFactions(),4);
  const playerFirst=Math.random()<0.5;
  state.tab='combat';
  state.battle={
    factions,
    turn:1,
    active: playerFirst ? 'player' : 'enemy',
    phase:'main',
    player: makeSide(factions),
    enemy: makeSide(factions),
    selectedHandUid:null,
    insertAt:null,
    attackSource:null,
    aimLock:null,
    winner:null,
    coin: playerFirst ? 'Tu commences' : 'L’adversaire commence',
    log:[],
    anim:null,
  };
  combatLog(`Factions: ${factions.join(', ')}. ${state.battle.coin} (pile ou face).`);
  beginTurn(state.battle.active, true);
  render();
}
function beginTurn(who, isOpening=false){
  const b=state.battle; if(!b||b.winner) return;
  b.active=who; b.phase='main'; b.selectedHandUid=null; b.insertAt=null; b.attackSource=null; b.aimLock=null;
  const p=b[who];
  p.turnCount += 1;
  p.maxMana=Math.min(10, p.turnCount);
  p.mana=p.maxMana;
  const fi=(p.turnCount-1) % b.factions.length;
  const col=b.factions[fi];
  if(colorManaTotal(p)<10){
    p.colorMana[col]=(p.colorMana[col]||0)+1;
    combatLog(`${who==='player'?'Toi':'Adverse'} : +1 mana ${col}.`);
  }
  const draws = isOpening ? 0 : 2;
  for(let i=0;i<draws;i++) drawOne(p, who);
  p.board.forEach(c=>{ c.canAttack=true; c.exhausted=false; c.justPlayed=false; });
  combatLog(`Tour ${p.turnCount} — ${who==='player'?'à toi':'adversaire'} (mana ${p.mana}/${p.maxMana}).`);
  if(who==='enemy') setTimeout(()=>enemyTurn(), 350);
}
function drawOne(p, who){
  if(!p.deck.length){
    p.hp=Math.max(0,p.hp-1);
    combatLog(`${who==='player'?'Tu':'Il'} fatigue (-1 tour).`);
    checkWinner();
    return;
  }
  if(p.hand.length>=10){ p.deck.shift(); combatLog('Main pleine: carte brûlée.'); return; }
  p.hand.push(p.deck.shift());
}
function checkWinner(){
  const b=state.battle; if(!b) return;
  const pDead=b.player.hp<=0, eDead=b.enemy.hp<=0;
  if(pDead && eDead){ b.winner='draw'; b.phase='ended'; combatLog('Match nul: les deux tours tombent.'); }
  else if(pDead){ b.winner='enemy'; b.phase='ended'; combatLog('Défaite: ta tour est détruite.'); }
  else if(eDead){ b.winner='player'; b.phase='ended'; combatLog('Victoire: la tour adverse tombe.'); }
}
function placementSlots(board){
  const n=board.length;
  if(n>=8) return [];
  if(n===0) return [0];
  const slots=[];
  for(let i=0;i<=n;i++) slots.push(i);
  return slots;
}
function selectHandCard(uid){
  if(_suppressClick) return;
  const b=state.battle; if(!b||b.active!=='player'||b.phase!=='main'||b.winner) return;
  const card=b.player.hand.find(c=>c.uid===uid);
  if(!card) return;
  if(!canAfford(b.player, card)){ combatLog(`Pas assez de mana pour ${card.name}.`); render(); return; }
  if(b.player.board.length>=8){ combatLog('Plateau plein (8).'); render(); return; }
  b.selectedHandUid = b.selectedHandUid===uid ? null : uid;
  b.insertAt = b.selectedHandUid ? placementSlots(b.player.board)[0] : null;
  render();
}
let _ptrDrag = null; // { uid, startX, startY, active, ghost }
let _suppressClick = false;
function clearPtrDrag(){
  if(_ptrDrag?.ghost) _ptrDrag.ghost.remove();
  document.querySelectorAll('.cbt-row.drop-hot,.cbt-slot.drop-hot,.cbt-card.dragging').forEach(el=>{
    el.classList.remove('drop-hot','dragging');
  });
  _ptrDrag = null;
}
function playFromHandAt(uid, idx){
  const b=state.battle;
  if(!b||b.active!=='player'||b.phase!=='main'||b.winner) return false;
  const card=b.player.hand.find(c=>c.uid===uid);
  if(!card) return false;
  if(!canAfford(b.player, card)){ combatLog(`Pas assez de mana pour ${card.name}.`); render(); return false; }
  if(b.player.board.length>=8){ combatLog('Plateau plein (8).'); render(); return false; }
  const slots=placementSlots(b.player.board);
  const at = (idx==null || idx==='' || !slots.includes(Number(idx))) ? (slots[0] ?? b.player.board.length) : Number(idx);
  playCardOn(b.player, card, at, 'player');
  b.selectedHandUid=null; b.insertAt=null;
  render();
  return true;
}
function onHandPointerDown(ev, uid){
  if(ev.button!=null && ev.button!==0) return;
  const b=state.battle;
  if(!b||b.active!=='player'||b.phase!=='main'||b.winner) return;
  const card=b.player.hand.find(c=>c.uid===uid);
  if(!card || !canAfford(b.player, card) || b.player.board.length>=8) return;
  _ptrDrag = { uid, startX: ev.clientX, startY: ev.clientY, active: false, ghost: null, el: ev.currentTarget };
  try{ ev.currentTarget?.setPointerCapture?.(ev.pointerId); }catch(_){}
  window.addEventListener('pointermove', onHandPointerMove);
  window.addEventListener('pointerup', onHandPointerUp, { once: true });
  window.addEventListener('pointercancel', onHandPointerUp, { once: true });
}
function onHandPointerMove(ev){
  if(!_ptrDrag) return;
  const dx=ev.clientX-_ptrDrag.startX, dy=ev.clientY-_ptrDrag.startY;
  if(!_ptrDrag.active && (dx*dx+dy*dy) < 36) return;
  if(!_ptrDrag.active){
    _ptrDrag.active = true;
    const b=state.battle;
    if(b){
      b.selectedHandUid=_ptrDrag.uid;
      b.insertAt=placementSlots(b.player.board)[0] ?? 0;
      // Affiche les slots sans re-render complet (sinon on perd le drag)
      document.querySelectorAll('.cbt-row.player').forEach(row=>row.classList.add('drop-hot'));
    }
    _ptrDrag.el?.classList.add('dragging');
    const ghost=document.createElement('div');
    ghost.className='cbt-drag-ghost';
    ghost.textContent = (b?.player.hand.find(c=>c.uid===_ptrDrag.uid)?.name) || 'Carte';
    document.body.appendChild(ghost);
    _ptrDrag.ghost = ghost;
  }
  if(_ptrDrag.ghost){
    _ptrDrag.ghost.style.transform = `translate(${ev.clientX+12}px, ${ev.clientY+12}px)`;
  }
  document.querySelectorAll('.cbt-row.player,.cbt-slot').forEach(el=>{
    const r=el.getBoundingClientRect();
    const over = ev.clientX>=r.left && ev.clientX<=r.right && ev.clientY>=r.top && ev.clientY<=r.bottom;
    el.classList.toggle('drop-hot', over);
  });
}
function onHandPointerUp(ev){
  window.removeEventListener('pointermove', onHandPointerMove);
  if(!_ptrDrag) return;
  const wasActive = _ptrDrag.active;
  const uid = _ptrDrag.uid;
  const hot = document.elementFromPoint(ev.clientX, ev.clientY);
  const slot = hot?.closest?.('.cbt-slot');
  const row = hot?.closest?.('.cbt-row.player');
  clearPtrDrag();
  if(!wasActive) return; // simple click → laisser onclick gérer
  _suppressClick = true;
  setTimeout(()=>{ _suppressClick = false; }, 0);
  if(slot){
    const idx = Number(slot.getAttribute('onclick')?.match(/playSelectedAt\((\d+)\)/)?.[1] ?? NaN);
    playFromHandAt(uid, Number.isFinite(idx) ? idx : null);
  } else if(row){
    playFromHandAt(uid, null);
  }
}
function onHandDragStart(ev, uid){
  const b=state.battle;
  if(!b||b.active!=='player'||b.phase!=='main'||b.winner){
    ev.preventDefault();
    return;
  }
  const card=b.player.hand.find(c=>c.uid===uid);
  if(!card){ ev.preventDefault(); return; }
  if(!canAfford(b.player, card) || b.player.board.length>=8){
    ev.preventDefault();
    combatLog(`Pas assez de mana pour ${card.name}.`);
    render();
    return;
  }
  // Si le drag pointeur est déjà actif, laisser le HTML5 de côté
  if(_ptrDrag?.active){ ev.preventDefault(); return; }
  clearPtrDrag();
  ev.currentTarget?.querySelectorAll('img').forEach(img=>{ img.setAttribute('draggable','false'); });
  b.selectedHandUid=uid;
  b.insertAt=placementSlots(b.player.board)[0] ?? 0;
  try{
    ev.dataTransfer.setData('text/plain', uid);
    ev.dataTransfer.setData('application/x-ff-card', uid);
    ev.dataTransfer.effectAllowed='move';
  }catch(_){}
  ev.currentTarget?.classList.add('dragging');
}
function onHandDragEnd(ev){
  ev.currentTarget?.classList.remove('dragging');
  document.querySelectorAll('.cbt-row.drop-hot,.cbt-slot.drop-hot').forEach(el=>el.classList.remove('drop-hot'));
}
function onBoardDragOver(ev){
  const b=state.battle;
  if(!b||b.active!=='player'||b.phase!=='main'||b.winner) return;
  if(b.player.board.length>=8) return;
  // Obligatoire pour autoriser le drop (sinon croix rouge).
  ev.preventDefault();
  if(ev.dataTransfer) ev.dataTransfer.dropEffect='move';
  ev.currentTarget?.classList.add('drop-hot');
}
function onBoardDragLeave(ev){
  // Ignore leave vers un enfant
  if(ev.currentTarget.contains?.(ev.relatedTarget)) return;
  ev.currentTarget?.classList.remove('drop-hot');
}
function onBoardDrop(ev, idx){
  ev.preventDefault();
  ev.stopPropagation();
  ev.currentTarget?.classList.remove('drop-hot');
  const b=state.battle;
  if(!b||b.active!=='player'||b.phase!=='main'||b.winner) return;
  let uid='';
  try{ uid=ev.dataTransfer.getData('application/x-ff-card') || ev.dataTransfer.getData('text/plain'); }catch(_){}
  uid = uid || b.selectedHandUid;
  playFromHandAt(uid, idx);
}
function playSelectedAt(idx){
  const b=state.battle; if(!b||b.active!=='player'||b.phase!=='main') return;
  const card=b.player.hand.find(c=>c.uid===b.selectedHandUid);
  if(!card) return;
  playCardOn(b.player, card, idx, 'player');
  b.selectedHandUid=null; b.insertAt=null;
  render();
}
function playCardOn(side, card, idx, who){
  if(!canAfford(side, card) || side.board.length>=8) return false;
  payCost(side, card);
  side.hand=side.hand.filter(c=>c.uid!==card.uid);
  const i=Math.max(0, Math.min(idx, side.board.length));
  side.board.splice(i, 0, card);
  card.justPlayed=true; card.canAttack=false;
  combatLog(`${who==='player'?'Tu invoques':'Adverse invoque'} ${card.name} (${card.cost}).`);
  return true;
}
/* —— Ciblage type Hearthstone : flèche jaune vers tour ou mignon —— */
let _aimMove=null;
let _aimKey=null;
function teardownAim(){
  if(_aimMove){
    window.removeEventListener('pointermove', _aimMove);
    window.removeEventListener('resize', _aimMove);
    _aimMove=null;
  }
  if(_aimKey){ window.removeEventListener('keydown', _aimKey); _aimKey=null; }
  document.querySelectorAll('.cbt-target-hot').forEach(el=>el.classList.remove('cbt-target-hot'));
}
function canCreatureAttack(c){
  return !!(c && c.canAttack && !c.exhausted && !c.justPlayed);
}
function isTank(c){
  return typeof hasAbility==='function' ? hasAbility(c,'tank') : !!(c?.roles||[]).includes('tank');
}
/** Cibles légales pour un assaut (Tank force le focus). */
function legalAttackTargets(atkSide){
  const b=state.battle;
  const defSide=atkSide==='player'?'enemy':'player';
  const board=b[defSide].board;
  const tanks=board.filter(isTank);
  if(tanks.length){
    return { face:false, minions:tanks, forcedTank:true };
  }
  return { face:true, minions:board.slice(), forcedTank:false };
}
function selectAttacker(uid){
  const b=state.battle; if(!b||b.active!=='player'||b.phase!=='main'||b.winner) return;
  const c=b.player.board.find(x=>x.uid===uid);
  if(!c) return;
  if(!canCreatureAttack(c)){
    combatLog(c.justPlayed || !c.canAttack
      ? `${c.name} a le mal d’invocation : elle attaquera au prochain tour.`
      : `${c.name} a déjà attaqué ce tour.`);
    render();
    return;
  }
  if(b.attackSource===uid){ cancelAttack(); return; }
  b.selectedHandUid=null; b.insertAt=null;
  b.attackSource=uid; b.aimLock=null;
  const legal=legalAttackTargets('player');
  combatLog(legal.forcedTank
    ? `${c.name} vise… un Tank adverse protège le reste — cible-le.`
    : `${c.name} vise… choisis une cible (tour ou mignon).`);
  render();
}
function cancelAttack(){
  const b=state.battle; if(!b) return;
  if(!b.attackSource && !b.aimLock) return;
  b.attackSource=null; b.aimLock=null;
  teardownAim();
  render();
}
function resolveCombatStrike(atkSide, atkUid, target){
  const b=state.battle; if(!b) return false;
  const defSide = atkSide==='player' ? 'enemy' : 'player';
  const A=b[atkSide], D=b[defSide];
  const atk=A.board.find(c=>c.uid===atkUid);
  if(!atk || !canCreatureAttack(atk)) return false;
  const legal=legalAttackTargets(atkSide);
  if(target.type==='face'){
    if(!legal.face){
      combatLog(`Impossible : un Tank adverse force le combat.`);
      return false;
    }
  } else {
    const def=D.board.find(c=>c.uid===target.uid);
    if(!def) return false;
    if(legal.forcedTank && !isTank(def)){
      combatLog(`Impossible : tu dois d’abord frapper un Tank.`);
      return false;
    }
    if(!legal.minions.some(c=>c.uid===def.uid)) return false;
  }
  atk.exhausted=true; atk.canAttack=false;
  if(target.type==='face'){
    D.hp=Math.max(0, D.hp-atk.attack);
    const tower=atkSide==='player'?'la tour adverse':'ta tour';
    combatLog(`${atk.name} frappe ${tower} pour ${atk.attack} (${D.hp}/30).`);
  } else {
    const def=D.board.find(c=>c.uid===target.uid);
    if(!def){ atk.exhausted=false; atk.canAttack=true; return false; }
    const tankNote=isTank(def)?' (Tank)':'';
    combatLog(`${atk.name} (${atk.attack}) charge ${def.name}${tankNote} — riposte ${def.attack}.`);
    def.hp-=atk.attack;
    atk.hp-=def.attack;
    if(def.hp<=0){ D.board=D.board.filter(c=>c.uid!==def.uid); combatLog(`${def.name} meurt.`); }
    if(atk.hp<=0){ A.board=A.board.filter(c=>c.uid!==atk.uid); combatLog(`${atk.name} meurt.`); }
  }
  checkWinner();
  return true;
}
function confirmAttackFace(){
  const b=state.battle;
  if(!b||b.active!=='player'||b.phase!=='main'||!b.attackSource) return;
  if(!legalAttackTargets('player').face){
    combatLog('Un Tank adverse te barre la route vers la tour.');
    render();
    return;
  }
  const src=b.attackSource;
  b.attackSource=null; b.aimLock=null;
  teardownAim();
  resolveCombatStrike('player', src, {type:'face'});
  render();
}
function confirmAttackMinion(uid){
  const b=state.battle;
  if(!b||b.active!=='player'||b.phase!=='main'||!b.attackSource) return;
  const legal=legalAttackTargets('player');
  if(!legal.minions.some(c=>c.uid===uid)){
    combatLog(legal.forcedTank
      ? 'Cible invalide : attaque un Tank.'
      : 'Cible invalide.');
    render();
    return;
  }
  const src=b.attackSource;
  b.attackSource=null; b.aimLock=null;
  teardownAim();
  resolveCombatStrike('player', src, {type:'minion', uid});
  render();
}
function chooseEnemyTarget(atk){
  const legal=legalAttackTargets('enemy');
  const board=legal.minions;
  if(!board.length) return legal.face ? {type:'face'} : {type:'face'};
  const lethal=board.filter(c=>c.hp<=atk.attack).sort((a,c)=>c.attack-a.attack || a.hp-c.hp);
  if(lethal.length && Math.random()<0.8) return {type:'minion', uid:lethal[0].uid};
  if(legal.forcedTank || Math.random()<0.55){
    const soft=board.slice().sort((a,c)=>a.hp-c.hp || c.attack-a.attack)[0];
    return {type:'minion', uid:soft.uid};
  }
  if(legal.face) return {type:'face'};
  return {type:'minion', uid:board[0].uid};
}
function endPlayerTurn(){
  const b=state.battle; if(!b||b.active!=='player'||b.winner) return;
  if(b.phase!=='main') return;
  b.selectedHandUid=null; b.attackSource=null; b.aimLock=null;
  teardownAim();
  beginTurn('enemy');
  render();
}
function enemyTurn(){
  const b=state.battle; if(!b||b.winner||b.active!=='enemy') return;
  let plays=0;
  while(plays<4 && b.enemy.board.length<8){
    const playable=b.enemy.hand.filter(c=>canAfford(b.enemy,c)).sort((a,c)=>a.cost-c.cost||c.attack-a.attack);
    if(!playable.length) break;
    const card=playable[0];
    const slots=placementSlots(b.enemy.board);
    const idx=slots[Math.floor(slots.length/2)] ?? b.enemy.board.length;
    if(!playCardOn(b.enemy, card, idx, 'enemy')) break;
    plays++;
  }
  const attackers=b.enemy.board.filter(c=>canCreatureAttack(c)).map(c=>c.uid);
  if(!attackers.length){
    checkWinner();
    render();
    if(!b.winner) setTimeout(()=>{ beginTurn('player'); render(); }, 450);
    return;
  }
  b.phase='enemy_attack';
  combatLog(`L’adversaire engage ${attackers.length} assaut(s).`);
  playEnemyAttacks(attackers, 0);
}
function playEnemyAttacks(uids, i){
  const b=state.battle;
  if(!b||b.winner){ teardownAim(); render(); return; }
  if(i>=uids.length){
    b.phase='main'; b.attackSource=null; b.aimLock=null;
    teardownAim();
    render();
    if(!b.winner) setTimeout(()=>{ beginTurn('player'); render(); }, 420);
    return;
  }
  const atkUid=uids[i];
  const atk=b.enemy.board.find(c=>c.uid===atkUid);
  if(!atk || !canCreatureAttack(atk)){
    playEnemyAttacks(uids, i+1);
    return;
  }
  const target=chooseEnemyTarget(atk);
  b.attackSource=atkUid;
  b.aimLock=target;
  render();
  setTimeout(()=>{
    const still=state.battle;
    if(!still||still.winner){ teardownAim(); render(); return; }
    still.attackSource=null; still.aimLock=null;
    teardownAim();
    resolveCombatStrike('enemy', atkUid, target);
    render();
    setTimeout(()=>playEnemyAttacks(uids, i+1), 360);
  }, 580);
}
function aimCurvePath(x1,y1,x2,y2){
  const dx=x2-x1, dy=y2-y1;
  const dist=Math.hypot(dx,dy)||1;
  const mx=(x1+x2)/2, my=(y1+y2)/2;
  const bulge=Math.min(90, 28+dist*0.18);
  const cx=mx + (dx>0?-1:1)*bulge*0.12;
  const cy=my - bulge;
  return `M ${x1.toFixed(1)} ${y1.toFixed(1)} Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`;
}
function elCenter(el){
  if(!el) return null;
  const r=el.getBoundingClientRect();
  return {x:r.left+r.width/2, y:r.top+r.height/2};
}
function resolveAimTipEl(lock){
  if(!lock) return null;
  if(lock.type==='face'){
    const b=state.battle;
    const src=b?.attackSource;
    const fromEnemy=!!b?.enemy.board.some(c=>c.uid===src);
    return document.querySelector(fromEnemy ? '.cbt-tower.ally' : '.cbt-tower.enemy');
  }
  return document.querySelector(`.cbt-card[data-uid="${lock.uid}"]`);
}
function drawAimArrow(fromEl, tipX, tipY, hotEl){
  const svg=document.querySelector('.cbt-aim-layer');
  const path=svg?.querySelector('.cbt-aim-stroke');
  const glow=svg?.querySelector('.cbt-aim-glow');
  if(!svg||!path||!fromEl) return;
  const from=elCenter(fromEl);
  if(!from) return;
  svg.setAttribute('viewBox', `0 0 ${window.innerWidth} ${window.innerHeight}`);
  svg.setAttribute('width', window.innerWidth);
  svg.setAttribute('height', window.innerHeight);
  const d=aimCurvePath(from.x, from.y, tipX, tipY);
  path.setAttribute('d', d);
  if(glow) glow.setAttribute('d', d);
  document.querySelectorAll('.cbt-target-hot').forEach(el=>el.classList.remove('cbt-target-hot'));
  if(hotEl) hotEl.classList.add('cbt-target-hot');
}
function syncAttackAim(){
  teardownAim();
  const b=state.battle;
  if(!b?.attackSource) return;
  const fromEl=document.querySelector(`.cbt-card[data-uid="${b.attackSource}"]`);
  const svg=document.querySelector('.cbt-aim-layer');
  if(!fromEl||!svg) return;

  const paintLocked=()=>{
    const tipEl=resolveAimTipEl(b.aimLock);
    const tip=elCenter(tipEl) || elCenter(fromEl);
    drawAimArrow(fromEl, tip.x, tip.y, tipEl);
  };

  if(b.aimLock){
    paintLocked();
    _aimMove=()=>paintLocked();
    window.addEventListener('resize', _aimMove);
    return;
  }

  const onMove=(ev)=>{
    const hot=document.elementFromPoint(ev.clientX, ev.clientY);
    const targetCard=hot?.closest?.('.cbt-card.cbt-target');
    const targetTower=hot?.closest?.('.cbt-tower.cbt-target');
    const tipEl=targetCard||targetTower||null;
    const tip=tipEl ? elCenter(tipEl) : {x:ev.clientX, y:ev.clientY};
    drawAimArrow(fromEl, tip.x, tip.y, tipEl);
  };
  _aimMove=onMove;
  window.addEventListener('pointermove', onMove);
  const from=elCenter(fromEl);
  drawAimArrow(fromEl, from.x, from.y-48, null);

  _aimKey=(ev)=>{ if(ev.key==='Escape'){ ev.preventDefault(); cancelAttack(); } };
  window.addEventListener('keydown', _aimKey);
}

function miniCard(c, opts={}){
  const fm=factionMana(c);
  const sel=opts.selected?' selected':'';
  const atk=opts.attacking?' attacking':'';
  const sick=opts.summonSick || ((c.justPlayed||!c.canAttack) && !opts.exhausted) ? ' sick':'';
  const exhausted=opts.exhausted?' exhausted':'';
  const ready=opts.ready?' ready':'';
  const aiming=opts.aiming?' aiming':'';
  const target=opts.targetable?' cbt-target':'';
  const tank=isTank(c)?' is-tank':'';
  const blocked=opts.blocked?' cbt-blocked':'';
  const affordable=opts.affordable!==false;
  const unafford=opts.checkAfford && !affordable ? ' unaffordable':'';
  const click=opts.onclick?`onclick="${opts.onclick}"`:'';
  const drag=opts.draggable
    ? `onpointerdown="onHandPointerDown(event,'${c.uid}')"`
    : '';
  const artSrc=(typeof currentImageFor==='function' ? currentImageFor(c) : null) || (imageVariantsFor(c)[0] || c.image || '');
  const img=artSrc?`<img src="${encodeURI(artSrc)}" alt="" draggable="false">`:'';
  const title = opts.summonSick ? ' title="Mal d’invocation — attaque au prochain tour"'
    : opts.exhausted ? ' title="Déjà utilisée"'
    : opts.aiming ? ' title="Attaquante — choisis une cible"'
    : opts.blocked ? ' title="Protégé par un Tank — cible invalide"'
    : opts.targetable ? (opts.forcedTank ? ' title="Tank — cible obligatoire"' : ' title="Cible valide — cliquer pour attaquer"')
    : opts.ready ? ' title="Prête — cliquer pour attaquer"'
    : '';
  const cls=`cbt-card${sel}${atk}${sick}${exhausted}${ready}${aiming}${target}${tank}${blocked}${unafford}${opts.draggable?' can-drag':''}`;
  const style=`style="--faction:${fm.color}"`;
  const abilityBits=typeof abilitiesHtml==='function' ? abilitiesHtml(c,{className:'cbt-abilities'}) : (isTank(c)?`<div class="ability-row cbt-abilities"><span class="ability-tag ability-tank"><em>Tank</em></span></div>`:'');
  const badge = opts.aiming?'<em class="cbt-badge atk-badge">Vise…</em>'
    : opts.targetable && opts.forcedTank?'<em class="cbt-badge tank-badge">Tank</em>'
    : opts.targetable?'<em class="cbt-badge target-badge">Cible</em>'
    : opts.blocked?'<em class="cbt-badge blocked-badge">Protégé</em>'
    : opts.summonSick?'<em class="cbt-badge sick-badge">Sommeil</em>'
    : opts.ready?'<em class="cbt-badge ready-badge">Prête</em>'
    : opts.exhausted?'<em class="cbt-badge done-badge">Fatiguée</em>'
    : (isTank(c) && !opts.hand ? '<em class="cbt-badge tank-badge">Tank</em>' : '');
  if(opts.hand){
    return `<div role="button" tabindex="0" class="${cls}" data-uid="${c.uid}" ${style} ${click} ${drag}
      onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();${opts.onclick||''}}">
      <span class="cbt-cost">${manaCostHtml(c)}</span>
      <div class="cbt-art">${img}</div>
      <strong>${c.name}</strong>
      ${abilityBits}
      <footer><b>${c.attack}</b><span>${c.hp ?? c.health}</span></footer>
    </div>`;
  }
  return `<button type="button" class="${cls}" data-uid="${c.uid}" ${style} ${click}${title}>
    <span class="cbt-cost">${manaCostHtml(c)}</span>
    <div class="cbt-art">${img}</div>
    <strong>${c.name}</strong>
    ${abilityBits}
    ${badge}
    <footer><b>${c.attack}</b><span>${c.hp ?? c.health}</span></footer>
  </button>`;
}
function renderBoardRow(side, who){
  const b=state.battle;
  const board=b[who].board;
  const isPlayer=who==='player';
  const aiming=!!b.attackSource && (b.phase==='main' || b.phase==='enemy_attack');
  const playerAiming=b.active==='player' && b.phase==='main' && !!b.attackSource
    && b.player.board.some(c=>c.uid===b.attackSource);
  const legal=playerAiming ? legalAttackTargets('player') : null;
  const canPlace=isPlayer && b.active==='player' && b.phase==='main' && b.selectedHandUid && !b.winner && !b.attackSource;
  const canDrop=isPlayer && b.active==='player' && b.phase==='main' && !b.winner && board.length<8 && !b.attackSource;
  const slots=canPlace?placementSlots(board):[];
  const parts=[];
  for(let i=0;i<=board.length;i++){
    if(slots.includes(i)){
      parts.push(`<button type="button" class="cbt-slot ${b.insertAt===i?'hot':''}" onclick="playSelectedAt(${i})"
        ondragover="onBoardDragOver(event)" ondragleave="onBoardDragLeave(event)" ondrop="onBoardDrop(event,${i})" title="Poser ici">+</button>`);
    }
    if(i<board.length){
      const c=board[i];
      const isSource=b.attackSource===c.uid;
      if(who==='enemy' && playerAiming){
        const ok=legal.minions.some(x=>x.uid===c.uid);
        parts.push(miniCard(c,{
          onclick: ok ? `confirmAttackMinion('${c.uid}')` : '',
          targetable:ok,
          blocked:!ok,
          forcedTank:!!legal.forcedTank,
          selected:false,
        }));
      } else if(isPlayer && b.active==='player' && b.phase==='main' && !b.winner){
        const ready=canCreatureAttack(c);
        parts.push(miniCard(c,{
          onclick:`selectAttacker('${c.uid}')`,
          selected:isSource,
          aiming:isSource,
          ready:ready && !isSource,
          summonSick: !!(c.justPlayed || (!c.canAttack && !c.exhausted)),
          exhausted: !!c.exhausted,
          attacking:isSource,
        }));
      } else {
        parts.push(miniCard(c,{
          aiming:isSource,
          attacking:isSource,
          summonSick: !!(c.justPlayed || (!c.canAttack && !c.exhausted)),
          exhausted: !!c.exhausted,
          ready: !isPlayer && canCreatureAttack(c) && aiming,
        }));
      }
    }
  }
  if(!board.length && !canPlace) parts.push('<em class="cbt-empty">Terrain vide — glisse une carte ici</em>');
  const dropAttrs=canDrop
    ? `ondragover="onBoardDragOver(event)" ondragleave="onBoardDragLeave(event)" ondrop="onBoardDrop(event,null)"`
    : '';
  return `<div class="cbt-row ${who}${playerAiming?' targeting':''}${legal?.forcedTank?' tank-lock':''}" ${dropAttrs}>${parts.join('')}</div>`;
}
function renderHearts(hp, maxHp=30){
  const per=3;
  const total=Math.ceil(maxHp/per);
  let html='';
  for(let i=0;i<total;i++){
    const inHeart=Math.max(0, Math.min(per, hp - i*per));
    let src='ui/combat/heart_empty.png';
    let cls='empty';
    if(inHeart>=3){ src='ui/combat/heart_full.png'; cls='full'; }
    else if(inHeart>=1){ src='ui/combat/heart_half.png'; cls='half'; }
    html+=`<img class="cbt-heart ${cls}" src="${src}" alt="" width="16" height="14" title="${hp}/${maxHp}">`;
  }
  return `<div class="cbt-hearts" title="${hp} / ${maxHp} PV">${html}<span class="cbt-hp-num">${hp}</span></div>`;
}
function renderManaCrystals(p){
  const cur=p.mana||0;
  const max=p.maxMana||0;
  let crystals='';
  for(let i=0;i<10;i++){
    let src='ui/combat/star_03.png';
    let cls='off locked';
    if(i < cur){ src='ui/combat/star_01.png'; cls='on'; }
    else if(i < max){ src='ui/combat/star_03.png'; cls='off'; }
    crystals+=`<img class="cbt-crystal ${cls}" src="${src}" alt="" width="14" height="13" title="Mana ${cur}/${max}">`;
  }
  return `<div class="cbt-mana-panel">
    <div class="cbt-crystals" title="Mana de base ${cur}/${max}">${crystals}<span class="cbt-mana-num">${cur}/${max}</span></div>
    <div class="cbt-color-row">${renderColorMana(p)}</div>
  </div>`;
}
function renderColorMana(p){
  const b=state.battle;
  return b.factions.map(f=>{
    const fm=FACTION_MANA[f]||{color:'#888',mark:'●',icon:'ui/combat/star_sm.png',element:f};
    const n=p.colorMana[f]||0;
    const icon=fm.icon||'ui/combat/star_sm.png';
    const el=fm.element||f;
    return `<span class="cbt-colorman ${n?'on':''}" style="--mana:${fm.color}" title="${f} · ${el}: ${n}">
      <span class="cbt-mana-gem">
        <img src="${icon}" alt="${el}" draggable="false">
        <i class="cbt-mana-shine" aria-hidden="true"></i>
      </span>
      <b>${n}</b>
    </span>`;
  }).join('');
}
function renderCombat(){
  const b=state.battle;
  if(!b){
    return `<section class="panel combat-lobby">
      <div class="section-head"><div><p class="eyebrow">Arène</p><h2>Combat aléatoire</h2>
      <p>Deux decks de 40 cartes tirés dans <b>4 factions</b> communes. Tu joues en bas. Clique une créature prête, puis vise la <b>tour</b> ou un <b>mignon</b> adverse — comme dans Hearthstone. Mana incolore (1→10) + mana de couleur cyclique. Tours à 30 PV.</p></div>
      <button class="cbt-start" onclick="startCombat()">Nouveau combat</button></div>
    </section>`;
  }
  const ended=b.winner?`<div class="cbt-banner ${b.winner}">${b.winner==='player'?'Victoire !':b.winner==='enemy'?'Défaite…':'Match nul'} <button onclick="startCombat()">Rejouer</button></div>`:'';
  const handCanDrag=b.active==='player' && b.phase==='main' && !b.winner && !b.attackSource;
  const playerAiming=b.active==='player' && b.phase==='main' && !!b.attackSource
    && b.player.board.some(c=>c.uid===b.attackSource);
  const aimLegal=playerAiming ? legalAttackTargets('player') : null;
  const aimName=b.attackSource
    ? (b.player.board.find(c=>c.uid===b.attackSource)||b.enemy.board.find(c=>c.uid===b.attackSource))?.name
    : null;
  const statusLabel = b.winner ? 'Partie terminée'
    : b.phase==='enemy_attack' ? 'Assaut adverse'
    : playerAiming ? `Visée — ${aimName||'créature'}`
    : b.active==='player' ? 'Ton tour' : 'Tour adverse';
  const aimHint = aimLegal?.forcedTank
    ? `Un <strong>Tank</strong> protège le camp adverse — tu dois le frapper.`
    : `Pointe la <strong>tour adverse</strong> ou un <strong>mignon</strong> — la flèche jaune suit ton geste.`;
  const midControls = b.winner ? `<span class="cbt-wait">Partie terminée</span>`
    : playerAiming ? `
      <div class="cbt-aim-panel${aimLegal?.forcedTank?' tank-lock':''}">
        <b>${aimLegal?.forcedTank?'Tank adverse !':'Choisis une cible'}</b>
        <p>${aimHint}</p>
        <button class="cbt-end" type="button" onclick="cancelAttack()">Annuler (Échap)</button>
      </div>`
    : b.phase==='enemy_attack' ? `<span class="cbt-wait">Assaut en cours…</span>`
    : b.active==='player' && b.phase==='main' ? `
        <span class="cbt-hint">Clique une créature <em>Prête</em>, puis une cible</span>
        <button class="cbt-end" onclick="endPlayerTurn()">Fin du tour</button>
      `
    : `<span class="cbt-wait">…</span>`;
  const aimSvg = b.attackSource ? `
    <svg class="cbt-aim-layer" aria-hidden="true">
      <defs>
        <filter id="cbt-aim-blur" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2.2" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <marker id="cbt-aim-head" viewBox="0 0 14 14" refX="12" refY="7" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M1,1 L13,7 L1,13 Z" fill="#ffe14a" stroke="#f5c518" stroke-width="1"/>
        </marker>
      </defs>
      <path class="cbt-aim-glow" d="" fill="none" stroke="#ffe14a" stroke-width="11" stroke-linecap="round" opacity=".28"/>
      <path class="cbt-aim-stroke" d="" fill="none" stroke="#ffe14a" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="11 9" marker-end="url(#cbt-aim-head)" filter="url(#cbt-aim-blur)"/>
    </svg>` : '';
  const canHitFace=!!(playerAiming && aimLegal?.face);
  const enemyTowerCls = `cbt-tower enemy${canHitFace?' cbt-target':''}${playerAiming && !canHitFace?' cbt-blocked':''}`;
  const enemyTowerClick = canHitFace
    ? ' onclick="confirmAttackFace()" title="Attaquer la tour adverse"'
    : (playerAiming ? ' title="Protégée par un Tank"' : '');
  return `<section class="combat-table${playerAiming?' is-aiming':''}${aimLegal?.forcedTank?' tank-lock':''}">
    ${aimSvg}
    ${ended}
    <div class="cbt-meta">
      <div><b>Factions</b> ${b.factions.map(f=>{
        const fm=FACTION_MANA[f]||{};
        return `<span class="tag" style="--faction:${fm.color||'#999'}" title="${fm.element||f}">${f}${fm.element?` · ${fm.element}`:''}</span>`;
      }).join('')}</div>
      <div>${b.coin} · ${statusLabel}</div>
      <button onclick="startCombat()">Reset</button>
    </div>
    <div class="cbt-side enemy-hud">
      <div class="${enemyTowerCls}"${enemyTowerClick}><span class="cbt-tower-label">Tour adverse</span>${renderHearts(b.enemy.hp)}</div>
      ${renderManaCrystals(b.enemy)}
      <div class="cbt-hand enemy-hand">${b.enemy.hand.map(()=>`<div class="cbt-back"></div>`).join('')}<small>Deck ${b.enemy.deck.length}</small></div>
    </div>
    ${renderBoardRow(b,'enemy')}
    <div class="cbt-mid">${midControls}</div>
    ${renderBoardRow(b,'player')}
    <div class="cbt-side ally-hud">
      <div class="cbt-tower ally"><span class="cbt-tower-label">Ta tour</span>${renderHearts(b.player.hp)}</div>
      ${renderManaCrystals(b.player)}
      <div class="cbt-hand">${b.player.hand.map(c=>{
        const ok=canAfford(b.player,c) && b.player.board.length<8;
        return miniCard(c,{
          hand:true,
          selected:b.selectedHandUid===c.uid,
          onclick: b.phase==='main' && !b.attackSource ? `selectHandCard('${c.uid}')` : '',
          draggable: handCanDrag && ok,
          checkAfford:true,
          affordable: ok,
        });
      }).join('')}<small>Deck ${b.player.deck.length}</small></div>
    </div>
    <aside class="cbt-log"><h3>Journal</h3>${b.log.map(x=>`<p>${x}</p>`).join('')}</aside>
  </section>`;
}

window.startCombat=startCombat;
window.selectHandCard=selectHandCard;
window.playSelectedAt=playSelectedAt;
window.selectAttacker=selectAttacker;
window.cancelAttack=cancelAttack;
window.confirmAttackFace=confirmAttackFace;
window.confirmAttackMinion=confirmAttackMinion;
window.syncAttackAim=syncAttackAim;
window.endPlayerTurn=endPlayerTurn;
window.onHandDragStart=onHandDragStart;
window.onHandDragEnd=onHandDragEnd;
window.onHandPointerDown=onHandPointerDown;
window.onBoardDragOver=onBoardDragOver;
window.onBoardDragLeave=onBoardDragLeave;
window.onBoardDrop=onBoardDrop;

render();

