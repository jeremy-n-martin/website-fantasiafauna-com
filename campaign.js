/* Campagne — Puzzle Quest / tour du magicien, combats de cartes */

const CAMPAIGN_KEY='ff-campaign-v1';
/** Échelle boutique / craft : 5 cartes d’une rareté → 1 de la rareté supérieure. */
const CAMPAIGN_RARITIES=[
  {id:'normal', label:'Normale', weight:55},
  {id:'bronze', label:'Bronze', weight:28},
  {id:'silver', label:'Argent', weight:12},
  {id:'gold', label:'Or', weight:4},
  {id:'rosegold', label:'Or rose', weight:0.85},
  {id:'obsidian', label:'Obsidienne', weight:0.15},
];
const RARITY_CRAFT_COST=5;

const CAMPAIGN_INTRO=[
  {
    eyebrow:'Prologue I',
    title:'La tour oubliée',
    text:'Tu es un magicien isolé dans une tour de pierre. Ton classeur — reliure d’écailles et d’encre — est encore presque vide. Dehors, les routes murmurent déjà le nom d’un seigneur de guerre qui collectionne les créatures comme des trophées.',
  },
  {
    eyebrow:'Prologue II',
    title:'L’appel des cartes',
    text:'Chaque duel rempli ton coffre d’or et ton classeur de cartes. Cinq exemplaires d’une même rareté peuvent être fusionnés en une rareté supérieure — des normales au bronze, jusqu’à l’obsidienne, plus rare que l’ombre.',
  },
  {
    eyebrow:'Prologue III',
    title:'Premier affrontement',
    text:'Un éclaireur du seigneur de guerre camp sous ta tour. Gagne ce combat : tu ramèneras or et cartes. Plus tard, les marchands échangeront tout cela. Pour l’heure… tire ta première main.',
  },
];

function defaultCampaign(){
  return {
    gold:50,
    binder:[], // {creatureId, name, rarity, count}
    introStep:0,
    phase:'intro', // intro | hub | battle | rewards | binder | fusion | shop
    battlesWon:0,
    lastRewards:null,
    shopStock:null,
    shopMsg:null,
  };
}
function ensureCampaign(){
  if(!state.campaign) state.campaign=loadCampaign();
  return state.campaign;
}
function loadCampaign(){
  try{
    const raw=localStorage.getItem(CAMPAIGN_KEY);
    if(!raw) return defaultCampaign();
    return {...defaultCampaign(), ...JSON.parse(raw)};
  }catch(_){
    return defaultCampaign();
  }
}
function saveCampaign(){
  try{ localStorage.setItem(CAMPAIGN_KEY, JSON.stringify(ensureCampaign())); }catch(_){}
}
function rarityIndex(id){
  return CAMPAIGN_RARITIES.findIndex(r=>r.id===id);
}
function nextRarity(id){
  const i=rarityIndex(id);
  if(i<0 || i>=CAMPAIGN_RARITIES.length-1) return null;
  return CAMPAIGN_RARITIES[i+1].id;
}
function rarityLabel(id){
  return CAMPAIGN_RARITIES.find(r=>r.id===id)?.label || id;
}
function rollCampaignRarity(){
  const total=CAMPAIGN_RARITIES.reduce((s,r)=>s+r.weight,0);
  let n=Math.random()*total;
  for(const r of CAMPAIGN_RARITIES){
    n-=r.weight;
    if(n<=0) return r.id;
  }
  return 'normal';
}
function binderKey(creatureId, rarity){
  return `${creatureId}::${rarity}`;
}
function addToBinder(creatureId, rarity='normal', count=1){
  const camp=ensureCampaign();
  const c=CREATURES.find(x=>x.id===Number(creatureId));
  if(!c || count<=0) return null;
  const rarityId=CAMPAIGN_RARITIES.some(r=>r.id===rarity) ? rarity : 'normal';
  let row=camp.binder.find(e=>e.creatureId===c.id && e.rarity===rarityId);
  if(!row){
    row={creatureId:c.id, name:c.name, rarity:rarityId, count:0};
    camp.binder.push(row);
  }
  row.count+=count;
  saveCampaign();
  return row;
}
/** Fusionne 5 cartes (même créature + rareté) → 1 de rareté supérieure. */
function craftBinderUpgrade(creatureId, rarity){
  const camp=ensureCampaign();
  const next=nextRarity(rarity);
  if(!next) return {ok:false, error:'max_rarity'};
  const row=camp.binder.find(e=>e.creatureId===Number(creatureId) && e.rarity===rarity);
  if(!row || row.count<RARITY_CRAFT_COST) return {ok:false, error:'not_enough'};
  row.count-=RARITY_CRAFT_COST;
  if(row.count<=0) camp.binder=camp.binder.filter(e=>e!==row);
  addToBinder(creatureId, next, 1);
  saveCampaign();
  return {ok:true, rarity:next};
}
function binderCount(){
  return ensureCampaign().binder.reduce((s,e)=>s+(e.count||0),0);
}
function sortedBinder(){
  const camp=ensureCampaign();
  return camp.binder.slice().sort((a,b)=>{
    const ra=rarityIndex(a.rarity), rb=rarityIndex(b.rarity);
    if(ra!==rb) return rb-ra;
    return (a.name||'').localeCompare(b.name||'','fr');
  });
}
function creatureArt(creatureId){
  const c=CREATURES.find(x=>x.id===Number(creatureId));
  if(!c) return '';
  return (typeof currentImageFor==='function' ? currentImageFor(c) : null) || c.image || '';
}
const SHOP_PRICES={
  normal:{buy:22, sell:7},
  bronze:{buy:55, sell:18},
  silver:{buy:130, sell:42},
  gold:{buy:300, sell:95},
  rosegold:{buy:650, sell:210},
  obsidian:{buy:1500, sell:480},
};
function shopPrice(rarity, kind='buy'){
  return (SHOP_PRICES[rarity] || SHOP_PRICES.normal)[kind];
}
function refreshShopStock(force=false){
  const camp=ensureCampaign();
  if(!force && Array.isArray(camp.shopStock) && camp.shopStock.length) return camp.shopStock;
  const stock=[];
  const n=5;
  for(let i=0;i<n;i++){
    const c=pickRewardCreature();
    // Boutique : un peu plus généreuse en bronze/argent que les drops de combat
    const roll=Math.random();
    let rarity='normal';
    if(roll>0.97) rarity='gold';
    else if(roll>0.88) rarity='silver';
    else if(roll>0.55) rarity='bronze';
    stock.push({
      uid:'shop-'+i+'-'+c.id+'-'+Date.now().toString(36),
      creatureId:c.id,
      name:c.name,
      rarity,
      price:shopPrice(rarity,'buy'),
    });
  }
  camp.shopStock=stock;
  camp.shopMsg=null;
  saveCampaign();
  return stock;
}
function buyShopOffer(uid){
  const camp=ensureCampaign();
  const offer=(camp.shopStock||[]).find(o=>o.uid===uid);
  if(!offer) return;
  if((camp.gold||0)<offer.price){
    camp.shopMsg=`Pas assez d’or (il faut ${offer.price}).`;
    saveCampaign();
    render();
    return;
  }
  camp.gold-=offer.price;
  addToBinder(offer.creatureId, offer.rarity, 1);
  camp.shopStock=(camp.shopStock||[]).filter(o=>o.uid!==uid);
  camp.shopMsg=`Acheté : ${offer.name} (${rarityLabel(offer.rarity)}) pour ${offer.price} or.`;
  saveCampaign();
  render();
}
function sellBinderCard(creatureId, rarity){
  const camp=ensureCampaign();
  const row=camp.binder.find(e=>e.creatureId===Number(creatureId) && e.rarity===rarity);
  if(!row || row.count<1) return;
  const price=shopPrice(rarity,'sell');
  row.count-=1;
  if(row.count<=0) camp.binder=camp.binder.filter(e=>e!==row);
  camp.gold=(camp.gold||0)+price;
  camp.shopMsg=`Vendu : ${row.name} (${rarityLabel(rarity)}) pour ${price} or.`;
  saveCampaign();
  render();
}
function payShopRefresh(){
  const camp=ensureCampaign();
  const cost=15;
  if((camp.gold||0)<cost){
    camp.shopMsg=`Rafraîchir coûte ${cost} or.`;
    saveCampaign();
    render();
    return;
  }
  camp.gold-=cost;
  refreshShopStock(true);
  camp.shopMsg=`Étalage renouvelé (−${cost} or).`;
  saveCampaign();
  render();
}
function setCampaignView(view){
  const camp=ensureCampaign();
  if((camp.introStep||0)<CAMPAIGN_INTRO.length) return;
  camp.phase=view;
  if(view==='shop') refreshShopStock(false);
  if(view==='binder'){
    state.binderRarity='Toutes';
    state.activeCapital='Toutes';
    state.search='';
    state.zoomedId=null;
  }
  camp.shopMsg=null;
  state.battle=null;
  state.combatView='campagne';
  saveCampaign();
  render();
}
function doCraftUpgrade(creatureId, rarity){
  const res=craftBinderUpgrade(creatureId, rarity);
  const camp=ensureCampaign();
  if(!res.ok){
    camp.shopMsg=res.error==='not_enough'
      ? `Il faut ${RARITY_CRAFT_COST} exemplaires.`
      : 'Impossible de fusionner (rareté max).';
  } else {
    const c=CREATURES.find(x=>x.id===Number(creatureId));
    camp.shopMsg=`Fusion : ${c?.name||'carte'} → ${rarityLabel(res.rarity)}.`;
  }
  saveCampaign();
  render();
}
function pickRewardCreature(){
  const pool=CREATURES.slice().sort((a,b)=>(a.cost||0)-(b.cost||0));
  const low=pool.slice(0, Math.max(40, Math.floor(pool.length*0.45)));
  return low[Math.floor(Math.random()*low.length)] || CREATURES[0];
}
function rollCampaignRewards(victory){
  const gold=victory
    ? 18 + Math.floor(Math.random()*23)
    : 4 + Math.floor(Math.random()*8);
  const cards=[];
  const n=victory ? (Math.random()<0.55 ? 2 : 1) : (Math.random()<0.35 ? 1 : 0);
  for(let i=0;i<n;i++){
    const c=pickRewardCreature();
    const rarity=victory ? rollCampaignRarity() : 'normal';
    cards.push({creatureId:c.id, name:c.name, rarity, image:c.image});
  }
  return {victory:!!victory, gold, cards};
}
function applyCampaignRewards(rewards){
  const camp=ensureCampaign();
  if(!rewards) return;
  camp.gold=(camp.gold||0)+(rewards.gold||0);
  (rewards.cards||[]).forEach(card=>{
    addToBinder(card.creatureId, card.rarity, 1);
  });
  if(rewards.victory) camp.battlesWon=(camp.battlesWon||0)+1;
  camp.lastRewards=rewards;
  saveCampaign();
}

function startCampaign(){
  state.tab='combat';
  state.combatView='campagne';
  state.battle=null;
  const camp=ensureCampaign();
  if(camp.phase==='battle') camp.phase='hub';
  if((camp.introStep||0)<CAMPAIGN_INTRO.length) camp.phase='intro';
  else if(camp.phase!=='rewards') camp.phase='hub';
  saveCampaign();
  if(typeof hideCombatCardPreview==='function') hideCombatCardPreview();
  render();
}
function advanceCampaignIntro(){
  const camp=ensureCampaign();
  camp.introStep=(camp.introStep||0)+1;
  if(camp.introStep>=CAMPAIGN_INTRO.length){
    camp.phase='hub';
    saveCampaign();
    startCampaignBattle();
    return;
  }
  saveCampaign();
  render();
}
function startCampaignBattle(){
  const camp=ensureCampaign();
  camp.phase='battle';
  camp.lastRewards=null;
  saveCampaign();
  state.combatView='campagne';
  const all=allFactions();
  const playerFactions=pickN(all, Math.min(2, all.length));
  const rest=all.filter(f=>!playerFactions.includes(f));
  const enemyPool=rest.length>=2 ? rest : all;
  const enemyFactions=pickN(enemyPool, Math.min(2, enemyPool.length));
  const factions=[...new Set([...playerFactions, ...enemyFactions])];
  const playerFirst=Math.random()<0.5;
  state.tab='combat';
  state.battle={
    mode:'campagne',
    factions,
    playerFactions,
    enemyFactions,
    turn:1,
    active: playerFirst ? 'player' : 'enemy',
    phase:'mulligan',
    player: makeSide(playerFactions, 15),
    enemy: makeSide(enemyFactions, 15),
    selectedHandUid:null,
    insertAt:null,
    attackSource:null,
    aimLock:null,
    winner:null,
    rewards:null,
    rewardsApplied:false,
    coin: playerFirst ? 'Tu commences' : 'L’adversaire commence',
    log:[],
    anim:null,
    flashUids:null,
    firstPlayer: playerFirst ? 'player' : 'enemy',
  };
  combatLog(`Campagne — Toi: ${playerFactions.join(' · ')} · Adverse: ${enemyFactions.join(' · ')}.`);
  combatLog(`Decks: 15 cartes les moins chères. ${state.battle.coin}.`);
  render();
}
function claimCampaignBattleRewards(){
  const b=state.battle;
  if(!b || b.mode!=='campagne' || !b.winner) return;
  if(!b.rewardsApplied){
    b.rewards=rollCampaignRewards(b.winner==='player');
    applyCampaignRewards(b.rewards);
    b.rewardsApplied=true;
  }
  const camp=ensureCampaign();
  camp.phase='rewards';
  camp.lastRewards=b.rewards;
  state.battle=null;
  saveCampaign();
  render();
}
function finishCampaignRewards(){
  const camp=ensureCampaign();
  camp.phase='hub';
  state.battle=null;
  saveCampaign();
  render();
}

function renderCampaignIntro(){
  const camp=ensureCampaign();
  const step=Math.min(camp.introStep||0, CAMPAIGN_INTRO.length-1);
  const page=CAMPAIGN_INTRO[step];
  const last=step>=CAMPAIGN_INTRO.length-1;
  return `<section class="panel combat-lobby campaign-story">
    <div class="campaign-dialog">
      <p class="eyebrow">${page.eyebrow} · ${step+1}/${CAMPAIGN_INTRO.length}</p>
      <h2>${page.title}</h2>
      <p class="campaign-prose">${page.text}</p>
      <div class="campaign-actions">
        <button type="button" class="cbt-end" onclick="backToCombatLobby()">Lobby</button>
        <button type="button" class="cbt-start" onclick="advanceCampaignIntro()">${last?'Au combat':'Continuer'}</button>
      </div>
    </div>
  </section>`;
}
function renderCampaignHub(){
  const camp=ensureCampaign();
  const rarBits=CAMPAIGN_RARITIES.map(r=>`<span class="camp-rarity camp-rarity-${r.id}">${r.label}</span>`).join('<span class="camp-rarity-arrow">→</span>');
  return `<section class="panel combat-lobby campaign-hub">
    <div class="section-head">
      <div>
        <p class="eyebrow">Tour du magicien</p>
        <h2>Classeur & coffre</h2>
        <p>Or et cartes gagnés en duel. Fusionne ${RARITY_CRAFT_COST} cartes d’une rareté pour la suivante. Achète et vends à la boutique.</p>
      </div>
    </div>
    <div class="camp-stats">
      <div class="camp-stat"><small>Or</small><b>${camp.gold||0}</b></div>
      <div class="camp-stat"><small>Classeur</small><b>${binderCount()}</b></div>
      <div class="camp-stat"><small>Victoires</small><b>${camp.battlesWon||0}</b></div>
    </div>
    <div class="camp-rarity-lane" title="Échelle de rareté">${rarBits}</div>
    <div class="lobby-modes camp-hub-grid">
      <article class="lobby-mode">
        <span class="lobby-mode-num">⚔</span>
        <h3>Prochain duel</h3>
        <p>Un défi sur la route — gagne de l’or et des cartes.</p>
        <button type="button" class="cbt-start" onclick="startCampaignBattle()">Combattre</button>
      </article>
      <article class="lobby-mode">
        <span class="lobby-mode-num">▣</span>
        <h3>Classeur</h3>
        <p>${binderCount()?`${binderCount()} carte(s) reliées.`:'Encore vide — gagne un duel ou passe à la boutique.'}</p>
        <button type="button" class="cbt-start" onclick="setCampaignView('binder')">Ouvrir</button>
      </article>
      <article class="lobby-mode">
        <span class="lobby-mode-num">✶</span>
        <h3>Fusion</h3>
        <p>${RARITY_CRAFT_COST} exemplaires d’une créature → rareté supérieure.</p>
        <button type="button" class="cbt-start" onclick="setCampaignView('fusion')">Fusionner</button>
      </article>
      <article class="lobby-mode">
        <span class="lobby-mode-num">♦</span>
        <h3>Boutique</h3>
        <p>Achète des cartes contre de l’or, ou vends ton surplus.</p>
        <button type="button" class="cbt-start" onclick="setCampaignView('shop')">Marchander</button>
      </article>
    </div>
    <div class="campaign-actions" style="margin-top:14px;justify-content:flex-start">
      <button type="button" class="cbt-end" onclick="backToCombatLobby()">Retour lobby</button>
    </div>
  </section>`;
}
function renderCampaignShell(title, eyebrow, body){
  const camp=ensureCampaign();
  return `<section class="panel combat-lobby campaign-panel">
    <div class="section-head">
      <div>
        <p class="eyebrow">${eyebrow}</p>
        <h2>${title}</h2>
      </div>
      <div class="camp-stats camp-stats-compact">
        <div class="camp-stat"><small>Or</small><b>${camp.gold||0}</b></div>
        <div class="camp-stat"><small>Classeur</small><b>${binderCount()}</b></div>
      </div>
    </div>
    ${camp.shopMsg?`<p class="camp-toast">${camp.shopMsg}</p>`:''}
    ${body}
    <div class="campaign-actions" style="margin-top:16px;justify-content:flex-start">
      <button type="button" class="cbt-end" onclick="setCampaignView('hub')">Retour tour</button>
    </div>
  </section>`;
}
function renderBinderCard(row, opts={}){
  const art=creatureArt(row.creatureId);
  const next=nextRarity(row.rarity);
  const canCraft=opts.fusion && next && row.count>=RARITY_CRAFT_COST;
  const sell=opts.shopSell;
  return `<article class="camp-card camp-rarity-${row.rarity}">
    <div class="camp-card-art">${art?`<img src="${encodeURI(art)}" alt="" width="96" height="96" decoding="async">`:''}</div>
    <div class="camp-card-meta">
      <strong>${row.name}</strong>
      <small class="camp-rarity camp-rarity-${row.rarity}">${rarityLabel(row.rarity)}</small>
      <em>×${row.count}</em>
    </div>
    <div class="camp-card-actions">
      ${canCraft?`<button type="button" class="cbt-start" onclick="doCraftUpgrade(${row.creatureId},'${row.rarity}')">Fusionner ${RARITY_CRAFT_COST}→${rarityLabel(next)}</button>`:''}
      ${sell?`<button type="button" class="cbt-end" onclick="sellBinderCard(${row.creatureId},'${row.rarity}')">Vendre ${shopPrice(row.rarity,'sell')} or</button>`:''}
    </div>
  </article>`;
}
function renderCampaignBinder(){
  if(typeof renderList==='function') return renderList({binder:true});
  return renderCampaignShell('Classeur', 'Collection', '<p class="campaign-prose">Classeur indisponible.</p>');
}
function renderCampaignFusion(){
  const craftable=sortedBinder().filter(r=>nextRarity(r.rarity) && r.count>=RARITY_CRAFT_COST);
  const almost=sortedBinder().filter(r=>nextRarity(r.rarity) && r.count>0 && r.count<RARITY_CRAFT_COST);
  const body=`
    <p class="campaign-prose">${RARITY_CRAFT_COST} cartes identiques (même créature + rareté) deviennent 1 carte de rareté supérieure.</p>
    <h3 class="camp-subhead">Prêtes à fusionner</h3>
    ${craftable.length
      ? `<div class="camp-card-grid">${craftable.map(r=>renderBinderCard(r,{fusion:true})).join('')}</div>`
      : `<p class="camp-muted">Aucune pile de ${RARITY_CRAFT_COST} pour l’instant.</p>`}
    <h3 class="camp-subhead">En cours</h3>
    ${almost.length
      ? `<div class="camp-card-grid">${almost.map(r=>renderBinderCard(r)).join('')}</div>`
      : `<p class="camp-muted">Rien en accumulation.</p>`}
  `;
  return renderCampaignShell('Fusion', 'Alchimie du classeur', body);
}
function renderCampaignShop(){
  const camp=ensureCampaign();
  const stock=refreshShopStock(false);
  const offers=stock.length
    ? `<div class="camp-card-grid">${stock.map(o=>{
        const art=creatureArt(o.creatureId);
        const can=(camp.gold||0)>=o.price;
        return `<article class="camp-card camp-rarity-${o.rarity}">
          <div class="camp-card-art">${art?`<img src="${encodeURI(art)}" alt="" width="96" height="96" decoding="async">`:''}</div>
          <div class="camp-card-meta">
            <strong>${o.name}</strong>
            <small class="camp-rarity camp-rarity-${o.rarity}">${rarityLabel(o.rarity)}</small>
            <em>${o.price} or</em>
          </div>
          <div class="camp-card-actions">
            <button type="button" class="cbt-start" ${can?'': 'disabled'} onclick="buyShopOffer('${o.uid}')">Acheter</button>
          </div>
        </article>`;
      }).join('')}</div>`
    : `<p class="camp-muted">Étalage vide — rafraîchis pour 15 or.</p>`;
  const sellable=sortedBinder();
  const body=`
    <div class="camp-shop-toolbar">
      <button type="button" class="cbt-end" onclick="payShopRefresh()">Rafraîchir (15 or)</button>
    </div>
    <h3 class="camp-subhead">À vendre</h3>
    ${offers}
    <h3 class="camp-subhead">Vendre depuis le classeur</h3>
    ${sellable.length
      ? `<div class="camp-card-grid">${sellable.map(r=>renderBinderCard(r,{shopSell:true})).join('')}</div>`
      : `<p class="camp-muted">Rien à vendre.</p>`}
  `;
  return renderCampaignShell('Boutique', 'Comptoir de la tour', body);
}
function renderCampaignRewards(){
  const camp=ensureCampaign();
  const r=camp.lastRewards || state.battle?.rewards;
  if(!r){
    return renderCampaignHub();
  }
  const cards=(r.cards||[]).map(c=>`
    <li class="camp-reward-card camp-rarity-${c.rarity}">
      <strong>${c.name}</strong>
      <small>${rarityLabel(c.rarity)}</small>
    </li>`).join('') || '<li class="camp-reward-empty">Aucune carte cette fois.</li>';
  return `<section class="panel combat-lobby campaign-rewards">
    <div class="campaign-dialog">
      <p class="eyebrow">${r.victory?'Victoire':'Défaite'}</p>
      <h2>${r.victory?'Butin du duel':'Salutations du champ'}</h2>
      <p class="campaign-prose">Tu gagnes <strong>${r.gold} or</strong>${(r.cards||[]).length?` et ${(r.cards||[]).length} carte(s)`:''}. Tout rejoint ton coffre et ton classeur.</p>
      <ul class="camp-reward-list">${cards}</ul>
      <div class="campaign-actions">
        <button type="button" class="cbt-start" onclick="finishCampaignRewards()">Continuer</button>
      </div>
    </div>
  </section>`;
}
function renderCampaign(){
  const camp=ensureCampaign();
  if((camp.introStep||0)<CAMPAIGN_INTRO.length){
    camp.phase='intro';
    return renderCampaignIntro();
  }
  if(camp.phase==='rewards') return renderCampaignRewards();
  if(camp.phase==='binder') return renderCampaignBinder();
  if(camp.phase==='fusion') return renderCampaignFusion();
  if(camp.phase==='shop') return renderCampaignShop();
  camp.phase='hub';
  return renderCampaignHub();
}

window.CAMPAIGN_RARITIES=CAMPAIGN_RARITIES;
window.RARITY_CRAFT_COST=RARITY_CRAFT_COST;
window.ensureCampaign=ensureCampaign;
window.startCampaign=startCampaign;
window.advanceCampaignIntro=advanceCampaignIntro;
window.startCampaignBattle=startCampaignBattle;
window.claimCampaignBattleRewards=claimCampaignBattleRewards;
window.finishCampaignRewards=finishCampaignRewards;
window.craftBinderUpgrade=craftBinderUpgrade;
window.setCampaignView=setCampaignView;
window.doCraftUpgrade=doCraftUpgrade;
window.buyShopOffer=buyShopOffer;
window.sellBinderCard=sellBinderCard;
window.payShopRefresh=payShopRefresh;
window.renderCampaign=renderCampaign;
