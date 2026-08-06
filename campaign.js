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
    decks:[], // {id, name, cards:[{creatureId, count}]} — max 15 uniques × 4
    activeDeckId:null,
    editingDeckId:null,
    introStep:0,
    phase:'intro', // intro | pickFactions | map | battle | rewards | binder | fusion | shop | deck | citadel
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
    discovered:['tour','forge','marche','col'],
    nodeStates:{},
    familyWins:{},
    capturedFamilies:[],
    encounteredIds:[],
    routeThreats:{},
    pendingTravel:null,
    citadel:{buildings:[], companion:null, mount:null},
    mountSkipCharges:0,
    mapVersion:2,
  };
}

/** Familles de decks ennemis (thèmes de rencontre). */
const CAMPAIGN_FAMILIES={
  sylvestre:{id:'sylvestre', label:'Sylvestres', factions:['Sylve','Bosquet'], theme:'Poison et soins'},
  morts_vivants:{id:'morts_vivants', label:'Morts-vivants', factions:['Nécropole','Abîme'], theme:'Sacrifice et résilience'},
  chevaliers:{id:'chevaliers', label:'Chevaliers', factions:['Forteresse','Bastion'], theme:'Tank et Bouclier divin'},
  demons:{id:'demons', label:'Démons', factions:['Pandémonium','Volcan'], theme:'Puissance risquée'},
  volants:{id:'volants', label:'Volants', factions:['Empyrée','Tour'], theme:'Mobilité et frappe'},
  geants:{id:'geants', label:'Géants', factions:['Tertre','Terrier'], theme:'Gros coûts et Piétinement'},
};

const CITADEL_BUILDINGS=[
  {id:'bestiaire', name:'Bestiaire', cost:60, blurb:'Archive les créatures rencontrées et leurs lieux.'},
  {id:'menagerie', name:'Ménagerie', cost:100, blurb:'Débloque les missions Capture dans les repaires.'},
  {id:'tour_guet', name:'Tour de guet', cost:80, blurb:'Révèle les menaces sur toutes les routes adjacentes.'},
  {id:'atelier_siege', name:'Atelier de siège', cost:160, blurb:'Permet d’assiéger les capitales hostiles.'},
];

const CAMPAIGN_COMPANIONS=[
  {id:'paladin', name:'Paladin', blurb:'Tes créatures ont +1 PV pendant les sièges.'},
  {id:'chasseur', name:'Chasseur', blurb:'La première créature Vol ennemie du deck coûte +1.'},
  {id:'eclaireur', name:'Éclaireur', blurb:'Révèle les menaces sur les routes voisines (sans Tour de guet).'},
];

const CAMPAIGN_MOUNTS=[
  {id:'destrier', name:'Destrier', blurb:'Ignore la prochaine rencontre routière (1 charge).'},
  {id:'ombre', name:'Monture d’ombre', blurb:'Permet de fuir une rencontre d’une famille déjà vaincue.'},
];

const CAPTURE_WINS_NEEDED=3;
const ENCOUNTER_TYPES={
  patrol:{id:'patrol', label:'Patrouille', blurb:'Combat normal contre une famille.'},
  ambush:{id:'ambush', label:'Embuscade', blurb:'L’ennemi commence avec une créature en jeu.'},
  blockade:{id:'blockade', label:'Blocus', blurb:'Victoire obligatoire pour emprunter la route.'},
  capture:{id:'capture', label:'Capture', blurb:'Défi de capture : vaincre pour recruter une créature de la famille.'},
  siege:{id:'siege', label:'Siège', blurb:'Tour adverse renforcée + défense initiale.'},
};

/** Carte MVP (~14 lieux, 4 capitales). positions en % ; links = voisins. */
const CAMPAIGN_MAP_NODES=[
  {id:'tour', name:'Tour oubliée', kind:'home', x:12, y:58, links:['forge','col','marche','clairiere'],
    blurb:'Ton refuge et ta citadelle. Classeur, decks, compagnons et bâtiments.'},
  {id:'forge', name:'Crypte des sceaux', kind:'fusion', x:8, y:28, links:['tour','marche'],
    blurb:'Cinq cartes d’une rareté deviennent une rareté supérieure.'},
  {id:'marche', name:'Comptoir des brumes', kind:'shop', x:30, y:40, links:['tour','forge','col','gue','clairiere'],
    blurb:'Marchands : boosters, ventes, rachat.'},
  {id:'clairiere', name:'Clairière du Hameau', kind:'village', x:22, y:78, links:['tour','marche','col','bosquet'],
    blurb:'Village accueillant : édition de deck, rumeurs, départ vers le Bosquet.',
    status:'neutral'},
  {id:'col', name:'Col des corbeaux', kind:'route', x:38, y:62, links:['tour','marche','clairiere','gue','landes'],
    family:'chevaliers', difficulty:1,
    blurb:'Col venté — patrouilles de chevaliers sur la crête.'},
  {id:'gue', name:'Gué de l’ambre', kind:'route', x:52, y:44, links:['marche','col','landes','manufacture','sanctuaire'],
    family:'volants', difficulty:2,
    blurb:'Embuscades ailées au passage du gué.'},
  {id:'landes', name:'Landes pourpres', kind:'route', x:48, y:76, links:['col','gue','bosquet','forteresse'],
    family:'demons', difficulty:2,
    blurb:'Bruyère pourpre et bannières démoniaques.'},
  {id:'bosquet', name:'Repaire du Bosquet', kind:'lair', x:36, y:90, links:['clairiere','landes','sylve'],
    family:'sylvestre', difficulty:2,
    blurb:'Famille sylvestre. Vaincre 3 fois ouvre une mission Capture (Ménagerie).',
    status:'hostile'},
  {id:'sylve', name:'Capitale — Sylve', kind:'capital', x:58, y:92, links:['bosquet','forteresse'],
    family:'sylvestre', capitalFaction:'Sylve', difficulty:3,
    blurb:'Grande capitale sylvestre. Siège possible avec l’Atelier.',
    status:'hostile', towerHp:40},
  {id:'manufacture', name:'Capitale — Manufacture', kind:'capital', x:70, y:28, links:['gue','sanctuaire','ruines'],
    family:'geants', capitalFaction:'Manufacture', difficulty:3,
    blurb:'Forges et automates. Conquête = recrutement Manufacture.',
    status:'hostile', towerHp:40},
  {id:'sanctuaire', name:'Sanctuaire des runes', kind:'sanctuary', x:66, y:52, links:['gue','manufacture','ossuaire','ruines'],
    family:'volants', difficulty:2,
    blurb:'Défi rituel : duel contre un deck thématique renforcé.'},
  {id:'ruines', name:'Ruines d’ambre', kind:'ruins', x:84, y:40, links:['manufacture','sanctuaire','necropole'],
    family:'geants', difficulty:2,
    blurb:'Reliques rares — butin amélioré après victoire.'},
  {id:'ossuaire', name:'Repaire des ossements', kind:'lair', x:74, y:68, links:['sanctuaire','forteresse','necropole'],
    family:'morts_vivants', difficulty:2,
    blurb:'Nécrophages. Capture après 3 victoires (Ménagerie).',
    status:'hostile'},
  {id:'forteresse', name:'Forteresse du Nord', kind:'fortress', x:62, y:78, links:['landes','sylve','ossuaire','necropole'],
    family:'chevaliers', difficulty:3,
    blurb:'Avant-poste fortifié. Prépare le siège de la Nécropole.',
    status:'hostile'},
  {id:'necropole', name:'Capitale — Nécropole', kind:'capital', x:88, y:72, links:['ruines','ossuaire','forteresse'],
    family:'morts_vivants', capitalFaction:'Nécropole', difficulty:3,
    blurb:'Siège du chapitre : tour 40 PV, mur d’ossements, deck sacrifice.',
    status:'hostile', towerHp:40, siegeDefense:true},
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
function mapRoadKey(a, b){
  return [a, b].sort().join('::');
}
function mapRoadPairs(){
  const seen=new Set();
  const pairs=[];
  for(const n of CAMPAIGN_MAP_NODES){
    for(const to of n.links||[]){
      const key=mapRoadKey(n.id, to);
      if(seen.has(key)) continue;
      seen.add(key);
      const b=mapNode(to);
      pairs.push([n, b, key]);
    }
  }
  return pairs;
}
function familyOf(id){
  return CAMPAIGN_FAMILIES[id] || null;
}
function isHubNode(n){
  if(!n) return false;
  return n.kind==='home' || n.kind==='village' || n.kind==='shop' || n.kind==='fusion';
}
function canEditDeckAt(n, camp){
  if(!n) return false;
  if(n.kind==='home' || n.kind==='village') return true;
  if(n.kind==='capital'){
    const st=getNodeStatus(camp, n.id);
    return st==='conquered' || st==='allied';
  }
  return false;
}
function getNodeStatus(camp, nodeId){
  const n=mapNode(nodeId);
  const custom=(camp.nodeStates||{})[nodeId];
  if(custom) return custom;
  if(n.status) return n.status;
  if((camp.discovered||[]).includes(nodeId)) return 'discovered';
  return 'unknown';
}
function setNodeStatus(camp, nodeId, status){
  if(!camp.nodeStates) camp.nodeStates={};
  camp.nodeStates[nodeId]=status;
}
function discoverNode(camp, nodeId){
  if(!Array.isArray(camp.discovered)) camp.discovered=[];
  if(!camp.discovered.includes(nodeId)) camp.discovered.push(nodeId);
  const st=getNodeStatus(camp, nodeId);
  if(st==='unknown') setNodeStatus(camp, nodeId, mapNode(nodeId).status||'discovered');
}
function hasCitadelBuilding(camp, id){
  return !!(camp.citadel?.buildings||[]).includes(id);
}
function citadelCompanion(camp){
  const id=camp.citadel?.companion;
  return CAMPAIGN_COMPANIONS.find(c=>c.id===id) || null;
}
function citadelMount(camp){
  const id=camp.citadel?.mount;
  return CAMPAIGN_MOUNTS.find(c=>c.id===id) || null;
}
function canSeeRouteThreats(camp){
  return hasCitadelBuilding(camp, 'tour_guet') || citadelCompanion(camp)?.id==='eclaireur';
}
function ensureRouteThreats(camp){
  if(!camp.routeThreats || typeof camp.routeThreats!=='object') camp.routeThreats={};
  for(const [a,b,key] of mapRoadPairs()){
    if(camp.routeThreats[key]) continue;
    const combatish=n=>['route','lair','fortress','sanctuary','ruins','capital'].includes(n.kind);
    if(!combatish(a) && !combatish(b)) continue;
    const fam=(a.family && CAMPAIGN_FAMILIES[a.family]) ? a.family
      : (b.family && CAMPAIGN_FAMILIES[b.family]) ? b.family
      : 'chevaliers';
    const roll=Math.random();
    const type=roll<0.35 ? 'ambush' : (roll<0.55 ? 'blockade' : 'patrol');
    camp.routeThreats[key]={type, family:fam, cleared:false};
  }
}
function routeThreatBetween(camp, fromId, toId){
  ensureRouteThreats(camp);
  const key=mapRoadKey(fromId, toId);
  const t=camp.routeThreats[key];
  if(!t || t.cleared) return null;
  return {...t, key};
}
function familyWinCount(camp, familyId){
  return (camp.familyWins&&camp.familyWins[familyId])|0;
}
function recordFamilyWin(camp, familyId){
  if(!familyId) return;
  if(!camp.familyWins) camp.familyWins={};
  camp.familyWins[familyId]=(camp.familyWins[familyId]|0)+1;
}
function captureReady(camp, familyId){
  if(!familyId) return false;
  if(!hasCitadelBuilding(camp, 'menagerie')) return false;
  if((camp.capturedFamilies||[]).includes(familyId)) return false;
  return familyWinCount(camp, familyId)>=CAPTURE_WINS_NEEDED;
}
function trackEncounteredFromSide(camp, side){
  if(!camp.encounteredIds) camp.encounteredIds=[];
  const seen=new Set(camp.encounteredIds);
  const piles=[...(side?.board||[]), ...(side?.hand||[]), ...(side?.deck||[])];
  for(const c of piles){
    if(c?.id!=null && !seen.has(c.id)){
      seen.add(c.id);
      camp.encounteredIds.push(c.id);
    }
  }
}
function migrateWorldMap(camp){
  if(!camp) return;
  const d=defaultCampaign();
  for(const k of ['discovered','nodeStates','familyWins','capturedFamilies','encounteredIds','routeThreats','citadel','pendingTravel']){
    if(camp[k]==null) camp[k]=d[k];
  }
  if(!camp.citadel || typeof camp.citadel!=='object') camp.citadel={buildings:[], companion:null, mount:null};
  if(!Array.isArray(camp.citadel.buildings)) camp.citadel.buildings=[];
  if(camp.mountSkipCharges==null) camp.mountSkipCharges=0;
  if(!CAMPAIGN_MAP_NODES.some(n=>n.id===camp.mapLocation)) camp.mapLocation='tour';
  if(Array.isArray(camp.mapCleared)){
    camp.mapCleared=camp.mapCleared.filter(id=>CAMPAIGN_MAP_NODES.some(n=>n.id===id));
  }
  ensureRouteThreats(camp);
  camp.mapVersion=2;
}
function loadCampaign(){
  try{
    const raw=localStorage.getItem(CAMPAIGN_KEY);
    if(!raw) return defaultCampaign();
    const camp={...defaultCampaign(), ...JSON.parse(raw)};
    migrateCampaignDecks(camp);
    migrateWorldMap(camp);
    return camp;
  }catch(_){
    return defaultCampaign();
  }
}
function ensureCampaign(){
  if(!state.campaign) state.campaign=loadCampaign();
  migrateCampaignDecks(state.campaign);
  migrateWorldMap(state.campaign);
  return state.campaign;
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
const DECK_MAX_UNIQUES=15;
const DECK_MAX_COPIES=4;

function migrateCampaignDecks(camp){
  if(!camp) return;
  if(!Array.isArray(camp.decks)) camp.decks=[];
  camp.decks=camp.decks.filter(d=>d && d.id);
  for(const d of camp.decks){
    if(!Array.isArray(d.cards)) d.cards=[];
    d.cards=d.cards
      .filter(e=>e && e.creatureId!=null)
      .map(e=>({creatureId:Number(e.creatureId), count:Math.max(1, Math.min(DECK_MAX_COPIES, e.count|0||1))}))
      .slice(0, DECK_MAX_UNIQUES);
  }
  if(camp.activeDeckId && !camp.decks.some(d=>d.id===camp.activeDeckId)) camp.activeDeckId=null;
  if(!camp.activeDeckId && camp.decks.length) camp.activeDeckId=camp.decks[0].id;
  if(camp.editingDeckId && !camp.decks.some(d=>d.id===camp.editingDeckId)) camp.editingDeckId=null;
}
function newDeckId(){
  return `deck-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,7)}`;
}
function getDeckById(id){
  const camp=ensureCampaign();
  return (camp.decks||[]).find(d=>d.id===id) || null;
}
function getActiveDeck(){
  const camp=ensureCampaign();
  return getDeckById(camp.activeDeckId) || camp.decks[0] || null;
}
function getEditingDeck(){
  const camp=ensureCampaign();
  return getDeckById(camp.editingDeckId) || getActiveDeck();
}
function deckUniqueCount(deck){
  return (deck?.cards||[]).length;
}
function deckTotalCount(deck){
  return (deck?.cards||[]).reduce((s,e)=>s+(e.count|0), 0);
}
function binderOwnedForCreature(creatureId){
  const id=Number(creatureId);
  return ensureCampaign().binder
    .filter(r=>Number(r.creatureId)===id)
    .reduce((s,r)=>s+(r.count|0), 0);
}
/** Exemplaires du classeur triés rareté desc. pour matérialiser le cadre. */
function binderCopiesForCreature(creatureId){
  const id=Number(creatureId);
  const rows=ensureCampaign().binder
    .filter(r=>Number(r.creatureId)===id && (r.count|0)>0)
    .slice()
    .sort((a,b)=>rarityIndex(b.rarity)-rarityIndex(a.rarity));
  const out=[];
  for(const row of rows){
    for(let i=0;i<(row.count|0);i++) out.push(row.rarity||'normal');
  }
  return out;
}
function deckEntry(deck, creatureId){
  const id=Number(creatureId);
  return (deck.cards||[]).find(e=>Number(e.creatureId)===id) || null;
}
function createEmptyDeck(name){
  const camp=ensureCampaign();
  const n=(camp.decks||[]).length+1;
  const deck={
    id:newDeckId(),
    name:name || `Deck ${n}`,
    cards:[],
  };
  camp.decks.push(deck);
  camp.activeDeckId=deck.id;
  camp.editingDeckId=deck.id;
  saveCampaign();
  return deck;
}
function setActiveDeck(deckId){
  const camp=ensureCampaign();
  if(!getDeckById(deckId)) return;
  camp.activeDeckId=deckId;
  saveCampaign();
  render();
}
function openDeckEditor(deckId){
  const camp=ensureCampaign();
  const deck=deckId ? getDeckById(deckId) : null;
  if(deck) camp.editingDeckId=deck.id;
  else if(!camp.editingDeckId){
    const d=createEmptyDeck();
    camp.editingDeckId=d.id;
  }
  setCampaignView('deck');
}
function deleteDeck(deckId){
  const camp=ensureCampaign();
  camp.decks=(camp.decks||[]).filter(d=>d.id!==deckId);
  if(camp.activeDeckId===deckId) camp.activeDeckId=camp.decks[0]?.id||null;
  if(camp.editingDeckId===deckId) camp.editingDeckId=camp.activeDeckId;
  saveCampaign();
  render();
}
function renameEditingDeck(name){
  const deck=getEditingDeck();
  if(!deck) return;
  const cleaned=String(name||'').trim().slice(0, 40);
  if(!cleaned) return;
  deck.name=cleaned;
  saveCampaign();
  render();
}
function deckAddCreature(creatureId, delta=1){
  const camp=ensureCampaign();
  let deck=getEditingDeck();
  if(!deck) deck=createEmptyDeck();
  const id=Number(creatureId);
  const c=CREATURES.find(x=>x.id===id);
  if(!c) return;
  const factions=camp.playerFactions||[];
  if(delta>0 && factions.length && !factions.includes(c.capital)){
    camp.shopMsg=`${c.name} hors factions (${factions.join(' · ')}).`;
    saveCampaign();
    render();
    return;
  }
  const owned=binderOwnedForCreature(id);
  if(owned<=0){
    camp.shopMsg='Cette carte n’est pas dans ton classeur.';
    saveCampaign();
    render();
    return;
  }
  let entry=deckEntry(deck, id);
  if(!entry){
    if(deckUniqueCount(deck)>=DECK_MAX_UNIQUES){
      camp.shopMsg=`Deck plein : ${DECK_MAX_UNIQUES} créatures max.`;
      saveCampaign();
      render();
      return;
    }
    entry={creatureId:id, count:0};
    deck.cards.push(entry);
  }
  const next=Math.min(DECK_MAX_COPIES, owned, (entry.count|0)+delta);
  entry.count=Math.max(0, next);
  if(entry.count<=0) deck.cards=deck.cards.filter(e=>e!==entry);
  camp.shopMsg=null;
  saveCampaign();
  render();
}
function deckSetCreatureCount(creatureId, count){
  const camp=ensureCampaign();
  const deck=getEditingDeck();
  if(!deck) return;
  const id=Number(creatureId);
  const owned=binderOwnedForCreature(id);
  let entry=deckEntry(deck, id);
  const n=Math.max(0, Math.min(DECK_MAX_COPIES, owned, count|0));
  if(n<=0){
    deck.cards=(deck.cards||[]).filter(e=>Number(e.creatureId)!==id);
  } else if(!entry){
    if(deckUniqueCount(deck)>=DECK_MAX_UNIQUES){
      camp.shopMsg=`Deck plein : ${DECK_MAX_UNIQUES} créatures max.`;
      saveCampaign();
      render();
      return;
    }
    deck.cards.push({creatureId:id, count:n});
  } else {
    entry.count=n;
  }
  saveCampaign();
  render();
}
function materializeDeckCards(deck){
  const cards=[];
  for(const entry of deck.cards||[]){
    const c=CREATURES.find(x=>x.id===Number(entry.creatureId));
    if(!c) continue;
    const need=Math.max(0, Math.min(DECK_MAX_COPIES, entry.count|0));
    const frames=binderCopiesForCreature(c.id);
    for(let i=0;i<need;i++){
      const card=typeof cloneCard==='function' ? cloneCard(c) : {...c};
      card.frameId=frames[i] || frames[frames.length-1] || 'normal';
      cards.push(card);
    }
  }
  return cards;
}
/** Construit un deck auto : jusqu’à 15 uniques × min(4, stock classeur), factions du joueur prioritaires. */
function autoBuildDeckFromBinder(opts={}){
  const camp=ensureCampaign();
  ensureStarterQuadCopies();
  const factions=camp.playerFactions||[];
  const ownedIds=[...new Set((camp.binder||[])
    .filter(r=>(r.count|0)>0)
    .map(r=>Number(r.creatureId)))];
  const models=ownedIds
    .map(id=>CREATURES.find(c=>c.id===id))
    .filter(Boolean)
    .filter(c=>!factions.length || factions.includes(c.capital))
    .sort((a,b)=>{
      const ca=(a.costColored||0)+(a.costNeutral||0)||a.cost||0;
      const cb=(b.costColored||0)+(b.costNeutral||0)||b.cost||0;
      if(ca!==cb) return ca-cb;
      return (a.name||'').localeCompare(b.name||'','fr');
    });
  const cards=[];
  for(const c of models){
    if(cards.length>=DECK_MAX_UNIQUES) break;
    const owned=binderOwnedForCreature(c.id);
    if(owned<=0) continue;
    cards.push({creatureId:c.id, count:Math.min(DECK_MAX_COPIES, owned)});
  }
  const deck=opts.replace && getEditingDeck()
    ? getEditingDeck()
    : createEmptyDeck(opts.name || 'Deck auto');
  deck.cards=cards;
  if(opts.name) deck.name=opts.name;
  camp.activeDeckId=deck.id;
  camp.editingDeckId=deck.id;
  camp.shopMsg=`Deck auto : ${deckUniqueCount(deck)} créatures · ${deckTotalCount(deck)} cartes.`;
  saveCampaign();
  return deck;
}
function autoBuildAndOpenDeck(){
  autoBuildDeckFromBinder({replace:false, name:'Deck auto'});
  const msg=ensureCampaign().shopMsg;
  setCampaignView('deck');
  if(msg){
    ensureCampaign().shopMsg=msg;
    saveCampaign();
    render();
  }
}
function newDeckAndEdit(){
  createEmptyDeck('Mon deck');
  setCampaignView('deck');
}
function confirmDeckAndGoMap(){
  const camp=ensureCampaign();
  const deck=getActiveDeck() || getEditingDeck();
  if(!deck || deckUniqueCount(deck)<=0){
    camp.shopMsg='Ajoute au moins une créature, ou clique « Créer automatiquement ».';
    saveCampaign();
    render();
    return;
  }
  camp.activeDeckId=deck.id;
  camp.editingDeckId=deck.id;
  const u=deckUniqueCount(deck);
  const t=deckTotalCount(deck);
  camp.shopMsg=`Deck actif : ${deck.name} · ${u} créatures · ${t} cartes.`;
  camp.phase='map';
  if(!camp.mapLocation) camp.mapLocation='tour';
  state.battle=null;
  state.combatView='campagne';
  saveCampaign();
  render();
}
function autoFillEditingDeck(){
  autoBuildDeckFromBinder({replace:true, name:null});
  render();
}

/** Deck joueur campagne : deck actif (15×4) sinon classeur filtré. */
function makeCampaignPlayerSide(factions, size=null){
  const camp=ensureCampaign();
  ensureStarterQuadCopies();
  const active=getActiveDeck();
  if(active && (active.cards||[]).length){
    const fromDeck=materializeDeckCards(active);
    if(fromDeck.length){
      return makeCampaignSideFromDeck(factions, fromDeck);
    }
  }
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
    // Premier passage : deck de départ + ouverture du builder
    migrateCampaignDecks();
    if(!(camp.decks||[]).length){
      autoBuildDeckFromBinder({name:'Deck de départ'});
      camp.shopMsg='Compose ton deck (15 créatures × 4 max) à partir du classeur, puis lance-toi sur la carte.';
    }
    camp.phase='deck';
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
  grantStarterBinder();
  if(view==='hub') view='map';
  camp.phase=view;
  if(view==='shop') refreshShopStock(false);
  if(view==='binder'){
    state.binderRarity='Toutes';
    state.activeCapital='Toutes';
    state.search='';
    state.zoomedId=null;
  }
  if(view==='deck'){
    migrateCampaignDecks();
    const here=mapNode(camp.mapLocation||'tour');
    if(!canEditDeckAt(here, camp)){
      camp.shopMsg='Édite ton deck dans un refuge, village, ou capitale alliée/conquise.';
      camp.phase='map';
      saveCampaign();
      render();
      return;
    }
    if(!getEditingDeck()){
      const active=getActiveDeck();
      if(active) camp.editingDeckId=active.id;
      else createEmptyDeck('Mon deck');
    }
  }
  if(view==='citadel'){
    if(mapNode(camp.mapLocation||'tour').kind!=='home'){
      camp.mapLocation='tour';
    }
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
  const freeTravel=!!opts.free || (isHubNode(mapNode(nodeId)) && ['tour','marche','forge'].includes(nodeId));
  if(!freeTravel && !isMapReachable(from, nodeId)){
    camp.shopMsg='Cette route n’est pas accessible depuis ici.';
    saveCampaign();
    render();
    return;
  }
  if(from===nodeId){
    camp.phase='map';
    saveCampaign();
    render();
    return;
  }
  // Rencontre routière (max 1) sauf free travel / skip monture
  if(!freeTravel && !opts.afterBattle){
    const threat=routeThreatBetween(camp, from, nodeId);
    if(threat){
      if(opts.skipMount && citadelMount(camp)?.id==='destrier' && (camp.mountSkipCharges|0)>0){
        camp.mountSkipCharges=(camp.mountSkipCharges|0)-1;
        if(camp.routeThreats[threat.key]) camp.routeThreats[threat.key].cleared=true;
        camp.shopMsg='Destrier : rencontre évitée.';
      } else if(opts.fleeMount && citadelMount(camp)?.id==='ombre' && familyWinCount(camp, threat.family)>0){
        camp.shopMsg='Monture d’ombre : tu contournes la rencontre.';
        // ne clear pas — on peut revenir
      } else if(!opts.forceArrive){
        camp.pendingTravel={from, to:nodeId, threatKey:threat.key, type:threat.type, family:threat.family};
        camp.shopMsg=null;
        camp.phase='map';
        saveCampaign();
        render();
        return;
      }
    }
  }
  camp.pendingTravel=null;
  camp.mapLocation=nodeId;
  discoverNode(camp, nodeId);
  camp.shopMsg=camp.shopMsg||null;
  camp.phase='map';
  saveCampaign();
  render();
}
function resolvePendingTravelFight(){
  const camp=ensureCampaign();
  const p=camp.pendingTravel;
  if(!p) return;
  startCampaignBattle(p.to, {
    encounter:p.type||'blockade',
    family:p.family,
    threatKey:p.threatKey,
    travelTo:p.to,
    fromRoad:true,
  });
}
function resolvePendingTravelSkip(){
  const camp=ensureCampaign();
  const p=camp.pendingTravel;
  if(!p) return;
  if(citadelMount(camp)?.id==='destrier' && (camp.mountSkipCharges|0)>0){
    travelCampaignMap(p.to, {skipMount:true});
    return;
  }
  if(citadelMount(camp)?.id==='ombre' && familyWinCount(camp, p.family)>0){
    travelCampaignMap(p.to, {fleeMount:true});
    return;
  }
  camp.shopMsg='Impossible d’éviter : combats ou choisis un autre chemin.';
  saveCampaign();
  render();
}
function cancelPendingTravel(){
  const camp=ensureCampaign();
  camp.pendingTravel=null;
  camp.shopMsg='Tu restes sur place.';
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
  if(view==='citadel'){
    camp.mapLocation='tour';
    setCampaignView('citadel');
    return;
  }
  if(view==='shop') camp.mapLocation='marche';
  if(view==='binder' || view==='fusion' || view==='deck') camp.mapLocation=camp.mapLocation||'tour';
  setCampaignView(view);
}
function mapKindLabel(kind){
  return ({
    home:'Refuge', shop:'Boutique', fusion:'Fusion', duel:'Duel',
    village:'Village', capital:'Capitale', lair:'Repaire', sanctuary:'Sanctuaire',
    ruins:'Ruines', fortress:'Forteresse', route:'Route',
  })[kind] || kind;
}
function mapStatusLabel(st){
  return ({
    unknown:'Inconnu', discovered:'Découvert', neutral:'Neutre', hostile:'Hostile',
    allied:'Allié', conquered:'Conquis', revolt:'Révolte',
  })[st] || st;
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
function startCampaignBattle(fromNode, battleOpts={}){
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
  migrateCampaignDecks();
  const active=getActiveDeck();
  const uniques=deckUniqueCount(active);
  if(!active || uniques<=0){
    camp.shopMsg='Crée ou active un deck avant le duel (15 créatures × 4 max).';
    camp.phase='deck';
    if(!getEditingDeck()) createEmptyDeck('Mon deck');
    saveCampaign();
    render();
    return;
  }
  if(uniques < DECK_MAX_UNIQUES){
    camp.shopMsg=`Deck incomplet (${uniques}/${DECK_MAX_UNIQUES}). Tu peux quand même combattre — ou compléter via « Remplir ce deck ».`;
  }
  const nodeId=fromNode || camp.mapLocation || 'col';
  const node=mapNode(nodeId);
  const encounter=battleOpts.encounter
    || (battleOpts.siege || (node.kind==='capital' && getNodeStatus(camp, nodeId)==='hostile') ? 'siege' : null)
    || (battleOpts.capture ? 'capture' : null)
    || (node.kind==='route' ? 'patrol' : 'patrol');
  const isSiege=encounter==='siege' || !!battleOpts.siege;
  if(isSiege && node.kind==='capital' && !hasCitadelBuilding(camp, 'atelier_siege') && !battleOpts.force){
    camp.shopMsg='Construis l’Atelier de siège à la citadelle pour attaquer une capitale.';
    saveCampaign();
    render();
    return;
  }
  if(encounter==='capture' && !captureReady(camp, battleOpts.family||node.family)){
    camp.shopMsg='Capture indisponible (Ménagerie + 3 victoires sur la famille).';
    saveCampaign();
    render();
    return;
  }
  if(!battleOpts.fromRoad && !isHubNode(node) && camp.mapLocation!==nodeId && !isMapReachable(camp.mapLocation||'tour', nodeId)){
    camp.shopMsg='Rejoins d’abord ce lieu sur la carte.';
    saveCampaign();
    render();
    return;
  }
  const famId=battleOpts.family || node.family || 'chevaliers';
  const fam=familyOf(famId) || CAMPAIGN_FAMILIES.chevaliers;
  let enemyFactions=fam.factions.slice(0, 2);
  if(node.capitalFaction && !enemyFactions.includes(node.capitalFaction)){
    enemyFactions=[node.capitalFaction, enemyFactions[0]].filter(Boolean).slice(0,2);
  }
  camp.phase='battle';
  camp.lastRewards=null;
  camp.battleNode=nodeId;
  if(!battleOpts.fromRoad) camp.mapLocation=nodeId;
  saveCampaign();
  state.combatView='campagne';
  const factions=[...new Set([...playerFactions, ...enemyFactions])];
  const playerFirst=encounter==='ambush' ? false : Math.random()<0.5;
  const playFactions=campaignPlayFactions(playerFactions);
  const playerSide=typeof makeCampaignPlayerSide==='function'
    ? makeCampaignPlayerSide(playFactions)
    : makeSide(playFactions, CAMPAIGN_DECK_SIZE*STARTER_COPIES);
  const enemySide=makeCampaignSideFromDeck(enemyFactions, buildCampaignDeck(enemyFactions));

  // Compagnon Chasseur : 1ʳᵉ Vol ennemie coûte +1
  if(citadelCompanion(camp)?.id==='chasseur'){
    const vol=enemySide.deck.find(c=>hasRole?.(c,'vol') || (c.abilities||[]).includes('vol') || (c.roles||[]).includes('volant'));
    if(vol){ vol.cost=(vol.cost|0)+1; }
  }
  // Compagnon Paladin + siège : +1 PV sur le deck joueur
  if(isSiege && citadelCompanion(camp)?.id==='paladin'){
    for(const c of [...playerSide.deck, ...playerSide.hand]){
      c.hp=(c.hp|0)+1;
      c.maxHp=(c.maxHp||c.hp)+1;
      if(c.baseHp!=null) c.baseHp=(c.baseHp|0)+1;
    }
  }
  // Siège / tour renforcée
  const towerHp=isSiege ? (node.towerHp||40) : 30;
  enemySide.hp=towerHp;
  // Embuscade / défense de siège : créature adverse déjà en jeu
  if(encounter==='ambush' || (isSiege && node.siegeDefense) || battleOpts.ambush){
    const tokenSrc=enemySide.deck.find(c=>(c.cost|0)<=3) || enemySide.deck[0];
    if(tokenSrc){
      const idx=enemySide.deck.indexOf(tokenSrc);
      if(idx>=0) enemySide.deck.splice(idx,1);
      const token=typeof cloneCard==='function' ? cloneCard(tokenSrc) : {...tokenSrc};
      token.uid=typeof uid==='function' ? uid() : `e${Date.now()}`;
      token.canAttack=false;
      token.summoningSickness=true;
      if(isSiege && node.siegeDefense){
        token.name='Mur d’ossements';
        token.attack=0; token.baseAttack=0;
        token.hp=5; token.maxHp=5; token.baseHp=5;
        if(!token.roles) token.roles=[];
        if(!token.roles.includes('tank')) token.roles.push('tank');
        if(!token.abilities) token.abilities=[];
        if(!token.abilities.includes('tank')) token.abilities.push('tank');
      }
      enemySide.board.push(token);
    }
  }
  // Capture : défi thématique (récompense spéciale) — moteur = combat normal pour le MVP
  const captureMode=encounter==='capture';

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
    encounter,
    family:famId,
    threatKey:battleOpts.threatKey||null,
    travelTo:battleOpts.travelTo||null,
    captureMode,
    siege:isSiege,
    towerMax:towerHp,
  };
  const encLabel=ENCOUNTER_TYPES[encounter]?.label || encounter;
  combatLog(`Campagne — ${node.name} · ${encLabel} (${fam.label}). Toi: ${playerFactions.join(' · ')} · Adverse: ${enemyFactions.join(' · ')}.`);
  if(captureMode){
    combatLog('Mission Capture : vaincs ce défi pour recruter une créature de la famille.');
  }
  if(isSiege) combatLog(`Siège : tour adverse ${towerHp} PV.`);
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
  const camp=ensureCampaign();
  trackEncounteredFromSide(camp, b.enemy);
  trackEncounteredFromSide(camp, b.player);
  if(!b.rewardsApplied){
    b.rewards=rollCampaignRewards(b.winner==='player');
    if(b.winner==='player' && mapNode(b.mapNode)?.kind==='ruins'){
      b.rewards.gold=(b.rewards.gold||0)+12;
      const c=pickRewardCreature();
      b.rewards.cards.push({creatureId:c.id, name:c.name, rarity:rollCampaignRarity(), image:c.image});
    }
    if(b.winner==='player' && b.captureMode){
      const fam=familyOf(b.family);
      const pool=CREATURES.filter(c=>fam && fam.factions.includes(c.capital));
      const pick=pool[Math.floor(Math.random()*pool.length)] || pickRewardCreature();
      b.rewards.cards.push({creatureId:pick.id, name:pick.name, rarity:'silver', image:pick.image});
      b.rewards.captureName=pick.name;
      if(!Array.isArray(camp.capturedFamilies)) camp.capturedFamilies=[];
      if(b.family && !camp.capturedFamilies.includes(b.family)) camp.capturedFamilies.push(b.family);
    }
    applyCampaignRewards(b.rewards);
    b.rewardsApplied=true;
  }
  camp.phase='rewards';
  camp.lastRewards=b.rewards;
  if(b.winner==='player'){
    if(camp.battleNode){
      if(!Array.isArray(camp.mapCleared)) camp.mapCleared=[];
      if(!camp.mapCleared.includes(camp.battleNode)) camp.mapCleared.push(camp.battleNode);
    }
    if(b.family) recordFamilyWin(camp, b.family);
    if(b.threatKey && camp.routeThreats?.[b.threatKey]){
      camp.routeThreats[b.threatKey].cleared=true;
    }
    if(b.siege && camp.battleNode){
      setNodeStatus(camp, camp.battleNode, 'conquered');
      discoverNode(camp, camp.battleNode);
      camp.gold=(camp.gold||0)+40;
      if(b.rewards){
        b.rewards.gold=(b.rewards.gold||0)+40;
        b.rewards.conquered=mapNode(camp.battleNode).name;
      }
    }
    if(b.travelTo){
      camp.mapLocation=b.travelTo;
      discoverNode(camp, b.travelTo);
    }
  }
  camp.pendingTravel=null;
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
  ensureRouteThreats(camp);
  const hereId=camp.mapLocation||'tour';
  const here=mapNode(hereId);
  const cleared=new Set(camp.mapCleared||[]);
  const reachable=mapLinksFrom(hereId);
  const seeThreats=canSeeRouteThreats(camp);
  const discovered=new Set(camp.discovered||[]);
  const roads=mapRoadPairs().map(([a,b,key])=>{
    const active=a.id===hereId||b.id===hereId;
    const threat=camp.routeThreats?.[key];
    const danger=threat && !threat.cleared && seeThreats && active;
    return `<line class="camp-map-road${active?' is-active':''}${danger?' is-threat':''}" x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" />`;
  }).join('');
  const nodes=CAMPAIGN_MAP_NODES.map(n=>{
    const isHere=n.id===hereId;
    const canGo=reachable.has(n.id);
    const done=cleared.has(n.id);
    const known=discovered.has(n.id) || isHere || canGo;
    const locked=!isHere && !canGo;
    const st=getNodeStatus(camp, n.id);
    const cls=[
      'camp-map-node',
      `kind-${n.kind}`,
      `status-${st}`,
      isHere?'is-here':'',
      canGo?'is-reachable':'',
      locked?'is-locked':'',
      done?'is-cleared':'',
      !known?'is-fog':'',
    ].filter(Boolean).join(' ');
    const click=locked ? '' : `onclick="travelCampaignMap('${n.id}')"`;
    const labelName=known ? n.name : '???';
    const fam=familyOf(n.family);
    const sub=known
      ? `${mapKindLabel(n.kind)}${fam?` · ${fam.label}`:''}${n.difficulty?` · ${mapDifficultyLabel(n)}`:''}${done?' · vaincu':''}`
      : 'Terra incognita';
    return `<button type="button" class="${cls}" style="left:${n.x}%;top:${n.y}%" ${click} ${locked?'disabled':''} title="${labelName}">
      <span class="camp-map-pin" aria-hidden="true"></span>
      <span class="camp-map-label"><b>${labelName}</b><small>${sub}</small></span>
    </button>`;
  }).join('');
  const pawn=`<div class="camp-map-pawn" style="left:${here.x}%;top:${here.y}%" title="Tu es ici" aria-hidden="true"><i></i></div>`;

  let actions='';
  const stHere=getNodeStatus(camp, here.id);
  if(here.kind==='home'){
    actions=`<button type="button" class="cbt-start" onclick="setCampaignView('citadel')">Citadelle</button>
      <button type="button" class="cbt-start" onclick="setCampaignView('deck')">Créer / éditer mon deck</button>
      <button type="button" class="cbt-start" onclick="setCampaignView('binder')">Ouvrir le classeur</button>
      <button type="button" class="cbt-end" onclick="setCampaignView('fusion')">Fusion</button>`;
  } else if(here.kind==='village'){
    actions=`<button type="button" class="cbt-start" onclick="setCampaignView('deck')">Éditer mon deck</button>
      <button type="button" class="cbt-end" onclick="setCampaignView('binder')">Classeur</button>`;
  } else if(here.kind==='shop'){
    actions=`<button type="button" class="cbt-start" onclick="setCampaignView('shop')">Marchander</button>`;
  } else if(here.kind==='fusion'){
    actions=`<button type="button" class="cbt-start" onclick="setCampaignView('fusion')">Fusionner des cartes</button>`;
  } else if(here.kind==='capital' && stHere==='hostile'){
    actions=`<button type="button" class="cbt-start" onclick="startCampaignBattle('${here.id}',{siege:true})">${hasCitadelBuilding(camp,'atelier_siege')?'Assiéger la capitale':'Siège (Atelier requis)'}</button>`;
  } else if(here.kind==='capital' && (stHere==='conquered'||stHere==='allied')){
    actions=`<button type="button" class="cbt-start" onclick="setCampaignView('deck')">Éditer mon deck ici</button>
      <p class="camp-muted">Capitale conquise — recrutement et services locaux.</p>`;
  } else if(here.kind==='lair'){
    const fam=here.family;
    const wins=familyWinCount(camp, fam);
    actions=`<button type="button" class="cbt-start" onclick="startCampaignBattle('${here.id}')">${cleared.has(here.id)?'Rejouer le repaire':'Engager le combat'}</button>
      <p class="camp-muted">Victoires famille : ${wins}/${CAPTURE_WINS_NEEDED}</p>`;
    if(captureReady(camp, fam)){
      actions+=`<button type="button" class="cbt-start" onclick="startCampaignBattle('${here.id}',{capture:true,encounter:'capture',family:'${fam}'})">Mission Capture</button>`;
    }
  } else if(['route','fortress','sanctuary','ruins'].includes(here.kind)){
    actions=`<button type="button" class="cbt-start" onclick="startCampaignBattle('${here.id}')">${cleared.has(here.id)?'Rejouer':'Engager le combat'}</button>`;
  }

  let pendingBlock='';
  if(camp.pendingTravel){
    const p=camp.pendingTravel;
    const enc=ENCOUNTER_TYPES[p.type]||ENCOUNTER_TYPES.patrol;
    const fam=familyOf(p.family);
    const dest=mapNode(p.to);
    const canSkip=citadelMount(camp)?.id==='destrier' && (camp.mountSkipCharges|0)>0;
    const canFlee=citadelMount(camp)?.id==='ombre' && familyWinCount(camp, p.family)>0;
    pendingBlock=`<div class="camp-encounter-modal" role="dialog" aria-label="Rencontre routière">
      <p class="eyebrow">Rencontre sur la route</p>
      <h3>${enc.label} → ${dest.name}</h3>
      <p class="campaign-prose">${enc.blurb}${fam?` · ${fam.label} (${fam.theme})`:''}</p>
      <div class="campaign-actions" style="justify-content:flex-start;margin-top:10px">
        <button type="button" class="cbt-start" onclick="resolvePendingTravelFight()">Combattre</button>
        ${(canSkip||canFlee)?`<button type="button" class="cbt-end" onclick="resolvePendingTravelSkip()">Éviter (monture)</button>`:''}
        <button type="button" class="cbt-end" onclick="cancelPendingTravel()">Rester ici</button>
      </div>
    </div>`;
  }

  const quickNav=`
    <div class="camp-quick-nav" role="navigation" aria-label="Accès campagne">
      <button type="button" class="cbt-start" onclick="setCampaignView('binder')">▣ Classeur</button>
      <button type="button" class="cbt-start" onclick="setCampaignView('deck')">☰ Deck</button>
      <button type="button" class="cbt-start" onclick="setCampaignView('shop')">♦ Boutique</button>
      <button type="button" class="cbt-end" onclick="setCampaignView('fusion')">✶ Fusion</button>
      <button type="button" class="cbt-end" onclick="setCampaignView('citadel')">🏰 Citadelle</button>
      ${here.kind!=='home'?`<button type="button" class="cbt-end" onclick="travelCampaignMap('tour',{free:true})">↩ Tour</button>`:''}
      ${here.kind!=='shop'?`<button type="button" class="cbt-end" onclick="travelCampaignMap('marche',{free:true})">↩ Comptoir</button>`:''}
    </div>`;
  const factions=(camp.playerFactions||[]).join(' · ') || '—';
  const activeDeck=getActiveDeck();
  const deckLabel=activeDeck
    ? `${activeDeck.name} · ${deckUniqueCount(activeDeck)}/${DECK_MAX_UNIQUES} · ${deckTotalCount(activeDeck)} cartes`
    : 'Aucun deck actif';
  const deckStat=`<div class="camp-stat"><small>Deck</small><b title="${deckLabel}">${activeDeck?deckUniqueCount(activeDeck)+'/'+DECK_MAX_UNIQUES:'—'}</b></div>`;
  const companion=citadelCompanion(camp);
  const mount=citadelMount(camp);

  return `<section class="panel combat-lobby campaign-map-panel">
    <div class="section-head">
      <div>
        <p class="eyebrow">World map</p>
        <h2>Routes du seigneur de guerre</h2>
        <p>Factions : <strong>${factions}</strong> · Deck : <strong>${deckLabel}</strong>
        ${companion?` · Compagnon : <strong>${companion.name}</strong>`:''}
        ${mount?` · Monture : <strong>${mount.name}</strong>`:''}</p>
      </div>
      <div class="camp-stats camp-stats-compact">
        <div class="camp-stat"><small>Or</small><b>${camp.gold||0}</b></div>
        <div class="camp-stat"><small>Classeur</small><b>${binderCount()}</b></div>
        ${deckStat}
        <div class="camp-stat"><small>Victoires</small><b>${camp.battlesWon||0}</b></div>
      </div>
    </div>
    ${quickNav}
    ${camp.shopMsg?`<p class="camp-toast">${camp.shopMsg}</p>`:''}
    ${pendingBlock}
    <div class="camp-map-layout">
      <div class="camp-map" role="img" aria-label="Carte de campagne">
        <div class="camp-map-terrain" aria-hidden="true"></div>
        <svg class="camp-map-roads" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${roads}</svg>
        ${nodes}
        ${pawn}
      </div>
      <aside class="camp-map-dossier">
        <p class="eyebrow">${mapKindLabel(here.kind)} · ${mapStatusLabel(stHere)}</p>
        <h3>${here.name}</h3>
        <p class="campaign-prose">${here.blurb}</p>
        ${here.family?`<p class="camp-map-diff">${familyOf(here.family)?.label||''} — ${familyOf(here.family)?.theme||''}</p>`:''}
        ${here.difficulty?`<p class="camp-map-diff">Difficulté ${mapDifficultyLabel(here)}</p>`:''}
        <div class="campaign-actions" style="justify-content:flex-start;margin-top:12px">${actions}</div>
        <p class="camp-muted" style="margin-top:14px">Une menace max par trajet. ${seeThreats?'Routes dangereuses en surbrillance.':'Construis la Tour de guet (ou prends l’Éclaireur) pour voir les menaces.'}</p>
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
function renderCampaignDeckBuilder(){
  const camp=ensureCampaign();
  let deck=getEditingDeck();
  if(!deck){
    deck=createEmptyDeck('Mon deck');
  }
  const uniques=deckUniqueCount(deck);
  const total=deckTotalCount(deck);
  const deckList=(camp.decks||[]).map(d=>{
    const active=d.id===camp.activeDeckId;
    const editing=d.id===camp.editingDeckId;
    return `<div class="camp-deck-tab${editing?' is-editing':''}${active?' is-active':''}">
      <button type="button" class="camp-deck-tab-main" onclick="openDeckEditor('${d.id}')">${d.name}</button>
      <button type="button" class="camp-deck-tab-use${active?' on':''}" onclick="setActiveDeck('${d.id}')" title="Deck actif">${active?'★':'☆'}</button>
      <button type="button" class="camp-deck-tab-del" onclick="deleteDeck('${d.id}')" title="Supprimer">×</button>
    </div>`;
  }).join('') || '<em class="camp-deck-empty">Aucun deck — crée-en un ou génère automatiquement.</em>';

  const deckCards=(deck.cards||[]).slice().sort((a,b)=>{
    const ca=CREATURES.find(x=>x.id===Number(a.creatureId));
    const cb=CREATURES.find(x=>x.id===Number(b.creatureId));
    return (ca?.name||'').localeCompare(cb?.name||'','fr');
  }).map(entry=>{
    const c=CREATURES.find(x=>x.id===Number(entry.creatureId));
    if(!c) return '';
    const owned=binderOwnedForCreature(c.id);
    const art=creatureArt(c.id);
    return `<article class="camp-deck-slot">
      <img src="${encodeURI(art)}" alt="" width="64" height="64" loading="lazy">
      <div class="camp-deck-slot-meta">
        <b>${c.name}</b>
        <small>${c.capital} · stock ${owned}</small>
      </div>
      <div class="camp-deck-slot-qty">
        <button type="button" onclick="deckAddCreature(${c.id}, -1)">−</button>
        <span>${entry.count}</span>
        <button type="button" onclick="deckAddCreature(${c.id}, 1)" ${entry.count>=DECK_MAX_COPIES||entry.count>=owned?'disabled':''}>+</button>
      </div>
    </article>`;
  }).join('') || '<p class="camp-deck-hint">Ajoute des cartes depuis ton classeur (colonne de droite).</p>';

  // Binder aggregé par créature
  const byId=new Map();
  for(const row of camp.binder||[]){
    if((row.count|0)<=0) continue;
    const id=Number(row.creatureId);
    const cur=byId.get(id) || {creatureId:id, count:0};
    cur.count+=row.count|0;
    byId.set(id, cur);
  }
  const factions=camp.playerFactions||[];
  const binderPool=[...byId.values()]
    .map(e=>{
      const c=CREATURES.find(x=>x.id===e.creatureId);
      return c ? {c, owned:e.count, inDeck:deckEntry(deck, e.creatureId)?.count||0} : null;
    })
    .filter(Boolean)
    .filter(({c})=>!factions.length || factions.includes(c.capital))
    .sort((a,b)=>(a.c.cost|0)-(b.c.cost|0) || (a.c.name||'').localeCompare(b.c.name||'','fr'));

  const binderHtml=binderPool.map(({c, owned, inDeck})=>{
    const full=uniques>=DECK_MAX_UNIQUES && inDeck===0;
    const maxed=inDeck>=DECK_MAX_COPIES || inDeck>=owned;
    const picked=inDeck>0;
    return `<button type="button" class="camp-deck-pick${picked?' picked':''}${full||maxed?' is-max':''}"
      onclick="deckAddCreature(${c.id}, 1)" ${full||maxed?'disabled':''}
      title="${full?'Deck plein (15 créatures)':maxed?'Maximum d’exemplaires':'Ajouter au deck'}">
      <img src="${encodeURI(creatureArt(c.id))}" alt="" width="72" height="72" loading="lazy">
      <span class="camp-deck-pick-name">${c.name}</span>
      <span class="camp-deck-pick-meta">${c.capital} · coût ${c.cost} · ×${owned}${inDeck?` · deck ${inDeck}`:''}</span>
    </button>`;
  }).join('') || '<em>Aucune carte de tes factions dans le classeur.</em>';

  const factionsLabel=(factions||[]).join(' · ') || '—';
  const ready=uniques>0;

  return `<section class="panel campaign-panel camp-deck-panel">
    <div class="section-head">
      <div>
        <p class="eyebrow">Construction</p>
        <h2>Créer ton deck</h2>
        <p>Factions : <strong>${factionsLabel}</strong> · jusqu’à <strong>${DECK_MAX_UNIQUES} créatures</strong> × <strong>${DECK_MAX_COPIES}</strong> (stock classeur).</p>
      </div>
      <div class="camp-stats camp-stats-compact">
        <div class="camp-stat"><small>Uniques</small><b>${uniques}/${DECK_MAX_UNIQUES}</b></div>
        <div class="camp-stat"><small>Cartes</small><b>${total}/${DECK_MAX_UNIQUES*DECK_MAX_COPIES}</b></div>
      </div>
    </div>
    ${camp.shopMsg?`<p class="camp-toast">${camp.shopMsg}</p>`:''}
    <div class="camp-deck-toolbar">
      <div class="camp-deck-tabs">${deckList}</div>
      <div class="camp-deck-actions">
        <button type="button" class="cbt-end" onclick="newDeckAndEdit()">+ Nouveau deck</button>
        <button type="button" class="cbt-start" onclick="autoBuildAndOpenDeck()">Créer automatiquement</button>
        <button type="button" class="cbt-end" onclick="autoFillEditingDeck()">Remplir ce deck (auto)</button>
        <button type="button" class="cbt-start" onclick="confirmDeckAndGoMap()" ${ready?'':'disabled'}>Valider → Carte</button>
        <button type="button" class="cbt-end" onclick="setCampaignView('map')">↩ Carte</button>
      </div>
    </div>
    <div class="camp-deck-rename">
      <label>Nom du deck
        <input type="text" maxlength="40" value="${(deck.name||'').replace(/"/g,'&quot;')}"
          onchange="renameEditingDeck(this.value)" onkeydown="if(event.key==='Enter'){event.preventDefault();renameEditingDeck(this.value)}">
      </label>
      <button type="button" class="cbt-start" onclick="setActiveDeck('${deck.id}')">Utiliser ce deck</button>
    </div>
    <div class="camp-deck-grid">
      <div class="camp-deck-col">
        <h3>Ton deck</h3>
        <div class="camp-deck-slots">${deckCards}</div>
      </div>
      <div class="camp-deck-col">
        <h3>Classeur (${factionsLabel})</h3>
        <div class="camp-deck-picks">${binderHtml}</div>
      </div>
    </div>
  </section>`;
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
function buyCitadelBuilding(buildingId){
  const camp=ensureCampaign();
  const b=CITADEL_BUILDINGS.find(x=>x.id===buildingId);
  if(!b) return;
  if(hasCitadelBuilding(camp, buildingId)){
    camp.shopMsg=`${b.name} est déjà construit.`;
  } else if((camp.gold||0)<b.cost){
    camp.shopMsg=`Il faut ${b.cost} or pour ${b.name}.`;
  } else {
    camp.gold-=b.cost;
    camp.citadel.buildings.push(buildingId);
    camp.shopMsg=`Construit : ${b.name}.`;
  }
  saveCampaign();
  render();
}
function setCitadelCompanion(id){
  const camp=ensureCampaign();
  if(!camp.citadel) camp.citadel={buildings:[], companion:null, mount:null};
  camp.citadel.companion=CAMPAIGN_COMPANIONS.some(c=>c.id===id) ? id : null;
  camp.shopMsg=camp.citadel.companion
    ? `Compagnon : ${citadelCompanion(camp).name}.`
    : 'Compagnon retiré.';
  saveCampaign();
  render();
}
function setCitadelMount(id){
  const camp=ensureCampaign();
  if(!camp.citadel) camp.citadel={buildings:[], companion:null, mount:null};
  const prev=camp.citadel.mount;
  camp.citadel.mount=CAMPAIGN_MOUNTS.some(c=>c.id===id) ? id : null;
  if(camp.citadel.mount==='destrier' && prev!=='destrier'){
    camp.mountSkipCharges=1;
  }
  camp.shopMsg=camp.citadel.mount
    ? `Monture : ${citadelMount(camp).name}.`
    : 'Monture retirée.';
  saveCampaign();
  render();
}
function renderCampaignCitadel(){
  const camp=ensureCampaign();
  camp.mapLocation='tour';
  const buildings=CITADEL_BUILDINGS.map(b=>{
    const owned=hasCitadelBuilding(camp, b.id);
    return `<article class="camp-citadel-card${owned?' is-owned':''}">
      <h4>${b.name}</h4>
      <p>${b.blurb}</p>
      ${owned
        ? `<span class="camp-muted">Construit</span>`
        : `<button type="button" class="cbt-start" onclick="buyCitadelBuilding('${b.id}')">Construire (${b.cost} or)</button>`}
    </article>`;
  }).join('');
  const companions=CAMPAIGN_COMPANIONS.map(c=>{
    const on=camp.citadel?.companion===c.id;
    return `<article class="camp-citadel-card${on?' is-owned':''}">
      <h4>${c.name}</h4>
      <p>${c.blurb}</p>
      <button type="button" class="cbt-end" onclick="setCitadelCompanion('${on?'':c.id}')">${on?'Retirer':'Choisir'}</button>
    </article>`;
  }).join('');
  const mounts=CAMPAIGN_MOUNTS.map(m=>{
    const on=camp.citadel?.mount===m.id;
    return `<article class="camp-citadel-card${on?' is-owned':''}">
      <h4>${m.name}</h4>
      <p>${m.blurb}${m.id==='destrier'&&on?` · Charges : ${camp.mountSkipCharges|0}`:''}</p>
      <button type="button" class="cbt-end" onclick="setCitadelMount('${on?'':m.id}')">${on?'Retirer':'Choisir'}</button>
    </article>`;
  }).join('');
  let bestiary='';
  if(hasCitadelBuilding(camp, 'bestiaire')){
    const ids=camp.encounteredIds||[];
    const list=ids.slice(0,24).map(id=>{
      const c=CREATURES.find(x=>x.id===id);
      return c?`<li>${c.name} <small>(${c.capital})</small></li>`:'';
    }).join('') || '<li class="camp-muted">Aucune rencontre enregistrée.</li>';
    bestiary=`<div class="camp-subhead">Bestiaire</div><ul class="camp-bestiary">${list}</ul>`;
  }
  const body=`
    <p class="campaign-prose">La citadelle débloque la progression RPG : captures, sièges, vision des routes. Un seul compagnon et une seule monture actifs.</p>
    <div class="camp-subhead">Bâtiments</div>
    <div class="camp-citadel-grid">${buildings}</div>
    <div class="camp-subhead">Hall des héros — compagnon</div>
    <div class="camp-citadel-grid">${companions}</div>
    <div class="camp-subhead">Écurie — monture</div>
    <div class="camp-citadel-grid">${mounts}</div>
    ${bestiary}
  `;
  return renderCampaignShell('Citadelle', 'Tour oubliée', body);
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
      <p class="campaign-prose">Tu gagnes <strong>${r.gold} or</strong>${(r.cards||[]).length?` et ${(r.cards||[]).length} carte(s)`:''}. Tout rejoint ton coffre et ton classeur.
        ${r.conquered?` <strong>Capitale conquise : ${r.conquered}.</strong>`:''}
        ${r.captureName?` <strong>Créature capturée : ${r.captureName}.</strong>`:''}
      </p>
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
  if(camp.phase==='deck') return renderCampaignDeckBuilder();
  if(camp.phase==='fusion') return renderCampaignFusion();
  if(camp.phase==='shop') return renderCampaignShop();
  if(camp.phase==='citadel') return renderCampaignCitadel();
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
window.resolvePendingTravelFight=resolvePendingTravelFight;
window.resolvePendingTravelSkip=resolvePendingTravelSkip;
window.cancelPendingTravel=cancelPendingTravel;
window.buyCitadelBuilding=buyCitadelBuilding;
window.setCitadelCompanion=setCitadelCompanion;
window.setCitadelMount=setCitadelMount;
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
window.openDeckEditor=openDeckEditor;
window.setActiveDeck=setActiveDeck;
window.deleteDeck=deleteDeck;
window.renameEditingDeck=renameEditingDeck;
window.deckAddCreature=deckAddCreature;
window.deckSetCreatureCount=deckSetCreatureCount;
window.createEmptyDeck=createEmptyDeck;
window.confirmDeckAndGoMap=confirmDeckAndGoMap;
window.autoBuildAndOpenDeck=autoBuildAndOpenDeck;
window.autoFillEditingDeck=autoFillEditingDeck;
window.newDeckAndEdit=newDeckAndEdit;
window.DECK_MAX_UNIQUES=DECK_MAX_UNIQUES;
window.DECK_MAX_COPIES=DECK_MAX_COPIES;
