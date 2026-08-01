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
    attackers:[],
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
  b.active=who; b.phase='main'; b.selectedHandUid=null; b.insertAt=null; b.attackers=[];
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
function toggleAttacker(uid){
  const b=state.battle; if(!b||b.active!=='player'||b.phase!=='main'||b.winner) return;
  const c=b.player.board.find(x=>x.uid===uid);
  if(!c) return;
  if(c.justPlayed || !c.canAttack){
    combatLog(`${c.name} a le mal d’invocation : elle attaquera au prochain tour.`);
    render();
    return;
  }
  if(c.exhausted){
    combatLog(`${c.name} a déjà attaqué ce tour.`);
    render();
    return;
  }
  const i=b.attackers.indexOf(uid);
  if(i>=0) b.attackers.splice(i,1); else b.attackers.push(uid);
  render();
}
function selectAllAttackers(){
  const b=state.battle; if(!b||b.active!=='player'||b.phase!=='main'||b.winner) return;
  const ready=b.player.board.filter(c=>c.canAttack && !c.exhausted && !c.justPlayed);
  if(!ready.length){
    combatLog('Aucune créature prête : les nouvelles invoquées attaquent au tour suivant.');
    render();
    return;
  }
  b.attackers=ready.map(c=>c.uid);
  render();
}
function declareAttack(){
  const b=state.battle; if(!b||b.active!=='player'||b.phase!=='main') return;
  if(!b.attackers.length){
    // Raccourci : si rien n'est sélectionné, attaquer avec toutes les prêtes
    const ready=b.player.board.filter(c=>c.canAttack && !c.exhausted && !c.justPlayed);
    if(!ready.length){
      combatLog('Aucune créature ne peut attaquer (mal d’invocation ou déjà fatiguée).');
      render();
      return;
    }
    b.attackers=ready.map(c=>c.uid);
  }
  b.phase='resolve';
  const blocks={};
  for(const aUid of b.attackers){
    const free=b.enemy.board.filter(c=>!Object.values(blocks).includes(c.uid));
    if(free.length && Math.random()<0.55){
      free.sort((a,c)=>a.hp-c.hp||a.attack-c.attack);
      blocks[aUid]=free[0].uid;
    } else blocks[aUid]=null;
  }
  resolveAttacks('player','enemy', b.attackers, blocks);
  b.attackers=[];
  b.phase='main';
  checkWinner();
  render();
}
function resolveAttacks(atkSide, defSide, attackerUids, blocks){
  const b=state.battle;
  const A=b[atkSide], D=b[defSide];
  for(const aUid of attackerUids){
    const atk=A.board.find(c=>c.uid===aUid);
    if(!atk) continue;
    atk.exhausted=true; atk.canAttack=false;
    const blockUid=blocks[aUid];
    const blocker=blockUid ? D.board.find(c=>c.uid===blockUid) : null;
    if(blocker){
      combatLog(`${atk.name} (${atk.attack}) frappe ${blocker.name}, riposte ${blocker.attack}.`);
      blocker.hp-=atk.attack;
      atk.hp-=blocker.attack;
      if(blocker.hp<=0){ D.board=D.board.filter(c=>c.uid!==blocker.uid); combatLog(`${blocker.name} meurt.`); }
      if(atk.hp<=0){ A.board=A.board.filter(c=>c.uid!==atk.uid); combatLog(`${atk.name} meurt.`); }
    } else {
      D.hp=Math.max(0, D.hp-atk.attack);
      combatLog(`${atk.name} passe et inflige ${atk.attack} à la tour (${D.hp}/30).`);
    }
  }
  checkWinner();
}
function endPlayerTurn(){
  const b=state.battle; if(!b||b.active!=='player'||b.winner) return;
  if(b.phase!=='main') return;
  b.selectedHandUid=null; b.attackers=[];
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
  const attackers=b.enemy.board.filter(c=>c.canAttack&&!c.exhausted).map(c=>c.uid);
  if(!attackers.length){
    checkWinner();
    render();
    if(!b.winner) setTimeout(()=>{ beginTurn('player'); render(); }, 450);
    return;
  }
  // Phase de blocage joueur
  b.pendingAttackers=attackers.slice();
  b.blocks={};
  b.blockFocus=0;
  b.phase='block';
  const names=attackers.map(uid=>b.enemy.board.find(c=>c.uid===uid)?.name||'?').join(', ');
  combatLog(`L’adversaire attaque avec ${attackers.length} créature(s) : ${names}. Choisis tes bloqueurs.`);
  render();
}
function currentIncomingAttacker(){
  const b=state.battle;
  if(!b||b.phase!=='block') return null;
  const uid=b.pendingAttackers[b.blockFocus];
  return b.enemy.board.find(c=>c.uid===uid)||null;
}
function usedBlockers(){
  const b=state.battle;
  return new Set(Object.values(b.blocks||{}).filter(Boolean));
}
function assignBlocker(blockerUid){
  const b=state.battle;
  if(!b||b.phase!=='block'||b.winner) return;
  const atkUid=b.pendingAttackers[b.blockFocus];
  if(!atkUid) return;
  if(blockerUid){
    const blocker=b.player.board.find(c=>c.uid===blockerUid);
    if(!blocker) return;
    if(usedBlockers().has(blockerUid)){
      combatLog(`${blocker.name} bloque déjà une autre attaque.`);
      render();
      return;
    }
    b.blocks[atkUid]=blockerUid;
    combatLog(`Tu bloques ${currentIncomingAttacker()?.name||'l’attaque'} avec ${blocker.name}.`);
  } else {
    b.blocks[atkUid]=null;
    combatLog(`Tu laisses passer ${currentIncomingAttacker()?.name||'l’attaque'} vers la tour.`);
  }
  b.blockFocus += 1;
  if(b.blockFocus >= b.pendingAttackers.length) finishBlocking();
  else render();
}
function finishBlocking(){
  const b=state.battle; if(!b) return;
  resolveAttacks('enemy','player', b.pendingAttackers, b.blocks);
  b.pendingAttackers=[];
  b.blocks={};
  b.blockFocus=0;
  b.phase='main';
  checkWinner();
  render();
  if(!b.winner){
    setTimeout(()=>{ beginTurn('player'); render(); }, 500);
  }
}

function miniCard(c, opts={}){
  const fm=factionMana(c);
  const sel=opts.selected?' selected':'';
  const atk=opts.attacking?' attacking':'';
  const sick=opts.summonSick || ((c.justPlayed||!c.canAttack) && !opts.exhausted) ? ' sick':'';
  const exhausted=opts.exhausted?' exhausted':'';
  const ready=opts.ready?' ready':'';
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
    : opts.ready ? ' title="Prête — cliquer pour sélectionner"'
    : opts.blockPick ? ' title="Cliquer pour bloquer avec cette créature"'
    : opts.blockFocus ? ' title="Cette créature attaque — choisis un bloqueur"'
    : '';
  const cls=`cbt-card${sel}${atk}${sick}${exhausted}${ready}${unafford}${opts.blockFocus?' block-focus':''}${opts.blockPick?' block-pick':''}${opts.draggable?' can-drag':''}`;
  const style=`style="--faction:${fm.color}"`;
  if(opts.hand){
    return `<div role="button" tabindex="0" class="${cls}" ${style} ${click} ${drag}
      onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();${opts.onclick||''}}">
      <span class="cbt-cost">${manaCostHtml(c)}</span>
      <div class="cbt-art">${img}</div>
      <strong>${c.name}</strong>
      <footer><b>${c.attack}</b><span>${c.hp ?? c.health}</span></footer>
    </div>`;
  }
  return `<button type="button" class="${cls}" ${style} ${click}${title}>
    <span class="cbt-cost">${manaCostHtml(c)}</span>
    <div class="cbt-art">${img}</div>
    <strong>${c.name}</strong>
    ${opts.blockFocus?'<em class="cbt-badge atk-badge">Attaque !</em>':opts.blockPick?'<em class="cbt-badge ready-badge">Bloquer</em>':opts.summonSick?'<em class="cbt-badge sick-badge">Sommeil</em>':opts.ready?'<em class="cbt-badge ready-badge">Prête</em>':opts.exhausted?'<em class="cbt-badge done-badge">Fatiguée</em>':''}
    <footer><b>${c.attack}</b><span>${c.hp ?? c.health}</span></footer>
  </button>`;
}
function renderBoardRow(side, who){
  const b=state.battle;
  const board=b[who].board;
  const isPlayer=who==='player';
  const canPlace=isPlayer && b.active==='player' && b.phase==='main' && b.selectedHandUid && !b.winner;
  const canDrop=isPlayer && b.active==='player' && b.phase==='main' && !b.winner && board.length<8;
  const blocking=b.phase==='block';
  const focusAtk=blocking ? currentIncomingAttacker() : null;
  const used=blocking ? usedBlockers() : new Set();
  const slots=canPlace?placementSlots(board):[];
  const parts=[];
  for(let i=0;i<=board.length;i++){
    if(slots.includes(i)){
      parts.push(`<button type="button" class="cbt-slot ${b.insertAt===i?'hot':''}" onclick="playSelectedAt(${i})"
        ondragover="onBoardDragOver(event)" ondragleave="onBoardDragLeave(event)" ondrop="onBoardDrop(event,${i})" title="Poser ici">+</button>`);
    }
    if(i<board.length){
      const c=board[i];
      if(blocking && who==='enemy'){
        const isFocus=focusAtk && focusAtk.uid===c.uid;
        const isAtk=b.pendingAttackers.includes(c.uid);
        parts.push(miniCard(c,{
          attacking:isAtk,
          selected:isFocus,
          blockFocus:isFocus,
        }));
      } else if(blocking && who==='player'){
        const busy=used.has(c.uid);
        parts.push(miniCard(c,{
          onclick: busy ? '' : `assignBlocker('${c.uid}')`,
          ready:!busy,
          exhausted:busy,
          blockPick:!busy,
        }));
      } else {
        const attacking=b.attackers.includes(c.uid);
        const ready=isPlayer && c.canAttack && !c.exhausted && !c.justPlayed;
        const onclick=isPlayer && b.active==='player' && b.phase==='main'
          ? `toggleAttacker('${c.uid}')`
          : '';
        parts.push(miniCard(c,{
          attacking,
          onclick,
          selected:attacking,
          ready,
          summonSick: !!(c.justPlayed || (!c.canAttack && !c.exhausted)),
          exhausted: !!c.exhausted,
        }));
      }
    }
  }
  if(!board.length && !canPlace && !blocking) parts.push('<em class="cbt-empty">Terrain vide — glisse une carte ici</em>');
  const dropAttrs=canDrop
    ? `ondragover="onBoardDragOver(event)" ondragleave="onBoardDragLeave(event)" ondrop="onBoardDrop(event,null)"`
    : '';
  return `<div class="cbt-row ${who}${blocking?' blocking':''}" ${dropAttrs}>${parts.join('')}</div>`;
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
      <p>Deux decks de 40 cartes tirés dans <b>4 factions</b> communes. Tu joues en bas. Mana incolore (1→10) + mana de couleur cyclique. Tours à 30 PV. Main de départ : 7 cartes, puis +2 par tour. Glisse une carte sur le plateau pour l’invoquer.</p></div>
      <button class="cbt-start" onclick="startCombat()">Nouveau combat</button></div>
    </section>`;
  }
  const ended=b.winner?`<div class="cbt-banner ${b.winner}">${b.winner==='player'?'Victoire !':b.winner==='enemy'?'Défaite…':'Match nul'} <button onclick="startCombat()">Rejouer</button></div>`:'';
  const handCanDrag=b.active==='player' && b.phase==='main' && !b.winner;
  const focusAtk=b.phase==='block' ? currentIncomingAttacker() : null;
  const blockStep=b.phase==='block' ? (b.blockFocus+1) : 0;
  const blockTotal=b.phase==='block' ? b.pendingAttackers.length : 0;
  const statusLabel = b.winner ? 'Partie terminée'
    : b.phase==='block' ? `Blocage ${blockStep}/${blockTotal}`
    : b.active==='player' ? 'Ton tour' : 'Tour adverse';
  const midControls = b.winner ? `<span class="cbt-wait">Partie terminée</span>`
    : b.phase==='block' && focusAtk ? `
      <div class="cbt-block-panel">
        <b>Phase de blocage</b>
        <p><strong>${focusAtk.name}</strong> (${focusAtk.attack}/${focusAtk.hp}) attaque ta tour — clique une de tes créatures pour bloquer, ou laisse passer.</p>
        <div class="cbt-block-actions">
          <button class="cbt-end" onclick="assignBlocker(null)">Laisser passer → tour</button>
        </div>
        <small>${blockStep} / ${blockTotal}</small>
      </div>`
    : b.active==='player' && b.phase==='main' ? `
        <button class="cbt-atk" onclick="declareAttack()">${b.attackers.length?`Attaquer ! (${b.attackers.length})`:'Attaquer (toutes les prêtes)'}</button>
        <button class="cbt-end" onclick="selectAllAttackers()" type="button">Sélectionner les prêtes</button>
        <button class="cbt-end" onclick="endPlayerTurn()">Fin du tour</button>
      `
    : `<span class="cbt-wait">…</span>`;
  return `<section class="combat-table">
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
      <div class="cbt-tower enemy"><span class="cbt-tower-label">Tour adverse</span>${renderHearts(b.enemy.hp)}</div>
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
          onclick: b.phase==='main' ? `selectHandCard('${c.uid}')` : '',
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
window.toggleAttacker=toggleAttacker;
window.declareAttack=declareAttack;
window.selectAllAttackers=selectAllAttackers;
window.assignBlocker=assignBlocker;
window.endPlayerTurn=endPlayerTurn;
window.onHandDragStart=onHandDragStart;
window.onHandDragEnd=onHandDragEnd;
window.onHandPointerDown=onHandPointerDown;
window.onBoardDragOver=onBoardDragOver;
window.onBoardDragLeave=onBoardDragLeave;
window.onBoardDrop=onBoardDrop;

render();

