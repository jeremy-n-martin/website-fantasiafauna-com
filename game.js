/* CREATURES est defini dans creatures-data.js (charge avant ce fichier). */
if (typeof CREATURES === 'undefined') {
  throw new Error('CREATURES manquant : charge creatures-data.js avant game.js');
}

const CAPITAL_COLORS = {"Citadelle":"#ffd24a","Empyrée":"#7dd3fc","Abîme":"#c084fc","Cénote":"#22d3ee","Sylve":"#4ade80","Bosquet":"#22c55e","Nécropole":"#a855f7","Pandémonium":"#ef4444","Forteresse":"#94a3b8","Hameau":"#fbbf24","Manufacture":"#cbd5e1","Bastion":"#d97706","Tertre":"#ca8a04","Terrier":"#a16207","Volcan":"#f97316","Lagune":"#0ea5e9","Désert":"#eab308","Tour":"#38bdf8"};
const FACTION_MANA = {"Citadelle":{"color":"#ffd24a","ink":"#2a1f08","mark":"☀","icon":"ui/combat/mana/light.png","element":"Lumière"},"Empyrée":{"color":"#7dd3fc","ink":"#0a1a2e","mark":"❄","icon":"ui/combat/mana/ice.png","element":"Glace"},"Abîme":{"color":"#c084fc","ink":"#1a0812","mark":"☾","icon":"ui/combat/mana/dark.png","element":"Ombre"},"Cénote":{"color":"#22d3ee","ink":"#062022","mark":"💧","icon":"ui/combat/mana/water.png","element":"Eau"},"Sylve":{"color":"#4ade80","ink":"#0d1a0c","mark":"🌿","icon":"ui/combat/mana/nature.png","element":"Nature"},"Bosquet":{"color":"#22c55e","ink":"#0d1a0c","mark":"🌿","icon":"ui/combat/mana/nature.png","element":"Nature"},"Nécropole":{"color":"#a855f7","ink":"#140a22","mark":"☾","icon":"ui/combat/mana/dark.png","element":"Ombre"},"Pandémonium":{"color":"#ef4444","ink":"#1a080e","mark":"🔥","icon":"ui/combat/mana/fire.png","element":"Feu"},"Forteresse":{"color":"#94a3b8","ink":"#1a1714","mark":"⚙","icon":"ui/combat/mana/metal.png","element":"Métal"},"Hameau":{"color":"#fbbf24","ink":"#2a1a08","mark":"☀","icon":"ui/combat/mana/light.png","element":"Lumière"},"Manufacture":{"color":"#cbd5e1","ink":"#12141a","mark":"⚙","icon":"ui/combat/mana/metal.png","element":"Métal"},"Bastion":{"color":"#d97706","ink":"#1a0e08","mark":"⛰","icon":"ui/combat/mana/earth.png","element":"Terre"},"Tertre":{"color":"#ca8a04","ink":"#1a140a","mark":"⛰","icon":"ui/combat/mana/earth.png","element":"Terre"},"Terrier":{"color":"#a16207","ink":"#1a140a","mark":"⛰","icon":"ui/combat/mana/earth.png","element":"Terre"},"Volcan":{"color":"#f97316","ink":"#1a0a08","mark":"🔥","icon":"ui/combat/mana/fire.png","element":"Feu"},"Lagune":{"color":"#0ea5e9","ink":"#061820","mark":"💧","icon":"ui/combat/mana/water.png","element":"Eau"},"Désert":{"color":"#eab308","ink":"#2a1c08","mark":"◇","icon":"ui/combat/mana/sand.png","element":"Sable"},"Tour":{"color":"#38bdf8","ink":"#0a1520","mark":"⚡","icon":"ui/combat/mana/storm.png","element":"Foudre"}};

const state = {
  tab: 'list', search: '', activeCapital: 'Toutes',
  artIndex: {}, artBust: {}, frameStyle: {}, bulkFrame: 'normal',
  cardStyle: {}, bulkStyle: 'archive', zoomedId: null, borderMode: 'normal',
  battle: null, combatView: 'lobby', campaign: null,
  binderRarity: 'Toutes',
  sortOrder: 'cost-desc',
  costFilter: 'Toutes',
};
const CARD_FRAMES = [
  { id: 'normal', label: 'Normal' },
  { id: 'bronze', label: 'Bronze' },
  { id: 'silver', label: 'Argent' },
  { id: 'gold', label: 'Or' },
  { id: 'rosegold', label: 'Or rose' },
  { id: 'platinum', label: 'Platine' },
  { id: 'obsidian', label: 'Obsidienne' },
];
const CARD_STYLES = [
  { id: 'archive', label: 'Archive' },
  { id: 'manuscrit', label: 'Manuscrit' },
  { id: 'runique', label: 'Runique' },
  { id: 'folie', label: 'Folie' },
  { id: 'atlas', label: 'Atlas' },
  { id: 'relique', label: 'Relique' },
];
const SORT_ORDERS = [
  { id: 'cost-desc', label: '↓ Coût', title: 'Coût d’invocation décroissant' },
  { id: 'cost-asc', label: '↑ Coût', title: 'Coût d’invocation croissant' },
  { id: 'atk-desc', label: '↓ ATQ', title: 'Attaque décroissante' },
  { id: 'atk-asc', label: '↑ ATQ', title: 'Attaque croissante' },
  { id: 'hp-desc', label: '↓ PV', title: 'Points de vie décroissants' },
  { id: 'hp-asc', label: '↑ PV', title: 'Points de vie croissants' },
  { id: 'name', label: 'A→Z', title: 'Nom alphabétique' },
];
const COST_FILTERS = ['Toutes', 1, 2, 3, 4, 5, 6, 7, 8];
const byId = id => document.getElementById(id);
/* Capacités de créature (keywords) — extensible */
const ABILITIES = {
  tank: {
    id: 'tank',
    label: 'Tank',
    description: 'Quand un Tank est en jeu, les créatures adverses sont obligées de l\'attaquer en priorité.',
  },
  ranged: {
    id: 'ranged',
    label: 'Ranged',
    description: 'Attaque à distance : ignore les Tanks et n’encaisse jamais de riposte (Assassin + Sans riposte).',
  },
  vol: {
    id: 'vol',
    label: 'Vol',
    description: 'Créature volante : ignore le premier bloqueur adverse.',
  },
  lancer: {
    id: 'lancer',
    label: 'Rafale',
    description: 'À l’arrivée en jeu, puis tous les 2 tours : inflige 1 dégât à une cible adverse aléatoire.',
  },
  'lancer-mod': {
    id: 'lancer-mod',
    label: 'Rafale+',
    description: 'À l’arrivée en jeu, puis chaque tour : inflige 1 dégât à une cible adverse aléatoire.',
  },
  'lancer-max': {
    id: 'lancer-max',
    label: 'Rafale majeure',
    description: 'À l’arrivée en jeu, puis chaque tour : inflige 2 dégâts à 2 cibles adverses aléatoires.',
  },
  'sort-degat': {
    id: 'sort-degat',
    label: 'Sort de dégât',
    description: 'À l’arrivée en jeu, puis tous les 2 tours : inflige 1 dégât à une cible adverse aléatoire.',
  },
  'sort-degat-mod': {
    id: 'sort-degat-mod',
    label: 'Sort de dégât+',
    description: 'À l’arrivée en jeu, puis chaque tour : inflige 1 dégât à une cible adverse aléatoire.',
  },
  'sort-degat-max': {
    id: 'sort-degat-max',
    label: 'Tempête de sorts',
    description: 'À l’arrivée en jeu, puis chaque tour : inflige 2 dégâts à 2 cibles adverses aléatoires.',
  },
  soin: {
    id: 'soin',
    label: 'Soin',
    description: 'À l’arrivée en jeu, puis tous les 2 tours : soigne 1 PV d’un allié blessé aléatoire (ou elle-même).',
  },
  'soin-mod': {
    id: 'soin-mod',
    label: 'Soin+',
    description: 'À l’arrivée en jeu, puis chaque tour : soigne 1 PV d’un allié blessé aléatoire (ou elle-même).',
  },
  'soin-max': {
    id: 'soin-max',
    label: 'Soin majeur',
    description: 'À l’arrivée en jeu, puis chaque tour : soigne 2 PV sur 2 alliés blessés aléatoires.',
  },
  invocation: {
    id: 'invocation',
    label: 'Invocation',
    description: 'À l’arrivée en jeu, puis tous les 3 tours : invoque une créature à sa droite (ou à gauche si besoin), si un emplacement est libre.',
  },
  'invocation-rapide': {
    id: 'invocation-rapide',
    label: 'Invocation rapide',
    description: 'À l’arrivée en jeu, puis tous les 2 tours : invoque une créature à sa droite (ou à gauche si besoin), si un emplacement est libre.',
  },
  'invocation-intime': {
    id: 'invocation-intime',
    label: 'Invocation incessante',
    description: 'À l’arrivée en jeu, puis chaque tour : invoque une créature à sa droite (ou à gauche si besoin), si un emplacement est libre.',
  },
  etendard: {
    id: 'etendard',
    label: 'Étendard',
    description: 'Tant que cette créature est en jeu, toutes les créatures alliées de sa faction ont +1/+1.',
  },
  formation: {
    id: 'formation',
    label: 'Formation',
    description: 'Tant que cette créature est en jeu, les deux créatures alliées adjacentes ont +1/+1.',
  },
  'activer-regen': {
    id: 'activer-regen',
    label: 'Activer : Régénération',
    description: 'Au lieu d’attaquer, active-la : elle ne peut plus attaquer ce tour, et récupère tous ses PV au début de ton prochain tour.',
  },
  'activer-tank': {
    id: 'activer-tank',
    label: 'Activer : Rempart',
    description: 'Au lieu d’attaquer, active-la : elle ne peut plus attaquer ce tour, et gagne Tank pendant tout ton prochain tour (expire à la fin de ce tour).',
  },
  'activer-bouclier': {
    id: 'activer-bouclier',
    label: 'Activer : Bouclier divin',
    description: 'Au lieu d’attaquer, active-la : elle gagne Bouclier divin (ignore la prochaine source de dégâts).',
  },
  'bouclier-divin': {
    id: 'bouclier-divin',
    label: 'Bouclier divin',
    description: 'Ignore entièrement la première source de dégâts reçue, puis le bouclier disparaît.',
  },
  'double-attaque': {
    id: 'double-attaque',
    label: 'Double attaque',
    description: 'Lors de la phase d’attaque : frappe deux fois la même cible (la cible peut riposter à chaque frappe).',
  },
  pietinement: {
    id: 'pietinement',
    label: 'Piétinement',
    description: 'Les dégâts qui dépassent les PV du bloqueur sont infligés à la tour adverse.',
  },
  'contact-mortel': {
    id: 'contact-mortel',
    label: 'Contact mortel',
    description: 'Un seul point de dégâts infligé suffit à détruire une créature.',
  },
  celerite: {
    id: 'celerite',
    label: 'Célérité',
    description: 'Peut attaquer et utiliser ses capacités avec engagement dès son arrivée (ignore le mal d’invocation).',
  },
  'lien-de-vie': {
    id: 'lien-de-vie',
    label: 'Lien de vie',
    description: 'Les dégâts qu’elle inflige font gagner autant de PV à ta tour.',
  },
  poison: {
    id: 'poison',
    label: 'Poison',
    description: 'Quand cette créature inflige des dégâts à un mignon, il est Empoisonné : 1 dégât au début de chacun de ses tours.',
  },
  brulant: {
    id: 'brulant',
    label: 'Brûlant',
    description: 'Quand cette créature inflige des dégâts à un mignon, il prend Feu : 1 dégât à la fin de chacun de ses tours.',
  },
  gelant: {
    id: 'gelant',
    label: 'Gélant',
    description: 'Quand cette créature inflige des dégâts à un mignon, il est Gelé : il ne peut pas attaquer au prochain tour.',
  },
  'fin-tour-tir': {
    id: 'fin-tour-tir',
    label: 'Fin de tour',
    description: 'À la fin de ton tour : inflige 1 dégât à une cible adverse aléatoire.',
  },
  'debut-tour-soin': {
    id: 'debut-tour-soin',
    label: 'Début de tour',
    description: 'Au début de ton tour : cette créature récupère 1 PV.',
  },
  'quand-blesse': {
    id: 'quand-blesse',
    label: 'Représailles',
    description: 'Chaque fois que cette créature subit des dégâts : inflige 1 dégât à une cible adverse aléatoire.',
  },
  'quand-invoque': {
    id: 'quand-invoque',
    label: 'Appel du sang',
    description: 'Chaque fois que tu invoques une créature : celle-ci gagne +1/+1.',
  },
  'apres-attaque': {
    id: 'apres-attaque',
    label: 'Enchaînement',
    description: 'Après que cette créature a attaqué : inflige 1 dégât à une cible adverse aléatoire.',
  },
  'jetons-1-1': {
    id: 'jetons-1-1',
    label: 'Portée de rejetons',
    description: 'À l’arrivée en jeu : invoque deux créatures 1/1 à ses côtés si la place le permet.',
  },
  'donner-buff': {
    id: 'donner-buff',
    label: 'Bénédiction',
    description: 'À l’arrivée en jeu : donne +2/+2 à une créature alliée aléatoire (ou à elle-même).',
  },
  soutient: {
    id: 'soutient',
    label: 'Soutien',
    description: 'À l’arrivée en jeu : donne +1 PV max à une créature alliée aléatoire (ou à elle-même).',
  },
  'soutient-2': {
    id: 'soutient-2',
    label: 'Soutien 2',
    description: 'À l’arrivée en jeu : donne +1 PV max à 2 créatures alliées aléatoires différentes (ou à elle-même s’il n’y a pas d’autre alliée).',
  },
  charge: {
    id: 'charge',
    label: 'Charge',
    description: 'Peut attaquer dès son tour d’arrivée (ignore le mal d’invocation).',
  },
  camouflage: {
    id: 'camouflage',
    label: 'Camouflage',
    description: 'Ne peut pas être ciblée par une attaque adverse tant qu’elle n’a pas attaqué ou activé un effet.',
  },
  'vol-de-vie': {
    id: 'vol-de-vie',
    label: 'Vol de vie',
    description: 'Les dégâts qu’elle inflige en combat la soignent d’autant.',
  },
  'dernier-souffle': {
    id: 'dernier-souffle',
    label: 'Dernier souffle',
    description: 'Quand elle meurt : inflige 2 dégâts à une cible adverse aléatoire.',
  },
  'cri-frappe': {
    id: 'cri-frappe',
    label: 'Cri de guerre : Frappe',
    description: 'À l’arrivée en jeu : inflige 1 dégât à toutes les créatures adverses.',
  },
  furie: {
    id: 'furie',
    label: 'Furie',
    description: 'Chaque fois que cette créature subit des dégâts : elle gagne +1 ATQ.',
  },
  'allie-meurt': {
    id: 'allie-meurt',
    label: 'Deuil',
    description: 'Chaque fois qu’une créature alliée meurt : celle-ci gagne +1/+1.',
  },
  'quand-tue': {
    id: 'quand-tue',
    label: 'Exécution',
    description: 'Quand elle tue une créature adverse en combat : gagne +1/+1.',
  },
  affaiblir: {
    id: 'affaiblir',
    label: 'Affaiblir',
    description: 'Quand elle inflige des dégâts à un mignon : la cible perd 1 ATQ (permanent).',
  },
  survie: {
    id: 'survie',
    label: 'Survie',
    description: 'La première fois qu’elle devrait mourir, elle survit avec 1 PV à la place.',
  },
  'fin-tour-buff': {
    id: 'fin-tour-buff',
    label: 'Montée en puissance',
    description: 'À la fin de ton tour : cette créature gagne +1 ATQ.',
  },
  'debut-tour-tir': {
    id: 'debut-tour-tir',
    label: 'Aube sanglante',
    description: 'Au début de ton tour : inflige 1 dégât à une cible adverse aléatoire.',
  },
  'activer-frappe': {
    id: 'activer-frappe',
    label: 'Activer : Frappe',
    description: 'Au lieu d’attaquer, active-la : inflige 2 dégâts à une cible adverse aléatoire.',
  },
  'activer-soin': {
    id: 'activer-soin',
    label: 'Activer : Soins',
    description: 'Au lieu d’attaquer, active-la : soigne 1 PV à toutes les créatures alliées.',
  },
  'activer-purge': {
    id: 'activer-purge',
    label: 'Activer : Purification',
    description: 'Au lieu d’attaquer, active-la : retire poison, feu et gel, puis soigne 2 PV.',
  },
};
function abilityDef(id){ return ABILITIES[id] || null; }
/** Rôles de forme : exactement 1 parmi normal | fast | ranged | caster | tank. */
const CREATURE_ROLES = ['normal', 'fast', 'ranged', 'caster', 'tank'];
/** Capacités de jeu (abilities) + rétrocompat si un id est encore dans roles. */
function creatureAbilityList(c){
  if(!c) return [];
  const fromAb=Array.isArray(c.abilities) ? c.abilities : [];
  const roles=c.roles||[];
  let list = fromAb.length ? fromAb.slice() : (c.roles||[]).filter(id => ABILITIES[id] && !CREATURE_ROLES.includes(id));
  // Tank / Ranged sont stockés comme rôle unique mais restent affichés comme badges
  for(const id of ['tank','ranged']){
    if(roles.includes(id) && !list.includes(id)) list.unshift(id);
  }
  // Ancien tag « volant » → capacité vol
  if((roles.includes('volant') || list.includes('volant')) && !list.includes('vol')){
    list=list.filter(id=>id!=='volant');
    list.push('vol');
  }
  return list;
}
function hasAbility(c, id){
  if(!c) return false;
  const abs=creatureAbilityList(c);
  const roles=c.roles||[];
  if(id==='assassin' || id==='sans-riposte'){
    return abs.includes(id) || abs.includes('ranged')
      || roles.includes(id) || roles.includes('ranged');
  }
  if(id==='vol' || id==='volant'){
    return abs.includes('vol') || abs.includes('volant') || roles.includes('volant');
  }
  return abs.includes(id) || roles.includes(id);
}
function creatureAbilityIds(c){
  const hide=new Set(['fin-tour-tir','fin-tour-buff','debut-tour-soin','debut-tour-tir']);
  const ids=creatureAbilityList(c).filter(id => ABILITIES[id] && !hide.has(id));
  // Activer en premier, puis le reste dans l’ordre du catalogue
  const isAct=id=>id.startsWith('activer-');
  const order=Object.keys(ABILITIES);
  return ids.slice().sort((a,b)=>{
    const aa=isAct(a)?0:1, bb=isAct(b)?0:1;
    if(aa!==bb) return aa-bb;
    return order.indexOf(a)-order.indexOf(b);
  });
}
function abilitiesHtml(c, opts={}){
  const ids=creatureAbilityIds(c);
  if(!ids.length) return '';
  const extra=opts.className ? ' '+opts.className : '';
  const expanded=!!opts.expanded;
  return '<div class="ability-row'+(expanded?' is-expanded':'')+extra+'">'+ids.map(id=>{
    const a=ABILITIES[id];
    const act=id.startsWith('activer-') ? ' is-activate' : '';
    if(expanded){
      return '<div class="ability-detail ability-'+id+act+'" data-ability="'+id+'"><em>'+a.label+'</em><p>'+a.description+'</p></div>';
    }
    return '<span class="ability-tag ability-'+id+act+'" tabindex="0" data-ability="'+id+'" aria-label="'+a.label+': '+a.description+'" onclick="event.stopPropagation()" onpointerdown="event.stopPropagation()"><em>'+a.label+'</em><span class="ability-tip" role="tooltip"><b>'+a.label+'</b>'+a.description+'</span></span>';
  }).join('')+'</div>';
}

function displayHp(c){ return c.health; }
function quoteFor(c){ return c.quote || ''; }

function defaultFrameFor(_c){
  return 'normal';
}
function frameFor(c){
  const id = state.frameStyle[c.id] || state.bulkFrame || defaultFrameFor(c);
  return CARD_FRAMES.find(f=>f.id===id) || CARD_FRAMES[0];
}
function resetFramesToNormal(){
  state.frameStyle = {};
  state.bulkFrame = 'normal';
}
function styleFor(c){
  let id = state.cardStyle[c.id] || state.bulkStyle || 'archive';
  if (id === 'arcanum') id = 'relique';
  return CARD_STYLES.find(s=>s.id===id) || CARD_STYLES[0];
}
function cycleCardStyle(id, ev){
  if(ev){ ev.preventDefault(); ev.stopPropagation(); }
  const c=CREATURES.find(x=>x.id===Number(id));
  if(!c) return;
  const cur=styleFor(c);
  const i=CARD_STYLES.findIndex(s=>s.id===cur.id);
  state.cardStyle[c.id]=CARD_STYLES[(i+1)%CARD_STYLES.length].id;
  state.bulkStyle=null;
  render();
}
function paintAllStyles(styleId, ev){
  if(ev){ ev.preventDefault(); ev.stopPropagation(); }
  if(!CARD_STYLES.some(s=>s.id===styleId)) return;
  const targets=filteredCreatures();
  targets.forEach(c=>{ state.cardStyle[c.id]=styleId; });
  state.bulkStyle=styleId;
  render();
}
function updateCardShine(){
  const view = window.innerHeight || 1;
  const scrollY = window.scrollY || 0;
  const vel = Math.min(1, Math.abs(scrollY - (_lastScrollY || scrollY)) / 28);
  _lastScrollY = scrollY;
  document.querySelectorAll('.ff-card').forEach(card=>{
    const r = card.getBoundingClientRect();
    if (r.bottom < -80 || r.top > view + 80) return;
    const mid = (r.top + r.bottom) / 2;
    const t = Math.max(0, Math.min(1, mid / view));
    const angle = -55 + t * 130;
    const x = 5 + t * 90;
    const y = 5 + (1 - t) * 90;
    const str = Math.max(0.35, 1 - Math.abs(t - 0.4) * 1.2) + vel * 0.45;
    const beam = t * 100;
    card.style.setProperty('--shine-angle', angle.toFixed(1) + 'deg');
    card.style.setProperty('--shine-x', x.toFixed(1) + '%');
    card.style.setProperty('--shine-y', y.toFixed(1) + '%');
    card.style.setProperty('--shine-str', Math.min(1.35, str).toFixed(3));
    card.style.setProperty('--rim-pos', beam.toFixed(1) + '%');
    card.style.setProperty('--rim-beam', beam.toFixed(1));
    card.style.setProperty('--rim-vel', vel.toFixed(3));
  });
}
let _lastScrollY = 0;
let _shineTick = 0;
function scheduleCardShine(){
  if (_shineTick) return;
  _shineTick = requestAnimationFrame(()=>{ _shineTick = 0; updateCardShine(); });
}
function cycleCardFrame(id, ev){
  if(ev){ ev.preventDefault(); ev.stopPropagation(); }
  const c=CREATURES.find(x=>x.id===Number(id));
  if(!c) return;
  const cur=frameFor(c);
  const i=CARD_FRAMES.findIndex(f=>f.id===cur.id);
  state.frameStyle[c.id]=CARD_FRAMES[(i+1)%CARD_FRAMES.length].id;
  state.bulkFrame=null;
  render();
}
function paintAllFrames(frameId, ev){
  if(ev){ ev.preventDefault(); ev.stopPropagation(); }
  if(!CARD_FRAMES.some(f=>f.id===frameId)) return;
  const targets=filteredCreatures();
  targets.forEach(c=>{ state.frameStyle[c.id]=frameId; });
  state.bulkFrame=frameId;
  render();
}
function sizeLabel(c){ return c.size ? `${c.size} m` : ''; }
function factionMana(c){
  return FACTION_MANA[c.capital] || { color: CAPITAL_COLORS[c.capital] || '#c9aa69', ink: '#1a1208', mark: '●', icon: 'ui/combat/star_sm.png' };
}
/** Coût d’invocation : 1–3 mana spécialisé de la couleur, le reste incolore. */
function normalizeManaCost(card){
  let colored=Math.max(0, card?.costColored|0);
  let neutral=card?.costNeutral != null
    ? Math.max(0, card.costNeutral|0)
    : Math.max(0, (card?.cost|0) - colored);
  if(colored < 1){
    if(neutral >= 1){ colored=1; neutral-=1; }
    else colored=1;
  } else if(colored > 3){
    neutral += colored - 3;
    colored=3;
  }
  return {colored, neutral, total: colored + neutral};
}
function manaCostHtml(c){
  const fm = factionMana(c);
  const {colored:k, neutral:n} = normalizeManaCost(c);
  const parts = [];
  const maxPips = 4;
  if (n > 0) parts.push(`<span class="mana-pip mana-neutral" title="Mana incolore"><span>${n}</span></span>`);
  const room = maxPips - parts.length;
  const elName = fm.element || c.capital;
  const icon = fm.icon ? `<img class="mana-pip-icon" src="${fm.icon}" alt="${elName}" draggable="false">` : `<em>${fm.mark||'●'}</em>`;
  if (k <= 0) {
    /* nothing */
  } else if (k > room) {
    parts.push(`<span class="mana-pip mana-color mana-stacked mana-gem" style="--mana:${fm.color};--mana-ink:${fm.ink}" title="${c.capital} · ${elName} ×${k}"><span>${k}</span>${icon}</span>`);
  } else {
    for (let i = 0; i < k; i++) {
      parts.push(`<span class="mana-pip mana-color mana-gem" style="--mana:${fm.color};--mana-ink:${fm.ink}" title="${c.capital} · ${elName}">${icon}</span>`);
    }
  }
  if (!parts.length) parts.push(`<span class="mana-pip mana-neutral" title="Mana incolore"><span>0</span></span>`);
  return `<div class="mana-cost" style="--pip-count:${parts.length}"><div class="mana-cost-inner">${parts.join('')}</div></div>`;
}
function nameClassFor(name=''){
  const len = String(name).length;
  if (len > 22) return 'name-xl name-wrap';
  if (len > 16) return 'name-xl';
  if (len > 12) return 'name-long';
  if (len > 9) return 'name-mid';
  return '';
}
function parseCreatureImage(image=''){
  const m=String(image).match(/^img\/(.+) (\d+)\.png$/);
  return m ? {base:m[1], num:+m[2]} : null;
}
function imageVariantsFor(c){
  const parsed=parseCreatureImage(c.image);
  if(!parsed) return c.image ? [c.image] : [];
  const nums=(typeof IMG_VARIANTS!=='undefined' && IMG_VARIANTS[parsed.base]) || null;
  if(nums && nums.length) return nums.map(n=>`img/${parsed.base} ${n}.png`);
  return [c.image];
}
function currentArtIndex(c){
  const variants=imageVariantsFor(c);
  if(!variants.length) return 0;
  return ((state.artIndex[c.id]||0) % variants.length + variants.length) % variants.length;
}
function currentImageFor(c, opts={}){
  const variants=imageVariantsFor(c);
  const src=variants[currentArtIndex(c)] || c.image || '';
  if(!src) return '';
  if(opts.raw) return src;
  const parsed=parseCreatureImage(src);
  const bust=parsed ? state.artBust[parsed.base] : state.artBust[c.id];
  return bust ? `${src}?v=${bust}` : src;
}
function cycleCardArt(id, ev){
  if(ev){ ev.preventDefault(); ev.stopPropagation(); }
  const c=CREATURES.find(x=>x.id===Number(id));
  if(!c) return;
  const variants=imageVariantsFor(c);
  if(variants.length<2) return;
  state.artIndex[c.id]=(currentArtIndex(c)+1)%variants.length;
  render();
}
function artRankButtonsHtml(c){
  if(!c) return '';
  const variants=imageVariantsFor(c);
  if(variants.length<2) return '';
  const idx=currentArtIndex(c);
  const parsed=parseCreatureImage(variants[idx]||'');
  const alreadyFirst=parsed && parsed.num===1;
  if(alreadyFirst){
    return `<span class="art-rank" role="group" aria-label="Image principale">
      <button type="button" class="art-rank-btn art-rank-first is-saved" disabled title="Déjà l’image n°1">1er</button>
    </span>`;
  }
  return `<span class="art-rank" role="group" aria-label="Promouvoir en image principale">
    <button type="button" class="art-rank-btn art-rank-first" onclick="rankCardArt(${c.id},event)" title="Mettre cette image en n°1 (échange avec l’actuelle n°1)">1er</button>
  </span>`;
}
function artToolsHtml(c){
  const variants=imageVariantsFor(c);
  const artIdx=currentArtIndex(c);
  const cycleBtn=variants.length>1
    ? `<button type="button" class="art-cycle" onclick="cycleCardArt(${c.id}, event)" title="Image suivante (${artIdx+1}/${variants.length})" aria-label="Image suivante de ${c.name}">↻ <small>${artIdx+1}/${variants.length}</small></button>`
    : '';
  return `<span class="art-tools">${artRankButtonsHtml(c)}${cycleBtn}</span>`;
}
async function rankCardArt(id, ev){
  if(ev){ ev.preventDefault(); ev.stopPropagation(); }
  const c=CREATURES.find(x=>x.id===Number(id));
  if(!c) return;
  const art=currentImageFor(c, {raw:true}) || c.image || '';
  const parsed=parseCreatureImage(art);
  if(!parsed) return;
  if(parsed.num===1) return;
  const btn=ev?.currentTarget;
  if(btn){
    btn.classList.add('is-saving');
    btn.disabled=true;
  }
  try{
    const res=await fetch('/api/art-rank', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
        rank:1,
        creature:c.name,
        id:c.id,
        art,
        artIndex:currentArtIndex(c),
      }),
    });
    const data=await res.json().catch(()=>({}));
    if(!res.ok || !data.ok) throw new Error(data.error||'vote_failed');
    // Afficher la nouvelle n°1 et forcer le rechargement des fichiers échangés
    state.artIndex[c.id]=0;
    state.artBust[parsed.base]=Date.now();
    if(btn){
      btn.classList.remove('is-saving');
      btn.classList.add('is-saved');
    }
    render();
  }catch(_){
    if(btn){
      btn.classList.remove('is-saving');
      btn.classList.add('is-error');
      setTimeout(()=>btn.classList.remove('is-error'), 1200);
      btn.disabled=false;
    }
    console.warn('Promotion art indisponible (lance python server.py).');
  }
}
function toggleCardZoom(id, ev){
  if(ev){ ev.preventDefault(); ev.stopPropagation(); }
  const n=Number(id);
  state.zoomedId=state.zoomedId===n?null:n;
  document.querySelectorAll('.card-gallery > .zoomed').forEach(el=>el.classList.remove('zoomed'));
  if(state.zoomedId!=null){
    document.querySelector(`.card-gallery > [data-id="${state.zoomedId}"]`)?.classList.add('zoomed');
  }
}
function clearCardZoom(){
  if(state.zoomedId==null) return;
  state.zoomedId=null;
  document.querySelectorAll('.card-gallery > .zoomed').forEach(el=>el.classList.remove('zoomed'));
}
const BORDER_MODES=[
  {id:'normal', label:'Normal', title:'Carte complète (bestiaire)'},
  {id:'jeu', label:'Jeu', title:'Apparence combat (même rendu que le plateau)'},
  {id:'image', label:'Image', title:'Illustration seule, fine bordure'},
  {id:'dense', label:'Dense', title:'Bandeau image + nom, faction, ATQ/HP'},
];
function setBorderMode(mode){
  state.borderMode=BORDER_MODES.some(m=>m.id===mode)?mode:'normal';
  state.zoomedId=null;
  render();
}
function cardView(c){
  const mode=state.borderMode||'normal';
  if(mode==='jeu') return cardViewJeu(c);
  if(mode==='image') return cardViewImage(c);
  if(mode==='dense') return cardViewDense(c);
  return cardViewNormal(c);
}
function buildFfCardHtml(c, opts={}){
  const color=CAPITAL_COLORS[c.capital]||'#c9aa69';
  const artSrc=currentImageFor(c) || c.image || '';
  const frame=opts.frame || frameFor(c);
  const typo=opts.style || (opts.forceArchive
    ? (CARD_STYLES.find(s=>s.id==='archive') || CARD_STYLES[0])
    : styleFor(c));
  const hp=opts.hp != null ? opts.hp : displayHp(c);
  const atk=opts.attack != null ? opts.attack : c.attack;
  const maxHp=opts.maxHp != null ? opts.maxHp : (c.maxHp != null ? c.maxHp : c.health);
  const injured=maxHp != null && hp < maxHp;
  const hpPct=maxHp > 0 ? Math.max(0, Math.min(100, (hp / maxHp) * 100)) : 100;
  /* Sources 480×480 : 240 sur la carte, 480 en aperçu combat (taille réelle). */
  const artPx=opts.artNative ? 480 : 240;
  const img=artSrc?`<img src="${encodeURI(artSrc)}" alt="${c.name}" width="${artPx}" height="${artPx}" decoding="async" draggable="false">`:'';
  const size=sizeLabel(c);
  const extras=[];
  if(opts.zoomed) extras.push('zoomed');
  if(injured) extras.push('is-wounded');
  if(opts.extraClass) extras.push(opts.extraClass);
  const previewExpanded=!!opts.previewExpanded;
  if(previewExpanded) extras.push('is-preview-expanded');
  const cls=extras.length ? ' '+extras.join(' ') : '';
  const dataId=c.id!=null ? ` data-id="${c.id}"` : '';
  const dataExtra=opts.dataAttrs ? ` ${opts.dataAttrs}` : '';
  const onclick=opts.onclick ? ` onclick="${opts.onclick}"` : '';
  const title=opts.title ? ` title="${opts.title}"` : '';
  const natures=(c.natures||[]).join(' · ');
  const hpBar=injured
    ? `<div class="card-hp-bar" style="--hp-pct:${hpPct.toFixed(1)}%" title="${hp} / ${maxHp} PV" aria-hidden="true"><i></i></div>`
    : '';
  const abilHtml=abilitiesHtml(c, {expanded: previewExpanded || !!opts.abilitiesExpanded});
  const statsBlock=previewExpanded
    ? `<div class="card-preview-footer">
      <div class="card-stats-expanded" aria-label="Attaque ${atk}, points de vie ${hp}${injured?` sur ${maxHp}`:''}">
        <div class="stat-col">
          <span class="stat-atk${opts.atkBuffed?' is-buffed':''}${opts.atkDebuffed?' is-debuffed':''}"><b>${atk}</b></span>
          ${opts.atkModListHtml||'<span class="stat-mod-empty">ATQ de base</span>'}
        </div>
        <div class="stat-col">
          <span class="stat-hp${injured?' is-wounded':''}${opts.hpBuffed?' is-buffed':''}${opts.hpDebuffed?' is-debuffed':''}"><b>${hp}</b></span>
          ${opts.hpModListHtml||'<span class="stat-mod-empty">PV de base</span>'}
        </div>
      </div>
    </div>`
    : `<div class="card-stats" aria-label="Attaque ${atk}, points de vie ${hp}${injured?` sur ${maxHp}`:''}">
      <span class="stat-atk${opts.atkBuffed?' is-buffed':''}${opts.atkDebuffed?' is-debuffed':''}" title="${opts.atkTitle?String(opts.atkTitle).replaceAll('"','&quot;'):'Attaque'}"><b>${atk}</b>${opts.atkModTipHtml||''}</span>
      <span class="stat-hp${injured?' is-wounded':''}${opts.hpBuffed?' is-buffed':''}${opts.hpDebuffed?' is-debuffed':''}" title="${opts.hpTitle?String(opts.hpTitle).replaceAll('"','&quot;'):`Points de vie${injured?` (${hp}/${maxHp})`:''}`}"><b>${hp}</b>${opts.hpModTipHtml||''}</span>
    </div>`;
  return `<article class="ff-card frame-${frame.id} style-${typo.id}${cls}"${dataId}${dataExtra} style="--faction:${color}"${onclick}${title}>
    ${opts.badgeHtml||''}
    <span class="card-rim" aria-hidden="true"></span>
    <header class="card-title"><span class="card-name ${nameClassFor(c.name)}">${c.name}</span>${manaCostHtml(c)}</header>
    <div class="card-art">${img}<i>${c.capital}</i>${size?`<em class="card-size">${size}</em>`:''}${opts.artExtra||''}</div>
    ${hpBar}
    <div class="type-line">${c.origin||''} · ${natures}</div>
    ${abilHtml}
    <blockquote>${quoteFor(c)}</blockquote>
    ${statsBlock}
  </article>`;
}
function cardViewNormal(c){
  return buildFfCardHtml(c, {
    zoomed: state.zoomedId===c.id,
    onclick: `toggleCardZoom(${c.id}, event)`,
    title: 'Cliquer pour zoomer',
    artExtra: artToolsHtml(c),
  });
}
function cardViewJeu(c){
  const color=(typeof factionMana==='function'?factionMana(c).color:null)||CAPITAL_COLORS[c.capital]||'#c9aa69';
  const zoomed=state.zoomedId===c.id?' zoomed':'';
  const view={...c, hp:displayHp(c), health:c.health};
  // Source unique : même miniCard que le combat
  return `<div class="gallery-card mode-jeu${zoomed}" data-id="${c.id}" style="--faction:${color}" onclick="toggleCardZoom(${c.id}, event)" title="Cliquer pour zoomer">${miniCard(view,{hand:true})}</div>`;
}
function cardViewImage(c){
  const color=CAPITAL_COLORS[c.capital]||'#c9aa69';
  const artSrc=currentImageFor(c);
  const zoomed=state.zoomedId===c.id?' zoomed':'';
  const img=artSrc?`<img src="${encodeURI(artSrc)}" alt="${c.name}" width="240" height="240" decoding="async">`:'';
  return `<article class="gallery-card mode-image${zoomed}" data-id="${c.id}" style="--faction:${color}" onclick="toggleCardZoom(${c.id}, event)" title="${c.name} — cliquer pour zoomer">
    <div class="image-only">${img}${artToolsHtml(c)}</div>
  </article>`;
}
function cardViewDense(c){
  const color=CAPITAL_COLORS[c.capital]||'#c9aa69';
  const artSrc=currentImageFor(c);
  const zoomed=state.zoomedId===c.id?' zoomed':'';
  const img=artSrc?`<img src="${encodeURI(artSrc)}" alt="" width="240" height="240" decoding="async">`:'';
  return `<article class="gallery-card mode-dense${zoomed}" data-id="${c.id}" style="--faction:${color}" onclick="toggleCardZoom(${c.id}, event)" title="${c.name} — cliquer pour zoomer">
    <div class="dense-strip">${img}</div>
    <div class="dense-meta">
      <strong class="dense-name">${c.name}</strong>
      <span class="dense-faction">${c.capital}</span>
      <span class="dense-stats"><b class="dense-atk">${c.attack}</b><b class="dense-hp">${displayHp(c)}</b></span>
    </div>
  </article>`;
}
function isBinderView(){
  return state.tab==='combat'
    && state.combatView==='campagne'
    && state.campaign
    && state.campaign.phase==='binder';
}
function binderRows(){
  return (typeof sortedBinder==='function') ? sortedBinder() : [];
}
function binderOwnedCapitals(){
  const ids=new Set(binderRows().map(r=>r.creatureId));
  return new Set(CREATURES.filter(c=>ids.has(c.id)).map(c=>c.capital));
}
function binderOwnedRarities(){
  return new Set(binderRows().map(r=>r.rarity));
}
function binderOwnedCosts(){
  const set=new Set();
  for(const row of binderRows()){
    if(!(row.count>0)) continue;
    const c=CREATURES.find(x=>x.id===row.creatureId);
    if(c) set.add(c.cost|0);
  }
  return set;
}
function matchesCostFilter(c){
  const f=state.costFilter;
  if(f==null || f==='Toutes') return true;
  return (c.cost|0) === (f|0);
}
function compareCreatures(a, b){
  const order=state.sortOrder||'cost-desc';
  const byName=()=>a.name.localeCompare(b.name,'fr');
  if(order==='cost-asc') return (a.cost|0)-(b.cost|0) || byName();
  if(order==='atk-desc') return (b.attack|0)-(a.attack|0) || (b.cost|0)-(a.cost|0) || byName();
  if(order==='atk-asc') return (a.attack|0)-(b.attack|0) || (a.cost|0)-(b.cost|0) || byName();
  if(order==='hp-desc') return (b.health|0)-(a.health|0) || (b.cost|0)-(a.cost|0) || byName();
  if(order==='hp-asc') return (a.health|0)-(b.health|0) || (a.cost|0)-(b.cost|0) || byName();
  if(order==='name') return byName() || (b.cost|0)-(a.cost|0);
  // cost-desc (défaut)
  return (b.cost|0)-(a.cost|0) || byName();
}
function filteredCreatures(){
  const q=state.search.trim().toLowerCase();
  return CREATURES.filter(c=>{
    if(state.activeCapital!=='Toutes' && c.capital!==state.activeCapital) return false;
    if(!matchesCostFilter(c)) return false;
    if(!q) return true;
    return [c.name,c.capital,c.origin,c.rarity,...(c.roles||[]),...(c.abilities||[]),...c.natures].join(' ').toLowerCase().includes(q);
  }).slice().sort(compareCreatures);
}
/** Entrées classeur (créature + rareté) filtrées comme la liste. */
function filteredBinderEntries(){
  const q=state.search.trim().toLowerCase();
  const rarity=state.binderRarity||'Toutes';
  return binderRows().filter(row=>{
    const c=CREATURES.find(x=>x.id===row.creatureId);
    if(!c || !(row.count>0)) return false;
    if(rarity!=='Toutes' && row.rarity!==rarity) return false;
    if(state.activeCapital!=='Toutes' && c.capital!==state.activeCapital) return false;
    if(!matchesCostFilter(c)) return false;
    const hay=[c.name,c.capital,c.origin,row.rarity,...(c.roles||[]),...(c.abilities||[]),...(c.natures||[])];
    if(typeof rarityLabel==='function') hay.push(rarityLabel(row.rarity));
    if(q && !hay.join(' ').toLowerCase().includes(q)) return false;
    return true;
  }).map(row=>({row, creature:CREATURES.find(x=>x.id===row.creatureId)}))
    .sort((a,b)=>compareCreatures(a.creature, b.creature) || String(b.row.rarity).localeCompare(String(a.row.rarity)));
}
function setFilter(cap){
  if(isBinderView() && cap!=='Toutes' && !binderOwnedCapitals().has(cap)) return;
  state.activeCapital=cap;
  state.zoomedId=null;
  if(!isBinderView()) resetFramesToNormal();
  render();
}
function setBinderRarity(rarityId){
  if(!isBinderView()) return;
  if(rarityId!=='Toutes' && !binderOwnedRarities().has(rarityId)) return;
  state.binderRarity=rarityId||'Toutes';
  state.zoomedId=null;
  render();
}
function setSortOrder(id){
  if(!SORT_ORDERS.some(o=>o.id===id)) return;
  state.sortOrder=id;
  state.zoomedId=null;
  render();
}
function setCostFilter(v){
  if(v==='Toutes' || v==='' || v==null) state.costFilter='Toutes';
  else {
    const n=Number(v);
    if(!COST_FILTERS.includes(n)) return;
    if(isBinderView() && !binderOwnedCosts().has(n)) return;
    state.costFilter=n;
  }
  state.zoomedId=null;
  render();
}
function setSearch(v){ state.search=v; state.zoomedId=null; render(); }
function setTab(tab){
  state.tab=tab;
  state.zoomedId=null;
  if(tab==='combat' && !state.battle) state.combatView=state.combatView||'lobby';
  if(typeof hideCombatCardPreview==='function') hideCombatCardPreview();
  render();
}
function cardViewBinder(entry){
  const c=entry.creature;
  const row=entry.row;
  const frame=CARD_FRAMES.find(f=>f.id===row.rarity) || CARD_FRAMES[0];
  const mode=state.borderMode||'normal';
  const countBadge=`<span class="binder-count" title="${row.count} exemplaire${row.count>1?'s':''}">×${row.count}</span>`;
  const rarityLabelTxt=(typeof rarityLabel==='function'?rarityLabel(row.rarity):row.rarity);
  const zoomTitle=`${c.name} · ${rarityLabelTxt} — cliquer pour zoomer`;
  if(mode==='jeu'){
    const color=(typeof factionMana==='function'?factionMana(c).color:null)||CAPITAL_COLORS[c.capital]||'#c9aa69';
    const zoomed=state.zoomedId===c.id?' zoomed':'';
    const view={...c, hp:displayHp(c), health:c.health};
    return `<div class="gallery-card mode-jeu${zoomed}" data-id="${c.id}" data-rarity="${row.rarity}" style="--faction:${color}" onclick="toggleCardZoom(${c.id}, event)" title="${zoomTitle}">${typeof miniCard==='function'?miniCard(view,{hand:true,frame}):''}${countBadge}</div>`;
  }
  if(mode==='image'){
    const color=CAPITAL_COLORS[c.capital]||'#c9aa69';
    const artSrc=currentImageFor(c);
    const zoomed=state.zoomedId===c.id?' zoomed':'';
    const img=artSrc?`<img src="${encodeURI(artSrc)}" alt="${c.name}" width="240" height="240" decoding="async">`:'';
    return `<article class="gallery-card mode-image${zoomed}" data-id="${c.id}" data-rarity="${row.rarity}" style="--faction:${color}" onclick="toggleCardZoom(${c.id}, event)" title="${zoomTitle}">
      <div class="image-only">${img}${artToolsHtml(c)}</div>${countBadge}
    </article>`;
  }
  if(mode==='dense'){
    const color=CAPITAL_COLORS[c.capital]||'#c9aa69';
    const artSrc=currentImageFor(c);
    const zoomed=state.zoomedId===c.id?' zoomed':'';
    const img=artSrc?`<img src="${encodeURI(artSrc)}" alt="" width="240" height="240" decoding="async">`:'';
    return `<article class="gallery-card mode-dense${zoomed}" data-id="${c.id}" data-rarity="${row.rarity}" style="--faction:${color}" onclick="toggleCardZoom(${c.id}, event)" title="${zoomTitle}">
      <div class="dense-strip">${img}</div>
      <div class="dense-meta">
        <strong class="dense-name">${c.name}</strong>
        <span class="dense-faction">${c.capital} · ${rarityLabelTxt}</span>
        <span class="dense-stats"><b class="dense-atk">${c.attack}</b><b class="dense-hp">${displayHp(c)}</b></span>
      </div>${countBadge}
    </article>`;
  }
  /* Même structure que la liste bestiaire : .ff-card enfant direct de .card-gallery */
  return buildFfCardHtml(c, {
    frame,
    zoomed: state.zoomedId===c.id,
    onclick: `toggleCardZoom(${c.id}, event)`,
    title: zoomTitle,
    artExtra: artToolsHtml(c),
    badgeHtml: countBadge,
    dataAttrs: `data-rarity="${row.rarity}"`,
  });
}
function renderList(opts={}){
  const binder=!!opts.binder || isBinderView();
  const caps=['Toutes',...Array.from(new Set(CREATURES.map(c=>c.capital))).sort((a,b)=>a.localeCompare(b,'fr'))];
  const ownedCaps=binder?binderOwnedCapitals():null;
  const ownedRarities=binder?binderOwnedRarities():null;
  const ownedCosts=binder?binderOwnedCosts():null;
  const picks=binder?null:filteredCreatures();
  const binderEntries=binder?filteredBinderEntries():null;
  const shown=binder?(binderEntries||[]).length:(picks||[]).length;
  const mode=state.borderMode||'normal';
  const rarityPalette=mode==='normal' || binder ? `
    <div class="frame-palette" role="group" aria-label="${binder?'Filtrer par rareté':'Peindre la rareté des cartes'}">
      <span class="frame-palette-label">Raretés</span>
      ${binder?`<button type="button" class="frame-swatch frame-all ${(state.binderRarity||'Toutes')==='Toutes'?'active':''}" onclick="setBinderRarity('Toutes')" title="Toutes les raretés"><small>Toutes</small></button>`:''}
      ${CARD_FRAMES.map(f=>{
        if(binder){
          const empty=!ownedRarities.has(f.id);
          const active=(state.binderRarity||'Toutes')===f.id?'active':'';
          return `<button type="button" class="frame-swatch frame-${f.id} ${active}${empty?' is-empty':''}" ${empty?'disabled aria-disabled="true"':''} onclick="setBinderRarity('${f.id}')" title="${empty?`Aucune carte ${f.label}`:`Filtrer : ${f.label}`}"><i></i><small>${f.label}</small></button>`;
        }
        return `<button type="button" class="frame-swatch frame-${f.id} ${state.bulkFrame===f.id?'active':''}" onclick="paintAllFrames('${f.id}', event)" title="Appliquer ${f.label} à toutes les cartes affichées"><i></i><small>${f.label}</small></button>`;
      }).join('')}
    </div>` : '';
  const stylePalette=!binder && mode==='normal'?`
    <div class="frame-palette style-palette" role="group" aria-label="Peindre le style typographique">
      <span class="frame-palette-label">Styles</span>
      ${CARD_STYLES.map(s=>`<button type="button" class="frame-swatch style-swatch style-${s.id} ${state.bulkStyle===s.id?'active':''}" onclick="paintAllStyles('${s.id}', event)" title="Appliquer ${s.label} à toutes les cartes affichées"><i></i><small>${s.label}</small></button>`).join('')}
    </div>`:'';
  const backBar=binder?`
    <div class="campaign-actions binder-toolbar" style="margin:0 0 14px;justify-content:space-between">
      <button type="button" class="cbt-end" onclick="setCampaignView('map')">Retour carte</button>
      <div class="camp-stats camp-stats-compact">
        <div class="camp-stat"><small>Or</small><b>${(typeof ensureCampaign==='function'?ensureCampaign():null)?.gold||0}</b></div>
        <div class="camp-stat"><small>Classeur</small><b>${typeof binderCount==='function'?binderCount():0}</b></div>
      </div>
    </div>`:'';
  const gallery=binder
    ? (binderEntries||[]).map(e=>cardViewBinder(e)).join('') || '<em>Ton classeur est vide pour ce filtre. Gagne un duel ou passe à la boutique.</em>'
    : (picks||[]).map(c=>cardView(c)).join('') || '<em>Aucune carte ne correspond à ce filtre.</em>';
  return `<section class="showcase panel${binder?' binder-showcase':''}">
    ${backBar}
    <div class="section-head">
      <div>
        <p class="eyebrow">${binder?'Collection':'Bestiaire'}</p>
        <h2>${binder?'Classeur':'Liste des Cartes'}</h2>
        <p>${shown} carte${shown>1?'s':''} ${binder?'possédée':'affichée'}${shown>1?'s':''}${binder?' — seules tes cartes apparaissent ; les filtres sans exemplaire sont grisés.':' — filtre par faction ou cherche un nom, un rôle, une origine.'}</p>
      </div>
      <div class="searchbox">
        <input value="${state.search.replaceAll('"','&quot;')}" oninput="setSearch(this.value)" placeholder="Chercher dragon, caster, Nécropole…">
      </div>
    </div>
    <div class="frame-palette border-palette" role="group" aria-label="Mode d'affichage des cartes">
      <span class="frame-palette-label">Affichage</span>
      ${BORDER_MODES.map(m=>`<button type="button" class="frame-swatch border-swatch border-${m.id} ${mode===m.id?'active':''}" onclick="setBorderMode('${m.id}')" title="${m.title}"><small>${m.label}</small></button>`).join('')}
    </div>
    ${rarityPalette}
    ${stylePalette}
    <div class="filters frame-palette" role="group" aria-label="Filtrer par faction">
      <span class="frame-palette-label">Faction</span>
      ${caps.map(c=>{
        const active=state.activeCapital===c?'active':'';
        const esc=c.replaceAll("'","\\'");
        if(c==='Toutes'){
          return `<button type="button" class="filter-faction ${active}" onclick="setFilter('${esc}')"><small>Toutes</small></button>`;
        }
        const empty=binder && !ownedCaps.has(c);
        const fm=FACTION_MANA[c]||{color:'#c9aa69',icon:'ui/combat/star_sm.png',element:c};
        const icon=fm.icon?`<img class="filter-mana" src="${fm.icon}" alt="" draggable="false">`:'';
        return `<button type="button" class="filter-faction ${active}${empty?' is-empty':''}" style="--mana:${fm.color}" ${empty?'disabled aria-disabled="true"':''} onclick="setFilter('${esc}')" title="${empty?`Aucune carte ${c}`:`${c} · ${fm.element||''}`}">${icon}<small>${c}</small></button>`;
      }).join('')}
    </div>
    <div class="filters frame-palette cost-palette" role="group" aria-label="Filtrer par coût">
      <span class="frame-palette-label">Coût</span>
      ${COST_FILTERS.map(v=>{
        const id=v==='Toutes'?'Toutes':String(v);
        const active=(state.costFilter==='Toutes'?v==='Toutes':state.costFilter===v)?'active':'';
        const empty=binder && v!=='Toutes' && !ownedCosts.has(v|0);
        return `<button type="button" class="filter-faction filter-cost ${active}${empty?' is-empty':''}" ${empty?'disabled aria-disabled="true"':''} onclick="setCostFilter('${id}')" title="${v==='Toutes'?'Tous les coûts':`Coût ${v}`}"><small>${v==='Toutes'?'Tous':v}</small></button>`;
      }).join('')}
    </div>
    <div class="filters frame-palette order-palette" role="group" aria-label="Ordre d’affichage">
      <span class="frame-palette-label">Ordre</span>
      ${SORT_ORDERS.map(o=>{
        const active=(state.sortOrder||'cost-desc')===o.id?'active':'';
        return `<button type="button" class="filter-faction filter-order ${active}" onclick="setSortOrder('${o.id}')" title="${o.title}"><small>${o.label}</small></button>`;
      }).join('')}
    </div>
    <div class="card-gallery mode-${mode}">${gallery}</div>
  </section>`;
}
function render(){
  const title = state.tab==='combat' ? 'Combat' : 'Liste des Cartes';
  const sub = state.tab==='combat'
    ? 'Combat rapide ou campagne — decks 60 cartes (15×4) / 2 factions.'
    : 'Consulte le bestiaire : factions, capacités, stats et illustrations.';
  byId('app').innerHTML=`<header class="topbar">
    <div>
      <p class="eyebrow">Fantasia Fauna</p>
      <h1>${title}</h1>
      <p class="subtitle">${sub}</p>
    </div>
    <nav class="tabs">
      <button class="${state.tab==='list'?'active':''}" onclick="setTab('list')">Liste des Cartes</button>
      <button class="${state.tab==='combat'?'active':''}" onclick="setTab('combat')">Combat</button>
    </nav>
    <div class="topbar-end">
      ${typeof FFAudio?.volumeControlHtml==='function' ? FFAudio.volumeControlHtml() : ''}
      <div class="stats"><span>${CREATURES.length} créatures</span>${state.tab==='list'?`<span>${filteredCreatures().length} affichées</span>`:''}</div>
    </div>
  </header>
  <main>${state.tab==='combat'?renderCombat():renderList()}</main>`;
  scheduleCardShine();
  if(typeof FFAudio?.syncVolumeUi==='function') FFAudio.syncVolumeUi();
  if(typeof syncAttackAim==='function') requestAnimationFrame(()=>syncAttackAim());
}
window.ABILITIES=ABILITIES;
window.abilityDef=abilityDef;
window.creatureAbilityList=creatureAbilityList;
window.hasAbility=hasAbility;
window.creatureAbilityIds=creatureAbilityIds;
window.abilitiesHtml=abilitiesHtml;
window.buildFfCardHtml=buildFfCardHtml;
window.setFilter=setFilter;
window.setSearch=setSearch;
window.setTab=setTab;
window.setBinderRarity=setBinderRarity;
window.setSortOrder=setSortOrder;
window.setCostFilter=setCostFilter;
window.setBorderMode=setBorderMode;
window.toggleCardZoom=toggleCardZoom;
window.cycleCardArt=cycleCardArt;
window.rankCardArt=rankCardArt;
window.cycleCardFrame=cycleCardFrame;
window.paintAllFrames=paintAllFrames;
window.cycleCardStyle=cycleCardStyle;
window.paintAllStyles=paintAllStyles;
document.addEventListener('click', ()=>clearCardZoom());
window.addEventListener('keydown', e=>{ if(e.key==='Escape') clearCardZoom(); });
window.addEventListener('scroll', scheduleCardShine, {passive:true});
window.addEventListener('resize', scheduleCardShine);
