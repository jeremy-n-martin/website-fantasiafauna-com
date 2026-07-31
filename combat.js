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
  const needN=card.costNeutral ?? Math.max(0,(card.cost||0)-(card.costColored||0));
  const needC=card.costColored ?? 0;
  if((p.mana||0) < needN) return false;
  if(needC<=0) return true;
  return (p.colorMana[card.capital]||0) >= needC;
}
function payCost(p, card){
  const needN=card.costNeutral ?? Math.max(0,(card.cost||0)-(card.costColored||0));
  const needC=card.costColored ?? 0;
  p.mana -= needN;
  if(needC>0) p.colorMana[card.capital]=(p.colorMana[card.capital]||0)-needC;
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
  const b=state.battle; if(!b||b.active!=='player'||b.phase!=='main'||b.winner) return;
  const card=b.player.hand.find(c=>c.uid===uid);
  if(!card) return;
  if(!canAfford(b.player, card)){ combatLog(`Pas assez de mana pour ${card.name}.`); render(); return; }
  if(b.player.board.length>=8){ combatLog('Plateau plein (8).'); render(); return; }
  b.selectedHandUid = b.selectedHandUid===uid ? null : uid;
  b.insertAt = b.selectedHandUid ? placementSlots(b.player.board)[0] : null;
  render();
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
  if(!c||!c.canAttack||c.exhausted) return;
  const i=b.attackers.indexOf(uid);
  if(i>=0) b.attackers.splice(i,1); else b.attackers.push(uid);
  render();
}
function declareAttack(){
  const b=state.battle; if(!b||b.active!=='player'||b.phase!=='main') return;
  if(!b.attackers.length){ combatLog('Sélectionne au moins une créature qui attaque.'); render(); return; }
  b.phase='resolve';
  const blocks={};
  for(const aUid of b.attackers){
    const free=b.enemy.board.filter(c=>!Object.values(blocks).includes(c.uid));
    if(free.length && Math.random()<0.55){
      free.sort((a,b)=>a.hp-b.hp||a.attack-b.attack);
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
  if(attackers.length){
    const blocks={};
    const tanks=b.player.board.filter(c=>(c.roles||[]).includes('tank')||c.health>=c.attack+2);
    attackers.forEach((aUid,i)=>{
      blocks[aUid]=(tanks[i] && Math.random()<0.4) ? tanks[i].uid : null;
    });
    resolveAttacks('enemy','player', attackers, blocks);
  }
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
  const sick=c.justPlayed||!c.canAttack?' sick':'';
  const click=opts.onclick?`onclick="${opts.onclick}"`:'';
  const img=c.image?`<img src="${encodeURI(currentImageFor(c))}" alt="">`:'';
  return `<button type="button" class="cbt-card ${c.rarity||''}${sel}${atk}${sick}" style="--faction:${fm.color}" ${click}>
    <span class="cbt-cost">${manaCostHtml(c)}</span>
    <div class="cbt-art">${img}</div>
    <strong>${c.name}</strong>
    <footer><b>${c.attack}</b><span>${c.hp ?? c.health}</span></footer>
  </button>`;
}
function renderBoardRow(side, who){
  const b=state.battle;
  const board=b[who].board;
  const isPlayer=who==='player';
  const canPlace=isPlayer && b.active==='player' && b.phase==='main' && b.selectedHandUid && !b.winner;
  const slots=canPlace?placementSlots(board):[];
  const parts=[];
  for(let i=0;i<=board.length;i++){
    if(slots.includes(i)){
      parts.push(`<button type="button" class="cbt-slot ${b.insertAt===i?'hot':''}" onclick="playSelectedAt(${i})" title="Poser ici">+</button>`);
    }
    if(i<board.length){
      const c=board[i];
      const attacking=b.attackers.includes(c.uid);
      const onclick=isPlayer && b.active==='player' && b.phase==='main'
        ? `toggleAttacker('${c.uid}')`
        : '';
      parts.push(miniCard(c,{ attacking, onclick, selected:attacking }));
    }
  }
  if(!board.length && !canPlace) parts.push('<em class="cbt-empty">Terrain vide</em>');
  return `<div class="cbt-row ${who}">${parts.join('')}</div>`;
}
function renderColorMana(p){
  const b=state.battle;
  return b.factions.map(f=>{
    const fm=FACTION_MANA[f]||{color:'#888',mark:'●'};
    const n=p.colorMana[f]||0;
    return `<span class="cbt-colorman ${n?'on':''}" style="--mana:${fm.color}" title="${f}: ${n}"><em>${fm.mark}</em><b>${n}</b></span>`;
  }).join('');
}
function renderCombat(){
  const b=state.battle;
  if(!b){
    return `<section class="panel combat-lobby">
      <div class="section-head"><div><p class="eyebrow">Arène</p><h2>Combat aléatoire</h2>
      <p>Deux decks de 40 cartes tirés dans <b>4 factions</b> communes. Tu joues en bas. Mana incolore (1→10) + mana de couleur cyclique. Tours à 30 PV. Main de départ : 7 cartes, puis +2 par tour.</p></div>
      <button class="cbt-start" onclick="startCombat()">Nouveau combat</button></div>
    </section>`;
  }
  const ended=b.winner?`<div class="cbt-banner ${b.winner}">${b.winner==='player'?'Victoire !':b.winner==='enemy'?'Défaite…':'Match nul'} <button onclick="startCombat()">Rejouer</button></div>`:'';
  return `<section class="combat-table">
    ${ended}
    <div class="cbt-meta">
      <div><b>Factions</b> ${b.factions.map(f=>`<span class="tag" style="--faction:${(FACTION_MANA[f]||{}).color||'#999'}">${f}</span>`).join('')}</div>
      <div>${b.coin} · ${b.active==='player'?'Ton tour':'Tour adverse'}</div>
      <button onclick="startCombat()">Reset</button>
    </div>
    <div class="cbt-side enemy-hud">
      <div class="cbt-tower enemy">Tour adverse<br><strong>${b.enemy.hp}</strong>/30</div>
      <div class="cbt-mana">Mana ${b.enemy.mana}/${b.enemy.maxMana} ${renderColorMana(b.enemy)}</div>
      <div class="cbt-hand enemy-hand">${b.enemy.hand.map(()=>`<div class="cbt-back"></div>`).join('')}<small>Deck ${b.enemy.deck.length}</small></div>
    </div>
    ${renderBoardRow(b,'enemy')}
    <div class="cbt-mid">
      ${b.active==='player' && b.phase==='main' && !b.winner ? `
        <button class="cbt-atk" onclick="declareAttack()" ${b.attackers.length?'':'disabled'}>Attaquer ! (${b.attackers.length})</button>
        <button class="cbt-end" onclick="endPlayerTurn()">Fin du tour</button>
      ` : `<span class="cbt-wait">${b.winner?'Partie terminée':'…'}</span>`}
    </div>
    ${renderBoardRow(b,'player')}
    <div class="cbt-side ally-hud">
      <div class="cbt-tower ally">Ta tour<br><strong>${b.player.hp}</strong>/30</div>
      <div class="cbt-mana">Mana ${b.player.mana}/${b.player.maxMana} ${renderColorMana(b.player)}</div>
      <div class="cbt-hand">${b.player.hand.map(c=>miniCard(c,{
        selected:b.selectedHandUid===c.uid,
        onclick:`selectHandCard('${c.uid}')`
      })).join('')}<small>Deck ${b.player.deck.length}</small></div>
    </div>
    <aside class="cbt-log"><h3>Journal</h3>${b.log.map(x=>`<p>${x}</p>`).join('')}</aside>
  </section>`;
}

window.startCombat=startCombat;
window.selectHandCard=selectHandCard;
window.playSelectedAt=playSelectedAt;
window.toggleAttacker=toggleAttacker;
window.declareAttack=declareAttack;
window.endPlayerTurn=endPlayerTurn;

render();

