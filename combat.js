/* Combat — plateau type Hearthstone, decks 40 / 4 factions */

const CBT_PREFS_KEY='ff-combat-prefs';
function loadCombatPrefs(){
  const defaults={ density:'compact', zoom:'md', showLog:true };
  try{
    const raw=localStorage.getItem(CBT_PREFS_KEY);
    if(!raw) return {...defaults};
    return {...defaults, ...JSON.parse(raw)};
  }catch(_){ return {...defaults}; }
}
function saveCombatPrefs(){
  try{ localStorage.setItem(CBT_PREFS_KEY, JSON.stringify(state.combatPrefs||{})); }catch(_){}
}
function ensureCombatPrefs(){
  if(!state.combatPrefs) state.combatPrefs=loadCombatPrefs();
  return state.combatPrefs;
}
function setCombatPref(key, value){
  const p=ensureCombatPrefs();
  p[key]=value;
  saveCombatPrefs();
  render();
}
function toggleCombatDensity(){
  const p=ensureCombatPrefs();
  setCombatPref('density', p.density==='comfort' ? 'compact' : 'comfort');
}
function cycleCombatZoom(dir=1){
  const order=['sm','md','lg'];
  const p=ensureCombatPrefs();
  const i=Math.max(0, order.indexOf(p.zoom||'md'));
  const next=order[(i+dir+order.length)%order.length];
  setCombatPref('zoom', next);
}
function toggleCombatLog(){
  const p=ensureCombatPrefs();
  setCombatPref('showLog', !p.showLog);
}
async function toggleCombatFullscreen(){
  const el=document.querySelector('.combat-table');
  if(!el) return;
  try{
    if(document.fullscreenElement || document.webkitFullscreenElement){
      if(document.exitFullscreen) await document.exitFullscreen();
      else if(document.webkitExitFullscreen) document.webkitExitFullscreen();
    } else {
      if(el.requestFullscreen) await el.requestFullscreen();
      else if(el.webkitRequestFullscreen) el.webkitRequestFullscreen();
    }
  }catch(err){
    combatLog('Plein écran indisponible sur ce navigateur.');
  }
  render();
}
function isCombatFullscreen(){
  return !!(document.fullscreenElement || document.webkitFullscreenElement);
}
function combatTableClasses(extra=''){
  const p=ensureCombatPrefs();
  const dens=p.density==='comfort' ? 'cbt-density-comfort' : 'cbt-density-compact';
  const zoom=`cbt-zoom-${p.zoom||'md'}`;
  const log=p.showLog===false ? 'cbt-log-hidden' : '';
  return ['combat-table', dens, zoom, log, extra].filter(Boolean).join(' ');
}
function renderCombatConfigBar(){
  const p=ensureCombatPrefs();
  const fs=isCombatFullscreen();
  const densLabel=p.density==='comfort' ? 'Confort' : 'Compact';
  const zoomLabel=(p.zoom||'md').toUpperCase();
  return `<div class="cbt-meta-actions">
    <div class="cbt-cfg-group" title="Zoom des cartes">
      <button type="button" class="cbt-cfg" onclick="cycleCombatZoom(-1)" aria-label="Zoom moins">−</button>
      <button type="button" class="cbt-cfg on" onclick="cycleCombatZoom(1)" title="Cycle zoom">Zoom ${zoomLabel}</button>
      <button type="button" class="cbt-cfg" onclick="cycleCombatZoom(1)" aria-label="Zoom plus">+</button>
    </div>
    <button type="button" class="cbt-cfg${p.density==='comfort'?' on':''}" onclick="toggleCombatDensity()">${densLabel}</button>
    <button type="button" class="cbt-cfg${p.showLog!==false?' on':''}" onclick="toggleCombatLog()">Journal</button>
    <button type="button" class="cbt-cfg${fs?' on':''}" onclick="toggleCombatFullscreen()">${fs?'Quitter PE':'Plein écran'}</button>
    <button type="button" class="cbt-cfg" onclick="startCombat()">Reset</button>
  </div>`;
}

function uid(){ return crypto.randomUUID?.() || Math.random().toString(36).slice(2,10); }
function shuffleInPlace(arr){
  for(let i=arr.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [arr[i],arr[j]]=[arr[j],arr[i]]; }
  return arr;
}
function pickN(arr,n){
  const copy=arr.slice(); shuffleInPlace(copy); return copy.slice(0,n);
}
const ACTIVATION_SPECS = [
  {id:'activer-regen', label:'Régénération', effect:'regen'},
  {id:'activer-tank', label:'Rempart', effect:'tank'},
  {id:'activer-bouclier', label:'Bouclier divin', effect:'shield'},
  {id:'activer-frappe', label:'Frappe', effect:'strike'},
  {id:'activer-soin', label:'Soins', effect:'healAll'},
  {id:'activer-purge', label:'Purification', effect:'purge'},
];
const ON_HIT_EFFECTS = [
  {role:'poison', status:'poison', label:'Poison', vfx:'poison'},
  {role:'brulant', status:'brulant', label:'Feu', vfx:'brulant'},
  {role:'gelant', freeze:true, label:'Gel', vfx:'gelant'},
  {role:'affaiblir', weaken:1, label:'Affaibli', vfx:'affaiblir'},
];
const KEYWORD_ROLES = new Set([
  'lancer','lancer-mod','lancer-max','sort-degat','sort-degat-mod','sort-degat-max',
  'soin','soin-mod','soin-max','invocation','invocation-rapide','invocation-intime',
  'etendard','formation',
  'activer-regen','activer-tank','activer-bouclier','activer-frappe','activer-soin','activer-purge',
  'bouclier-divin','double-attaque','charge','camouflage','vol-de-vie','dernier-souffle',
  'cri-pioche','cri-frappe','furie','allie-meurt','quand-tue','affaiblir','survie',
  'poison','brulant','gelant','fin-tour-tir','fin-tour-buff','debut-tour-soin','debut-tour-tir',
  'quand-blesse','quand-invoque','apres-attaque','jetons-1-1','donner-buff',
]);
function cloneCard(c){
  const roles=[...(c.roles||[])];
  const atk=c.attack||0;
  const hp=c.health||0;
  const card={
    ...c,
    roles,
    uid: uid(),
    attack: atk,
    baseAttack: atk,
    hp,
    maxHp: hp,
    baseMaxHp: hp,
    auraAtk: 0,
    auraHp: 0,
    _appliedAuraHp: 0,
    canAttack: false,
    exhausted: false,
    justPlayed: true,
    abilityCD: null,
    summoned: false,
    attacksThisTurn: 0,
    activatedThisTurn: false,
    divineShield: false,
    tempTank: false,
    pendingRegen: false,
    pendingTank: false,
    frozen: false,
    skipNextAttack: false,
    survieUsed: false,
    stealthed: false,
    statuses: [],
  };
  if(hasRole(card,'bouclier-divin')) card.divineShield=true;
  if(hasRole(card,'camouflage')) card.stealthed=true;
  return card;
}
function activationSpec(c){
  for(const spec of ACTIVATION_SPECS){
    if(hasRole(c, spec.id)) return spec;
  }
  return null;
}
function maxAttacks(c){
  return hasRole(c,'double-attaque') ? 2 : 1;
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
    if(delta>0) spawnDamageFloat(c.uid, delta, 'buff');
    spawnBuffSparkles(c.uid, Math.min(8, Math.abs(atk||0)+Math.abs(hp||0)*2));
  }
}
function healCreature(c, amount){
  if(!c || amount<=0) return 0;
  const max=c.maxHp??c.baseMaxHp??c.health??c.hp;
  const before=c.hp??0;
  c.hp=Math.min(max, before+amount);
  const healed=c.hp-before;
  if(healed>0) spawnDamageFloat(c.uid, healed, 'heal');
  return healed;
}
function clearCreatureStatuses(c){
  if(!c) return false;
  let changed=false;
  if(Array.isArray(c.statuses) && c.statuses.length){
    c.statuses=[];
    changed=true;
  }
  if(c.frozen || c.skipNextAttack){
    c.frozen=false;
    c.skipNextAttack=false;
    changed=true;
  }
  return changed;
}
function breakStealth(c, reason=''){
  if(!c || !c.stealthed) return false;
  c.stealthed=false;
  combatLog(`${c.name} sort du camouflage${reason?` (${reason})`:''}.`);
  return true;
}
function isStealthed(c){
  return !!(c && c.stealthed);
}
function makeToken11(capital){
  return cloneCard({
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
    costColored:0,
    costNeutral:1,
  });
}
function abilityPulseSpec(c){
  const roles=c?.roles||[];
  const has=(id)=>roles.includes(id);
  if(has('lancer-max')) return {kind:'dmg', dmg:2, targets:2, period:1, vfx:'lancer', label:'Salve de lancer'};
  if(has('sort-degat-max')) return {kind:'dmg', dmg:2, targets:2, period:1, vfx:'sort', label:'Tempête de sorts'};
  if(has('lancer-mod')) return {kind:'dmg', dmg:1, targets:1, period:1, vfx:'lancer', label:'Arme de lancer+'};
  if(has('sort-degat-mod')) return {kind:'dmg', dmg:1, targets:1, period:1, vfx:'sort', label:'Sort de dégât+'};
  if(has('lancer')) return {kind:'dmg', dmg:1, targets:1, period:2, vfx:'lancer', label:'Arme de lancer'};
  if(has('sort-degat')) return {kind:'dmg', dmg:1, targets:1, period:2, vfx:'sort', label:'Sort de dégât'};
  if(has('soin-max')) return {kind:'heal', amount:2, targets:2, period:1, vfx:'soin', label:'Soin majeur'};
  if(has('soin-mod')) return {kind:'heal', amount:1, targets:1, period:1, vfx:'soin', label:'Soin+'};
  if(has('soin')) return {kind:'heal', amount:1, targets:1, period:2, vfx:'soin', label:'Soin'};
  if(has('invocation-intime')) return {kind:'summon', period:1, vfx:'invocation', label:'Invocation incessante'};
  if(has('invocation-rapide')) return {kind:'summon', period:2, vfx:'invocation', label:'Invocation rapide'};
  if(has('invocation')) return {kind:'summon', period:3, vfx:'invocation', label:'Invocation'};
  return null;
}
function stripPulseRoles(roles){
  return (roles||[]).filter(r=>!KEYWORD_ROLES.has(r));
}
function hasRole(c, id){
  if(!c) return false;
  if(typeof hasAbility==='function') return hasAbility(c, id);
  return !!(c.roles||[]).includes(id);
}
function applyStatus(c, statusId){
  if(!c) return;
  c.statuses=Array.isArray(c.statuses)?c.statuses:[];
  if(!c.statuses.includes(statusId)) c.statuses.push(statusId);
}
function hasStatus(c, statusId){
  return !!(c && Array.isArray(c.statuses) && c.statuses.includes(statusId));
}
function dealDamageToCreature(who, c, dmg, opts={}){
  const b=state.battle; if(!b||!c||dmg<=0) return 0;
  if(c.divineShield){
    c.divineShield=false;
    combatLog(`${c.name} : Bouclier divin absorbe les dégâts.`);
    spawnCombatFx('bouclier', c.uid, [c.uid]);
    return 0;
  }
  c.hp-=dmg;
  spawnDamageFloat(c.uid, dmg, 'damage');
  if(c.hp<=0 && hasRole(c,'survie') && !c.survieUsed){
    c.survieUsed=true;
    c.hp=1;
    combatLog(`${c.name} (Survie) : résiste avec 1 PV.`);
    spawnCombatFx('bouclier', c.uid, [c.uid]);
  }
  // Furie / représailles seulement si la créature est encore en vie
  if(c.hp>0){
    if(hasRole(c,'furie') && !opts.skipFury){
      buffCreature(c, 1, 0);
      combatLog(`${c.name} (Furie) : +1 ATQ.`);
    }
    if(hasRole(c,'quand-blesse') && opts.allowRetaliate!==false){
      const hits=[];
      for(const t of randomEnemyTargets(who, 1)){
        const res=applyDamageToTarget(who, t, 1, {allowRetaliate:false});
        if(res) hits.push(res);
      }
      if(hits.length){
        combatLog(`${c.name} (Représailles) : 1 dégât → ${hits.map(h=>h.label).join(', ')}.`);
        spawnCombatFx('sort', c.uid, hits.map(h=>h.key));
      }
    }
  }
  return dmg;
}
function killCreature(who, c, reason='') {
  const b=state.battle; if(!b||!c) return false;
  const side=b[who];
  if(!side.board.some(x=>x.uid===c.uid)) return false;
  side.board=side.board.filter(x=>x.uid!==c.uid);
  combatLog(`${c.name} meurt${reason?` (${reason})`:''}.`);
  spawnDeathParticles(c.uid);
  if(c.hp<=-10) screenShake();
  if(hasRole(c,'dernier-souffle')){
    const hits=[];
    for(const t of randomEnemyTargets(who, 1)){
      const res=applyDamageToTarget(who, t, 2, {allowRetaliate:false});
      if(res) hits.push(res);
    }
    if(hits.length){
      combatLog(`${c.name} (Dernier souffle) : 2 dégâts → ${hits.map(h=>h.label).join(', ')}.`);
      spawnCombatFx('sort', c.uid, hits.map(h=>h.key));
    }
  }
  side.board.forEach(ally=>{
    if(!hasRole(ally,'allie-meurt')) return;
    buffCreature(ally, 1, 1);
    combatLog(`${ally.name} (Deuil) : +1/+1.`);
    spawnCombatFx('formation', ally.uid, [ally.uid]);
  });
  refreshBoardAuras(who);
  checkWinner();
  return true;
}
function sweepDead(who, reason=''){
  const b=state.battle; if(!b) return;
  let guard=16;
  while(guard--){
    const dead=b[who].board.find(c=>c.hp<=0);
    if(!dead) break;
    killCreature(who, dead, reason);
  }
}
function refreshBoardAuras(who, opts={}){
  const b=state.battle; if(!b) return;
  const side=b[who];
  const board=side.board;
  if(!board.length) return;
  board.forEach(c=>{
    if(c.baseAttack==null) c.baseAttack=(c.attack||0)-(c.auraAtk||0);
    if(c.baseMaxHp==null) c.baseMaxHp=(c.maxHp??c.health??0)-(c.auraHp||0);
    c.auraAtk=0;
    c.auraHp=0;
  });
  const etendardSources=[];
  const formationTargets=[];
  board.forEach((c,i)=>{
    if(hasRole(c,'etendard')){
      etendardSources.push(c);
      board.forEach(ally=>{
        if(ally.capital===c.capital){
          ally.auraAtk+=1;
          ally.auraHp+=1;
        }
      });
    }
    if(hasRole(c,'formation')){
      if(i>0){
        board[i-1].auraAtk+=1;
        board[i-1].auraHp+=1;
        formationTargets.push(board[i-1].uid);
      }
      if(i<board.length-1){
        board[i+1].auraAtk+=1;
        board[i+1].auraHp+=1;
        formationTargets.push(board[i+1].uid);
      }
    }
  });
  board.forEach(c=>{
    const prev=c._appliedAuraHp||0;
    const next=c.auraHp||0;
    const delta=next-prev;
    c.attack=(c.baseAttack||0)+(c.auraAtk||0);
    c.maxHp=(c.baseMaxHp||0)+next;
    c.hp=(c.hp??c.baseMaxHp??0)+delta;
    if(c.hp>c.maxHp) c.hp=c.maxHp;
    c._appliedAuraHp=next;
  });
  const died=side.board.filter(c=>c.hp<=0);
  if(died.length){
    sweepDead(who, 'aura');
    return;
  }
  if(opts.fxSource){
    const src=opts.fxSource;
    if(hasRole(src,'etendard')){
      const keys=board.filter(c=>c.capital===src.capital).map(c=>c.uid);
      spawnCombatFx('etendard', src.uid, keys);
      combatLog(`${src.name} (Étendard) : +1/+1 aux alliés de ${src.capital}.`);
    }
    if(hasRole(src,'formation')){
      const idx=board.findIndex(c=>c.uid===src.uid);
      const keys=[];
      if(idx>0) keys.push(board[idx-1].uid);
      if(idx>=0 && idx<board.length-1) keys.push(board[idx+1].uid);
      if(keys.length){
        spawnCombatFx('formation', src.uid, keys);
        combatLog(`${src.name} (Formation) : +1/+1 aux adjacentes.`);
      }
    }
  }
}
function pickRandom(arr, n){
  const copy=arr.slice();
  shuffleInPlace(copy);
  return copy.slice(0, Math.max(0, n));
}
function spawnCombatFx(vfx, fromUid, toKeys){
  const root=document.querySelector('.combat-table')||document.body;
  const fromEl=fromUid ? root.querySelector(`.cbt-card[data-uid="${fromUid}"]`) : null;
  const from=fromEl ? fromEl.getBoundingClientRect() : {left:window.innerWidth/2, top:window.innerHeight/2, width:40, height:40};
  const fx=document.createElement('div');
  fx.className=`cbt-fx cbt-fx-${vfx}`;
  fx.style.left=(from.left+from.width/2)+'px';
  fx.style.top=(from.top+from.height/2)+'px';
  document.body.appendChild(fx);
  (toKeys||[]).forEach((key, i)=>{
    let tip=null;
    if(key==='face-enemy') tip=document.querySelector('.cbt-tower.enemy');
    else if(key==='face-player') tip=document.querySelector('.cbt-tower.ally');
    else tip=document.querySelector(`.cbt-card[data-uid="${key}"]`);
    const r=tip?.getBoundingClientRect();
    const bolt=document.createElement('i');
    bolt.className='cbt-fx-bolt';
    if(r){
      const x1=from.left+from.width/2, y1=from.top+from.height/2;
      const x2=r.left+r.width/2, y2=r.top+r.height/2;
      const dx=x2-x1, dy=y2-y1;
      const dist=Math.hypot(dx,dy)||1;
      bolt.style.width=dist+'px';
      bolt.style.transform=`rotate(${Math.atan2(dy,dx)}rad)`;
      bolt.style.animationDelay=(i*60)+'ms';
    }
    fx.appendChild(bolt);
    if(tip){
      tip.classList.add('cbt-fx-hit-'+vfx);
      setTimeout(()=>tip.classList.remove('cbt-fx-hit-'+vfx), 520);
    }
  });
  setTimeout(()=>fx.remove(), 700);
}

/* Floating damage/heal numbers */
function spawnDamageFloat(uid, amount, type='damage'){
  const root=document.querySelector('.combat-table')||document.body;
  const el=uid ? root.querySelector(`.cbt-card[data-uid="${uid}"]`) : null;
  if(!el) return;
  const r=el.getBoundingClientRect();
  const num=document.createElement('div');
  num.className='cbt-damage-float'+(type==='heal'?' heal':type==='buff'?' buff':'');
  num.textContent=(type==='heal'?'+':'-')+amount;
  num.style.left=(r.left+r.width/2-20)+'px';
  num.style.top=(r.top+r.height*0.3)+'px';
  document.body.appendChild(num);
  setTimeout(()=>num.remove(), 1500);
}

/* Tower shake effect */
function shakeTower(side){
  const selector=side==='enemy'?'.cbt-tower.enemy':'.cbt-tower.ally';
  const tower=document.querySelector(selector);
  if(!tower) return;
  tower.classList.remove('shaking');
  void tower.offsetWidth;
  tower.classList.add('shaking');
  setTimeout(()=>tower.classList.remove('shaking'), 700);
}

/* Screen shake effect */
function screenShake(){
  const table=document.querySelector('.combat-table');
  if(!table) return;
  table.classList.remove('screen-shake');
  void table.offsetWidth;
  table.classList.add('screen-shake');
  setTimeout(()=>table.classList.remove('screen-shake'), 450);
}

/* Death particles */
function spawnDeathParticles(uid){
  const root=document.querySelector('.combat-table')||document.body;
  const el=uid ? root.querySelector(`.cbt-card[data-uid="${uid}"]`) : null;
  if(!el) return;
  const r=el.getBoundingClientRect();
  const cx=r.left+r.width/2, cy=r.top+r.height/2;
  for(let i=0;i<12;i++){
    const p=document.createElement('div');
    p.className='cbt-death-particle';
    const angle=(i/12)*Math.PI*2;
    const dist=30+Math.random()*40;
    p.style.setProperty('--dx', (Math.cos(angle)*dist)+'px');
    p.style.setProperty('--dy', (Math.sin(angle)*dist)+'px');
    p.style.left=cx+'px';
    p.style.top=cy+'px';
    p.style.animationDelay=(Math.random()*0.15)+'s';
    document.body.appendChild(p);
    setTimeout(()=>p.remove(), 1000);
  }
}

/* Buff sparkles */
function spawnBuffSparkles(uid, count=6){
  const root=document.querySelector('.combat-table')||document.body;
  const el=uid ? root.querySelector(`.cbt-card[data-uid="${uid}"]`) : null;
  if(!el) return;
  const r=el.getBoundingClientRect();
  for(let i=0;i<count;i++){
    const s=document.createElement('div');
    s.className='cbt-buff-sparkle';
    s.style.left=(r.left+Math.random()*r.width)+'px';
    s.style.top=(r.top+Math.random()*r.height)+'px';
    s.style.animationDelay=(i*0.1)+'s';
    document.body.appendChild(s);
    setTimeout(()=>s.remove(), 1200);
  }
}

/* Strike impact effect */
function spawnStrikeImpact(fromUid, toUid){
  const root=document.querySelector('.combat-table')||document.body;
  const fromEl=fromUid ? root.querySelector(`.cbt-card[data-uid="${fromUid}"]`) : null;
  const toEl=toUid ? root.querySelector(`.cbt-card[data-uid="${toUid}"]`) : null;
  if(!fromEl||!toEl) return;
  const f=fromEl.getBoundingClientRect();
  const t=toEl.getBoundingClientRect();
  const fx=document.createElement('div');
  fx.className='cbt-fx cbt-fx-strike';
  fx.style.left=(f.left+f.width/2)+'px';
  fx.style.top=(f.top+f.height/2)+'px';
  document.body.appendChild(fx);
  const bolt=document.createElement('i');
  bolt.className='cbt-fx-bolt';
  const dx=t.left+t.width/2-(f.left+f.width/2);
  const dy=t.top+t.height/2-(f.top+f.height/2);
  const dist=Math.hypot(dx,dy)||1;
  bolt.style.width=dist+'px';
  bolt.style.transform=`rotate(${Math.atan2(dy,dx)}rad)`;
  fx.appendChild(bolt);
  toEl.classList.add('cbt-fx-hit-strike');
  setTimeout(()=>toEl.classList.remove('cbt-fx-hit-strike'), 520);
  setTimeout(()=>fx.remove(), 700);
}
function applyDamageToTarget(atkSide, target, dmg, opts={}){
  const b=state.battle; if(!b||dmg<=0) return null;
  const defSide=atkSide==='player'?'enemy':'player';
  const D=b[defSide];
  if(target.type==='face'){
    D.hp=Math.max(0, D.hp-dmg);
    return {key: defSide==='enemy'?'face-enemy':'face-player', label: defSide==='enemy'?'la tour adverse':'ta tour'};
  }
  const def=D.board.find(c=>c.uid===target.uid);
  if(!def) return null;
  const dealt=dealDamageToCreature(defSide, def, dmg, {allowRetaliate:opts.allowRetaliate});
  if(def.hp<=0){
    killCreature(defSide, def);
    return {key:def.uid, label:def.name+' (mort)'};
  }
  if(dealt<=0) return {key:def.uid, label:def.name+' (bouclier)'};
  return {key:def.uid, label:def.name};
}
function randomEnemyTargets(atkSide, count){
  const b=state.battle;
  const defSide=atkSide==='player'?'enemy':'player';
  const D=b[defSide];
  const pool=D.board.map(c=>({type:'minion', uid:c.uid}));
  pool.push({type:'face'});
  return pickRandom(pool, count);
}
function randomWoundedAllies(side, count){
  const wounded=side.board.filter(c=>(c.hp??c.health)<(c.maxHp??c.health));
  return pickRandom(wounded, count);
}
function makeSummonedCreature(source){
  const cap=source.capital;
  const maxCost=Math.max(1, Math.min(3, (source.cost||2)-1));
  let pool=CREATURES.filter(c=>c.capital===cap && (c.cost||0)<=maxCost && c.id!==source.id);
  if(!pool.length) pool=CREATURES.filter(c=>(c.cost||0)<=2);
  if(!pool.length) pool=[source];
  const base=pickN(pool,1)[0];
  const token=cloneCard(base);
  token.roles=stripPulseRoles(token.roles);
  token.summoned=true;
  token.justPlayed=true;
  token.canAttack=false;
  token.abilityCD=null;
  return token;
}
function summonBeside(side, source, who){
  if(side.board.length>=8){
    combatLog(`${source.name} ne peut pas invoquer : plateau plein.`);
    return null;
  }
  const idx=side.board.findIndex(c=>c.uid===source.uid);
  if(idx<0) return null;
  const token=makeSummonedCreature(source);
  const right=idx+1;
  if(right<=side.board.length) side.board.splice(right, 0, token);
  else side.board.splice(Math.max(0, idx), 0, token);
  combatLog(`${who==='player'?'Ton':'Adverse'} ${source.name} invoque ${token.name}.`);
  flashCombatCard(token.uid, 520);
  refreshBoardAuras(who);
  notifySummonTriggers(who, token);
  return token;
}
function triggerCreaturePulse(who, card, opts={}){
  const b=state.battle; if(!b||!card) return;
  const spec=abilityPulseSpec(card);
  if(!spec) return;
  const side=b[who];
  const hits=[];
  if(spec.kind==='dmg'){
    const targets=randomEnemyTargets(who, spec.targets);
    for(const t of targets){
      const res=applyDamageToTarget(who, t, spec.dmg);
      if(res) hits.push(res);
    }
    if(hits.length){
      combatLog(`${card.name} (${spec.label}) : ${spec.dmg} dégât(s) → ${hits.map(h=>h.label).join(', ')}.`);
      spawnCombatFx(spec.vfx, card.uid, hits.map(h=>h.key));
      hits.forEach(h=>{ if(h.key && !String(h.key).startsWith('face')) flashCombatCard(h.key, 380); });
      checkWinner();
    }
  } else if(spec.kind==='heal'){
    const wounded=randomWoundedAllies(side, spec.targets);
    if(!wounded.length){
      if(opts.enter) combatLog(`${card.name} (${spec.label}) : aucun allié blessé.`);
    } else {
      for(const ally of wounded){
        const max=ally.maxHp??ally.health;
        ally.hp=Math.min(max, (ally.hp??ally.health)+spec.amount);
        hits.push({key:ally.uid, label:`${ally.name} +${spec.amount}`});
      }
      combatLog(`${card.name} (${spec.label}) soigne : ${hits.map(h=>h.label).join(', ')}.`);
      spawnCombatFx('soin', card.uid, hits.map(h=>h.key));
      hits.forEach(h=>flashCombatCard(h.key, 380));
    }
  } else if(spec.kind==='summon'){
    const token=summonBeside(side, card, who);
    if(token) spawnCombatFx('invocation', card.uid, [token.uid]);
  }
  card.abilityCD=spec.period;
}
function tickBoardAbilities(who){
  const b=state.battle; if(!b) return;
  const side=b[who];
  // snapshot uids — summons can insert mid-loop
  const uids=side.board.map(c=>c.uid);
  for(const uid of uids){
    const c=side.board.find(x=>x.uid===uid);
    if(!c) continue;
    const spec=abilityPulseSpec(c);
    if(!spec) continue;
    if(c.abilityCD==null) c.abilityCD=spec.period;
    c.abilityCD-=1;
    if(c.abilityCD<=0) triggerCreaturePulse(who, c, {enter:false});
  }
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
function makeSide(factions){
  const deck=buildDeck(factions,40);
  const hand=sortHand(deck.splice(0,7));
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
    phase:'mulligan',
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
    flashUids:null,
    firstPlayer: playerFirst ? 'player' : 'enemy',
  };
  combatLog(`Factions: ${factions.join(', ')}. ${state.battle.coin} (pile ou face).`);
  combatLog(`Main d’ouverture (${state.battle.player.hand.length}) — garde ou repioche une fois.`);
  render();
}
function keepOpeningHand(){
  const b=state.battle;
  if(!b||b.phase!=='mulligan'||b.winner) return;
  combatLog('Tu gardes ta main.');
  finishMulligan();
}
function redrawOpeningHand(){
  const b=state.battle;
  if(!b||b.phase!=='mulligan'||b.winner) return;
  const p=b.player;
  const n=p.hand.length;
  p.deck.push(...p.hand);
  p.hand=[];
  shuffleInPlace(p.deck);
  for(let i=0;i<n;i++){
    if(!p.deck.length) break;
    p.hand.push(p.deck.shift());
  }
  sortHand(p.hand);
  combatLog(`Tu repioches ${p.hand.length} carte(s).`);
  finishMulligan();
}
function finishMulligan(){
  const b=state.battle; if(!b) return;
  b.phase='main';
  b.selectedHandUid=null;
  beginTurn(b.firstPlayer || b.active, true);
  render();
}
function flashCombatCard(uid, ms=420){
  const b=state.battle; if(!b||!uid) return;
  if(!Array.isArray(b.flashUids)) b.flashUids=[];
  if(!b.flashUids.includes(uid)) b.flashUids.push(uid);
  clearTimeout(flashCombatCard._t);
  flashCombatCard._t=setTimeout(()=>{
    if(state.battle){
      state.battle.flashUids=null;
      render();
    }
  }, ms);
}
function beginTurn(who, isOpening=false){
  const b=state.battle; if(!b||b.winner) return;
  // Fin de tour du camp adverse (sauf ouverture)
  if(!isOpening){
    const prev=who==='player'?'enemy':'player';
    runEndOfTurnEffects(prev);
  }
  b.active=who; b.phase='main'; b.selectedHandUid=null; b.insertAt=null;
  b.attackSource=null; b.aimLock=null; b.actionChoice=null;
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
  // Reset d’assaut + effets de début de tour
  const uids=p.board.map(c=>c.uid);
  for(const uid of uids){
    const c=p.board.find(x=>x.uid===uid);
    if(!c) continue;
    c.justPlayed=false;
    c.activatedThisTurn=false;
    c.attacksThisTurn=0;
    // Tank temporaire : appliqué au début du tour suivant l’activation, retiré en fin de ce tour
    if(c.pendingTank){
      c.tempTank=true;
      c.pendingTank=false;
      combatLog(`${c.name} devient Tank jusqu’à la fin de ce tour.`);
    }
    if(c.pendingRegen){
      c.hp=c.maxHp??c.baseMaxHp??c.hp;
      c.pendingRegen=false;
      combatLog(`${c.name} régénère tous ses PV.`);
      spawnCombatFx('soin', c.uid, [c.uid]);
    }
    if(c.skipNextAttack){
      c.frozen=true;
      c.skipNextAttack=false;
      combatLog(`${c.name} est gelé et ne peut pas attaquer.`);
    } else {
      c.frozen=false;
    }
    if(hasStatus(c,'poison') && !isOpening){
      dealDamageToCreature(who, c, 1, {fromStrike:false});
      combatLog(`${c.name} subit 1 dégât de Poison.`);
      if(c.hp<=0){ killCreature(who, c, 'poison'); continue; }
    }
    if(hasRole(c,'debut-tour-soin') && !isOpening){
      const healed=healCreature(c, 1);
      if(healed){
        combatLog(`${c.name} (Début de tour) : +1 PV.`);
        spawnCombatFx('soin', c.uid, [c.uid]);
      }
    }
    if(hasRole(c,'debut-tour-tir') && !isOpening){
      const hits=[];
      for(const t of randomEnemyTargets(who, 1)){
        const res=applyDamageToTarget(who, t, 1);
        if(res) hits.push(res);
      }
      if(hits.length){
        combatLog(`${c.name} (Aube sanglante) : 1 dégât → ${hits.map(h=>h.label).join(', ')}.`);
        spawnCombatFx('lancer', c.uid, hits.map(h=>h.key));
      }
    }
    c.canAttack=!c.frozen;
    c.exhausted=!!c.frozen;
  }
  if(!isOpening) tickBoardAbilities(who);
  checkWinner();
  combatLog(`Tour ${p.turnCount} — ${who==='player'?'à toi':'adversaire'} (mana ${p.mana}/${p.maxMana}).`);
  if(who==='enemy') setTimeout(()=>enemyTurn(), 350);
}
function runEndOfTurnEffects(who){
  const b=state.battle; if(!b) return;
  const side=b[who];
  const uids=side.board.map(c=>c.uid);
  for(const uid of uids){
    const c=side.board.find(x=>x.uid===uid);
    if(!c) continue;
    if(hasStatus(c,'brulant')){
      dealDamageToCreature(who, c, 1, {fromStrike:false, skipFury:false});
      combatLog(`${c.name} brûle (1 dégât).`);
      if(c.hp<=0){ killCreature(who, c, 'feu'); continue; }
    }
    if(hasRole(c,'fin-tour-tir')){
      const hits=[];
      for(const t of randomEnemyTargets(who, 1)){
        const res=applyDamageToTarget(who, t, 1);
        if(res) hits.push(res);
      }
      if(hits.length){
        combatLog(`${c.name} (Fin de tour) : 1 dégât → ${hits.map(h=>h.label).join(', ')}.`);
        spawnCombatFx('lancer', c.uid, hits.map(h=>h.key));
      }
    }
    if(hasRole(c,'fin-tour-buff')){
      buffCreature(c, 1, 0);
      combatLog(`${c.name} (Montée en puissance) : +1 ATQ.`);
      spawnCombatFx('etendard', c.uid, [c.uid]);
    }
    // Rempart : expire à la fin du tour où il était actif
    if(c.tempTank){
      c.tempTank=false;
      combatLog(`${c.name} n’est plus Tank.`);
    }
  }
  checkWinner();
}
function triggerEnterExtras(who, card){
  const b=state.battle; if(!b||!card) return;
  const side=b[who];
  if(hasRole(card,'bouclier-divin')){
    card.divineShield=true;
    combatLog(`${card.name} arrive avec Bouclier divin.`);
    spawnCombatFx('bouclier', card.uid, [card.uid]);
  }
  if(hasRole(card,'camouflage')){
    card.stealthed=true;
    combatLog(`${card.name} arrive camouflée.`);
  }
  if(hasRole(card,'jetons-1-1')){
    const spawned=[];
    for(let n=0;n<2;n++){
      if(side.board.length>=8) break;
      const token=makeToken11(card.capital);
      const idx=side.board.findIndex(c=>c.uid===card.uid);
      const at=idx>=0 ? Math.min(idx+1+n, side.board.length) : side.board.length;
      side.board.splice(at, 0, token);
      spawned.push(token);
    }
    if(spawned.length){
      combatLog(`${card.name} invoque ${spawned.length} Rejeton(s) 1/1.`);
      spawnCombatFx('invocation', card.uid, spawned.map(t=>t.uid));
      refreshBoardAuras(who);
      spawned.forEach(t=>notifySummonTriggers(who, t));
    }
  }
  if(hasRole(card,'donner-buff')){
    const allies=side.board.slice();
    const target=pickRandom(allies,1)[0]||card;
    buffCreature(target, 2, 2);
    combatLog(`${card.name} (Bénédiction) : +2/+2 à ${target.name}.`);
    spawnCombatFx('etendard', card.uid, [target.uid]);
    refreshBoardAuras(who);
  }
  if(hasRole(card,'cri-pioche')){
    drawOne(side, who);
    combatLog(`${card.name} (Cri de guerre) : pioche une carte.`);
  }
  if(hasRole(card,'cri-frappe')){
    const defSide=who==='player'?'enemy':'player';
    const foes=b[defSide].board.slice();
    const keys=[];
    foes.forEach(f=>{
      dealDamageToCreature(defSide, f, 1, {allowRetaliate:false});
      keys.push(f.uid);
    });
    if(keys.length){
      combatLog(`${card.name} (Cri de guerre) : 1 dégât à toutes les créatures adverses.`);
      spawnCombatFx('sort', card.uid, keys);
      sweepDead(defSide);
    }
  }
  notifySummonTriggers(who, card);
}
function notifySummonTriggers(who, summoned){
  const b=state.battle; if(!b||!summoned) return;
  b[who].board.forEach(c=>{
    if(c.uid===summoned.uid) return;
    if(!hasRole(c,'quand-invoque')) return;
    buffCreature(c, 1, 1);
    combatLog(`${c.name} (Appel du sang) : +1/+1.`);
    spawnCombatFx('formation', c.uid, [c.uid]);
  });
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
  sortHand(p.hand);
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
    hideCombatCardPreview();
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
  if(hasRole(card,'charge')){
    card.justPlayed=false;
    card.canAttack=true;
    card.exhausted=false;
  } else {
    card.justPlayed=true;
    card.canAttack=false;
  }
  combatLog(`${who==='player'?'Tu invoques':'Adverse invoque'} ${card.name} (${card.cost})${hasRole(card,'charge')?' — Charge !':''}.`);
  flashCombatCard(card.uid, 520);
  triggerEnterExtras(who, card);
  triggerCreaturePulse(who, card, {enter:true});
  refreshBoardAuras(who, {fxSource: card});
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
  if(!c || c.justPlayed || c.activatedThisTurn || c.frozen) return false;
  const used=c.attacksThisTurn||0;
  return used < maxAttacks(c) && !c.exhausted;
}
function canCreatureActivate(c){
  return !!(c && !c.justPlayed && !c.activatedThisTurn && !(c.attacksThisTurn>0) && activationSpec(c));
}
function isTank(c){
  return !!(c && (hasRole(c,'tank') || c.tempTank));
}
function isAssassin(c){
  return typeof hasAbility==='function'
    ? hasAbility(c,'assassin')
    : !!(c?.roles||[]).includes('assassin') || !!(c?.roles||[]).includes('ranged');
}
function hasNoRiposte(c){
  return typeof hasAbility==='function'
    ? hasAbility(c,'sans-riposte')
    : !!(c?.roles||[]).includes('sans-riposte') || !!(c?.roles||[]).includes('ranged');
}
/** Cibles légales pour un assaut (Tank force le focus, sauf Assassin / Camouflage). */
function legalAttackTargets(atkSide, atkCreature){
  const b=state.battle;
  const defSide=atkSide==='player'?'enemy':'player';
  const board=b[defSide].board;
  const visible=board.filter(c=>!isStealthed(c));
  const atk=atkCreature || (b.attackSource
    ? b[atkSide].board.find(c=>c.uid===b.attackSource)
    : null);
  if(atk && isAssassin(atk)){
    return { face:true, minions:visible.slice(), forcedTank:false, assassin:true };
  }
  const tanks=visible.filter(isTank);
  if(tanks.length){
    return { face:false, minions:tanks, forcedTank:true, assassin:false };
  }
  return { face:true, minions:visible.slice(), forcedTank:false, assassin:false };
}
function selectAttacker(uid){
  const b=state.battle; if(!b||b.active!=='player'||b.phase!=='main'||b.winner) return;
  const c=b.player.board.find(x=>x.uid===uid);
  if(!c) return;
  const canAtk=canCreatureAttack(c);
  const canAct=canCreatureActivate(c);
  if(!canAtk && !canAct){
    combatLog(c.justPlayed
      ? `${c.name} a le mal d’invocation.`
      : c.frozen ? `${c.name} est gelé.`
      : c.activatedThisTurn ? `${c.name} s’est déjà activée.`
      : `${c.name} a déjà agi ce tour.`);
    render();
    return;
  }
  b.selectedHandUid=null; b.insertAt=null;
  // Créature activable : choix Attaquer / Activer
  if(canAct){
    if(b.actionChoice===uid && !b.attackSource){ b.actionChoice=null; render(); return; }
    b.actionChoice=uid;
    b.attackSource=null; b.aimLock=null;
    teardownAim();
    combatLog(`${c.name} : choisis Attaquer ou Activer (${activationSpec(c).label}).`);
    render();
    return;
  }
  startAttackAim(uid);
}
function startAttackAim(uid){
  const b=state.battle; if(!b) return;
  const c=b.player.board.find(x=>x.uid===uid);
  if(!c || !canCreatureAttack(c)) return;
  if(b.attackSource===uid){ cancelAttack(); return; }
  b.actionChoice=null;
  b.selectedHandUid=null; b.insertAt=null;
  b.attackSource=uid; b.aimLock=null;
  const legal=legalAttackTargets('player', c);
  combatLog(legal.assassin || isAssassin(c)
    ? `${c.name} vise… Ranged : les Tanks ne te bloquent pas.`
    : legal.forcedTank
      ? `${c.name} vise… un Tank adverse protège le reste — cible-le.`
      : `${c.name} vise… choisis une cible (tour ou mignon).`);
  render();
}
function applyActivationEffect(who, c, spec){
  if(!c || !spec) return;
  breakStealth(c, 'activation');
  if(spec.effect==='regen'){
    c.pendingRegen=true;
    combatLog(`${c.name} s’active : régénération complète au prochain tour.`);
    spawnCombatFx('soin', c.uid, [c.uid]);
  } else if(spec.effect==='tank'){
    c.pendingTank=true;
    combatLog(`${c.name} s’active : Tank au prochain tour.`);
    spawnCombatFx('formation', c.uid, [c.uid]);
  } else if(spec.effect==='shield'){
    c.divineShield=true;
    combatLog(`${c.name} s’active : Bouclier divin !`);
    spawnCombatFx('bouclier', c.uid, [c.uid]);
  } else if(spec.effect==='strike'){
    const hits=[];
    for(const t of randomEnemyTargets(who, 1)){
      const res=applyDamageToTarget(who, t, 2);
      if(res) hits.push(res);
    }
    if(hits.length){
      combatLog(`${c.name} s’active : 2 dégâts → ${hits.map(h=>h.label).join(', ')}.`);
      spawnCombatFx('sort', c.uid, hits.map(h=>h.key));
    }
  } else if(spec.effect==='healAll'){
    const b=state.battle;
    const side=b[who];
    const keys=[];
    side.board.forEach(ally=>{
      if(healCreature(ally, 1)) keys.push(ally.uid);
    });
    combatLog(`${c.name} s’active : soigne les alliés (+1 PV).`);
    if(keys.length) spawnCombatFx('soin', c.uid, keys);
  } else if(spec.effect==='purge'){
    const cleaned=clearCreatureStatuses(c);
    const healed=healCreature(c, 2);
    combatLog(`${c.name} s’active : purification${cleaned?' (statuts retirés)':''}${healed?` +${healed} PV`:''}.`);
    spawnCombatFx('soin', c.uid, [c.uid]);
  }
}
function activateCreature(uid){
  const b=state.battle; if(!b||b.active!=='player'||b.phase!=='main'||b.winner) return;
  const c=b.player.board.find(x=>x.uid===uid);
  if(!c || !canCreatureActivate(c)) return;
  const spec=activationSpec(c);
  c.activatedThisTurn=true;
  c.canAttack=false;
  c.exhausted=true;
  b.actionChoice=null;
  b.attackSource=null;
  applyActivationEffect('player', c, spec);
  render();
}
function cancelAttack(){
  const b=state.battle; if(!b) return;
  if(!b.attackSource && !b.aimLock && !b.actionChoice) return;
  b.attackSource=null; b.aimLock=null; b.actionChoice=null;
  teardownAim();
  render();
}
function markAttackUsed(atk){
  atk.attacksThisTurn=(atk.attacksThisTurn||0)+1;
  if(atk.attacksThisTurn>=maxAttacks(atk)){
    atk.exhausted=true;
    atk.canAttack=false;
  } else {
    atk.exhausted=false;
    atk.canAttack=true;
    combatLog(`${atk.name} (Double attaque) : encore une attaque possible.`);
  }
}
function applyOnAttackEffects(atk, def){
  if(!def) return;
  const notes=[];
  for(const fx of ON_HIT_EFFECTS){
    if(!hasRole(atk, fx.role)) continue;
    if(fx.status) applyStatus(def, fx.status);
    if(fx.freeze) def.skipNextAttack=true;
    if(fx.weaken){
      buffCreature(def, -fx.weaken, 0);
      if((def.baseAttack||0)<0) def.baseAttack=0;
      if((def.attack||0)<0) def.attack=0;
    }
    notes.push(fx.label);
    spawnCombatFx(fx.vfx, atk.uid, [def.uid]);
  }
  if(notes.length) combatLog(`${def.name} subit : ${notes.join(', ')}.`);
}
function applyLifesteal(atk, amount){
  if(!atk || amount<=0 || !hasRole(atk,'vol-de-vie')) return;
  const healed=healCreature(atk, amount);
  if(healed){
    combatLog(`${atk.name} (Vol de vie) : +${healed} PV.`);
    spawnCombatFx('soin', atk.uid, [atk.uid]);
  }
}
function triggerAfterAttack(who, atk){
  if(!hasRole(atk,'apres-attaque')) return;
  const hits=[];
  for(const t of randomEnemyTargets(who, 1)){
    const res=applyDamageToTarget(who, t, 1);
    if(res) hits.push(res);
  }
  if(hits.length){
    combatLog(`${atk.name} (Enchaînement) : 1 dégât → ${hits.map(h=>h.label).join(', ')}.`);
    spawnCombatFx('lancer', atk.uid, hits.map(h=>h.key));
  }
}
function resolveCombatStrike(atkSide, atkUid, target){
  const b=state.battle; if(!b) return false;
  const defSide = atkSide==='player' ? 'enemy' : 'player';
  const A=b[atkSide], D=b[defSide];
  const atk=A.board.find(c=>c.uid===atkUid);
  if(!atk || !canCreatureAttack(atk)) return false;
  const legal=legalAttackTargets(atkSide, atk);
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
  markAttackUsed(atk);
  breakStealth(atk, 'attaque');
  flashCombatCard(atk.uid);
  if(target.type==='face'){
    D.hp=Math.max(0, D.hp-atk.attack);
    const tower=atkSide==='player'?'la tour adverse':'ta tour';
    combatLog(`${atk.name} frappe ${tower} pour ${atk.attack} (${D.hp}/30).`);
    shakeTower(defSide);
    if(atk.attack>=4) screenShake();
    applyLifesteal(atk, atk.attack);
    triggerAfterAttack(atkSide, atk);
  } else {
    const def=D.board.find(c=>c.uid===target.uid);
    if(!def){
      atk.attacksThisTurn=Math.max(0,(atk.attacksThisTurn||1)-1);
      atk.exhausted=false; atk.canAttack=true;
      return false;
    }
    if(isStealthed(def)){
      combatLog(`${def.name} est camouflée — cible invalide.`);
      atk.attacksThisTurn=Math.max(0,(atk.attacksThisTurn||1)-1);
      atk.exhausted=false; atk.canAttack=true;
      return false;
    }
    const tankNote=isTank(def)?' (Tank)':'';
    const noRiposte=hasNoRiposte(atk);
    const riposteDmg=def.attack||0;
    let dealt=0;
    // Dégâts d’attaque + vol de vie / on-hit avant la riposte (évite un heal post-létal)
    if(noRiposte){
      combatLog(`${atk.name} (${atk.attack}) frappe ${def.name}${tankNote} — sans riposte.`);
      dealt=dealDamageToCreature(defSide, def, atk.attack);
    } else {
      combatLog(`${atk.name} (${atk.attack}) charge ${def.name}${tankNote} — riposte ${riposteDmg}.`);
      dealt=dealDamageToCreature(defSide, def, atk.attack);
    }
    if(dealt>0 && def.hp>0){
      applyOnAttackEffects(atk, def);
      spawnStrikeImpact(atk.uid, def.uid);
    } else if(dealt>0 && def.hp<=0){
      spawnStrikeImpact(atk.uid, def.uid);
      // Effets on-hit inutiles sur un cadavre — skip
    }
    if(dealt>0) applyLifesteal(atk, dealt);
    if(!noRiposte && def.hp>0 && riposteDmg>0){
      dealDamageToCreature(atkSide, atk, riposteDmg);
    }
    flashCombatCard(def.uid);
    const killedDef=def.hp<=0;
    if(killedDef){
      killCreature(defSide, def);
      if(hasRole(atk,'quand-tue') && atk.hp>0 && A.board.some(x=>x.uid===atk.uid)){
        buffCreature(atk, 1, 1);
        combatLog(`${atk.name} (Exécution) : +1/+1.`);
        spawnCombatFx('etendard', atk.uid, [atk.uid]);
      }
    }
    if(atk.hp<=0) killCreature(atkSide, atk);
    else triggerAfterAttack(atkSide, atk);
  }
  checkWinner();
  return true;
}
function confirmAttackFace(){
  const b=state.battle;
  if(!b||b.active!=='player'||b.phase!=='main'||!b.attackSource) return;
  const atk=b.player.board.find(c=>c.uid===b.attackSource);
  if(!legalAttackTargets('player', atk).face){
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
  const atk=b.player.board.find(c=>c.uid===b.attackSource);
  const legal=legalAttackTargets('player', atk);
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
  const legal=legalAttackTargets('enemy', atk);
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
  b.selectedHandUid=null; b.attackSource=null; b.aimLock=null; b.actionChoice=null;
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
  // IA : parfois activer plutôt qu’attaquer
  b.enemy.board.forEach(c=>{
    if(!canCreatureActivate(c)) return;
    if(Math.random()<0.35){
      const spec=activationSpec(c);
      c.activatedThisTurn=true; c.canAttack=false; c.exhausted=true;
      applyActivationEffect('enemy', c, spec);
      combatLog(`Adverse active ${c.name} (${spec.label}).`);
    }
  });
  const attackers=[];
  b.enemy.board.forEach(c=>{
    if(!canCreatureAttack(c)) return;
    attackers.push(c.uid);
    if(hasRole(c,'double-attaque') && maxAttacks(c)>1) attackers.push(c.uid);
  });
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
  const fm=typeof factionMana==='function' ? factionMana(c) : {color:'#c9aa69'};
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
  const flash=(state.battle && Array.isArray(state.battle.flashUids) && state.battle.flashUids.includes(c.uid)) ? ' cbt-flash' : '';
  const click=opts.onclick?`onclick="${opts.onclick}"`:'';
  const drag=opts.draggable
    ? `onpointerdown="onHandPointerDown(event,'${c.uid}')"`
    : '';
  const title = opts.summonSick ? ' title="Mal d’invocation — attaque au prochain tour"'
    : opts.exhausted ? ' title="Déjà utilisée"'
    : opts.aiming ? ' title="Attaquante — choisis une cible"'
    : opts.blocked ? (opts.stealthed ? ' title="Camouflage — impossible à cibler"' : ' title="Protégé par un Tank — cible invalide"')
    : opts.targetable ? (opts.forcedTank ? ' title="Tank — cible obligatoire"' : ' title="Cible valide — cliquer pour attaquer"')
    : opts.ready ? ' title="Prête — cliquer pour attaquer ou activer"'
    : '';
  const statusClasses=[];
  if(hasStatus(c,'poison')) statusClasses.push('is-poisoned');
  if(hasStatus(c,'brulant')) statusClasses.push('is-burning');
  if(c.frozen || c.skipNextAttack) statusClasses.push('is-frozen');
  if(c.weakened) statusClasses.push('is-weakened');
  if(hasRole(c,'furie')) statusClasses.push('has-fury');
  const statusCls=statusClasses.length ? ' '+statusClasses.join(' ') : '';
  const cls=`cbt-card${sel}${atk}${sick}${exhausted}${ready}${aiming}${target}${tank}${blocked}${unafford}${statusCls}${flash}${opts.draggable?' can-drag':''}${opts.hand?' in-hand':''}${c.divineShield?' has-shield':''}`;
  const style=`style="--faction:${fm.color}"`;
  const badge = opts.aiming?'<em class="cbt-badge atk-badge">Vise…</em>'
    : opts.targetable && opts.forcedTank?'<em class="cbt-badge tank-badge">Tank</em>'
    : opts.targetable?'<em class="cbt-badge target-badge">Cible</em>'
    : opts.blocked && opts.stealthed?'<em class="cbt-badge stealth-badge">Camouflage</em>'
    : opts.blocked?'<em class="cbt-badge blocked-badge">Protégé</em>'
    : opts.summonSick?'<em class="cbt-badge sick-badge">Sommeil</em>'
    : opts.ready?'<em class="cbt-badge ready-badge">Prête</em>'
    : opts.exhausted?'<em class="cbt-badge done-badge">Fatiguée</em>'
    : (isStealthed(c) && !opts.hand ? '<em class="cbt-badge stealth-badge">Camouflage</em>'
    : (isTank(c) && !opts.hand ? '<em class="cbt-badge tank-badge">Tank</em>' : ''));
  const marks=[];
  if(!opts.hand){
    if(c.divineShield) marks.push('<i class="cbt-mark shield" title="Bouclier divin"></i>');
    if(isStealthed(c)) marks.push('<i class="cbt-mark stealth" title="Camouflage"></i>');
    if(hasStatus(c,'poison')) marks.push('<i class="cbt-mark poison" title="Poison"></i>');
    if(hasStatus(c,'brulant')) marks.push('<i class="cbt-mark burn" title="Feu"></i>');
    if(c.frozen || c.skipNextAttack) marks.push('<i class="cbt-mark freeze" title="Gel"></i>');
    if(c.pendingRegen) marks.push('<i class="cbt-mark regen" title="Régénère au prochain tour"></i>');
    if(c.pendingTank || c.tempTank) marks.push('<i class="cbt-mark tanking" title="Tank temporaire"></i>');
  }
  const statusRow=marks.length?`<span class="cbt-marks">${marks.join('')}</span>`:'';
  const face = typeof buildFfCardHtml==='function'
    ? buildFfCardHtml(c, {
        forceArchive:true,
        frame: typeof frameFor==='function' ? frameFor(c) : {id:'normal'},
        hp: c.hp ?? c.health,
        maxHp: c.maxHp ?? c.health,
        attack: c.attack,
      })
    : `<strong>${c.name}</strong>`;
  if(opts.hand){
    return `<div role="button" tabindex="0" class="${cls}" data-uid="${c.uid}" ${style} ${click} ${drag}
      onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();${opts.onclick||''}}">
      ${face}${badge}
    </div>`;
  }
  return `<button type="button" class="${cls}" data-uid="${c.uid}" ${style} ${click}${title}>
    ${face}${badge}${statusRow}
  </button>`;
}
function renderBoardRow(side, who){
  const b=state.battle;
  const board=b[who].board;
  const isPlayer=who==='player';
  const aiming=!!b.attackSource && (b.phase==='main' || b.phase==='enemy_attack');
  const playerAiming=b.active==='player' && b.phase==='main' && !!b.attackSource
    && b.player.board.some(c=>c.uid===b.attackSource);
  const aimAtk=playerAiming ? b.player.board.find(c=>c.uid===b.attackSource) : null;
  const legal=playerAiming ? legalAttackTargets('player', aimAtk) : null;
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
          stealthed: isStealthed(c),
          forcedTank:!!legal.forcedTank,
          selected:false,
        }));
      } else if(isPlayer && b.active==='player' && b.phase==='main' && !b.winner){
        const ready=canCreatureAttack(c) || canCreatureActivate(c);
        const choosing=b.actionChoice===c.uid;
        parts.push(miniCard(c,{
          onclick:`selectAttacker('${c.uid}')`,
          selected:isSource || choosing,
          aiming:isSource,
          ready:ready && !isSource && !choosing,
          summonSick: !!c.justPlayed,
          exhausted: !!c.exhausted && !ready,
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
      <p>Decks aléatoires · Attaque ou activation · Charge, vol de vie, dernier souffle, furie, statuses…</p></div>
      <button class="cbt-start" onclick="startCombat()">Nouveau combat</button></div>
    </section>`;
  }
  const mulligan=b.phase==='mulligan';
  const ended=b.winner?`<div class="cbt-banner ${b.winner}">${b.winner==='player'?'Victoire !':b.winner==='enemy'?'Défaite…':'Match nul'} <button onclick="startCombat()">Rejouer</button></div>`:'';
  const handCanDrag=!mulligan && b.active==='player' && b.phase==='main' && !b.winner && !b.attackSource;
  const playerAiming=!mulligan && b.active==='player' && b.phase==='main' && !!b.attackSource
    && b.player.board.some(c=>c.uid===b.attackSource);
  const choosingAction=!mulligan && b.active==='player' && b.phase==='main' && !!b.actionChoice
    && !b.attackSource && b.player.board.some(c=>c.uid===b.actionChoice);
  const actionCard=choosingAction ? b.player.board.find(c=>c.uid===b.actionChoice) : null;
  const actionSpec=actionCard ? activationSpec(actionCard) : null;
  const aimAtk=playerAiming ? b.player.board.find(c=>c.uid===b.attackSource) : null;
  const aimLegal=playerAiming ? legalAttackTargets('player', aimAtk) : null;
  const aimName=b.attackSource
    ? (b.player.board.find(c=>c.uid===b.attackSource)||b.enemy.board.find(c=>c.uid===b.attackSource))?.name
    : null;
  const statusLabel = b.winner ? 'Partie terminée'
    : mulligan ? 'Main d’ouverture'
    : b.phase==='enemy_attack' ? 'Assaut adverse'
    : choosingAction ? `Action — ${actionCard?.name||'créature'}`
    : playerAiming ? `Visée — ${aimName||'créature'}`
    : b.active==='player' ? 'Ton tour' : 'Tour adverse';
  const aimHint = aimLegal?.assassin
    ? `<strong>Ranged</strong> : ignore les Tanks et n’encaisse pas de riposte.`
    : aimLegal?.forcedTank
      ? `Un <strong>Tank</strong> protège le camp adverse — tu dois le frapper.`
      : `Pointe la <strong>tour adverse</strong> ou un <strong>mignon</strong> — la flèche jaune suit ton geste.`;
  const midControls = b.winner ? `<span class="cbt-wait">Partie terminée</span>`
    : mulligan ? `
      <div class="cbt-mulligan-panel">
        <b>Main d’ouverture</b>
        <p>Garde ces ${b.player.hand.length} cartes, ou <strong>repioche une fois</strong> le même nombre.</p>
        <div class="cbt-mulligan-actions">
          <button class="cbt-end" type="button" onclick="keepOpeningHand()">Garder</button>
          <button class="cbt-start" type="button" onclick="redrawOpeningHand()">Repiocher</button>
        </div>
      </div>`
    : choosingAction ? `
      <div class="cbt-aim-panel cbt-action-panel">
        <b>${actionCard.name}</b>
        <p>Attaquer, ou <strong>Activer : ${actionSpec?.label||'effet'}</strong> (ne pourra plus attaquer ce tour).</p>
        <div class="cbt-mulligan-actions">
          ${canCreatureAttack(actionCard)?`<button class="cbt-start" type="button" onclick="startAttackAim('${actionCard.uid}')">Attaquer</button>`:''}
          <button class="cbt-end" type="button" onclick="activateCreature('${actionCard.uid}')">Activer</button>
          <button class="cbt-end" type="button" onclick="cancelAttack()">Annuler</button>
        </div>
      </div>`
    : playerAiming ? `
      <div class="cbt-aim-panel${aimLegal?.forcedTank?' tank-lock':''}${aimLegal?.assassin?' assassin-lock':''}">
        <b>${aimLegal?.assassin?'Ranged — libre':aimLegal?.forcedTank?'Tank adverse !':'Choisis une cible'}</b>
        <p>${aimHint}</p>
        <button class="cbt-end" type="button" onclick="cancelAttack()">Annuler (Échap)</button>
      </div>`
    : b.phase==='enemy_attack' ? `<span class="cbt-wait">Assaut en cours…</span>`
    : b.active==='player' && b.phase==='main' ? `
        <span class="cbt-hint">Clique une créature <em>Prête</em> — attaque ou activation</span>
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
  return `<section class="${combatTableClasses(`${playerAiming?' is-aiming':''}${mulligan?' is-mulligan':''}${aimLegal?.forcedTank?' tank-lock':''}`)}">
    ${aimSvg}
    ${ended}
    <div class="cbt-meta">
      <div><b>Factions</b> ${b.factions.map(f=>{
        const fm=FACTION_MANA[f]||{};
        return `<span class="tag" style="--faction:${fm.color||'#999'}" title="${fm.element||f}">${f}${fm.element?` · ${fm.element}`:''}</span>`;
      }).join('')}</div>
      <div class="cbt-status-line">${b.coin} · ${statusLabel}</div>
      ${renderCombatConfigBar()}
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
        const ok=!mulligan && canAfford(b.player,c) && b.player.board.length<8;
        return miniCard(c,{
          hand:true,
          selected:b.selectedHandUid===c.uid,
          onclick: !mulligan && b.phase==='main' && !b.attackSource ? `selectHandCard('${c.uid}')` : '',
          draggable: handCanDrag && ok,
          checkAfford:!mulligan,
          affordable: mulligan ? true : ok,
        });
      }).join('')}<small>Deck ${b.player.deck.length}</small></div>
    </div>
    ${ensureCombatPrefs().showLog===false?'':`<aside class="cbt-log"><h3>Journal</h3>${b.log.map(x=>`<p>${x}</p>`).join('')}</aside>`}
  </section>`;
}

function findCombatCardByUid(uid){
  const b=state.battle; if(!b||!uid) return null;
  return b.player.hand.find(c=>c.uid===uid)
    || b.player.board.find(c=>c.uid===uid)
    || b.enemy.board.find(c=>c.uid===uid)
    || null;
}
function hideCombatCardPreview(){
  const host=document.getElementById('cbt-card-preview');
  if(!host) return;
  host.classList.remove('show');
  host.replaceChildren();
}
function showCombatCardPreview(el){
  if(!el || state.tab!=='combat' || !state.battle) return;
  if(_ptrDrag?.active) return;
  const uid=el.getAttribute('data-uid');
  const c=findCombatCardByUid(uid);
  if(!c || typeof buildFfCardHtml!=='function') return;
  const r=el.getBoundingClientRect();
  const midX=r.left + r.width/2;
  const side = midX < window.innerWidth * 0.5 ? 'right' : 'left';
  let host=document.getElementById('cbt-card-preview');
  if(!host){
    host=document.createElement('div');
    host.id='cbt-card-preview';
    host.setAttribute('aria-hidden','true');
    document.body.appendChild(host);
  }
  host.className='cbt-card-preview show side-'+side;
  const midY=r.top + r.height/2;
  const y=Math.max(24, Math.min(window.innerHeight - 24, midY));
  host.style.top=y+'px';
  host.innerHTML=buildFfCardHtml(c, {
    forceArchive:true,
    frame: typeof frameFor==='function' ? frameFor(c) : {id:'normal'},
    hp: c.hp ?? c.health,
    maxHp: c.maxHp ?? c.health,
    attack: c.attack,
    extraClass:'cbt-preview-face',
  });
}
function bindCombatCardPreview(){
  if(bindCombatCardPreview._ready) return;
  bindCombatCardPreview._ready=true;
  document.addEventListener('pointerover', (ev)=>{
    const el=ev.target?.closest?.('.combat-table .cbt-card');
    if(!el) return;
    const from=ev.relatedTarget;
    if(from && el.contains(from)) return;
    showCombatCardPreview(el);
  });
  document.addEventListener('pointerout', (ev)=>{
    const el=ev.target?.closest?.('.combat-table .cbt-card');
    if(!el) return;
    const to=ev.relatedTarget;
    if(to && el.contains(to)) return;
    hideCombatCardPreview();
  });
  document.addEventListener('pointerdown', (ev)=>{
    if(ev.target?.closest?.('.combat-table .cbt-card')) hideCombatCardPreview();
  }, true);
}

window.startCombat=startCombat;
window.keepOpeningHand=keepOpeningHand;
window.redrawOpeningHand=redrawOpeningHand;
window.selectHandCard=selectHandCard;
window.playSelectedAt=playSelectedAt;
window.selectAttacker=selectAttacker;
window.startAttackAim=startAttackAim;
window.activateCreature=activateCreature;
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
window.showCombatCardPreview=showCombatCardPreview;
window.hideCombatCardPreview=hideCombatCardPreview;
window.toggleCombatFullscreen=toggleCombatFullscreen;
window.toggleCombatDensity=toggleCombatDensity;
window.toggleCombatLog=toggleCombatLog;
window.cycleCombatZoom=cycleCombatZoom;

if(!window._cbtFsBound){
  window._cbtFsBound=true;
  document.addEventListener('fullscreenchange', ()=>{ if(state.tab==='combat') render(); });
  document.addEventListener('webkitfullscreenchange', ()=>{ if(state.tab==='combat') render(); });
}

bindCombatCardPreview();
ensureCombatPrefs();
render();

