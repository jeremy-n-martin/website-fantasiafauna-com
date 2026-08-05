/* Campagne — Puzzle Quest / tour du magicien, combats de cartes */

const CAMPAIGN_KEY='ff-campaign-v1';
const CAMP_CHEATS_KEY='ff-campaign-cheats';
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
    phase:'intro', // intro | pickFactions | map | battle | rewards | binder | fusion | shop
    battlesWon:0,
    lastRewards:null,
    shopStock:null,
    shopMsg:null,
    lastBooster:null,
    playerFactions:null, // [principale, secondaire]
    starterGranted:false,
    starterQuadGranted:false,
    mapLocation:'tour',
    mapCleared:[],
    battleNode:null,
  };
}

/** Carte du monde — positions en % ; links = déplacements possibles. */
const CAMPAIGN_MAP_NODES=[
  {id:'tour', name:'Tour oubliée', kind:'home', x:14, y:56, links:['forge','col','marche'],
    blurb:'Ton refuge de pierre. Classeur, coffre, et le départ de toutes les routes.'},
  {id:'forge', name:'Crypte des sceaux', kind:'fusion', x:10, y:28, links:['tour','marche'],
    blurb:'Cinq cartes d’une rareté deviennent une rareté supérieure.'},
  {id:'marche', name:'Comptoir des brumes', kind:'shop', x:36, y:42, links:['tour','forge','col','gue'],
    blurb:'Marchands itinérants : boosters (100 or / 10 cartes), ventes à l’unité, rachat.'},
  {id:'col', name:'Col des corbeaux', kind:'duel', x:32, y:74, links:['tour','marche','landes'], difficulty:1,
    blurb:'Éclaireurs du seigneur de guerre — un premier défi sur la crête.'},
  {id:'gue', name:'Gué de l’ambre', kind:'duel', x:58, y:50, links:['marche','landes','camp'], difficulty:2,
    blurb:'Embuscade au gué. L’eau porte les cris avant les lames.'},
  {id:'landes', name:'Landes pourpres', kind:'duel', x:54, y:78, links:['col','gue','camp'], difficulty:2,
    blurb:'Vent, bruyère, et bannières du seigneur de guerre.'},
  {id:'camp', name:'Camp du seigneur', kind:'duel', x:84, y:34, links:['gue','landes'], difficulty:3,
    blurb:'Le camp retranché. Un duel pour la gloire — et le butin.'},
];
function mapNode(id){
  return CAMPAIGN_MAP_NODES.find(n=>n.id===id) || CAMPAIGN_MAP_NODES[0];
}
function mapLinksFrom(id){
  const n=mapNode(id);
  return new Set(n.links||[]);
}
function isMapReachable(fromId, toId){
  if(fromId===toId) return true;
  return mapLinksFrom(fromId).has(toId);
}
function mapRoadPairs(){
  const seen=new Set();
  const pairs=[];
  for(const n of CAMPAIGN_MAP_NODES){
    for(const to of n.links||[]){
      const key=[n.id, to].sort().join('::');
      if(seen.has(key)) continue;
      seen.add(key);
      const b=mapNode(to);
      pairs.push([n, b]);
    }
  }
  return pairs;
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
function loadCampCheats(){
  try{
    const raw=localStorage.getItem(CAMP_CHEATS_KEY);
    if(!raw) return {monoFaction:false};
    return {monoFaction:false, ...JSON.parse(raw)};
  }catch(_){
    return {monoFaction:false};
  }
}
function saveCampCheats(cheats){
  try{ localStorage.setItem(CAMP_CHEATS_KEY, JSON.stringify(cheats||loadCampCheats())); }catch(_){}
}
function isMonoFactionCheat(){
  return !!loadCampCheats().monoFaction;
}
/** Factions réellement utilisées en combat (cheat = faction principale seule). */
function campaignPlayFactions(playerFactions){
  const list=Array.isArray(playerFactions) ? playerFactions.filter(Boolean) : [];
  if(!list.length) return list;
  if(isMonoFactionCheat()) return [list[0]];
  return list.slice();
}
function toggleMonoFactionCheat(){
  const cheats=loadCampCheats();
  cheats.monoFaction=!cheats.monoFaction;
  saveCampCheats(cheats);
  if(typeof render==='function') render();
}
function monoFactionCheatLabel(){
  const on=isMonoFactionCheat();
  const camp=typeof ensureCampaign==='function' ? ensureCampaign() : null;
  const primary=(camp?.playerFactions||[])[0] || 'ta faction principale';
  return on
    ? `Cheat mono-faction : ON (${primary})`
    : 'Cheat mono-faction : OFF';
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
function addToBinder(creatureId, rarity='normal', count=1, opts={}){
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
  if(!opts.silent) saveCampaign();
  return row;
}
const STARTER_PRIMARY=8;
const STARTER_SECONDARY=7;
const STARTER_COPIES=4; // 15 modèles × 4 = 60 cartes
const CAMPAIGN_DECK_SIZE=STARTER_PRIMARY+STARTER_SECONDARY; // modèles uniques
function campaignFactionList(){
  return typeof allFactions==='function'
    ? allFactions()
    : Array.from(new Set(CREATURES.map(c=>c.capital))).sort((a,b)=>a.localeCompare(b,'fr'));
}
function hasChosenFactions(camp=ensureCampaign()){
  return Array.isArray(camp.playerFactions) && camp.playerFactions.length>=2;
}
/** Créatures les moins chères d’une faction (uniques). */
function pickLowestCostFromFaction(faction, size){
  const pool=CREATURES
    .filter(c=>c.capital===faction)
    .slice()
    .sort((a,b)=>{
      const ca=a.cost||0, cb=b.cost||0;
      if(ca!==cb) return ca-cb;
      const pa=(a.power||0)-(b.power||0);
      if(pa) return pa;
      return (a.name||'').localeCompare(b.name||'','fr');
    });
  const seen=new Set();
  const picked=[];
  for(const c of pool){
    if(seen.has(c.id)) continue;
    seen.add(c.id);
    picked.push(c);
    if(picked.length>=size) break;
  }
  return picked;
}
/** 15 créatures : 8 de la faction principale + 7 de la secondaire. */
function pickLowestCostCreatures(factions, size=15){
  const list=(factions||[]).filter(Boolean);
  if(list.length>=2 && size===STARTER_PRIMARY+STARTER_SECONDARY){
    return [
      ...pickLowestCostFromFaction(list[0], STARTER_PRIMARY),
      ...pickLowestCostFromFaction(list[1], STARTER_SECONDARY),
    ];
  }
  const pool=CREATURES
    .filter(c=>list.includes(c.capital))
    .slice()
    .sort((a,b)=>{
      const ca=a.cost||0, cb=b.cost||0;
      if(ca!==cb) return ca-cb;
      const pa=(a.power||0)-(b.power||0);
      if(pa) return pa;
      return (a.name||'').localeCompare(b.name||'','fr');
    });
  const seen=new Set();
  const picked=[];
  for(const c of pool){
    if(seen.has(c.id)) continue;
    seen.add(c.id);
    picked.push(c);
    if(picked.length>=size) break;
  }
  return picked;
}
/** Donne au joueur 15 modèles × 4 exemplaires (60 cartes) une fois les 2 factions choisies. */
function grantStarterBinder(){
  const camp=ensureCampaign();
  if(camp.starterGranted && hasChosenFactions(camp)){
    ensureStarterQuadCopies();
    return camp.playerFactions;
  }
  const all=campaignFactionList();

  // Sauvegarde déjà en cours : ne pas re-flooder le classeur
  if((camp.binder||[]).length>0){
    if(!hasChosenFactions(camp)){
      const caps=[...new Set((camp.binder||[]).map(r=>{
        const c=CREATURES.find(x=>x.id===r.creatureId);
        return c?.capital;
      }).filter(Boolean))];
      camp.playerFactions=caps.slice(0, 2);
      while(camp.playerFactions.length<Math.min(2, all.length)){
        const extra=(typeof pickN==='function'
          ? pickN(all.filter(f=>!camp.playerFactions.includes(f)), 1)
          : all.filter(f=>!camp.playerFactions.includes(f)).slice(0, 1))[0];
        if(!extra) break;
        camp.playerFactions.push(extra);
      }
    }
    camp.starterGranted=true;
    ensureStarterQuadCopies();
    saveCampaign();
    return camp.playerFactions;
  }

  if(!hasChosenFactions(camp)){
    return camp.playerFactions || [];
  }
  const factions=camp.playerFactions.slice(0, 2);
  const starters=pickLowestCostCreatures(factions, STARTER_PRIMARY+STARTER_SECONDARY);
  starters.forEach(c=>addToBinder(c.id, 'normal', STARTER_COPIES, {silent:true}));
  camp.starterGranted=true;
  camp.starterQuadGranted=true;
  saveCampaign();
  return factions;
}
/** Migre les vieilles sauvegardes (1×) vers 4 exemplaires des 15 cartes de départ. */
function ensureStarterQuadCopies(){
  const camp=ensureCampaign();
  if(camp.starterQuadGranted || !hasChosenFactions(camp)) return;
  const starters=pickLowestCostCreatures(camp.playerFactions.slice(0, 2), STARTER_PRIMARY+STARTER_SECONDARY);
  for(const c of starters){
    let row=(camp.binder||[]).find(e=>e.creatureId===c.id && e.rarity==='normal');
    if(!row){
      addToBinder(c.id, 'normal', STARTER_COPIES, {silent:true});
    } else if((row.count||0) < STARTER_COPIES){
      row.count=STARTER_COPIES;
    }
  }
  camp.starterQuadGranted=true;
  saveCampaign();
}
function chooseCampaignFaction(name){
  const camp=ensureCampaign();
  const all=campaignFactionList();
  if(!all.includes(name)) return;
  if(!Array.isArray(camp.playerFactions)) camp.playerFactions=[];
  if(camp.playerFactions.includes(name)) return;
  if(camp.playerFactions.length>=2) return;
  camp.playerFactions.push(name);
  camp.phase='pickFactions';
  if(camp.playerFactions.length>=2){
    grantStarterBinder();
    camp.phase='map';
    camp.mapLocation=camp.mapLocation||'tour';
  }
  saveCampaign();
  render();
}
/** Deck campagne : N modèles × 4 exemplaires. */
function buildCampaignDeck(factions, unique=CAMPAIGN_DECK_SIZE, copies=STARTER_COPIES){
  const base=typeof buildLowCostDeck==='function' ? buildLowCostDeck(factions, unique) : [];
  const out=[];
  for(const c of base){
    for(let i=0;i<copies;i++){
      const card=typeof cloneCard==='function' ? cloneCard(c) : {...c};
      card.frameId=card.frameId||'normal';
      out.push(card);
    }
  }
  return out;
}
function makeCampaignSideFromDeck(factions, cards){
  const pool=cards.slice();
  const startingDeckSize=pool.length;
  const deck=typeof shuffleInPlace==='function' ? shuffleInPlace(pool) : pool;
  const handN=Math.min(7, deck.length);
  const hand=typeof sortHand==='function' ? sortHand(deck.splice(0, handN)) : deck.splice(0, handN);
  return {
    hp:30, mana:0, maxMana:0, turnCount:0,
    colorMana:Object.fromEntries(factions.map(f=>[f,0])),
    deck, hand, board:[],
    prayer:[null, null, null],
    prayedThisTurn:false,
    factions:factions.slice(),
    startingDeckSize,
  };
}
/** Deck joueur campagne : tous les exemplaires du classeur (rareté = cadre). */
function makeCampaignPlayerSide(factions, size=null){
  const camp=ensureCampaign();
  ensureStarterQuadCopies();
  const cards=[];
  const rows=sortedBinder().filter(row=>{
    const c=CREATURES.find(x=>x.id===row.creatureId);
    return c && factions.includes(c.capital) && row.count>0;
  });
  for(const row of rows){
    const c=CREATURES.find(x=>x.id===row.creatureId);
    if(!c) continue;
    const n=row.count|0;
    for(let i=0;i<n;i++){
      const card=typeof cloneCard==='function' ? cloneCard(c) : {...c};
      card.frameId=row.rarity || 'normal';
      cards.push(card);
    }
  }
  const target=size != null ? size : Math.max(CAMPAIGN_DECK_SIZE*STARTER_COPIES, cards.length);
  if(cards.length<target){
    for(const c of buildCampaignDeck(factions, CAMPAIGN_DECK_SIZE, STARTER_COPIES)){
      cards.push(c);
      if(cards.length>=target) break;
    }
  }
  return makeCampaignSideFromDeck(factions, cards);
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
const BOOSTER_PRICE=100;
const BOOSTER_SIZE=10;
/** Chaîne 1/5 : bronze → argent → or → or rose → obsidienne. */
function rollBoosterRarity(){
  let rarity='normal';
  for(const tier of ['bronze','silver','gold','rosegold','obsidian']){
    if(Math.random()>=1/5) break;
    rarity=tier;
  }
  return rarity;
}
function pickBoosterCreature(){
  if(!CREATURES.length) return null;
  return CREATURES[Math.floor(Math.random()*CREATURES.length)];
}
function openCampaignBooster(opts={}){
  const camp=ensureCampaign();
  const free=!!opts.free;
  if(!free && (camp.gold||0)<BOOSTER_PRICE){
    camp.shopMsg=`Il faut ${BOOSTER_PRICE} or pour un booster.`;
    saveCampaign();
    render();
    return;
  }
  if(!free) camp.gold-=BOOSTER_PRICE;
  const cards=[];
  for(let i=0;i<BOOSTER_SIZE;i++){
    const c=pickBoosterCreature();
    if(!c) continue;
    const rarity=rollBoosterRarity();
    addToBinder(c.id, rarity, 1, {silent:true});
    cards.push({creatureId:c.id, name:c.name, rarity});
  }
  camp.lastBooster=cards;
  const specials=cards.filter(c=>c.rarity!=='normal').length;
  camp.shopMsg=free
    ? `Booster test ×${BOOSTER_SIZE} (gratuit)${specials?` · ${specials} spéciale${specials>1?'s':''}`:''}.`
    : `Booster ×${BOOSTER_SIZE} ouvert (−${BOOSTER_PRICE} or)${specials?` · ${specials} spéciale${specials>1?'s':''}`:''}.`;
  saveCampaign();
  render();
}
function openFreeTestBooster(){
  openCampaignBooster({free:true});
}
function resetCampaign(){
  if(!confirm('Réinitialiser la campagne ? Or, classeur, carte et progression seront effacés.')) return;
  try{ localStorage.removeItem(CAMPAIGN_KEY); }catch(_){}
  state.campaign=defaultCampaign();
  state.battle=null;
  state.combatView='lobby';
  state.tab='combat';
  if(typeof hideCombatCardPreview==='function') hideCombatCardPreview();
  render();
}
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
  if(!hasChosenFactions(camp)){
    camp.phase='pickFactions';
    saveCampaign();
    render();
    return;
  }
  if(view==='hub') view='map';
  camp.phase=view;
  if(view==='shop') refreshShopStock(false);
  if(view==='binder'){
    state.binderRarity='Toutes';
    state.activeCapital='Toutes';
    state.search='';
    state.zoomedId=null;
  }
  if(view==='map'){
    if(!camp.mapLocation) camp.mapLocation='tour';
  }
  camp.shopMsg=null;
  state.battle=null;
  state.combatView='campagne';
  saveCampaign();
  render();
}
function travelCampaignMap(nodeId, opts={}){
  const camp=ensureCampaign();
  const from=camp.mapLocation||'tour';
  // Accès rapide (toolbar) : on peut rejoindre tour / comptoir sans être voisin
  const freeTravel=!!opts.free || nodeId==='tour' || nodeId==='marche' || nodeId==='forge';
  if(!freeTravel && !isMapReachable(from, nodeId)){
    camp.shopMsg='Cette route n’est pas accessible depuis ici.';
    saveCampaign();
    render();
    return;
  }
  camp.mapLocation=nodeId;
  camp.shopMsg=null;
  camp.phase='map';
  saveCampaign();
  render();
}
function openCampaignPanel(view){
  const camp=ensureCampaign();
  if((camp.introStep||0)<CAMPAIGN_INTRO.length){
    startCampaign();
    return;
  }
  if(!hasChosenFactions(camp)){
    camp.phase='pickFactions';
    state.tab='combat';
    state.combatView='campagne';
    saveCampaign();
    render();
    return;
  }
  grantStarterBinder();
  if(view==='map' || view==='hub'){
    setCampaignView('map');
    return;
  }
  if(view==='shop') camp.mapLocation='marche';
  if(view==='binder' || view==='fusion') camp.mapLocation=camp.mapLocation||'tour';
  setCampaignView(view);
}
function mapKindLabel(kind){
  return ({home:'Refuge', shop:'Boutique', fusion:'Fusion', duel:'Duel'})[kind] || kind;
}
function mapDifficultyLabel(n){
  const d=n.difficulty||1;
  return '⚔'.repeat(Math.min(3, d)) + '·'.repeat(Math.max(0, 3-d));
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
  if((camp.introStep||0)<CAMPAIGN_INTRO.length){
    camp.phase='intro';
  } else if(!hasChosenFactions(camp)){
    camp.phase='pickFactions';
  } else {
    grantStarterBinder();
    if(camp.phase==='battle') camp.phase='map';
    else if(camp.phase!=='rewards') camp.phase='map';
  }
  if(!camp.mapLocation) camp.mapLocation='tour';
  saveCampaign();
  if(typeof hideCombatCardPreview==='function') hideCombatCardPreview();
  render();
}
function advanceCampaignIntro(){
  const camp=ensureCampaign();
  camp.introStep=(camp.introStep||0)+1;
  if(camp.introStep>=CAMPAIGN_INTRO.length){
    camp.playerFactions=Array.isArray(camp.playerFactions)?camp.playerFactions:[];
    camp.phase=hasChosenFactions(camp)?'map':'pickFactions';
    if(hasChosenFactions(camp)) grantStarterBinder();
    camp.mapLocation=camp.mapLocation||'tour';
    saveCampaign();
    render();
    return;
  }
  saveCampaign();
  render();
}
function startCampaignBattle(fromNode){
  const camp=ensureCampaign();
  if(!hasChosenFactions(camp)){
    camp.phase='pickFactions';
    saveCampaign();
    render();
    return;
  }
  const playerFactions=grantStarterBinder();
  if(!playerFactions || playerFactions.length<2){
    camp.phase='pickFactions';
    saveCampaign();
    render();
    return;
  }
  const nodeId=fromNode || camp.mapLocation || 'col';
  const node=mapNode(nodeId);
  if(node.kind==='duel' && camp.mapLocation!==nodeId && !isMapReachable(camp.mapLocation||'tour', nodeId)){
    camp.shopMsg='Rejoins d’abord ce lieu sur la carte.';
    saveCampaign();
    render();
    return;
  }
  camp.phase='battle';
  camp.lastRewards=null;
  camp.battleNode=node.kind==='duel' ? nodeId : (camp.mapLocation||'col');
  if(node.kind==='duel') camp.mapLocation=nodeId;
  saveCampaign();
  state.combatView='campagne';
  const all=allFactions();
  const rest=all.filter(f=>!playerFactions.includes(f));
  const enemyPool=rest.length>=2 ? rest : all;
  const enemyFactions=pickN(enemyPool, Math.min(2, enemyPool.length));
  const factions=[...new Set([...playerFactions, ...enemyFactions])];
  const playerFirst=Math.random()<0.5;
  const playFactions=campaignPlayFactions(playerFactions);
  const playerSide=typeof makeCampaignPlayerSide==='function'
    ? makeCampaignPlayerSide(playFactions)
    : makeSide(playFactions, CAMPAIGN_DECK_SIZE*STARTER_COPIES);
  const enemySide=makeCampaignSideFromDeck(enemyFactions, buildCampaignDeck(enemyFactions));
  state.tab='combat';
  state.battle={
    mode:'campagne',
    factions,
    playerFactions: playFactions,
    chosenFactions: playerFactions.slice(),
    enemyFactions,
    turn:1,
    active: playerFirst ? 'player' : 'enemy',
    phase:'mulligan',
    player: playerSide,
    enemy: enemySide,
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
    mapNode:camp.battleNode,
  };
  combatLog(`Campagne — ${mapNode(camp.battleNode).name}. Toi: ${playerFactions.join(' · ')} · Adverse: ${enemyFactions.join(' · ')}.`);
  if(isMonoFactionCheat()){
    combatLog(`Cheat mono-faction : deck limité à ${playFactions[0]||'—'}.`);
  }
  combatLog(`Decks 60 cartes (classeur ${binderCount()}) — main 7 → pile ${playerSide.deck.length}/${playerSide.startingDeckSize}. ${state.battle.coin}.`);
  if(typeof stampSideFrames==='function'){
    stampSideFrames(state.battle.enemy, typeof rollCampaignRarity==='function'?rollCampaignRarity:null);
  }
  if(typeof preloadBattleSounds==='function') preloadBattleSounds(state.battle);
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
  if(b.winner==='player' && camp.battleNode){
    if(!Array.isArray(camp.mapCleared)) camp.mapCleared=[];
    if(!camp.mapCleared.includes(camp.battleNode)) camp.mapCleared.push(camp.battleNode);
  }
  state.battle=null;
  saveCampaign();
  render();
}
function finishCampaignRewards(){
  const camp=ensureCampaign();
  camp.phase='map';
  if(camp.battleNode) camp.mapLocation=camp.battleNode;
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
        <button type="button" class="cbt-start" onclick="advanceCampaignIntro()">${last?'Choisir tes factions':'Continuer'}</button>
      </div>
    </div>
  </section>`;
}
function renderCampaignFactionPick(){
  const camp=ensureCampaign();
  const chosen=Array.isArray(camp.playerFactions)?camp.playerFactions:[];
  const step=chosen.length; // 0 = principale, 1 = secondaire
  const title=step===0 ? 'Faction principale' : 'Seconde faction';
  const hint=step===0
    ? `Clique ta faction principale — tu recevras ${STARTER_PRIMARY} cartes ×${STARTER_COPIES} exemplaires.`
    : `Clique ta seconde faction — ${STARTER_SECONDARY} cartes ×${STARTER_COPIES} (après ${STARTER_PRIMARY} de ${chosen[0]}). Total : ${CAMPAIGN_DECK_SIZE*STARTER_COPIES} cartes.`;
  const buttons=campaignFactionList().map(f=>{
    const fm=(typeof FACTION_MANA!=='undefined' && FACTION_MANA[f]) || {color:'#c9aa69',icon:'ui/combat/star_sm.png',element:f};
    const taken=chosen.includes(f);
    const disabled=taken;
    const icon=fm.icon?`<img src="${fm.icon}" alt="" width="22" height="22" draggable="false">`:'';
    return `<button type="button" class="camp-faction-btn${taken?' is-taken':''}" style="--faction:${fm.color}"
      ${disabled?'disabled':''} onclick='chooseCampaignFaction(${JSON.stringify(f)})'>
      ${icon}<b>${f}</b><small>${fm.element||f}</small>
    </button>`;
  }).join('');
  const progress=chosen.map((f,i)=>{
    const fm=(typeof FACTION_MANA!=='undefined' && FACTION_MANA[f]) || {color:'#c9aa69'};
    const role=i===0?'Principale':'Secondaire';
    return `<span class="camp-faction-chip" style="--faction:${fm.color}">${role} · ${f}</span>`;
  }).join('');
  return `<section class="panel combat-lobby campaign-story campaign-faction-pick">
    <div class="campaign-dialog campaign-dialog-wide">
      <p class="eyebrow">Allégeance · ${step+1}/2</p>
      <h2>${title}</h2>
      <p class="campaign-prose">${hint}</p>
      ${progress?`<div class="camp-faction-chosen">${progress}</div>`:''}
      <div class="camp-faction-grid" role="group" aria-label="Factions">${buttons}</div>
      <div class="campaign-actions">
        <button type="button" class="cbt-end" onclick="backToCombatLobby()">Lobby</button>
      </div>
    </div>
  </section>`;
}
function renderCampaignMap(){
  if(hasChosenFactions()) grantStarterBinder();
  const camp=ensureCampaign();
  const hereId=camp.mapLocation||'tour';
  const here=mapNode(hereId);
  const cleared=new Set(camp.mapCleared||[]);
  const reachable=mapLinksFrom(hereId);
  const roads=mapRoadPairs().map(([a,b])=>{
    const active=a.id===hereId||b.id===hereId;
    return `<line class="camp-map-road${active?' is-active':''}" x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" />`;
  }).join('');
  const nodes=CAMPAIGN_MAP_NODES.map(n=>{
    const isHere=n.id===hereId;
    const canGo=reachable.has(n.id);
    const done=cleared.has(n.id);
    const locked=!isHere && !canGo;
    const cls=[
      'camp-map-node',
      `kind-${n.kind}`,
      isHere?'is-here':'',
      canGo?'is-reachable':'',
      locked?'is-locked':'',
      done?'is-cleared':'',
    ].filter(Boolean).join(' ');
    const click=locked
      ? ''
      : `onclick="travelCampaignMap('${n.id}')"`;
    return `<button type="button" class="${cls}" style="left:${n.x}%;top:${n.y}%" ${click} ${locked?'disabled':''} title="${n.name}">
      <span class="camp-map-pin" aria-hidden="true"></span>
      <span class="camp-map-label"><b>${n.name}</b><small>${mapKindLabel(n.kind)}${n.kind==='duel'?` · ${mapDifficultyLabel(n)}`:''}${done?' · vaincu':''}</small></span>
    </button>`;
  }).join('');
  const pawn=`<div class="camp-map-pawn" style="left:${here.x}%;top:${here.y}%" title="Tu es ici" aria-hidden="true"><i></i></div>`;

  let actions='';
  if(here.kind==='home'){
    actions=`<button type="button" class="cbt-start" onclick="setCampaignView('binder')">Ouvrir le classeur</button>
      <button type="button" class="cbt-end" onclick="setCampaignView('fusion')">Fusion</button>`;
  } else if(here.kind==='shop'){
    actions=`<button type="button" class="cbt-start" onclick="setCampaignView('shop')">Marchander</button>`;
  } else if(here.kind==='fusion'){
    actions=`<button type="button" class="cbt-start" onclick="setCampaignView('fusion')">Fusionner des cartes</button>`;
  } else if(here.kind==='duel'){
    actions=`<button type="button" class="cbt-start" onclick="startCampaignBattle('${here.id}')">${cleared.has(here.id)?'Rejouer le duel':'Engager le combat'}</button>`;
  }
  const quickNav=`
    <div class="camp-quick-nav" role="navigation" aria-label="Accès campagne">
      <button type="button" class="cbt-start" onclick="setCampaignView('binder')">▣ Classeur</button>
      <button type="button" class="cbt-start" onclick="setCampaignView('shop')">♦ Boutique</button>
      <button type="button" class="cbt-end" onclick="setCampaignView('fusion')">✶ Fusion</button>
      ${here.kind!=='home'?`<button type="button" class="cbt-end" onclick="travelCampaignMap('tour',{free:true})">↩ Tour</button>`:''}
      ${here.kind!=='shop'?`<button type="button" class="cbt-end" onclick="travelCampaignMap('marche',{free:true})">↩ Comptoir</button>`:''}
    </div>`;
  const factions=(camp.playerFactions||[]).join(' · ') || '—';

  return `<section class="panel combat-lobby campaign-map-panel">
    <div class="section-head">
      <div>
        <p class="eyebrow">Carte du monde</p>
        <h2>Routes du seigneur de guerre</h2>
        <p>Déplace-toi de lieu en lieu. Factions de départ : <strong>${factions}</strong>.</p>
      </div>
      <div class="camp-stats camp-stats-compact">
        <div class="camp-stat"><small>Or</small><b>${camp.gold||0}</b></div>
        <div class="camp-stat"><small>Classeur</small><b>${binderCount()}</b></div>
        <div class="camp-stat"><small>Victoires</small><b>${camp.battlesWon||0}</b></div>
      </div>
    </div>
    ${quickNav}
    ${camp.shopMsg?`<p class="camp-toast">${camp.shopMsg}</p>`:''}
    <div class="camp-map-layout">
      <div class="camp-map" role="img" aria-label="Carte de campagne">
        <div class="camp-map-terrain" aria-hidden="true"></div>
        <svg class="camp-map-roads" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${roads}</svg>
        ${nodes}
        ${pawn}
      </div>
      <aside class="camp-map-dossier">
        <p class="eyebrow">${mapKindLabel(here.kind)}</p>
        <h3>${here.name}</h3>
        <p class="campaign-prose">${here.blurb}</p>
        ${here.kind==='duel'?`<p class="camp-map-diff">Difficulté ${mapDifficultyLabel(here)}</p>`:''}
        <div class="campaign-actions" style="justify-content:flex-start;margin-top:12px">${actions}</div>
        <p class="camp-muted" style="margin-top:14px">Clique un lieu relié pour voyager. Classeur et boutique restent accessibles en haut.</p>
      </aside>
    </div>
    <div class="campaign-actions" style="margin-top:14px;justify-content:flex-start">
      <button type="button" class="cbt-end" onclick="backToCombatLobby()">Retour lobby</button>
    </div>
  </section>`;
}
function renderCampaignHub(){
  return renderCampaignMap();
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
      <button type="button" class="cbt-end" onclick="setCampaignView('map')">Retour carte</button>
    </div>
  </section>`;
}
function frameFromCampaignRarity(rarity){
  const id=CAMPAIGN_RARITIES.some(r=>r.id===rarity) ? rarity : 'normal';
  if(typeof CARD_FRAMES!=='undefined'){
    return CARD_FRAMES.find(f=>f.id===id) || CARD_FRAMES[0];
  }
  return {id};
}
/** Carte complète (cadre rareté) réduite — boutique / fusion / butin. */
function renderCampFfFace(creatureId, rarity){
  const c=CREATURES.find(x=>x.id===Number(creatureId));
  if(!c || typeof buildFfCardHtml!=='function'){
    const art=creatureArt(creatureId);
    return `<div class="camp-card-art">${art?`<img src="${encodeURI(art)}" alt="" width="96" height="96" decoding="async">`:''}</div>`;
  }
  const frame=frameFromCampaignRarity(rarity);
  return `<div class="camp-ff-scale" data-rarity="${frame.id}">${buildFfCardHtml(c,{
    frame,
    forceArchive:true,
  })}</div>`;
}
function renderBinderCard(row, opts={}){
  const next=nextRarity(row.rarity);
  const canCraft=opts.fusion && next && row.count>=RARITY_CRAFT_COST;
  const sell=opts.shopSell;
  return `<article class="camp-offer camp-rarity-${row.rarity}">
    ${renderCampFfFace(row.creatureId, row.rarity)}
    <div class="camp-card-meta">
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
  const canBooster=(camp.gold||0)>=BOOSTER_PRICE;
  const offers=stock.length
    ? `<div class="camp-card-grid">${stock.map(o=>{
        const can=(camp.gold||0)>=o.price;
        return `<article class="camp-offer camp-rarity-${o.rarity}">
          ${renderCampFfFace(o.creatureId, o.rarity)}
          <div class="camp-card-meta">
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
  const boosterReveal=(camp.lastBooster||[]).length
    ? `<div class="camp-card-grid camp-booster-grid">${camp.lastBooster.map(c=>`
        <article class="camp-offer camp-rarity-${c.rarity}">
          ${renderCampFfFace(c.creatureId, c.rarity)}
          <div class="camp-card-meta">
            <strong>${c.name}</strong>
            <small class="camp-rarity camp-rarity-${c.rarity}">${rarityLabel(c.rarity)}</small>
          </div>
        </article>`).join('')}</div>`
    : '';
  const body=`
    <div class="camp-booster-panel">
      <div>
        <h3 class="camp-subhead" style="margin-top:0">Booster ×${BOOSTER_SIZE}</h3>
        <p class="campaign-prose" style="margin-bottom:8px">${BOOSTER_PRICE} or · 10 cartes. Chaque carte est normale, puis peut monter : bronze 1/5 → argent 1/25 → or 1/125 → or rose 1/625 → obsidienne 1/3125.</p>
        <button type="button" class="cbt-start" ${canBooster?'':'disabled'} onclick="openCampaignBooster()">Acheter un booster (${BOOSTER_PRICE} or)</button>
      </div>
    </div>
    ${boosterReveal?`<h3 class="camp-subhead">Dernier booster</h3>${boosterReveal}`:''}
    <div class="camp-shop-toolbar">
      <button type="button" class="cbt-end" onclick="payShopRefresh()">Rafraîchir l’étalage (15 or)</button>
    </div>
    <h3 class="camp-subhead">À l’unité</h3>
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
      ${renderCampFfFace(c.creatureId, c.rarity)}
      <div class="camp-card-meta">
        <strong>${c.name}</strong>
        <small class="camp-rarity camp-rarity-${c.rarity}">${rarityLabel(c.rarity)}</small>
      </div>
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
  if(!hasChosenFactions(camp) || camp.phase==='pickFactions'){
    camp.phase='pickFactions';
    return renderCampaignFactionPick();
  }
  if(camp.phase==='rewards') return renderCampaignRewards();
  if(camp.phase==='binder') return renderCampaignBinder();
  if(camp.phase==='fusion') return renderCampaignFusion();
  if(camp.phase==='shop') return renderCampaignShop();
  if(camp.phase==='battle' && !state.battle) camp.phase='map';
  camp.phase='map';
  return renderCampaignMap();
}

window.CAMPAIGN_RARITIES=CAMPAIGN_RARITIES;
window.CAMPAIGN_MAP_NODES=CAMPAIGN_MAP_NODES;
window.RARITY_CRAFT_COST=RARITY_CRAFT_COST;
window.ensureCampaign=ensureCampaign;
window.startCampaign=startCampaign;
window.advanceCampaignIntro=advanceCampaignIntro;
window.chooseCampaignFaction=chooseCampaignFaction;
window.startCampaignBattle=startCampaignBattle;
window.claimCampaignBattleRewards=claimCampaignBattleRewards;
window.finishCampaignRewards=finishCampaignRewards;
window.craftBinderUpgrade=craftBinderUpgrade;
window.setCampaignView=setCampaignView;
window.travelCampaignMap=travelCampaignMap;
window.openCampaignPanel=openCampaignPanel;
window.doCraftUpgrade=doCraftUpgrade;
window.buyShopOffer=buyShopOffer;
window.sellBinderCard=sellBinderCard;
window.payShopRefresh=payShopRefresh;
window.openCampaignBooster=openCampaignBooster;
window.openFreeTestBooster=openFreeTestBooster;
window.resetCampaign=resetCampaign;
window.toggleMonoFactionCheat=toggleMonoFactionCheat;
window.isMonoFactionCheat=isMonoFactionCheat;
window.monoFactionCheatLabel=monoFactionCheatLabel;
window.campaignPlayFactions=campaignPlayFactions;
window.BOOSTER_PRICE=BOOSTER_PRICE;
window.BOOSTER_SIZE=BOOSTER_SIZE;
window.renderCampaign=renderCampaign;
